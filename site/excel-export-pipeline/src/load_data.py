from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable
import json

import pandas as pd
from pymongo import MongoClient

from .config import PipelineConfig


@dataclass
class RawData:
    """Raw DataFrames loaded from the live MongoDB database."""

    incidents: pd.DataFrame
    reports: pd.DataFrame
    entities: pd.DataFrame
    duplicates: pd.DataFrame
    taxonomies: dict[str, pd.DataFrame]


def _flatten_classifications(docs: Iterable[dict], namespace: str) -> pd.DataFrame:
    """Filter classification docs by namespace and flatten their attributes into columns."""
    rows = []
    for doc in docs:
        # Only published classifications
        if doc.get("namespace") == namespace and doc.get("publish"):
            # We want one row per incident mapped to this classification document
            incidents = doc.get("incidents", [])
            for inc_id in incidents:
                row = {"Incident ID": inc_id}
                for attr in doc.get("attributes", []):
                    v = attr.get("value_json")
                    if v is not None:
                        try:
                            # Try to decode the inner JSON to a native Python type
                            v = json.loads(v)
                            # To be consistent with the previous CSV/BSON extraction,
                            # render lists as a JSON string (e.g. "['A', 'B']").
                            if isinstance(v, list):
                                v = json.dumps(v)
                        except Exception:
                            pass
                    row[attr["short_name"]] = v
                rows.append(row)
    return pd.DataFrame(rows)


def load_raw_data(config: PipelineConfig) -> RawData:
    """Read the required collections directly from the live MongoDB database."""
    if not config.mongo.uri:
        raise RuntimeError(
            "MongoDB connection string is not set. Provide it via the "
            "MONGODB_CONNECTION_STRING environment variable (an Atlas mongodb+srv:// URI "
            f"with read access to the '{config.mongo.database}' database)."
        )

    coll = config.mongo.collections
    client = MongoClient(config.mongo.uri)
    try:
        db = client[config.mongo.database]

        # Read full documents (no projection) so schema-drift detection stays meaningful.
        incidents = pd.DataFrame(list(db[coll["incidents"]].find({})))
        reports = pd.DataFrame(list(db[coll["reports"]].find({})))
        entities = pd.DataFrame(list(db[coll["entities"]].find({})))
        duplicates = pd.DataFrame(list(db[coll["duplicates"]].find({})))

        # Pull classifications once, then flatten per configured namespace.
        classification_docs = list(db[coll["classifications"]].find({}))
        taxonomies = {
            name: _flatten_classifications(classification_docs, name)
            for name in config.taxonomies
        }
    finally:
        client.close()

    return RawData(
        incidents=incidents,
        reports=reports,
        entities=entities,
        duplicates=duplicates,
        taxonomies=taxonomies,
    )
