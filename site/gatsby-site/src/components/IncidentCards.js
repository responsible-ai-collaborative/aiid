import React from 'react';
import { useModal, CustomModal } from '../../src/components/useModal';
import { Highlight, connectHits, connectStateResults } from 'react-instantsearch-dom';
import { Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { navigate } from 'gatsby';
import md5 from 'md5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faIdCard,
  faUserShield,
  faFlag,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import WebArchiveLink from './WebArchiveLink';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';

const cardNeedsBlockquote = (item) => {
  if (item.text && item.text.matchLevel === 'full') {
    return true;
  }
  return false;
};

const getParagraphs = (itemText) => {
  return (
    <>
      {itemText.split('\n').map((paragraph, index, array) => (
        <p key={index}>
          {array.length - 1 === index ? <>{paragraph + '...'}</> : <>{paragraph}</>}
        </p>
      ))}
    </>
  );
};

const getFlagModalContent = () => (
  <div className="modal-body">
    <p>Is there a problem with this content? Examples of &quot;problems`&quot;` include,</p>
    <ul>
      <li>The text contents of the report are not parsed properly</li>
      <li>The authors of the report are not associated with the report</li>
      <li>The report is associated with the wrong incident</li>
      <li>The text contents of the report are not parsed properly</li>
    </ul>
    <p>
      Flagged content will still be displayed within the database, but a database editor will
      periodically review the incident reports that have been flagged. Please note that the content
      contained within incident reports (e.g., the commentary within a news article) does not need
      to be correct or consistent across articles. If an article is wrong, misleading, or
      fraudulent, the best response is to submit additional incident reports that correct the
      record. The incident database is meant to capture the complete state of knowledge and
      discourse for incidents, not as an arbiter of what happened in individual incidents. In future
      versions of the database it will additionally be possible to apply tags to incident reports to
      classNameify their content.
    </p>
    <p>Please do NOT flag content if,</p>
    <ul>
      <li>You disagree with the report</li>
      <li>The linked report has disappeared from the web</li>
      <li>The report should not be considered an `&quot;`incident`&quot;`</li>
    </ul>
    <button type="button" className="btn btn-danger btn-sm w-100" data-dismiss="modal">
      Flag Report
    </button>
  </div>
);

const Text = styled.p`
  line-height: 1.3;
`;

const CardFooter = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const StyledLabel = styled.p`
  margin: 0.6em 0;
`;

const NoResults = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  grid-column-start: 2;
  grid-column-end: 3;

  p {
    text-align: center;
  }

  @media (max-width: 1240px) {
    grid-column-start: 1;
  }
`;

const CardBody = styled.div`
  padding: 1.25rem 1.25rem 0 1.25rem !important;
`;

const IncidentCardContainer = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  .subhead {
    margin: 0;
    opacity: 0.4;
    padding-top: 10px;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  max-width: 100%;
  grid-template-columns: 1fr 3fr;
  padding: 1.25rem;
`;

const IncidentCardImage = styled(Image)`
  height: ${({ height }) => height};
  object-fit: cover;
  width: 100%;
`;

const IncidentCard = ({
  item,
  authorsModal,
  submittersModal,
  flagReportModal,
  toggleFilterByIncidentId,
  showDetails,
  isCitePage,
}) => (
  <IncidentCardContainer id={item.mongodb_id}>
    <div className="card-header">
      {isCitePage ? <span>{item.title}</span> : <Highlight hit={item} attribute="title" />}
      <p className="subhead">
        {item.source_domain} &middot;{' '}
        {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
      </p>
    </div>
    <CardBody className="card-body">
      {/* <Highlight hit={item} attribute="description" /> */}
      {item._snippetResult && cardNeedsBlockquote(item._snippetResult) && (
        <blockquote>
          <Highlight
            hit={{
              _highlightResult: {
                ...item._snippetResult,
                text: {
                  ...item._snippetResult.text,
                  value: `...${item._snippetResult.text.value}...`,
                },
              },
            }}
            attribute="text"
          />
        </blockquote>
      )}
      {showDetails ? (
        <div>{getParagraphs(item.text)}</div>
      ) : (
        <div>
          <Text>{item.text.substr(0, 400) + '...'}</Text>
        </div>
      )}
    </CardBody>
    <div className="align-bottom">
      <IncidentCardImage
        publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
        alt={item.title}
        height={isCitePage ? 'unset' : '240px'}
        transformation={isCitePage ? null : fill().height(480)}
      />

      {toggleFilterByIncidentId && (
        <button
          type="button"
          className="btn btn-secondary btn-sm w-100"
          onClick={() => {
            navigate(`/cite/${item.incident_id}#${item.mongodb_id}`);
          }}
        >
          <StyledLabel>Show Details on Incident #{item.incident_id}</StyledLabel>
        </button>
      )}
    </div>
    <CardFooter className="card-footer text-muted">
      <WebArchiveLink url={item.url} date={item.date_submitted}>
        <FontAwesomeIcon icon={faNewspaper} className="far fa-newspaper" title="Read the Source" />
      </WebArchiveLink>

      <FontAwesomeIcon
        icon={faIdCard}
        className="pointer far fa-id-card"
        title="Authors"
        onClick={() =>
          authorsModal.openFor({
            title: 'Authors',
            body: function f() {
              return item.authors.join(', ');
            },
          })
        }
      />

      <FontAwesomeIcon
        icon={faUserShield}
        className="pointer fas fa-user-shield"
        title="Submitters"
        onClick={() =>
          submittersModal.openFor({
            title: 'Submitters',
            body: function f() {
              return item.submitters.join(', ');
            },
          })
        }
      />

      <FontAwesomeIcon
        icon={faFlag}
        className="pointer far fa-flag"
        title="Flag Report"
        onClick={() =>
          flagReportModal.openFor({
            title: 'Submitters',
            body: function f() {
              return getFlagModalContent();
            },
          })
        }
      />

      {toggleFilterByIncidentId && (
        <span
          aria-hidden="true"
          className="pointer"
          onClick={() => toggleFilterByIncidentId(item.incident_id + '')}
        >
          <FontAwesomeIcon icon={faHashtag} className="fas fa-hashtag" title="Incident ID" />
          {item.incident_id}
        </span>
      )}
    </CardFooter>
  </IncidentCardContainer>
);

const RenderCards = ({
  hits,
  toggleFilterByIncidentId,
  showDetails,
  authorsModal,
  submittersModal,
  flagReportModal,
  isSearchStalled,
}) => {
  if (isSearchStalled) {
    return (
      <NoResults>
        <Spinner animation="border" role="status" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </NoResults>
    );
  }

  if (hits.length === 0) {
    return (
      <NoResults>
        <p>Your search returned no results.</p>
        <p>Please clear your search in the search box above or the filters.</p>
      </NoResults>
    );
  }

  return (
    <>
      {hits.map((hit) => (
        <IncidentCard
          key={hit.objectID}
          item={hit}
          authorsModal={authorsModal}
          submittersModal={submittersModal}
          flagReportModal={flagReportModal}
          toggleFilterByIncidentId={toggleFilterByIncidentId}
          showDetails={showDetails}
        />
      ))}
    </>
  );
};

const CustomHits = connectHits(connectStateResults(RenderCards));

const Hits = ({ toggleFilterByIncidentId, showDetails = false, sortByDatePublished, scrollTo }) => {
  const authorsModal = useModal();

  const submittersModal = useModal();

  const flagReportModal = useModal();

  return (
    <>
      <CustomHits
        toggleFilterByIncidentId={toggleFilterByIncidentId}
        authorsModal={authorsModal}
        submittersModal={submittersModal}
        flagReportModal={flagReportModal}
        showDetails={showDetails}
        scrollTo={scrollTo}
        sortByDatePublished={sortByDatePublished}
      />
      <CustomModal {...authorsModal} />
      <CustomModal {...submittersModal} />
      <CustomModal {...flagReportModal} />
    </>
  );
};

const IncidentStatsCard = ({ incidentId, reportCount, incidentDate }) => {
  const STATS = [
    {
      key: 'incidentId',
      label: 'Incident ID',
    },
    {
      key: 'reportCount',
      label: 'Report Count',
    },
    {
      key: 'incidentDate',
      label: 'Incident Date',
    },
  ];

  if (reportCount === 0) {
    return null;
  }

  const stats = {
    incidentId,
    reportCount,
    incidentDate,
  };

  return (
    <IncidentCardContainer className="card">
      <div className="card-header">
        <h4>Incident Stats</h4>
      </div>
      <StatsContainer className="card-body">
        <div>
          {STATS.map((stat) => (
            <div key={stat.key}>{stat.label}</div>
          ))}
        </div>
        <div>
          {STATS.map((stat) => (
            <div key={stat.key}>{stats[stat.key]}</div>
          ))}
        </div>
      </StatsContainer>
    </IncidentCardContainer>
  );
};

export { Hits, IncidentCard, IncidentStatsCard, NoResults };
