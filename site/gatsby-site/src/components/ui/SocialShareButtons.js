import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';

const SocialShareButtons = ({ metaTitle, canonicalUrl, page }) => {
  return (
    <div className={`d-flex social-btn-container ${page}`}>
      {/* Twitter */}
      <button
        className={'social-btn'}
        onClick={() => {
          window.open(
            `https://twitter.com/intent/tweet?text=${metaTitle}&url=${canonicalUrl}`,
            'twitter-share',
            'width=550,height=235'
          );
          return false;
        }}
      >
        <FontAwesomeIcon
          icon={faTwitter}
          color={'#001934'}
          className={'pointer fa fa-lg'}
          title="Share to Twitter"
        />
      </button>

      {/* LinkedIn */}
      <button
        className={'social-btn'}
        onClick={() => {
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${canonicalUrl}`,
            'linkedin-share',
            'width=650,height=600'
          );
          return false;
        }}
      >
        <FontAwesomeIcon
          icon={faLinkedin}
          color={'#001934'}
          className={'pointer fa fa-lg'}
          title="Share to LinkedIn"
        />
      </button>

      {/* Email */}
      <button
        className={'social-btn'}
        onClick={() => {
          window.open(
            `mailto:?subject=${metaTitle}&body=${canonicalUrl}`,
            'email-share',
            'width=600,height=300'
          );
          return false;
        }}
      >
        <FontAwesomeIcon
          icon={faEnvelope}
          color={'#001934'}
          className={'pointer fa fa-lg'}
          title="Share by email"
        />
      </button>

      {/* Facebook */}
      <button
        className={'social-btn'}
        onClick={() => {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${canonicalUrl}`,
            'facebook-share',
            'width=580,height=296'
          );
          return false;
        }}
      >
        <FontAwesomeIcon
          icon={faFacebook}
          color={'#001934'}
          className={'pointer fa fa-lg'}
          title="Share to Facebook"
        />
      </button>
    </div>
  );
};

export default SocialShareButtons;
