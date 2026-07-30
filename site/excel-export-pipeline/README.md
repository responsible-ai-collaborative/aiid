# AIID Excel Export Pipeline

Builds the AI Incident Database Excel Export: a multi-sheet Excel workbook joining incident records with taxonomy classifications (MIT, GMF, CSETv1), alongside separate relational sheets for Reports and Entities. Runs weekly via GitHub Actions and uploads to Cloudflare R2.

**Why this exists:** it gives researchers, analysts, and journalists the whole database as a single, offline spreadsheet — no API, GraphQL, or MongoDB knowledge required. It complements the live [public GraphQL endpoint](../../README.md#public-graphql-endpoint) for people who'd rather work in Excel or a notebook than write queries.

> This README covers how to **run** the pipeline, its architecture, and the **output workbook's sheets/columns** (see [What the Output Looks Like](#what-the-output-looks-like)). To **extend** the pipeline (new columns, taxonomies, cleaning hooks) and understand the **raw MongoDB data model**, read the [Maintenance & Developer Guide](MAINTENANCE_GUIDE.md).

---

## What It Does

1. Connects to the live MongoDB `aiidprod` database (the same source the weekly DB backup uses).
2. Reads 5 core collections: `incidents`, `reports`, `entities`, `classifications`, `duplicates`.
3. Reports any schema drift between the config mapping and the live collections (advisory — does not block the run).
4. Cleans and normalises each data source (deduplicates, renames columns, parses arrays).
5. Dynamically flattens the `classifications` collection based on namespaces defined in `config.yaml`.
6. Left-joins taxonomies onto the incident spine, guaranteeing one row per incident.
7. Exports a 5-sheet Excel workbook: **Incidents**, **Reports**, **Entities**, plus an auto-generated **Data Dictionary** and **Coverage Map**.

> **Local vs CI:** Steps 1–7 are what `main.py` does — a local run only **writes the workbook to disk**. Uploading it to Cloudflare R2 is a separate step that runs **only in GitHub Actions** (see the CI/CD section below); `main.py` never uploads.

---

## Architecture

```text
main.py  ←  entry point, orchestrates all stages
│
├── src/load_data.py      Connect to MongoDB (aiidprod) and read the 5 collections into pandas DataFrames, dynamically parsing taxonomy attributes
├── src/schema_check.py   Key-level check — catch schema drift before heavy processing
├── src/clean.py          Normalise each source using a Registry Pattern for specific taxonomy hooks
├── src/build_dataset.py   Left-join all taxonomies onto the incident spine sequentially
├── src/export_excel.py   Write the styled, multi-sheet Excel workbook
└── src/config.py         Typed config dataclasses + YAML loader with env overrides
```

---

## Quick Start (Local Run)

**Prerequisites:**
- Python 3.11+ (developed on 3.11; CI pins 3.11; also runs on 3.13).
- A MongoDB to read from. For local runs the simplest is the site's seeded **in-memory MongoDB** (step 1) — no credentials needed.

**1. Start the in-memory MongoDB** in one terminal — it seeds the `aiidprod` collections on `mongodb://127.0.0.1:4110/`. Leave it running:

```bash
cd site/gatsby-site
npm install                 # first time only
npm run start:memory-mongo
```

**2. Run the pipeline** in a second terminal, pointed at that local database:

```bash
cd site/excel-export-pipeline

# (Recommended) create an isolated environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Point at the local in-memory MongoDB
export MONGODB_CONNECTION_STRING="mongodb://127.0.0.1:4110/"
# Windows PowerShell: $env:MONGODB_CONNECTION_STRING = "mongodb://127.0.0.1:4110/"

# Run with default config
python main.py

# Skip the advisory schema report
python main.py --skip-schema-check

# Point to a different config file
python main.py --config path/to/config.yaml
```

Output is written to `../../output/AIID_Excel_Export.xlsx` by default (a local run only writes this file — it never uploads to Cloudflare R2, which is CI-only). The in-memory database holds only sample seed data (a handful of incidents), so a local run verifies the pipeline works rather than producing the real dataset. To build against production instead, set `MONGODB_CONNECTION_STRING` to an Atlas `mongodb+srv://…` URI with read access to `aiidprod` (this is what CI uses).

---

## What the Output Looks Like

The **Incidents** sheet is the master table — one row per incident, with identity columns first, then one column per taxonomy attribute. A 4-of-57-column excerpt:

| Incident ID | date | title | Risk Domain (MIT) |
|---|---|---|---|
| 1 | 2015-05-19 | Google's YouTube Kids App Presents Inappropriate Content | Discrimination and Toxicity |
| 2 | 2018-12-05 | Warehouse robot ruptures can of bear spray… | AI system safety, failures, and limitations |
| 3 | 2018-10-27 | Crashes with Maneuvering Characteristics Augmentation System (MCAS) | AI system safety, failures, and limitations |

A recent run produced **1,515 incidents** (×57 columns), **7,174 reports**, and **6,444 entities**.

### Sheets in the workbook

| Sheet | What it holds |
|---|---|
| **Incidents** | The master table — one row per incident, columns grouped and color-coded by source (see groups below). The sheet opens with a dark title banner row and a merged group-category band row above the column headers. |
| **Reports** | The raw source documents (articles) linked to incidents. Kept separate because many reports map to one incident; flattening them into Incidents would explode the row count. Columns: Report Number, Title, URL, Source Domain, Date Published/Downloaded, Authors, Submitters, Language, Tags, Description, Is Incident Report. |
| **Entities** | The distinct organizations and actors tracked by the system. Columns: Entity ID, Name. |
| **Data Dictionary** | Auto-generated reference: every column in the Incidents sheet with its Column, Group, **Source**, Fill Rate (% non-empty), and a short description. |
| **Coverage Map** | Per-taxonomy-combination counts with a "What you can analyze" column describing what analysis is possible at each level, plus a TOTAL row. |

The **Incidents** sheet columns are organized into color-coded groups:

- **Identity** (dark navy) — ID, Date, Title, Description, Deployer, Developer, Harmed Parties, Editors, Editor Notes, Implicated Systems.
- **Coverage** (slate gray) — which taxonomies apply to the incident and the total report count.
- **MIT** (dark green) — Risk Domain, Risk Subdomain, Responsible Entity, Intent, Timing.
- **GMF** (brown) — AI Goal, AI Technology, Technical Failure.
- **CSETv1** (purple) — extensive harm metrics, deployment sectors, geographies, autonomy levels, AI methods, and more.

For how the MongoDB data is shaped and transformed into these sheets, see the [Maintenance & Developer Guide](MAINTENANCE_GUIDE.md#data-model).

---

## Configuration Reference

All schemas, table definitions, and Excel formatting settings live in `config.yaml`. The output path is overridable via an environment variable for CI/CD, and the MongoDB connection string is supplied via the environment only (never stored in `config.yaml`); see [Environment Overrides](#environment-overrides) below. Everything else — taxonomies, column maps, styles, column order — is configured by editing `config.yaml`.

| Key | Default | Description |
|---|---|---|
| `paths.output_path` | `../../output/AIID_Excel_Export.xlsx` | Final Excel output path |
| `mongo.database` | `aiidprod` | MongoDB database to read |
| `mongo.collections.*` | *(see config.yaml)* | Maps logical names to source collections (`incidents`, `reports`, `entities`, `duplicates`, `classifications`) |
| `columns.*` | *(see config.yaml)* | Maps raw MongoDB document keys to output headers for `incidents`, `reports`, `entities` |
| `columns.duplicates_id_column` | `duplicate_incident_number` | Column linking duplicates to true IDs |
| `taxonomies.*` | *(see config.yaml)* | Defines namespaces (e.g., `MIT`, `GMF`), internal mappings, and base colors |
| `styles.*` | *(see config.yaml)* | Defines Excel column header color groups (Identity, Coverage, Other) |
| `output.*_column_order` | *(see config.yaml)* | Ordered lists of columns for each sheet |

### Environment Overrides

A small set of values come from the environment rather than `config.yaml` (see `_apply_env_overrides` and `load_config` in `src/config.py`):

| Env var | Purpose |
|---|---|
| `MONGODB_CONNECTION_STRING` | **Required.** Atlas `mongodb+srv://…` URI with read access to `aiidprod`; never stored in `config.yaml`. (`MONGODB_URI` is also accepted, for parity with the DB-backup script.) |
| `OUTPUT_PATH` | Overrides `paths.output_path`. |

The CI workflow sets both. Taxonomies, column maps, styles, and column order are **not** env-overridable — edit `config.yaml` for those.

---

## CI/CD (GitHub Actions)

**Workflow file:** `.github/workflows/excel-export-pipeline.yml`

**Triggers:**
- **Scheduled:** Every Monday at 10:00 AM UTC
- **Manual:** `workflow_dispatch` with an `environment` input (defaults to `production`)

**Process:**
1. Checkout repo and set up Python 3.11.
2. Install dependencies.
3. Run `main.py` (with `MONGODB_CONNECTION_STRING` and `OUTPUT_PATH` set).
4. Validate output file exists.
5. Upload to Cloudflare R2 as `AIID_Excel_Export-YYYYMMDD.xlsx`.

**Required configuration** (set on the GitHub environment chosen by the `environment` input):

| Name | Type | Purpose |
|---|---|---|
| `CLOUDFLARE_R2_ACCOUNT_ID` | variable | R2 account ID |
| `CLOUDFLARE_R2_BUCKET_NAME` | variable | Target R2 bucket |
| `CLOUDFLARE_R2_WRITE_ACCESS_KEY_ID` | secret | R2 access key (write) |
| `CLOUDFLARE_R2_WRITE_SECRET_ACCESS_KEY` | secret | R2 secret key (write) |
| `MONGODB_CONNECTION_STRING` | secret | Read access to the `aiidprod` database |

The build step needs `MONGODB_CONNECTION_STRING`; the upload step needs the Cloudflare R2 variables and secrets.

---

## Exit Codes

| Code | Meaning |
|---|---|
| `0` | Success — Excel file written (this is the only code `main.py` returns deliberately) |
| `1` | Uncaught exception — missing connection string, MongoDB connection failure, etc. |

`main.py` only ever *returns* `0`. The schema check is **advisory** as it prints drift as warnings and never changes the exit code. 
---

## Contributing & License

This pipeline is part of the [AI Incident Database](../../README.md), an open-source project — contributions are welcome.

- **Contributing:** follow the project's [contribution workflow](../../README.md#contributing-changes) (fork → feature branch → PR). To extend the pipeline itself (new columns, taxonomies, cleaning hooks), start with the [Maintenance & Developer Guide](MAINTENANCE_GUIDE.md).
- **Code of Conduct:** all participants are expected to follow the project [Code of Conduct](../../CODE_OF_CONDUCT.md).
- **License:** released under the project [LICENSE](../../LICENSE.txt).
