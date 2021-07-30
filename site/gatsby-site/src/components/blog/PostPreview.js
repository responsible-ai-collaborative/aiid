import React from 'react';
import Img from 'gatsby-image';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { format } from 'date-fns';

const ThumbnailLink = styled(Link)`
  display: block;
  height: 300px;
  margin: 0 -2rem 0;
`;

const ThumbnailImg = styled(Img)`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

const TextContainer = styled.div`
  margin: 1rem auto 0;
  line-height: 1.7;
  flex: 1;
`;

const Title = styled.div`
  p {
    font-size: 1.5em;
  }
`;

const PostDate = styled.div`
  p {
    color: grey;
  }
`;

const Description = styled.div`
  padding-top: 0em;
  p {
    line-height: 1.5;
    margin-bottom: 0;
  }
`;

const Author = styled.div`
  font-style: italic;
  margin-top: 1rem;
`;

const Wrapper = styled.div`
  margin-top: -0.75em;
  padding: 0em 2em 1rem;
  @media (min-width: 991px) {
    display: flex;
    ${ThumbnailLink} {
      height: auto;
      margin: 0 1rem -1rem -2rem;
      justify-self: stretch;
      flex: 0.5;
      min-width: 280px;
    }
    ${TextContainer} {
      display: flex;
      flex-direction: column;
    }
    ${Description} {
      flex: 1;
    }
  }
`;

export default function PostPreview({ post }) {
  return (
    <Wrapper>
      <ThumbnailLink to={post.fields.slug}>
        <ThumbnailImg fluid={post.frontmatter.image.childImageSharp.fluid} />
      </ThumbnailLink>
      <TextContainer>
        <Link to={post.fields.slug}>
          <Title>
            <p>{post.fields.title}</p>
          </Title>
        </Link>
        <PostDate>
          <p>{format(new Date(post.frontmatter.date), 'MMM d, yyyy')}</p>
        </PostDate>
        <Description>
          <p>
            {post.excerpt}... <Link to={post.fields.slug}>(Read More)</Link>
          </p>
        </Description>
        <Author>By {post.frontmatter.author}</Author>
      </TextContainer>
    </Wrapper>
  );
}
