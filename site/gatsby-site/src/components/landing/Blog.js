import LatestPost from 'components/blog/LatestPost';
import React from 'react';
import { Card } from 'react-bootstrap';

export default function Blog() {
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title as="h2">Latest Blog Post</Card.Title>
          <LatestPost className="mt-3" />
        </Card.Body>
      </Card>
    </>
  );
}
