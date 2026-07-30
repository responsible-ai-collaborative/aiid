from __future__ import annotations

import ast
import pandas as pd
from typing import Dict

from .config import PipelineConfig


def _parse_entity_list(val: object) -> str:
    """Parse a JSON-ish Python-literal list of entity slugs into a display string."""
    try:
        items = ast.literal_eval(str(val))
        return ", ".join(str(item).replace("-", " ").strip().title() for item in items)
    except Exception:
        return str(val).strip()


def _count_reports(val: object) -> int:
    """Count reports from a JSON-ish Python-literal list field."""
    try:
        return len(ast.literal_eval(str(val)))
    except Exception:
        return 0


def _select_and_rename(df: pd.DataFrame, mapping: Dict[str, str]) -> pd.DataFrame:
    """Keep only mapped columns that exist, then rename them to output headers."""
    keep_cols = [c for c in mapping if c in df.columns]
    return df[keep_cols].copy().rename(columns=mapping)

def clean_incidents(df: pd.DataFrame, config: PipelineConfig, dup_ids: set[int]) -> pd.DataFrame:
    """Normalize incidents.csv into the core incident spine used for all joins."""
    inc = _select_and_rename(df, config.columns.incidents)

    # Drop incidents that are marked as duplicates of another incident.
    inc = inc[~inc["Incident ID"].isin(dup_ids)].copy()

    # Normalize time fields.
    inc["date"] = pd.to_datetime(inc["date"], errors="coerce")
    inc["year"] = inc["date"].dt.year.astype("Int64")

    # Derive a few convenience columns.
    inc["report_count"] = inc["reports"].apply(_count_reports)

    inc["deployer"] = inc["deployer_raw"].apply(_parse_entity_list)
    inc["developer"] = inc["developer_raw"].apply(_parse_entity_list)
    inc["harmed"] = inc["harmed_raw"].apply(_parse_entity_list)

    if "Editors" in inc.columns:
        inc["Editors"] = inc["Editors"].apply(_parse_entity_list)
    if "Implicated Systems" in inc.columns:
        inc["Implicated Systems"] = inc["Implicated Systems"].apply(_parse_entity_list)

    inc = inc.drop(
        columns=["reports", "deployer_raw", "developer_raw", "harmed_raw"],
        errors="ignore",
    )
    inc = inc.sort_values("Incident ID").reset_index(drop=True)

    return inc

def clean_reports(df: pd.DataFrame, config: PipelineConfig) -> pd.DataFrame:
    """Normalize reports into the format needed for the final sheet."""
    rep = _select_and_rename(df, config.columns.reports)

    # Convert timestamps
    if "Date Published" in rep.columns:
        rep["Date Published"] = pd.to_datetime(rep["Date Published"], errors="coerce").dt.date
    if "Date Downloaded" in rep.columns:
        rep["Date Downloaded"] = pd.to_datetime(rep["Date Downloaded"], errors="coerce").dt.date

    # Stringify list columns
    for col in ["Authors", "Submitters", "Tags"]:
        if col in rep.columns:
            rep[col] = rep[col].apply(_parse_entity_list)

    return rep.sort_values("Report Number").reset_index(drop=True)

def clean_entities(df: pd.DataFrame, config: PipelineConfig) -> pd.DataFrame:
    """Normalize entities into the format needed for the final sheet."""
    ent = _select_and_rename(df, config.columns.entities)

    return ent.sort_values("Entity ID").reset_index(drop=True)


# --- DYNAMIC TAXONOMY REGISTRY ---

def clean_generic_taxonomy(df: pd.DataFrame, mapping: Dict[str, str], dup_ids: set[int]) -> pd.DataFrame:
    """Normalize a generic taxonomy to a consistent set of columns and deduplicate."""
    cleaned = _select_and_rename(df, mapping)
    cleaned = cleaned[~cleaned["Incident ID"].isin(dup_ids)]
    return cleaned.sort_values("Incident ID").reset_index(drop=True)

def hook_clean_mit(df: pd.DataFrame) -> pd.DataFrame:
    """MIT specific cleaning (strip prefixes)."""
    if "Risk Domain" in df.columns:
        df["Risk Domain"] = df["Risk Domain"].str.replace(r"^\d+\.\s*", "", regex=True)
    if "Risk Subdomain" in df.columns:
        df["Risk Subdomain"] = df["Risk Subdomain"].str.replace(r"^\d+\.\d+\.\s*", "", regex=True)
    return df

def hook_clean_cset(df: pd.DataFrame) -> pd.DataFrame:
    """CSET specific cleaning (deduping and date mappings)."""
    df = df.drop_duplicates(subset="Incident ID")

    if "Location City" in df.columns:
        df["Location City"] = df["Location City"].str.strip().replace("", pd.NA)

    if "Incident Month" in df.columns:
        month_names = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ]
        month_map = {str(i): name for i, name in enumerate(month_names, 1)}
        month_map.update({f" {k}": v for k, v in month_map.items()})
        df["Incident Month"] = df["Incident Month"].replace(month_map)
    return df

CLEANING_HOOKS = {
    "MIT": hook_clean_mit,
    "CSETv1": hook_clean_cset,
}

def clean_taxonomies(tax_data: dict[str, pd.DataFrame], config: PipelineConfig, dup_ids: set[int]) -> dict[str, pd.DataFrame]:
    """Clean all configured taxonomies using the registry hooks."""
    cleaned = {}
    for name, df in tax_data.items():
        mapping = config.taxonomies[name].mapping
        base_df = clean_generic_taxonomy(df, mapping, dup_ids)
        
        # Apply specific hook if it exists
        hook = CLEANING_HOOKS.get(name)
        if hook:
            base_df = hook(base_df)
            
        cleaned[name] = base_df
    return cleaned

# --------------------------------

def compute_duplicate_ids(df: pd.DataFrame, id_column: str) -> set[int]:
    """Compute a set of incident IDs that should be excluded as duplicates."""
    return set(df[id_column].dropna().astype(int).tolist())
