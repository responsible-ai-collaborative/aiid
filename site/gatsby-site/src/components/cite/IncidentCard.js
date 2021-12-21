import React from 'react';
import { Highlight } from 'react-instantsearch-dom';
import styled from 'styled-components';
import md5 from 'md5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faNewspaper,
    faIdCard,
    faUserShield,
    faFlag,
} from '@fortawesome/free-solid-svg-icons';
import WebArchiveLink from '../WebArchiveLink';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { getParagraphs } from 'utils/typography';

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

const IncidentCardImage = styled(Image)`
  height: 480px;
  object-fit: cover;
  width: 100%;
`;

const ImageContainer = styled.div`
  height: 480px;
`


const CardBody = styled.div`
  padding: 1.25rem 1.25rem 0 1.25rem !important;
`;

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

const cardNeedsBlockquote = (item) => {
    if (item.text && item.text.matchLevel === 'full') {
        return true;
    }
    return false;
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

const IncidentCard = ({
    item,
    authorsModal,
    submittersModal,
    flagReportModal,
    showDetails,
}) => {

    return <IncidentCardContainer id={`r${item.mongodb_id}`}>
        <div className="card-header">
            <a href={`#r${item.mongodb_id}`}><span>{item.title}</span></a>
            <p className="subhead">
                {item.source_domain} &middot;{' '}
                {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
            </p>
        </div>
        <CardBody className="card-body">
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
            
            <ImageContainer>
                <IncidentCardImage
                    publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
                    alt={item.title}
                    transformation={fill().height(480)}
                />
            </ImageContainer>

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

        </CardFooter>
    </IncidentCardContainer>
};

export default IncidentCard;