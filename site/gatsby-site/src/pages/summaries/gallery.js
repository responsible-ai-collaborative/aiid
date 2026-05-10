import React, { useEffect, useRef, useState } from 'react';
import HeadContent from 'components/HeadContent';
import { graphql } from 'gatsby';
import md5 from 'md5';
import config from '../../../config';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';

const cloudName = config.cloudinary.cloudName;

const cloudinaryUrl = (publicID, size) =>
  `https://res.cloudinary.com/${cloudName}/image/upload/c_fill,h_${size},w_${size},q_auto,f_auto/${publicID}`;

const THUMB_PX = 150;

const HOVER_PX = 400;

const FALLBACK_SRC = '/logos/AIID_1000x1000px.png';

const fallbackBgStyle = {
  backgroundImage: `url("${FALLBACK_SRC}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const Thumb = ({ incident }) => {
  const [hovered, setHovered] = useState(false);

  const [thumbLoaded, setThumbLoaded] = useState(false);

  const [largeLoaded, setLargeLoaded] = useState(false);

  const thumbRef = useRef(null);

  const largeRef = useRef(null);

  const report = incident.reports[0];

  const publicID = report.cloudinary_id || `legacy/${md5(report.image_url)}`;

  const thumbSrc = cloudinaryUrl(publicID, THUMB_PX);

  const largeSrc = cloudinaryUrl(publicID, HOVER_PX);

  // After hydration/mount the image may have already finished loading from
  // cache, in which case the onLoad event has fired before React attached its
  // handler and thumbLoaded never flips. Cover that case explicitly.
  useEffect(() => {
    const img = thumbRef.current;

    if (img && img.complete && img.naturalWidth > 0) {
      setThumbLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hovered) return;
    const img = largeRef.current;

    if (img && img.complete && img.naturalWidth > 0) {
      setLargeLoaded(true);
    }
  }, [hovered]);

  return (
    <LocalizedLink
      to={`/cite/${incident.incident_id}`}
      data-cy={`incident-thumb-${incident.incident_id}`}
      className="group block relative aspect-square hover:z-10 focus:z-10 cursor-pointer"
      title={incident.title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 origin-center transition-transform duration-200 ease-out group-hover:scale-[2.2] group-focus:scale-[2.2] group-hover:shadow-2xl group-focus:shadow-2xl bg-gray-200"
        style={fallbackBgStyle}
      >
        <img
          ref={thumbRef}
          src={thumbSrc}
          alt={incident.title}
          loading="lazy"
          decoding="async"
          width={THUMB_PX}
          height={THUMB_PX}
          onLoad={() => setThumbLoaded(true)}
          className={`absolute inset-0 h-full w-full object-contain bg-white transition-opacity duration-200 ${
            thumbLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {hovered && (
          <img
            ref={largeRef}
            src={largeSrc}
            alt=""
            decoding="async"
            width={HOVER_PX}
            height={HOVER_PX}
            onLoad={() => setLargeLoaded(true)}
            className={`absolute inset-0 h-full w-full object-contain bg-white transition-opacity duration-200 ${
              largeLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[10px] font-semibold leading-tight text-center p-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 line-clamp-3 break-words">
          {incident.title}
        </div>
      </div>
    </LocalizedLink>
  );
};

export default function SummariesGallery({ data }) {
  const incidents = [...data.allMongodbAiidprodIncidents.nodes]
    .filter((incident) => incident.reports?.[0]?.cloudinary_id || incident.reports?.[0]?.image_url)
    .sort((a, b) => a.incident_id - b.incident_id);

  return (
    <>
      <div className="titleWrapper">
        <h1>
          <Trans ns="gallery">Incident Image Gallery</Trans>
        </h1>
      </div>
      <div className="styled-main-wrapper max-w-full">
        <p>
          <Trans ns="gallery">
            A visual index of every incident in the AI Incident Database. Hover a thumbnail to
            preview the full image and incident title; click to open the incident.
          </Trans>
        </p>
        <div
          data-cy="summaries-image-grid"
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-0"
        >
          {incidents.map((incident) => (
            <Thumb key={incident.incident_id} incident={incident} />
          ))}
        </div>
      </div>
    </>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const { t } = useTranslation('gallery');

  const metaTitle = t('Incident Image Gallery');

  const metaDescription = t(
    'A thumbnail gallery of every incident in the AI Incident Database. Hover for the title; click to open the incident.'
  );

  return (
    <>
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
      <HeadContent path={pathname} metaTitle={metaTitle} metaDescription={metaDescription} />
    </>
  );
};

export const pageQuery = graphql`
  query AllIncidentsImages {
    allMongodbAiidprodIncidents(sort: { incident_id: ASC }) {
      nodes {
        incident_id
        title
        reports {
          report_number
          image_url
          cloudinary_id
        }
      }
    }
  }
`;
