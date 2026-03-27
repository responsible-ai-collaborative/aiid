from __future__ import annotations

from dataclasses import dataclass
import pandas as pd

from .download import SnapshotPaths


@dataclass
class RawData:
    incidents: pd.DataFrame
    mit: pd.DataFrame
    gmf: pd.DataFrame
    cset: pd.DataFrame
    duplicates: pd.DataFrame


def load_raw_data(paths: SnapshotPaths) -> RawData:
    incidents = pd.read_csv(paths.incidents, low_memory=False)
    mit = pd.read_csv(paths.mit, low_memory=False)
    gmf = pd.read_csv(paths.gmf, low_memory=False)
    cset = pd.read_csv(paths.cset, low_memory=False)
    duplicates = pd.read_csv(paths.duplicates)

    return RawData(
        incidents=incidents,
        mit=mit,
        gmf=gmf,
        cset=cset,
        duplicates=duplicates,
    )
