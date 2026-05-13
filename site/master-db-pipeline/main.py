from __future__ import annotations

import argparse
from pathlib import Path
import sys

from src.config import load_config
from src.download import download_and_extract
from src.schema_check import check_schema
from src.load_data import load_raw_data
from src.clean import (
    compute_duplicate_ids,
    clean_incidents,
    clean_mit,
    clean_gmf,
    clean_cset,
)
from src.build_master import build_master
from src.validate import validate_master
from src.export_excel import export_excel


def parse_args() -> argparse.Namespace:
    """Parse CLI args for local runs and GitHub Actions."""
    parser = argparse.ArgumentParser(description="Build AIID master dataset from latest snapshot.")
    parser.add_argument(
        "--config",
        default=str(Path(__file__).with_name("config.yaml")),
        help="Path to config.yaml",
    )
    parser.add_argument(
        "--skip-schema-check",
        action="store_true",
        help="Skip schema check against config mappings",
    )
    return parser.parse_args()


def main() -> int:
    """Run the end-to-end master dataset pipeline.

    Exit codes:
      0 = success
      2 = schema check failure (missing expected columns)
      3 = validation failure (data quality guardrails failed)
    """
    args = parse_args()
    config_path = Path(args.config).resolve()

    # Load YAML config with optional env var overrides (CI-friendly).
    config = load_config(config_path)

    print("Starting master dataset pipeline")
    print(f"Config: {config_path}")

    # Download the latest public snapshot and locate required CSV inputs.
    snapshot_paths = download_and_extract(config)
    print("Snapshot download and extraction complete")

    if not args.skip_schema_check:
        # Fast header-only check to catch schema drift before doing heavy work.
        schema_result = check_schema(config, snapshot_paths)
        if not schema_result.is_ok:
            print("Schema check failed. Missing columns:")
            for source, col, mapped in schema_result.missing:
                print(f"  - {source}: '{col}' (maps to '{mapped}')")
            if schema_result.new_columns:
                print("New columns found (not mapped):")
                for source, col in schema_result.new_columns:
                    print(f"  - {source}: '{col}'")
            return 2

    # Load raw CSVs, compute duplicate incident IDs, and clean/normalize each source.
    raw = load_raw_data(snapshot_paths)
    dup_ids = compute_duplicate_ids(raw.duplicates, config.columns.duplicates_id_column)

    inc = clean_incidents(raw.incidents, config, dup_ids)
    mit = clean_mit(raw.mit, config, dup_ids)
    gmf = clean_gmf(raw.gmf, config, dup_ids)
    cset = clean_cset(raw.cset, config, dup_ids)

    # Left-join taxonomies onto incidents (1 row per incident).
    master = build_master(inc, mit, gmf, cset, config)

    # Keep the incident spine for join/row-count guardrails.
    inc_core = inc[
        [
            "Incident ID",
            "date",
            "year",
            "title",
            "description",
            "deployer",
            "developer",
            "harmed",
            "report_count",
        ]
    ].copy()

    # Validate dataset completeness/uniqueness and basic coverage expectations.
    validation = validate_master(master, inc_core, config)
    if not validation.ok:
        print("Validation failed:")
        for error in validation.errors:
            print(f"  - {error}")
        if validation.warnings:
            print("Warnings:")
            for warning in validation.warnings:
                print(f"  - {warning}")
        return 3

    if validation.warnings:
        print("Validation warnings:")
        for warning in validation.warnings:
            print(f"  - {warning}")

    # Export to Excel (artifact path is typically set via OUTPUT_PATH in CI).
    export_excel(master, config.paths.output_path)
    print(f"Excel written to {config.paths.output_path}")
    print(f"Rows: {len(master)} Columns: {len(master.columns)}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
