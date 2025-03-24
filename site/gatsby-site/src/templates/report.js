import React, { useEffect, useState } from 'react';
import HeadContent from 'components/HeadContent';
import { Trans, useTranslation } from 'react-i18next';
import Container from '../elements/Container';
import SocialShareButtons from '../components/ui/SocialShareButtons';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { Link, graphql } from 'gatsby';
import ReportCard from 'components/reports/ReportCard';
import { Button } from 'flowbite-react';
import { useUserContext } from 'contexts/UserContext';
import ClassificationsEditor from 'components/taxa/ClassificationsEditor';
import ClassificationsDisplay from 'components/taxa/ClassificationsDisplay';

function ReportPage(props) {
  const {
    data: {
      report,
      allMongodbAiidprodTaxa,
      allMongodbAiidprodClassifications,
      incident,
      allMongodbTranslationsReports,
    },
  } = props;

  const incidentId = incident?.incident_id;

  const { t } = useTranslation();

  const { locale: language } = useLocalization();

  const { loading, isRole } = useUserContext();

  if (report.language !== language && allMongodbTranslationsReports.nodes?.length > 0) {
    const reportTranslation = allMongodbTranslationsReports.nodes[0];

    report.title = reportTranslation.title;
    report.text = reportTranslation.text;
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
          href={`/cite/edit?report_number=${report.report_number}${
            incidentId ? `&incident_id=${incidentId}` : ''
          }`}
          className="hover:no-underline "
        >
          <Trans>Edit</Trans>
        </Button>
      );
    }
  }, [loading]);

  return (
    <>
      <div className={'titleWrapper'}>
        <div className="flex content-between w-full">
          <h1 className="tw-styled-heading">{language == 'en' ? metaTitle : defaultTitle}</h1>
          {incidentId && (
            <Link
              to={`/cite/${incident.incident_id}#r${report.report_number}`}
              className="hover:no-underline mb-5"
            >
              <Button outline={true} color={'light'}>
                <Trans>Back to Incident {{ incidentId }}</Trans>
              </Button>
            </Link>
          )}
        </div>
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
        <ReportCard item={report} alwaysExpanded={true} actions={actions} />
      </Container>
    </>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
    data: { report },
  } = props;

  const metaTitle = `Report ${report.report_number}`;

  return (
    <HeadContent
      path={pathname}
      {...{
        metaTitle,
        metaDescription: report.description || metaTitle,
        metaImage: report.image_url,
      }}
      metaType="website"
    />
  );
};

export const query = graphql`
  query ReportPageQuery($report_number: Int, $locale: String!) {
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
    allMongodbTranslationsReports(
      filter: { report_number: { eq: $report_number }, language: { eq: $locale } }
    ) {
      nodes {
        title
        text
        report_number
      }
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
    incident: mongodbAiidprodIncidents(
      reports: { elemMatch: { report_number: { in: [$report_number] } } }
    ) {
      incident_id
    }
  }
`;

export default ReportPage;
