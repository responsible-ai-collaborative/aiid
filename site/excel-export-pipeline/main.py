from __future__ import annotations

import argparse
from pathlib import Path
import sys

from src.config import load_config
from src.schema_check import check_schema
from src.load_data import load_raw_data
from src.clean import (
    compute_duplicate_ids,
    clean_incidents,
    clean_reports,
    clean_entities,
    clean_taxonomies,
)
from src.build_dataset import build_dataset
from src.export_excel import export_excel


def parse_args() -> argparse.Namespace:
    """Parse CLI args for local runs and GitHub Actions."""
    parser = argparse.ArgumentParser(description="Build the AIID Excel export directly from the live MongoDB database.")
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
    """Run the end-to-end Excel export pipeline.

    Returns 0 on success. The schema check is advisory and never changes the exit
    code; any genuine failure surfaces as a non-zero process exit (typically 1)
    from an uncaught exception.
    """
    args = parse_args()
    config_path = Path(args.config).resolve()

    # Load YAML config with optional env var overrides (CI-friendly).
    config = load_config(config_path)

    print("Starting Excel export pipeline")
    print(f"Config: {config_path}")

    # Read the required collections directly from the live MongoDB database.
    raw = load_raw_data(config)
    print(f"Loaded live data from MongoDB ({config.mongo.database})")

    if not args.skip_schema_check:
        # Advisory only — the export tolerates missing columns, so drift never aborts the run.
        schema_result = check_schema(config, raw)
        if schema_result.missing:
            print("::warning::Schema drift — mapped columns absent upstream (dropped from output):")
            for source, col, mapped in schema_result.missing:
                print(f"  - {source}: '{col}' (maps to '{mapped}')")
        if schema_result.new_columns:
            print("New unmapped columns upstream (consider adding to config.yaml):")
            for source, col in schema_result.new_columns:
                print(f"  - {source}: '{col}'")

    dup_ids = compute_duplicate_ids(raw.duplicates, config.columns.duplicates_id_column)

    inc = clean_incidents(raw.incidents, config, dup_ids)
    rep = clean_reports(raw.reports, config)
    ent = clean_entities(raw.entities, config)
    
    cleaned_taxonomies = clean_taxonomies(raw.taxonomies, config, dup_ids)

    # Left-join taxonomies onto incidents (1 row per incident).
    dataset = build_dataset(inc, cleaned_taxonomies, config)

    # Export to Excel (artifact path is typically set via OUTPUT_PATH in CI).
    export_excel(dataset, rep, ent, config)
    print(f"Excel written to {config.paths.output_path}")
    print(f"Incidents Rows: {len(dataset)} Columns: {len(dataset.columns)}")
    print(f"Reports Rows: {len(rep)}")
    print(f"Entities Rows: {len(ent)}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
