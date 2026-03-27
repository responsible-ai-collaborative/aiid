from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List
import os
import yaml


@dataclass
class PathsConfig:
    snapshot_dir: Path
    output_path: Path


@dataclass
class SnapshotConfig:
    base_url: str
    snapshot_page_url: str
    snapshot_filter: str


@dataclass
class ColumnsConfig:
    incidents: Dict[str, str]
    mit: Dict[str, str]
    gmf: Dict[str, str]
    cset: Dict[str, str]
    duplicates_id_column: str


@dataclass
class ValidationConfig:
    expected_min_incidents: int
    expected_mit_coverage: float


@dataclass
class OutputConfig:
    master_column_order: List[str]


@dataclass
class PipelineConfig:
    paths: PathsConfig
    snapshot: SnapshotConfig
    columns: ColumnsConfig
    validation: ValidationConfig
    output: OutputConfig


def _apply_env_overrides(raw: dict) -> dict:
    paths = raw.setdefault("paths", {})
    snapshot = raw.setdefault("snapshot", {})
    validation = raw.setdefault("validation", {})

    if os.getenv("SNAPSHOT_DIR"):
        paths["snapshot_dir"] = os.getenv("SNAPSHOT_DIR")
    if os.getenv("OUTPUT_PATH"):
        paths["output_path"] = os.getenv("OUTPUT_PATH")
    if os.getenv("SNAPSHOT_PAGE_URL"):
        snapshot["snapshot_page_url"] = os.getenv("SNAPSHOT_PAGE_URL")
    if os.getenv("BASE_URL"):
        snapshot["base_url"] = os.getenv("BASE_URL")
    if os.getenv("SNAPSHOT_FILTER"):
        snapshot["snapshot_filter"] = os.getenv("SNAPSHOT_FILTER")
    if os.getenv("EXPECTED_MIN_INCIDENTS"):
        validation["expected_min_incidents"] = int(os.getenv("EXPECTED_MIN_INCIDENTS"))
    if os.getenv("EXPECTED_MIT_COVERAGE"):
        validation["expected_mit_coverage"] = float(os.getenv("EXPECTED_MIT_COVERAGE"))

    return raw


def load_config(path: Path) -> PipelineConfig:
    with open(path, "r", encoding="utf-8") as handle:
        raw = yaml.safe_load(handle)

    raw = _apply_env_overrides(raw)

    paths = PathsConfig(
        snapshot_dir=Path(raw["paths"]["snapshot_dir"]).resolve(),
        output_path=Path(raw["paths"]["output_path"]).resolve(),
    )
    snapshot = SnapshotConfig(
        base_url=raw["snapshot"]["base_url"],
        snapshot_page_url=raw["snapshot"]["snapshot_page_url"],
        snapshot_filter=raw["snapshot"]["snapshot_filter"],
    )
    columns = ColumnsConfig(
        incidents=raw["columns"]["incidents"],
        mit=raw["columns"]["mit"],
        gmf=raw["columns"]["gmf"],
        cset=raw["columns"]["cset"],
        duplicates_id_column=raw["columns"]["duplicates_id_column"],
    )
    validation = ValidationConfig(
        expected_min_incidents=int(raw["validation"]["expected_min_incidents"]),
        expected_mit_coverage=float(raw["validation"]["expected_mit_coverage"]),
    )
    output = OutputConfig(
        master_column_order=list(raw["output"]["master_column_order"]),
    )

    return PipelineConfig(
        paths=paths,
        snapshot=snapshot,
        columns=columns,
        validation=validation,
        output=output,
    )
