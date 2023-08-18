import React, { useEffect, useState } from 'react';
import AiidHelmet from 'components/AiidHelmet';
import { Trans, useTranslation } from 'react-i18next';
import Container from '../elements/Container';
import SocialShareButtons from '../components/ui/SocialShareButtons';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { graphql } from 'gatsby';
import ReportCard from 'components/reports/ReportCard';
import { Button } from 'flowbite-react';
import { useUserContext } from 'contexts/userContext';
import ClassificationsEditor from 'components/taxa/ClassificationsEditor';
import ClassificationsDisplay from 'components/taxa/ClassificationsDisplay';

function ReportPage(props) {
  const {
    data: { report, allMongodbAiidprodTaxa, allMongodbAiidprodClassifications },
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
        <ReportCard item={report} alwaysExpanded={true} actions={actions} />
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
  }
`;

export default ReportPage;
