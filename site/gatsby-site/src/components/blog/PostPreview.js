import React from 'react';
import { GatsbyImage as Img } from 'gatsby-plugin-image';
import { format } from 'date-fns';
import { LocalizedLink } from 'gatsby-theme-i18n';
import Card from '../../elements/Card';
import { Trans } from 'react-i18next';

function PostPreview({ post }) {
  return (
    <Card className="border flex flex-col md:flex-row break bg-white min-w-0 relative rounded-t-lg md:rounded-l-lg md:rounded-r-none">
      <div className="flex flex-col w-full max-w-full md:w-2/6">
        <LocalizedLink to={post.frontmatter.slug} className="text-primary-blue max-w-full">
          <Img
            alt="post-image"
            className="img-fluid rounded-start h-full w-full max-w-full max-h-240 rounded-t-lg md:rounded-l-lg md:rounded-r-none"
            imgStyle={{ transition: '0.5s all ease-in-out' }}
            imgClassName="hover:scale-110 object-cover"
            image={post.frontmatter.image.childImageSharp.gatsbyImageData}
          />
        </LocalizedLink>
      </div>
      <Card.Body className="flex-col">
        <Card.Title as="h1">
          <LocalizedLink to={post.frontmatter.slug}>
            <h5>{post.fields.title}</h5>
          </LocalizedLink>
        </Card.Title>
        <div className="font-medium">{format(new Date(post.frontmatter.date), 'MMM d, yyyy')}</div>
        <div>
          {' '}
          {post.excerpt}...{' '}
          <LocalizedLink to={post.frontmatter.slug}>
            <Trans>(Read More)</Trans>
          </LocalizedLink>
        </div>
        <div className="mt-4">
          <small className="text-muted-gray text-sm">
            <Trans>By</Trans> {post.frontmatter.author}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PostPreview;
