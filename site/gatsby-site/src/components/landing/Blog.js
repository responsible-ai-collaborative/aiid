import LatestPost from 'components/blog/LatestPost';
import React from 'react';
import { Card } from 'react-bootstrap';

export default function Blog() {
  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title className="text-center h3">Latest Blog Post</Card.Title>
          <LatestPost />
        </Card.Body>
      </Card>
    </>
  );
}
