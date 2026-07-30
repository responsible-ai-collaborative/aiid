from __future__ import annotations

import functools
import pandas as pd
from .config import PipelineConfig

def build_dataset(inc: pd.DataFrame, taxonomies: dict[str, pd.DataFrame], config: PipelineConfig) -> pd.DataFrame:
    """Dynamically left-join all taxonomies onto the incident spine."""
    
    # Left join all dataframes iteratively using functools.reduce
    dfs_to_join = [inc] + list(taxonomies.values())
    master = functools.reduce(
        lambda left, right: pd.merge(left, right, on="Incident ID", how="left"),
        dfs_to_join
    )

    # Reconstruct the Data Sources column dynamically
    # Check each taxonomy's mapping (excluding Incident ID) to see if we have non-null values
    source_labels = []
    
    for tax_name, tax_config in config.taxonomies.items():
        tax_cols = [col for col in tax_config.mapping.values() if col != "Incident ID" and col in master.columns]
        if not tax_cols:
            continue
        
        # If any of the taxonomy's columns have a non-null value for a row, that taxonomy was applied
        has_tax = master[tax_cols].notna().any(axis=1)
        
        # Create a boolean series with the name of the taxonomy where True, and empty string where False
        source_labels.append(has_tax.map({True: f"{tax_name} | ", False: ""}))

    # Concatenate the strings across all taxonomies
    if source_labels:
        concatenated = source_labels[0]
        for series in source_labels[1:]:
            concatenated = concatenated + series
            
        # Strip the trailing " | "
        master["Data Sources"] = concatenated.str.rstrip(" | ")
        master["Data Sources"] = master["Data Sources"].replace("", "None")
    else:
        master["Data Sources"] = "None"

    return master
