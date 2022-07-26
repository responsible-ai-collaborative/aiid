import React from 'react';
import { GatsbyImage as Img } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Card, Col, Row } from 'react-bootstrap';
import { LocalizedLink } from 'gatsby-theme-i18n';

const StyledImg = styled(Img)`
  height: 100%;
  max-height: 240px;
`;

function PostPreview({ post, className }) {
  return (
    <Card className={className}>
      <Row className="g-0">
        <Col md={4}>
          <LocalizedLink to={`/blog/${post.frontmatter.slug}`}>
            <StyledImg
              alt="post-image"
              className="img-fluid rounded-start"
              image={post.frontmatter.image.childImageSharp.gatsbyImageData}
            />
          </LocalizedLink>
        </Col>
        <Col md={8}>
          <Card.Body>
            <Card.Title>
              <LocalizedLink to={`/blog/${post.frontmatter.slug}`}>
                {post.fields.title}
              </LocalizedLink>
            </Card.Title>
            <Card.Subtitle>{format(new Date(post.frontmatter.date), 'MMM d, yyyy')}</Card.Subtitle>
            <Card.Text>
              {' '}
              {post.excerpt}...{' '}
              <LocalizedLink to={`/blog/${post.frontmatter.slug}`}>(Read More)</LocalizedLink>
            </Card.Text>
            <Card.Text>
              <small className="text-muted">By {post.frontmatter.author}</small>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
}

export default styled(PostPreview)``;
