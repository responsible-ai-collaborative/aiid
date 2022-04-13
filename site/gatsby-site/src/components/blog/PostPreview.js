import React from 'react';
import Img from 'gatsby-image';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { format } from 'date-fns';
import { Card, Col, Row } from 'react-bootstrap';

const StyledImg = styled(Img)`
  height: 100%;
  max-height: 240px;
`;

function PostPreview({ post, className }) {
  return (
    <Card className={className}>
      <Row className="g-0">
        <Col md={4}>
          <Link to={post.fields.slug}>
            <StyledImg
              className="img-fluid rounded-start"
              fluid={post.frontmatter.image.childImageSharp.fluid}
            />
          </Link>
        </Col>
        <Col md={8}>
          <Card.Body>
            <Card.Title>
              <Link to={post.fields.slug}>{post.fields.title}</Link>
            </Card.Title>
            <Card.Subtitle>{format(new Date(post.frontmatter.date), 'MMM d, yyyy')}</Card.Subtitle>
            <Card.Text>
              {' '}
              {post.excerpt}... <Link to={post.fields.slug}>(Read More)</Link>
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
