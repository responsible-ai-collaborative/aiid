import React from 'react';
import { Card } from 'react-bootstrap';
import styled from 'styled-components';

const NewsImage = styled.img``;

const Outlet = styled.li``;

const Outlets = styled.ul`
  list-style-type: none;
  display: flex;
  justify-content: space-around;
  align-items: center;

  ${Outlet} {
    width: 120px;
  }
`;

export default function Featured() {
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title className="text-center h3">The Database in Print</Card.Title>
          <Card.Subtitle className="text-center">
            Read about the database on the{' '}
            <a
              href="https://www.partnershiponai.org/aiincidentdatabase/"
              target="_blank"
              rel="noreferrer"
            >
              PAI Blog
            </a>
            ,{' '}
            <a
              href="https://www.vice.com/en/article/m7agjq/this-database-is-finally-holding-ai-accountable"
              target="_blank"
              rel="noreferrer"
            >
              Vice News
            </a>
            ,{' '}
            <a
              href="https://venturebeat.com/2021/01/15/the-ai-incident-database-wants-to-improve-the-safety-of-machine-learning/"
              target="_blank"
              rel="noreferrer"
            >
              Venture Beat
            </a>
            ,{' '}
            <a
              href="https://www.wired.com/story/artificial-intelligence-hall-shame/"
              target="_blank"
              rel="noreferrer"
            >
              Wired
            </a>
            , and{' '}
            <a href="https://arxiv.org/abs/2011.08512" target="_blank" rel="noreferrer">
              arXiv
            </a>{' '}
            among other outlets.
          </Card.Subtitle>

          <Outlets className="mt-4">
            <Outlet>
              <a href="https://arxiv.org/abs/2011.08512" target="_blank" rel="noreferrer">
                <NewsImage src="/images/news/arxiv.png" rounded />
              </a>
            </Outlet>
            <Outlet>
              <a
                href="https://venturebeat.com/2021/01/15/the-ai-incident-database-wants-to-improve-the-safety-of-machine-learning/"
                target="_blank"
                rel="noreferrer"
              >
                <NewsImage src="/images/news/VentureBeat.png" rounded />
              </a>
            </Outlet>
            <Outlet>
              <a
                href="https://www.wired.com/story/artificial-intelligence-hall-shame/"
                target="_blank"
                rel="noreferrer"
              >
                <NewsImage src="/images/news/Wired_logo.svg" rounded />
              </a>
            </Outlet>
            <Outlet>
              <a
                href="https://www.vice.com/en/article/m7agjq/this-database-is-finally-holding-ai-accountable"
                target="_blank"
                rel="noreferrer"
              >
                <NewsImage src="/images/news/vice.png" rounded />
              </a>
            </Outlet>
          </Outlets>
        </Card.Body>
      </Card>
    </>
  );
}
