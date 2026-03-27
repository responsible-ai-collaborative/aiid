from __future__ import annotations

import pandas as pd

from .config import PipelineConfig


def build_master(
    inc: pd.DataFrame,
    mit: pd.DataFrame,
    gmf: pd.DataFrame,
    cset: pd.DataFrame,
    config: PipelineConfig,
) -> pd.DataFrame:
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

    mit_ids = set(mit["Incident ID"])
    gmf_ids = set(gmf["Incident ID"])
    cset_ids = set(cset["Incident ID"])

    def _sources(iid: int) -> str:
        parts: list[str] = []
        if iid in mit_ids:
            parts.append("MIT")
        if iid in gmf_ids:
            parts.append("GMF")
        if iid in cset_ids:
            parts.append("CSETv1")
        return " | ".join(parts) if parts else "None"

    inc_core["Data Sources"] = inc_core["Incident ID"].apply(_sources)

    mit_join = mit[
        ["Incident ID", "Risk Domain", "Risk Subdomain", "Responsible Entity", "Intent", "Timing"]
    ]
    master = inc_core.merge(mit_join, on="Incident ID", how="left")

    gmf_join = gmf[["Incident ID", "AI Goal", "AI Technology", "Technical Failure"]]
    master = master.merge(gmf_join, on="Incident ID", how="left")

    cset_join = ["Incident ID"] + [c for c in cset.columns if c != "Incident ID"]
    master = master.merge(cset[cset_join], on="Incident ID", how="left")

    master = master.sort_values("Incident ID").reset_index(drop=True)

    ordered = [c for c in config.output.master_column_order if c in master.columns]
    extra = [c for c in master.columns if c not in ordered]
    master = master[ordered + extra]

    return master
