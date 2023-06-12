import React from 'react';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import { Trans, useTranslation } from 'react-i18next';
import Container from '../elements/Container';
import SocialShareButtons from '../components/ui/SocialShareButtons';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { graphql } from 'gatsby';
import ReportCard from 'components/reports/ReportCard';
import { Button } from 'flowbite-react';
import { useUserContext } from 'contexts/userContext';

function ReportPage(props) {
  const {
    data: { report },
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

  const metaDescription = report.description;

  const metaImage = report.image_url;

  let actions = <></>;

  if (!loading && isRole('incident_editor')) {
    actions = (
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

  return (
    <Layout {...props}>
      <AiidHelmet {...{ metaTitle, metaDescription, path: props.location.pathname, metaImage }}>
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

      <Container>
        <ReportCard item={report} alwaysExpanded={true} actions={actions} />
      </Container>
    </Layout>
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
  }
`;

export default ReportPage;
