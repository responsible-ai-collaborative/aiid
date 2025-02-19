# Translation Process

The translation process runs as a Github Action workflow. The workflow is scheduled to run once per day.

We currently support translations for all new reports in the `reports` collection, and the fields that are translated are:
- Report `title`
- Report `text` (rich Markdown report text)
- Report `plain_text` (Report text without Markdown formatting)

The available languages for translation are defined in the environment variable `GATSBY_AVAILABLE_LANGUAGES`.
```
GATSBY_AVAILABLE_LANGUAGES=en,es,fr,ja
```

## Github Action Workflows

The structure of the Github Action workflow is as follows:

- [.github/workflows/translate-production.yml](/.github/workflows/translate-production.yml) - Translations for the production database. It calls the "translate.yml" workflow.
- [.github/workflows/translate-staging.yml](/.github/workflows/translate-staging.yml) - Translations for the staging database. It calls the "translate.yml" workflow.
- [.github/workflows/translate.yml](/.github/workflows/translate.yml) - The actual translation process used by the two workflows above.

## Workflow Steps

1. Get the list of languages, which is pulled from the [/site/gatsby-site/i18n/config.json](/site/gatsby-site/i18n/config.json) using the `GATSBY_AVAILABLE_LANGUAGES` environment variable as a filter.

2. Translate each report into the supported languages and store the translated reports in a `translations` database within a `reports` collection:
```
translations 
    |-- reports
    |   |-- { title, text, report_number, language }
    |   |-- { title, text, report_number, language }
    |   |-- { title, text, report_number, language }
```
To access this database, a user with read/write permissions needs to be provided through the following environment variable:

```
MONGODB_TRANSLATIONS_CONNECTION_STRING=mongodb+srv://<user>:<password>@aiiddev.<host>.mongodb.net
```

You can use the same value defined on the MongoDB Setup environment variable ```MONGODB_CONNECTION_STRING```

### Cost

The translate API charges ~20USD per million characters and can translate to 111 languages.

At the time of writing, there are 3960 Incident Reports, each report consisting of ~4000 characters, with a total sum of ~15 million characters.

Considering the pricing above, translating all ingested reports to one language will cost `(15 million / 1 million) * $20 = ~$300`, and translating all incident reports to all languages `$300 * 111= ~$33k`.

The translation process defaults to a **dry run** mode that prepends a string to every translated text instead of hitting Google's API.

Therefore, Translated texts in this mode will look like: `translated-{language}-YouTube to crack down on inappropriate content masked as kids’ cartoons`

The dry run is disabled through an environment variable as follows:

```
TRANSLATE_DRY_RUN=false
```

In addition to the Dry Run mode, you can also limit the number of reports to translate by setting the following environment variable. This variable sets the date from which the reports will be translated (using the `date_submitted` report field):

```
TRANSLATE_SUBMISSION_DATE_START=2024-01-01
```
