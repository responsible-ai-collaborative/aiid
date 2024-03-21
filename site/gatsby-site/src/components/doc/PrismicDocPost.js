import { PrismicRichText } from '@prismicio/react';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { Link } from 'gatsby';
import React, { useEffect } from 'react';
import { Trans } from 'react-i18next';
import config from '../../../config';
import { useLayoutContext } from 'contexts/LayoutContext';
import Outline from 'components/Outline';
import Leaderboards from 'components/landing/Leaderboards';
import Sponsors from 'components/landing/Sponsors';
import { RichText } from 'prismic-reactjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PrismicDocPost = ({ doc, location }) => {
  const components = {
    Leaderboards: <Leaderboards />,
    Sponsors: <Sponsors />,
  };

  const canonicalUrl = config.gatsby.siteUrl + location.pathname;

  const loc = new URL(canonicalUrl);

  const rightSidebar = (
    <>
      <Outline location={loc} />
    </>
  );

  const { displayRightSidebar } = useLayoutContext();

  useEffect(() => {
    displayRightSidebar(rightSidebar);
  }, []);

  return (
    <>
      <div className={'titleWrapper'}>
        <h1>{doc.data.title}</h1>
      </div>
      <div className="flex items-center mb-6 -mt-1 flex-wrap">
        {doc.data.aitranslated && (
          <>
            <TranslationBadge className="ml-2" />
            <Link className="ml-2" to={doc.data.slug}>
              <Trans>View Original</Trans>
            </Link>
          </>
        )}
      </div>
      {doc.data.content.map((content, index) => {
        return (
          <>
            {content.markdown && (
              <div className="prose">
                {(() => {
                  const rawMarkdown = RichText.asText(content.markdown.richText);

                  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{rawMarkdown}</ReactMarkdown>;
                })()}
              </div>
            )}
            {content.text && (
              <div className="prose">
                <PrismicRichText key={index} field={content.text.richText} />
              </div>
            )}
            {content.component && <div className=" mt-4">{components[content.component]}</div>}
          </>
        );
      })}
    </>
  );
};

export default PrismicDocPost;
