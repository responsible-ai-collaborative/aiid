import React, { useState, useRef, useEffect } from 'react';
import { AdvancedImage, lazyload } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/base';
import { format, quality } from '@cloudinary/base/actions/delivery';
import { auto } from '@cloudinary/base/qualifiers/format';
import { auto as qAuto } from '@cloudinary/base/qualifiers/quality';
import config from '../../config';
import TextInputGroup from '../components/forms/TextInputGroup';
import { Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';
import hash from 'object-hash';
import debounce from 'lodash/debounce';

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
  height = '800px',
  title,
  itemIdentifier,
}) => {
  const imageElement = useRef(null);

  const [loadFailed, setLoadFailed] = useState(!publicID || publicID == 'placeholder.svg');

  useEffect(() => {
    setLoadFailed(false);
    const img = imageElement.current?.imageRef.current;

    if (img) {
      const errorListener = img.addEventListener('error', () => {
        setLoadFailed(true);
      });

      return () => img.removeEventListener('error', errorListener);
    }
  }, [publicID, imageElement.current?.imageRef.current]);

  if (!publicID || publicID == '' || loadFailed) {
    return (
      <PlaceholderImage
        siteName="IncidentDatabase.AI"
        itemIdentifier={itemIdentifier}
        title={title || alt}
        className={className}
        height={height}
        style={style}
      />
    );
  } else {
    const image = new CloudinaryImage(publicID, {
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

    return (
      <AdvancedImage
        ref={imageElement}
        alt={alt}
        className={className}
        cldImg={image}
        plugins={plugins}
        style={style}
      />
    );
  }
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
  const [cloudinaryID, setCloudinaryID] = useState(cloudinary_id);

  // Debounced function needs to be in ref
  // so it can maintain its internal state
  const debouncedUpdateCloudinaryId = useRef(debounce((c) => setCloudinaryID(c), 2000)).current;

  useEffect(() => {
    const id = values.cloudinary_id || cloudinary_id;

    if (id && id.length > 0) {
      // We debounce updating the cloudinary_id to avoid
      // making too many requests to cloudinary
      debouncedUpdateCloudinaryId(id);
    } else {
      // But if the ID is null, then no request will made,
      // so we can update right away.
      setCloudinaryID('');
    }
  }, [cloudinary_id, values.cloudinary_id]);

  return (
    <>
      <TextInputGroup
        {...{
          name,
          label,
          icon,
          placeholder,
          values,
          errors,
          touched,
          handleChange,
          className,
          handleBlur,
          schema,
        }}
      />
      <figure
        data-cy="image-preview-figure"
        id="image-preview-figure"
        className="text-center md:flex md:items-center md:justify-center md:flex-col"
      >
        <div
          className="grid grid-cols-1 grid-rows-1 items-center justify-center mt-4"
          style={{ height: '20vh' }}
        >
          <div style={{ gridRowStart: '1', gridColumnStart: '1', maxHeight: '100%', zIndex: 1 }}>
            <Spinner size="xl" />
          </div>
          <div
            style={{
              gridRowStart: '1',
              gridColumnStart: '1',
              height: '20vh',
              maxWidth: '100%',
              zIndex: 2,
            }}
          >
            <Image
              publicID={cloudinaryID}
              alt={alt}
              height="300"
              className="inline-block mx-auto min-h-48 min-w-48 max-w-full h-full bg-white"
            />
          </div>
        </div>
        <figcaption className="mt-2">
          <Trans>Selected Image</Trans>
        </figcaption>
      </figure>
    </>
  );
};

function PlaceholderImage({ title, siteName, itemIdentifier, height = 480, style, className }) {
  const canvasRef = useRef();

  const h = Math.floor(Number(height.replace('px', '')));

  const w = Math.floor((h * 4) / 3);

  const random = mulberry32(Number('0x' + hash(itemIdentifier || title)) % Number.MAX_SAFE_INTEGER);

  const randInt = (min, max) => Math.floor(min + random() * (max - min));

  const randomChoice = (list) => list[Math.floor(random() * list.length)];

  useEffect(() => {
    const canvas = canvasRef.current;

    const charHeight = h / 12.5;

    const padding = charHeight * 0.2;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');

    const colorScheme = randomChoice([
      { background: '#020241', text: [235, 235, 255] },
      { background: '#030d01', text: [59, 255, 25] },
      { background: '#2d2400', text: [255, 204, 0] },
    ]);

    // Set background
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = colorScheme.background;
    ctx.fill();

    ctx.font = `${charHeight}px monospace`;

    const charWidth = ctx.measureText('M').width;

    const charsPerLine = Math.floor(w / charWidth);

    const numLines = Math.floor(h / charHeight);

    const title64 = btoa(
      title
        ? title.replace(/[^A-Za-z0-9 ]/g, '')
        : Array(10)
            .fill()
            .map(() => Math.floor(random() * Number.MAX_SAFE_INTEGER))
            .join('')
    ).replace(/[=+]/g, '');

    let displayText = Array(numLines).fill(title64).join('.');

    // Top half if there's an itemIdentifier, else all
    const availableLines = itemIdentifier ? numLines / 2 : numLines;

    // Pick randomly from available lines, not counting the first and last
    const rowIndex = charsPerLine * randInt(1, availableLines - 1);

    // Pick random column such that the full siteName can fit on the line
    const colIndex = randInt(1, charsPerLine - siteName.length - 1);

    const siteNameIndex = rowIndex + colIndex;

    displayText = insertStringAtIndex(displayText, siteName, siteNameIndex);

    let itemIdentifierIndex;

    if (itemIdentifier) {
      itemIdentifierIndex =
        charsPerLine * randInt(numLines / 2, numLines - 3) +
        randInt(1, charsPerLine - itemIdentifier.length - 1);

      displayText = insertStringAtIndex(displayText, itemIdentifier, itemIdentifierIndex);
    }

    ctx.filter = 'drop-shadow(0px 0px 10px white';
    for (let line = 0; line < numLines; line++) {
      ctx.fillStyle = `rgba(${colorScheme.text}, ${0.2 + random() / 4}`;

      const textIndex = (line * charsPerLine) % displayText.length;

      const lineText = displayText.slice(textIndex, textIndex + charsPerLine);

      const y = (charHeight + padding) * (line + 1);

      ctx.fillText(lineText, padding, y);

      ctx.fillStyle = `rgba(${colorScheme.text}, 1)`;
      if (line * charsPerLine < siteNameIndex && siteNameIndex < (line + 1) * charsPerLine) {
        const x = (siteNameIndex % charsPerLine) * charWidth + padding;

        ctx.fillText(siteName, x, y);
      }
      if (
        itemIdentifier &&
        line * charsPerLine < itemIdentifierIndex &&
        itemIdentifierIndex < (line + 1) * charsPerLine
      ) {
        const x = (itemIdentifierIndex % charsPerLine) * charWidth + padding;

        ctx.fillText(itemIdentifier, x, y);
      }
    }
  }, []);

  return <canvas ref={canvasRef} width={w} height={h} {...{ className, style }}></canvas>;
}

// Seeded RNG
function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function insertStringAtIndex(outerString, innerString, index) {
  return outerString.slice(0, index) + innerString + outerString.slice(index);
}

export { getCloudinaryPublicID, Image, PreviewImageInputGroup };
