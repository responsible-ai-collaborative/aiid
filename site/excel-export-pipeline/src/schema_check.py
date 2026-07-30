from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Tuple

from .config import PipelineConfig
from .load_data import RawData


@dataclass
class SchemaCheckResult:
    """Advisory schema report: mapped columns now missing upstream, and newly observed columns."""

    missing: List[Tuple[str, str, str]]
    new_columns: List[Tuple[str, str]]


def check_schema(config: PipelineConfig, raw: RawData) -> SchemaCheckResult:
    """Compare loaded collection headers against configured column mappings"""
    file_cols: Dict[str, set[str]] = {
        "incidents": set(raw.incidents.columns),
        "reports": set(raw.reports.columns),
        "entities": set(raw.entities.columns),
        "duplicates": set(raw.duplicates.columns),
    }

    check_maps: Dict[str, Dict[str, str]] = {
        "incidents": config.columns.incidents,
        "reports": config.columns.reports,
        "entities": config.columns.entities,
        "duplicates": {config.columns.duplicates_id_column: config.columns.duplicates_id_column},
    }

    for tax_name, tax_df in raw.taxonomies.items():
        file_cols[tax_name] = set(tax_df.columns)
        check_maps[tax_name] = config.taxonomies[tax_name].mapping

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
