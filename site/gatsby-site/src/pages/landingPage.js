import React from 'react';
import Helmet from 'react-helmet';
import Layout from 'components/Layout';
import { Wordlist } from '../pages/wordcounts';
import { StyledHeading } from 'components/styles/Docs';

const LandingPage = (props) => {
  const {
    pageContext: { wordCountsSorted },
  } = props;

  if (!wordCountsSorted) {
    return null;
  }

  const metaTitle = 'Welcome to the Artificial Intelligence Incident Database';

  const metaDescription = 'The starting point for information about the AI Incident Database';

  return (
    <Layout {...props}>
      <Helmet>
        <title>Welcome to the Artifical Intelligence Incident Database</title>
        <meta name="title" content={metaTitle} />
        <meta name="description" content={metaDescription} />
      </Helmet>
      <div className={'titleWrapper'}>
        <StyledHeading>Welcome to the AIID</StyledHeading>
      </div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus lacinia magna a
        rutrum. Curabitur ante ligula, elementum eget metus et, varius pharetra sapien. Donec
        ullamcorper elit commodo ipsum venenatis consequat. Nulla vitae lorem blandit, pellentesque
        mauris non, pretium dui. Nullam nulla magna, blandit id lacus vel, ultrices malesuada erat.
        Vivamus id ligula ut mi dignissim imperdiet sed vel leo. Nam dui lacus, rhoncus eu imperdiet
        eget, efficitur non nisi. Etiam pellentesque dui lacinia, facilisis tellus sed, laoreet
        ipsum. Etiam pretium et ligula ac posuere. Aliquam ut faucibus nibh, vel maximus enim.
        Aliquam congue augue sit amet risus dapibus, ut pretium enim mollis.
      </p>
      <h1 className="heading1">Wordcount</h1>
      <Wordlist content={wordCountsSorted.splice(0, 10)} />
    </Layout>
  );
};

export default LandingPage;
