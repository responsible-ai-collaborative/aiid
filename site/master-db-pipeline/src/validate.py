from __future__ import annotations

from dataclasses import dataclass
import pandas as pd

from .config import PipelineConfig


@dataclass
class ValidationResult:
    """Validation results split into hard errors vs soft warnings."""

    errors: list[str]
    warnings: list[str]

    @property
    def ok(self) -> bool:
        """True if the dataset passed all error-level checks."""
        return len(self.errors) == 0


def validate_master(master: pd.DataFrame, inc_core: pd.DataFrame, config: PipelineConfig) -> ValidationResult:
    """Validate row counts, uniqueness, completeness, and basic coverage guardrails."""
    errors: list[str] = []
    warnings: list[str] = []

    def _check(condition: bool, error_msg: str, warning: bool = False) -> None:
        """Append an error/warning if a check fails."""
        if condition:
            return
        if warning:
            warnings.append(error_msg)
        else:
            errors.append(error_msg)

    # Minimum size guardrail.
    _check(
        len(master) >= config.validation.expected_min_incidents,
        f"Row count {len(master)} is below expected minimum {config.validation.expected_min_incidents}",
    )

    # Primary key should remain unique after joins.
    dupes = master["Incident ID"].duplicated().sum()
    _check(dupes == 0, f"Found {dupes} duplicate Incident IDs")

    core_cols = [
        "Incident ID",
        "date",
        "year",
        "title",
        "description",
        "deployer",
        "developer",
        "harmed",
        "report_count",
        "Data Sources",
    ]
    for col in core_cols:
        nulls = master[col].isnull().sum()
        _check(nulls == 0, f"{col} has {nulls} nulls (should be 0)")

    # MIT coverage is expected to remain above a typical baseline.
    mit_pct = master["Risk Domain"].notna().mean() * 100
    _check(
        mit_pct >= config.validation.expected_mit_coverage,
        f"MIT coverage {mit_pct:.1f}% is below expected {config.validation.expected_mit_coverage}%",
        warning=True,
    )

    # Soft sanity check on time range.
    yr_min, yr_max = master["year"].min(), master["year"].max()
    _check(
        yr_min >= 1980 and yr_max >= 2024,
        f"Unexpected year range: {yr_min} -> {yr_max}",
        warning=True,
    )

    # Ensure joins did not increase row count (should stay 1 row per incident).
    _check(
        len(master) == len(inc_core),
        f"Row explosion: master has {len(master)} rows but incidents has {len(inc_core)}",
    )

    return ValidationResult(errors=errors, warnings=warnings)
