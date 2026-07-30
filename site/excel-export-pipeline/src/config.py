from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List
import os
import yaml


@dataclass
class PathsConfig:
    """Filesystem locations for outputs."""

    output_path: Path


@dataclass
class ThemeConfig:
    """Workbook-wide presentation theme (font + shared colors)."""

    font: str
    banner_color: str
    white: str
    alt_fill: str
    border_color: str
    total_fill: str
    generic_header: str


@dataclass
class MongoConfig:
    """Settings for connecting to the live MongoDB database."""

    uri: str
    database: str
    collections: Dict[str, str]


@dataclass
class ColumnsConfig:
    """Column mapping config for core collections (raw column -> normalized output column)."""

    incidents: Dict[str, str]
    reports: Dict[str, str]
    entities: Dict[str, str]
    duplicates_id_column: str


@dataclass
class TaxonomyConfig:
    """Config for an individual taxonomy namespace."""

    color: str
    band_label: str
    mapping: Dict[str, str]


@dataclass
class OutputConfig:
    """Excel output shape preferences."""

    column_order: List[str]
    reports_column_order: List[str]
    entities_column_order: List[str]
    column_widths: Dict[str, int]


@dataclass
class StyleConfig:
    """Config for an Excel column style group."""

    color: str
    band_label: str
    columns: List[str]

@dataclass
class PipelineConfig:
    """Top-level configuration for the Excel export build pipeline."""

    paths: PathsConfig
    mongo: MongoConfig
    columns: ColumnsConfig
    taxonomies: Dict[str, TaxonomyConfig]
    styles: Dict[str, StyleConfig]
    output: OutputConfig
    theme: ThemeConfig
    column_descriptions: Dict[str, str]
    coverage_analysis: Dict[str, str]


def _apply_env_overrides(raw: dict) -> dict:
    """Override YAML config with environment variables"""
    paths = raw.setdefault("paths", {})

    # Paths
    if os.getenv("OUTPUT_PATH"):
        paths["output_path"] = os.getenv("OUTPUT_PATH")

    return raw


def load_config(path: Path) -> PipelineConfig:
    """Load config YAML from disk and return a typed PipelineConfig."""
    with open(path, "r", encoding="utf-8") as handle:
        raw = yaml.safe_load(handle)

    # Allow CI/manual overrides without editing the repo config.yaml.
    raw = _apply_env_overrides(raw)

    paths = PathsConfig(
        output_path=Path(raw["paths"]["output_path"]).resolve(),
    )
    # The connection string is a secret, supplied via env (never stored in YAML).
    # MONGODB_URI is also accepted for parity with the DB-backup script.
    mongo = MongoConfig(
        uri=os.getenv("MONGODB_CONNECTION_STRING") or os.getenv("MONGODB_URI") or "",
        database=raw["mongo"]["database"],
        collections=dict(raw["mongo"]["collections"]),
    )
    columns = ColumnsConfig(
        incidents=raw["columns"]["incidents"],
        reports=raw["columns"].get("reports", {}),
        entities=raw["columns"].get("entities", {}),
        duplicates_id_column=raw["columns"]["duplicates_id_column"],
    )
    
    taxonomies = {}
    for name, tax_raw in raw.get("taxonomies", {}).items():
        taxonomies[name] = TaxonomyConfig(
            color=tax_raw["color"],
            band_label=tax_raw.get("band_label", name),
            mapping=tax_raw["mapping"]
        )
        
    styles = {}
    for name, style_raw in raw.get("styles", {}).items():
        styles[name] = StyleConfig(
            color=style_raw["color"],
            band_label=style_raw.get("band_label", name),
            columns=list(style_raw.get("columns", []))
        )
    
    output = OutputConfig(
        column_order=list(raw["output"]["column_order"]),
        reports_column_order=list(raw["output"].get("reports_column_order", [])),
        entities_column_order=list(raw["output"].get("entities_column_order", [])),
        column_widths=dict(raw["output"].get("column_widths", {})),
    )

    theme = ThemeConfig(**raw["theme"])

    return PipelineConfig(
        paths=paths,
        mongo=mongo,
        columns=columns,
        taxonomies=taxonomies,
        styles=styles,
        output=output,
        theme=theme,
        column_descriptions=dict(raw.get("column_descriptions", {})),
        coverage_analysis=dict(raw.get("coverage_analysis", {})),
    )
