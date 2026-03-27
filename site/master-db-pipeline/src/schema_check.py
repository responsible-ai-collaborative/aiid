from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Tuple
import pandas as pd

from .config import PipelineConfig
from .download import SnapshotPaths


@dataclass
class SchemaCheckResult:
    """Schema check outcome: missing expected columns and newly observed columns."""

    missing: List[Tuple[str, str, str]]
    new_columns: List[Tuple[str, str]]

    @property
    def is_ok(self) -> bool:
        """True if no required columns are missing."""
        return len(self.missing) == 0


def check_schema(config: PipelineConfig, paths: SnapshotPaths) -> SchemaCheckResult:
    """Compare snapshot headers against configured column mappings"""
    # Read only headers to keep this check fast and CI-friendly.
    raw_incidents = pd.read_csv(paths.incidents, nrows=0)
    raw_mit = pd.read_csv(paths.mit, nrows=0)
    raw_gmf = pd.read_csv(paths.gmf, nrows=0)
    raw_cset = pd.read_csv(paths.cset, nrows=0)
    raw_duplicates = pd.read_csv(paths.duplicates, nrows=0)

    file_cols: Dict[str, set[str]] = {
        "incidents": set(raw_incidents.columns),
        "MIT": set(raw_mit.columns),
        "GMF": set(raw_gmf.columns),
        "CSETv1": set(raw_cset.columns),
        "duplicates": set(raw_duplicates.columns),
    }

    check_maps: Dict[str, Dict[str, str]] = {
        "incidents": config.columns.incidents,
        "MIT": config.columns.mit,
        "GMF": config.columns.gmf,
        "CSETv1": config.columns.cset,
        "duplicates": {config.columns.duplicates_id_column: config.columns.duplicates_id_column},
    }

    missing: List[Tuple[str, str, str]] = []
    new_cols: List[Tuple[str, str]] = []

    noise = {
        "Namespace",
        "Published",
        "Incident Number",
        "_id",
        "Annotator",
        "Peer Reviewer",
        "Annotation Status",
        "Quality Control",
    }

    for source, mapping in check_maps.items():
        actual = file_cols[source]
        expected = set(mapping.keys())
        missing_cols = expected - actual
        added = actual - expected

        # Filter out known noisy columns that frequently appear.
        added_meaningful = {
            col
            for col in added
            if col not in noise
            and "Snippet" not in col
            and "Discussion" not in col
            and "Notes" not in col
            and "Potential" not in col
        }

        for col in sorted(missing_cols):
            missing.append((source, col, mapping[col]))

        for col in sorted(added_meaningful):
            new_cols.append((source, col))

    return SchemaCheckResult(missing=missing, new_columns=new_cols)
