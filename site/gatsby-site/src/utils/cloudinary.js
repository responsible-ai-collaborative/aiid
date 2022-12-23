import React, { useState, useRef, useEffect } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/base';
import { defaultImage, format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import config from '../../config';
import TextInputGroup from '../components/forms/TextInputGroup';
import { Spinner } from 'flowbite-react';
import { isWebUri } from 'valid-url';
import { Trans } from 'react-i18next';

const IMG_FALLBACK = 'fallback.jpg';

const getCloudinaryPublicID = (url) => {
  // https://cloudinary.com/documentation/fetch_remote_images#auto_upload_remote_files

  const publicID = 'reports/' + url.replace(/^https?:\/\//, '');

  return publicID;
};

const Image = ({
  publicID,
  className = '',
  alt,
  transformation = null,
  plugins = [lazyload()],
  style,
  height = '800px'
}) => {

  const imageElement = useRef(null);

  const [needsFallback, setNeedsFallback] = useState(!publicID || publicID == 'placeholder.svg');

  const image = new CloudinaryImage(publicID /*.replace(/%/g, '%25')*/, {
    cloudName: config.cloudinary.cloudName,
  });

  //TODO: this is a fix for this issue: https://github.com/PartnershipOnAI/aiid/issues/260
  // Setting transformation as a string skips the safe url check here: https://github.com/cloudinary/js-url-gen/blob/9a3d0a29ea77ddfd6f7181251615f34c2d8a6c5d/src/assets/CloudinaryFile.ts#L279
  const tmpImage = new CloudinaryImage();

  tmpImage.delivery(format(auto())).delivery(quality(qAuto()));

  if (transformation) {
    tmpImage.addTransformation(transformation);
  }

  image.transformation = tmpImage.transformation.toString();

  useEffect(() => {
    let fallbackTimeout;

    const useFallbackIfLoadFailed = () => {
      console.log('useFallbackIfLoadFailed');
      const img = imageElement.current?.imageRef.current;
      console.log(`img`, img);

      if (!img || img.naturalHeight == undefined || img.naturalHeight == 0) {
        if ((img.src || img.srcset) && img.complete) {
          setNeedsFallback(true);
        } else {
          fallbackTimeout = setTimeout(useFallbackIfLoadFailed, 1000);
        }
      }
    };

    useFallbackIfLoadFailed();

    return () => clearTimeout(fallbackTimeout);
  }, [publicID]);

  return needsFallback ? (
    <PlaceholderImage
        siteName="IncidentDatabase.AI"
        title="YouTube to crack down on inappropriate content masked as kids' cartoons"
        incidentNumber="No.100"
        height={height}
      />
  ) : (
    <AdvancedImage
      ref={imageElement}
      alt={alt}
      className={className}
      cldImg={image}
      plugins={plugins}
      style={style}
    />
  );
};

const PreviewImageInputGroup = ({
  cloudinary_id,
  name,
  label,
  placeholder,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  className = '',
  schema,
  alt = '',
  icon,
}) => {
  const [cloudinaryID, setCloudinaryID] = useState(IMG_FALLBACK);

  // Track whether the image is waiting to update so we can show a spinner.
  const [updatingImage, setUpdatingImage] = useState(false);

  const [imageReferenceError, setImageReferenceError] = useState(false);

  const timeoutID = useRef(null);

  const imageUrl = useRef(values.image_url);

  const updateCloudinaryID = () => {
    if (isWebUri(values.image_url)) {
      // We want to show an error if the given url does not point to an image.
      // We can do this by attempting to load the image ourselves
      // before passing it to Cloudinary, which loads a fallback on error.
      const img = document.createElement('img');

      img.src = values.image_url;
      img.onload = () => {
        setImageReferenceError(false);
        setCloudinaryID(getCloudinaryPublicID(values.image_url));
      };
      img.onerror = () => {
        setCloudinaryID(IMG_FALLBACK);
        setImageReferenceError(true);
      };
    } else {
      setCloudinaryID(IMG_FALLBACK);
    }
    setUpdatingImage(false);
  };

  // When the form value changes, wait two seconds,
  // and if it hasn't changed again by then, update the cloudinaryID.
  // This prevents repeated requests for partially-typed URLs.
  if (values.image_url != imageUrl.current) {
    imageUrl.current = values.image_url;
    setUpdatingImage(true);
    clearTimeout(timeoutID.current);
    timeoutID.current = setTimeout(updateCloudinaryID, 2000);
  }

  useEffect(() => {
    // Default to fallback so we don't have to hit cloudinary API
    // when we know there will be no match
    if (!cloudinary_id || cloudinary_id == 'reports/') {
      setCloudinaryID(IMG_FALLBACK);
    } else {
      setCloudinaryID(cloudinary_id);
    }
  }, [cloudinary_id]);

  const childErrors = { ...errors };

  touched.image_url = values.image_url.length > 0;
  if (imageReferenceError) {
    childErrors.image_url ||= '*Url must point to a valid image';
  }

  return (
    <>
      <TextInputGroup
        name={name}
        label={label}
        icon={icon}
        placeholder={placeholder}
        values={values}
        errors={childErrors}
        touched={touched}
        handleChange={handleChange}
        className={className}
        handleBlur={handleBlur}
        schema={schema}
      />
      <figure
        data-cy="image-preview-figure"
        id="image-preview-figure"
        className="text-center md:flex md:items-center md:justify-center md:flex-col"
      >
        <div
          className="flex items-center justify-center bootstrap md:max-w-prose"
          style={{ height: '20vh', marginTop: '1rem' }}
        >
          {updatingImage ? (
            <Spinner size="xl" />
          ) : (
            <Image publicID={cloudinaryID} style={{ maxHeight: '100%' }} alt={alt} />
          )}
        </div>
        <figcaption className="mt-2">
          <Trans>Selected Image</Trans>
        </figcaption>
      </figure>
    </>
  );
};

function PlaceholderImage({title, siteName, incidentNumber, height = 480, style, className}) {

  const canvasRef = useRef();

  console.log(`height`, height);

  const h = Math.floor(Number(height.replace('px', '')));
  const w = Math.floor(h * 4/3);
  console.log(`h`, h);
  console.log(`w`, w);

  useEffect(() => {
    const canvas = canvasRef.current;
    const charHeight = h / 12.5;
    const padding = charHeight * 0.2;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');

    const colorScheme = randomChoice([
      {background: '#020241', text: [235, 235, 255]},
      {background: '#030d01', text: [59, 255, 25]},
      {background: '#2d2400', text: [255, 204, 0]},
    ])

    console.log(`colorScheme`, colorScheme);

    // Set background
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = colorScheme.background;
    ctx.fill();


    ctx.font = `${charHeight}px monospace`;

    const charWidth = ctx.measureText('M').width;

    const charsPerLine = Math.floor(w / charWidth);

    const numLines = Math.floor(h / charHeight);

    const title64 = btoa(title).replace(/[=+]/g, '');
    let displayText = Array(numLines).fill(title64).join('.');

    let siteNameIndex = 
      // Pick random line from top half of the screen,
      // but not the first line.
      charsPerLine * (randInt(1, numLines / 2 - 1)) + 

      // Pick random column such that the full siteName can fit on the line.
      randInt(1, charsPerLine - siteName.length - 1);

    displayText = insertStringAtIndex(displayText, siteName, siteNameIndex);

    let incidentNumberIndex = 
      charsPerLine * randInt(numLines / 2, numLines - 3) + 
      randInt(1, charsPerLine - incidentNumber.length - 1);

    displayText = insertStringAtIndex(displayText, incidentNumber, incidentNumberIndex);


    ctx.filter = 'drop-shadow(0px 0px 10px white';
    for (let line = 0; line < numLines; line++) {
      ctx.fillStyle = `rgba(${colorScheme.text}, ${0.2 + Math.random() / 4}`;
      
      const textIndex = (line * charsPerLine) % displayText.length;
      const lineText = displayText.slice(textIndex, textIndex + charsPerLine)

      const y = (charHeight + padding) * (line + 1);
      ctx.fillText(lineText, padding, y);
      
      ctx.fillStyle = `rgba(${colorScheme.text}, 1`;
      if (line * charsPerLine < siteNameIndex && siteNameIndex < (line+1) * charsPerLine) {
        const x = (siteNameIndex % charsPerLine) * charWidth + padding;
        ctx.fillText(siteName, x, y)  ;
      }
      if (line * charsPerLine < incidentNumberIndex && incidentNumberIndex < (line+1) * charsPerLine) {
        const x = (incidentNumberIndex % charsPerLine) * charWidth + padding;
        ctx.fillText(incidentNumber, x, y)  ;
      }
    }  
  }, []);

  return <canvas ref={canvasRef} width={w} height={h} {...{className, style}}></canvas>
}

function randInt(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}
function insertStringAtIndex(outerString, innerString, index) {
  return outerString.slice(0, index) + innerString + outerString.slice(index);
}
function randomChoice(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export { getCloudinaryPublicID, Image, PreviewImageInputGroup };
