import React, { useEffect, useState } from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { Trans, useTranslation } from 'react-i18next';
import Container from '../elements/Container';
import SocialShareButtons from '../components/ui/SocialShareButtons';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { Link, graphql } from 'gatsby';
import ReportCard from 'components/reports/ReportCard';
import { Button } from 'flowbite-react';
import { useUserContext } from 'contexts/userContext';
import ClassificationsEditor from 'components/taxa/ClassificationsEditor';
import ClassificationsDisplay from 'components/taxa/ClassificationsDisplay';
import Card from 'elements/Card';

function ReportPage(props) {
  const {
    data: { report, allMongodbAiidprodTaxa, allMongodbAiidprodClassifications, incidents },
    data,
  } = props;

  const { t } = useTranslation();

  const { locale } = useLocalization();

  const { loading, isRole } = useUserContext();

  if (report.language !== locale) {
    report.title = data[locale].title;
    report.text = data[locale].text;
  }

  const defaultTitle = t('Report {{report_number}}', { ...report });

  const metaTitle = `Report ${report.report_number}`;

  const [actions, setActions] = useState(null);

  useEffect(() => {
    if (!loading && isRole('incident_editor')) {
      setActions(
        <Button
          data-cy="edit-report"
          size={'xs'}
          color="light"
          href={`/cite/edit?report_number=${report.report_number}`}
          className="hover:no-underline "
        >
          <Trans>Edit</Trans>
        </Button>
      );
    }
  }, []);

  return (
    <>
      <AiidHelmet
        {...{
          metaTitle,
          metaDescription: report.description,
          path: props.location.pathname,
          metaImage: report.image_url,
        }}
      >
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <h1 className="tw-styled-heading">{locale == 'en' ? metaTitle : defaultTitle}</h1>
        <SocialShareButtons
          metaTitle={metaTitle}
          path={props.location.pathname}
          page="cite"
        ></SocialShareButtons>
      </div>

      <ClassificationsEditor
        classifications={allMongodbAiidprodClassifications}
        taxa={allMongodbAiidprodTaxa}
        reportNumber={report.report_number}
      />

      <ClassificationsDisplay
        classifications={allMongodbAiidprodClassifications}
        taxa={allMongodbAiidprodTaxa}
      />

      <Container className="mt-4">
        <Card className={'shadow-card'} data-cy="classifications-editor">
          <Card.Header className="items-center justify-between">
            <h4>
              <Trans>Associated Incidents</Trans>
            </h4>
          </Card.Header>

          <Card.Body>
            {incidents.nodes.map((incident) => (
              <Link to={`/cite/${incident.incident_id}`} key={incident.incident_id}>
                <h4 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                  <span className="text-sm">
                    <Trans>Incident {{ id: incident.incident_id }}</Trans>
                  </span>
                  <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                    <Trans ns="entities" count={incident.reports.length}>
                      {{ count: incident.reports.length }} Report
                    </Trans>
                  </span>
                  <br />
                  {incident.title}
                </h4>
              </Link>
            ))}
          </Card.Body>
        </Card>

        <ReportCard className="mt-4" item={report} alwaysExpanded={true} actions={actions} />
      </Container>
    </>
  );
}

export const query = graphql`
  query ReportPageQuery(
    $report_number: Int
    $translate_es: Boolean!
    $translate_fr: Boolean!
    $translate_en: Boolean!
  ) {
    report: mongodbAiidprodReports(report_number: { eq: $report_number }) {
      submitters
      date_published
      report_number
      title
      url
      image_url
      cloudinary_id
      source_domain
      mongodb_id
      text
      authors
      epoch_date_submitted
      language
      description
    }
    es: mongodbTranslationsReportsEs(report_number: { eq: $report_number })
      @include(if: $translate_es) {
      title
      text
      report_number
    }
    fr: mongodbTranslationsReportsFr(report_number: { eq: $report_number })
      @include(if: $translate_fr) {
      title
      text
      report_number
    }
    en: mongodbTranslationsReportsEn(report_number: { eq: $report_number })
      @include(if: $translate_en) {
      title
      text
      report_number
    }
    allMongodbAiidprodTaxa {
      nodes {
        id
        namespace
        weight
        description
        complete_entities
        dummy_fields {
          field_number
          short_name
        }
        field_list {
          field_number
          short_name
          long_name
          short_description
          long_description
          display_type
          mongo_type
          default
          placeholder
          permitted_values
          weight
          instant_facet
          required
          public
          complete_from {
            all
            current
            entities
          }
          subfields {
            field_number
            short_name
            long_name
            short_description
            long_description
            display_type
            mongo_type
            default
            placeholder
            permitted_values
            weight
            instant_facet
            required
            public
            complete_from {
              all
              current
              entities
            }
          }
        }
      }
    }
    allMongodbAiidprodClassifications(
      filter: {
        reports: { elemMatch: { report_number: { eq: $report_number } } }
        publish: { eq: true }
      }
    ) {
      nodes {
        reports {
          report_number
        }
        id
        namespace
        notes
        attributes {
          short_name
          value_json
        }
        publish
      }
    }
    incidents: allMongodbAiidprodIncidents(
      filter: { reports: { elemMatch: { report_number: { eq: $report_number } } } }
    ) {
      nodes {
        incident_id
        title
        reports {
          report_number
        }
      }
    }
  }
`;

export default ReportPage;
