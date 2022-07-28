import React from 'react';
import { GatsbyImage as Img } from 'gatsby-plugin-image';
import { format } from 'date-fns';
import { LocalizedLink } from 'gatsby-theme-i18n';
import Card from '../../elements/Card';

function PostPreview({ post }) {
  return (
    <Card className="tw-border tw-flex tw-flex-col md:tw-flex-row tw-break tw-bg-white tw-min-w-0 tw-relative tw-rounded-t-lg md:tw-rounded-l-lg md:tw-rounded-r-none">
      <div className="tw-flex tw-flex-col tw-w-full tw-max-w-full md:tw-w-2/6">
        <LocalizedLink to={post.frontmatter.slug} className="tw-text-primary-blue tw-max-w-full">
          <Img
            alt="post-image"
            className="img-fluid tw-rounded-start tw-h-full tw-w-full tw-max-w-full tw-max-h-240 tw-rounded-t-lg md:tw-rounded-l-lg md:tw-rounded-r-none"
            imgStyle={{ transition: '0.5s all ease-in-out' }}
            imgClassName="hover:tw-scale-110 tw-object-cover"
            image={post.frontmatter.image.childImageSharp.gatsbyImageData}
          />
        </LocalizedLink>
      </div>
      <Card.Body className="tw-flex-col">
        <Card.Title>
          <LocalizedLink to={post.frontmatter.slug}>
            <h5>{post.fields.title}</h5>
          </LocalizedLink>
        </Card.Title>
        <div className="tw-font-medium">
          {format(new Date(post.frontmatter.date), 'MMM d, yyyy')}
        </div>
        <div>
          {' '}
          {post.excerpt}... <LocalizedLink to={post.frontmatter.slug}>(Read More)</LocalizedLink>
        </div>
        <div className="tw-mt-4">
          <small className="tw-text-muted-gray tw-text-sm">By {post.frontmatter.author}</small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default PostPreview;
