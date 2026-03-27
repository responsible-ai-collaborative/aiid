from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import re
import tarfile
import requests
from bs4 import BeautifulSoup

from .config import PipelineConfig


@dataclass
class SnapshotPaths:
    incidents: Path
    mit: Path
    gmf: Path
    cset: Path
    duplicates: Path


def _latest_snapshot_url(links: list[str]) -> str:
    def _ts(url: str) -> str:
        match = re.search(r"backup-(\d{14})\.tar\.bz2", url)
        return match.group(1) if match else ""

    return sorted(links, key=_ts)[-1]


def _find_file(root: Path, pattern: str) -> Path:
    matches = list(root.rglob(pattern))
    if not matches:
        raise FileNotFoundError(
            f"Could not find '{pattern}' under {root}. The snapshot structure may have changed."
        )
    return matches[0]


def download_and_extract(config: PipelineConfig) -> SnapshotPaths:
    snapshot_dir = config.paths.snapshot_dir
    snapshot_dir.mkdir(parents=True, exist_ok=True)

    html = requests.get(config.snapshot.snapshot_page_url, timeout=60).text
    soup = BeautifulSoup(html, "lxml")

    links: list[str] = []
    for anchor in soup.select("a[href]"):
        href = anchor["href"]
        if config.snapshot.snapshot_filter in href:
            if href.startswith("/"):
                href = config.snapshot.base_url + href
            links.append(href)

    if not links:
        raise RuntimeError(
            "No snapshot links found. The snapshots page structure may have changed."
        )

    latest_url = _latest_snapshot_url(links)

    tar_path = snapshot_dir / latest_url.split("/")[-1]
    if not tar_path.exists():
        with requests.get(latest_url, stream=True, timeout=300) as response:
            response.raise_for_status()
            with open(tar_path, "wb") as handle:
                for chunk in response.iter_content(chunk_size=1024 * 512):
                    if chunk:
                        handle.write(chunk)

    with tarfile.open(tar_path, "r:bz2") as tar:
        tar.extractall(snapshot_dir, filter="data")

    incidents_path = _find_file(snapshot_dir, "incidents.csv")
    mit_path = _find_file(snapshot_dir, "classifications_MIT.csv")
    gmf_path = _find_file(snapshot_dir, "classifications_GMF.csv")
    cset_path = _find_file(snapshot_dir, "classifications_CSETv1.csv")
    duplicates_path = _find_file(snapshot_dir, "duplicates.csv")

    return SnapshotPaths(
        incidents=incidents_path,
        mit=mit_path,
        gmf=gmf_path,
        cset=cset_path,
        duplicates=duplicates_path,
    )
