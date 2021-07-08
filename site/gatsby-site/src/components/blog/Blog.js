import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { Button, Row, Col, Card } from 'react-bootstrap';

const StyledImageBig = styled(Img)`
  margin: auto;
  margin-top: 1em;
  display: block;

  @media (max-width: 1100px) {
    width: 90%;
  }
  @media (min-width: 1100px) {
    width: 80%;
  }
`;

const StyledImageSmall = styled(Img)`
  padding: 0em 1em 0em 0em;
  @media (max-width: 800px) {
    margin: auto;
    display: block;
    float: none;
    max-width: 297px;
  }

  @media (min-width: 800px) {
    float: right;
    min-width: 297px;
    max-width: 297px;
  }
`;

const StyledCardLeadParagraph = styled.p`
  padding: 0em 2em 0em 2em;
  margin-bottom: 0px;
  line-height: 1.7;
`;

const StyledCardParagraph = styled.p`
  padding: 0em 2em 0em 2em;
  margin-bottom: 0px;
  line-height: 1.7;
`;

const StyledButton = styled(Button)`
  margin: 1em 0em 0em 0em;
`;

const StyledRow = styled(Row)``;

const SectionHeading = styled(Card.Header)`
  font-size: 26px;
  font-weight: 800;
  line-height: 1.5;
  margin-bottom: 0.5em;
  background-color: rgba(0, 0, 0, 0.03);
`;

const BlogHeading = styled.h2`
  padding: 1em 2em 0em 1em;
  margin-bottom: 0px;
  line-height: 1.7;
`;

const LiWrapper = styled.div`
  padding: 0em 2em 0em 2em;
  li {
    margin-left: 1em;
  }
`;

const Blog = () => {
  return (
    <StaticQuery
      query={graphql`
        query {
          cset: file(relativePath: { eq: "cset.png" }) {
            childImageSharp {
              fluid(maxWidth: 297) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          facet: file(relativePath: { eq: "facet.png" }) {
            childImageSharp {
              fluid(maxWidth: 920) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          pie_geography: file(relativePath: { eq: "pie_geography.png" }) {
            childImageSharp {
              fluid(maxWidth: 520) {
                ...GatsbyImageSharpFluid
              }
            }
          }
          pie_companies: file(relativePath: { eq: "pie_companies.png" }) {
            childImageSharp {
              fluid(maxWidth: 520) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      `}
      render={(data) => <Content data={data} />}
    />
  );
};

const Content = ({ data }) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const LongRead = () => {
    return (
      <>
        <StyledRow>
          <Col>
            <BlogHeading>Multiple Perspectives</BlogHeading>
            <StyledImageSmall fluid={data.cset.childImageSharp.fluid} alt="" />
            <StyledCardParagraph>
              The AIID does not offer one canonical source of truth regarding AI incidents. Indeed,
              reasonable parties will have well-founded reasons for why an incident should be
              reported or classified differently. Consequently, the AIID supports multiple
              perspectives on incidents both by ingesting multiple reports (to date,{' '}
              <Link to="/summaries/leaderboard">1199 authors from 547 publications</Link>), and by
              supporting multiple taxonomies. The first taxonomy presented by the AIID is thus the
              work of a collaboration with the{' '}
              <a href="https://cset.georgetown.edu/">Center for Security and Emerging Technology</a>{' '}
              (CSET) at Georgetown, which defined and applied their own taxonomy across all
              incidents admitted to the database. The CSET taxonomy{' '}
              <Link to="/taxonomy/cset">provides a many faceted view</Link> into the data and is
              detailed on its <Link to="/taxonomy/cset">taxonomy page</Link>. It also serves as the
              basis for their{' '}
              <a href="https://cset.georgetown.edu/publication/ai-accidents-an-emerging-threat/">
                primer on AI accidents
              </a>
              .
            </StyledCardParagraph>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <Link to={'/apps/discover?classifications=CSET%3AHarm%20Distribution%20Basis%3ARace'}>
              <StyledImageBig
                fluid={data.facet.childImageSharp.fluid}
                alt="The discover app filtered by racial disparate impact"
              />
            </Link>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <BlogHeading>Collection Biases</BlogHeading>
            <StyledCardParagraph>
              It is not the role of Partnership on AI, the AIID, or its editors to be the primary
              source of scholarship from the incident data, but rather to provide resources and
              infrastructure for incident discovery and scholarship. However, at the launch of this
              data product it is necessary to provide additional context.
            </StyledCardParagraph>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <Link to={'/taxonomy/cset'}>
              <StyledImageBig
                fluid={data.pie_geography.childImageSharp.fluid}
                alt="Collection biases of geography"
              />
            </Link>
            <StyledCardParagraph>
              <strong>Geographic Biases.</strong> The incident data within the database currently
              reflects the geographic biases of incident submitters, which are largely based in the
              English speaking world. In the future we will support machine translation and other
              functionality allowing for greater cross-language sharing, but at present the database
              is English-only.
            </StyledCardParagraph>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <Link to={'/taxonomy/cset'}>
              <StyledImageBig
                fluid={data.pie_companies.childImageSharp.fluid}
                alt="Sampling biases of companies"
              />
            </Link>
            <StyledCardParagraph>
              <strong>Company Bias.</strong> Much of the original data for the AIID was reported by
              people working at partner organizations. This is a major contributor to the fact that
              Google, Facebook, Amazon, OpenAI, YouTube, and Microsoft are all among the top
              reported companies. Even with the more intensive sampling of Partnership
              organizations, more than half of AIID incidents pertain to systems developed by much
              smaller organizations. AI is already everywhere and it is incumbent upon us all to
              learn from its failures happening anywhere in the world.
            </StyledCardParagraph>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <BlogHeading>What Can You Do With This?</BlogHeading>
            <StyledCardParagraph>
              You can help correct for incident reporting biases embedded within the data by
              submitting incident reports or writing your own taxonomy for inclusion alongside the
              CSET taxonomy. An incident first experienced in Hyderabad will soon find its way to
              Hamburg (and vice versa) if we do not work to learn from our collective failures and
              make a better world.
            </StyledCardParagraph>
            <LiWrapper>
              <ul>
                <li>
                  Explore incidents within the taxonomy, including:
                  <ul>
                    <li>
                      <Link
                        to={
                          '/apps/discover?classifications=CSET%3AHarm%20Distribution%20Basis%3ARace'
                        }
                      >
                        Those with disparate impact according to race
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={
                          '/apps/discover?classifications=CSET%3ASystem%20Developer%3AAmazon%7C%7CCSET%3ASystem%20Developer%3AGoogle%7C%7CCSET%3ASystem%20Developer%3AMicrosoft%7C%7CCSET%3ASystem%20Developer%3AOpenAI%7C%7CCSET%3ASystem%20Developer%3AFacebook%7C%7CCSET%3ASystem%20Developer%3AYouTube'
                        }
                      >
                        Those produced by Partner Organizations
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={
                          '/apps/discover?classifications=CSET%3AHarm%20Type%3AHarm%20to%20social%20or%20political%20systems'
                        }
                      >
                        Those that harmed social or political systems
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to={'/contact'}>Propose a new taxonomy</Link>
                </li>
                <li>
                  <Link to={'/research/snapshots'}>
                    Download a weekly snapshot of the complete database
                  </Link>
                </li>
                <li>
                  <Link to={'/apps/quickadd'}>Submit a new incident</Link>
                </li>
                <li>
                  <Link to={'https://github.com/PartnershipOnAI/aiid'}>Open a pull request</Link>
                </li>
              </ul>
            </LiWrapper>
          </Col>
        </StyledRow>
        <StyledRow>
          <Col>
            <BlogHeading>Credit and Acknowledgements</BlogHeading>
            <StyledCardParagraph>
              The CSET taxonomy and the associated AIID system development are the collaboration of{' '}
              <a href="https://cset.georgetown.edu/staff/zachary-arnold/">Zachary Arnold</a>,{' '}
              <a href="https://seanbmcgregor.com/">Sean McGregor</a>,{' '}
              <a href="https://cset.georgetown.edu/staff/helen-toner/">Helen Toner</a>,{' '}
              <a href="https://cset.georgetown.edu/staff/alex-friedland/">Alex Friedland</a>,{' '}
              <a href="https://github.com/alexmcode">Alexandru Muscă</a>, and a revolving group of{' '}
              <a href="https://www.georgetown.edu/">Georgetown</a> students responsible for filling
              out the taxonomy for the incidents in the database. Comments regarding the CSET
              taxonomy should be directed to Helen Toner (cset@georgetown.edu). Questions and
              comments regarding the AIID should be directed to Sean McGregor
              (taxonomy@seanbmcgregor.com).
            </StyledCardParagraph>
          </Col>
        </StyledRow>
      </>
    );
  };

  return (
    <>
      <SectionHeading>July 8th: The First Taxonomy of AI Incidents</SectionHeading>
      <StyledRow>
        <Col>
          <StyledCardLeadParagraph>
            In November the <a href="http://partnershiponai.org/">Partnership on AI</a> AI Incident
            Database (AIID) publicly invited users to{' '}
            <Link to="/apps/discover">instantly search</Link> through thousands of pages of text to
            better understand the limitations of AI products within the real world. Since November,
            tens of thousands of people from 157 countries have connected to the AIID. Today marks
            the launch of the <Link to="/research/2-roadmap">next stage</Link> of AI Incident
            Database with its first complete{' '}
            <Link to="/research/4-taxonomies">AI incident taxonomy</Link>.
          </StyledCardLeadParagraph>
        </Col>
      </StyledRow>
      {showAll ? <LongRead /> : null}
      <StyledButton
        variant="outline-primary"
        className="btn btn-lg assignment-button"
        onClick={toggleShowAll}
      >
        {`${showAll ? 'show less' : 'keep reading'}`}
      </StyledButton>
    </>
  );
};

export default Blog;
