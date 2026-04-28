from __future__ import annotations

import ast
import collections
import pandas as pd

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


def clean_incidents(df: pd.DataFrame, config: PipelineConfig, dup_ids: set[int]) -> pd.DataFrame:
    """Normalize incidents.csv into the core incident spine used for all joins."""
    keep_cols = [c for c in config.columns.incidents if c in df.columns]
    inc = df[keep_cols].copy()
    inc = inc.rename(columns=config.columns.incidents)

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

    inc = inc.drop(
        columns=["reports", "deployer_raw", "developer_raw", "harmed_raw"],
        errors="ignore",
    )
    inc = inc.sort_values("Incident ID").reset_index(drop=True)

    return inc


def clean_mit(df: pd.DataFrame, config: PipelineConfig, dup_ids: set[int]) -> pd.DataFrame:
    """Normalize MIT taxonomy and strip numeric prefixes from labels."""
    keep_cols = [c for c in config.columns.mit if c in df.columns]
    mit = df[keep_cols].copy()
    mit = mit.rename(columns=config.columns.mit)
    mit = mit[~mit["Incident ID"].isin(dup_ids)]

    if "Risk Domain" in mit.columns:
        mit["Risk Domain"] = mit["Risk Domain"].str.replace(r"^\d+\.\s*", "", regex=True)
    if "Risk Subdomain" in mit.columns:
        mit["Risk Subdomain"] = mit["Risk Subdomain"].str.replace(r"^\d+\.\d+\.\s*", "", regex=True)

    return mit.sort_values("Incident ID").reset_index(drop=True)


def clean_gmf(df: pd.DataFrame, config: PipelineConfig, dup_ids: set[int]) -> pd.DataFrame:
    """Normalize GMF taxonomy to a consistent set of columns."""
    keep_cols = [c for c in config.columns.gmf if c in df.columns]
    gmf = df[keep_cols].copy()
    gmf = gmf.rename(columns=config.columns.gmf)
    gmf = gmf[~gmf["Incident ID"].isin(dup_ids)]

    return gmf.sort_values("Incident ID").reset_index(drop=True)


def clean_cset(df: pd.DataFrame, config: PipelineConfig, dup_ids: set[int]) -> pd.DataFrame:
    """Normalize CSETv1 taxonomy, including minor string/value normalization."""
    keep_cols = [c for c in config.columns.cset if c in df.columns]
    cset = df[keep_cols].copy()
    cset = cset.rename(columns=config.columns.cset)
    cset = cset[~cset["Incident ID"].isin(dup_ids)]

    # CSET can have multiple rows per incident; keep a single representative row.
    cset = cset.drop_duplicates(subset="Incident ID")

    if "Location City" in cset.columns:
        cset["Location City"] = cset["Location City"].str.strip().replace("", pd.NA)

    if "Incident Month" in cset.columns:
        # Convert numeric month tokens to month names.
        month_names = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]
        month_map = {str(i): name for i, name in enumerate(month_names, 1)}
        month_map.update({f" {k}": v for k, v in month_map.items()})
        cset["Incident Month"] = cset["Incident Month"].replace(month_map)

    return cset.sort_values("Incident ID").reset_index(drop=True)


def compute_duplicate_ids(df: pd.DataFrame, id_column: str) -> set[int]:
    """Compute a set of incident IDs that should be excluded as duplicates."""
    return set(df[id_column].dropna().astype(int).tolist())


def top_technical_failures(gmf: pd.DataFrame, limit: int = 10) -> list[tuple[str, int]]:
    """Return most common GMF 'Technical Failure' labels (comma-split)."""
    failures: list[str] = []
    if "Technical Failure" not in gmf.columns:
        return []
    for value in gmf["Technical Failure"].dropna():
        # Values are typically comma-separated labels.
        failures.extend(item.strip() for item in str(value).split(","))
    return collections.Counter(failures).most_common(limit)
