import React, { useRef, useEffect } from 'react';
import hash from 'object-hash';

export default function PlaceholderImage({
  title,
  siteName,
  itemIdentifier,
  height = 480,
  style,
  className,
}) {
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
      { background: '#020241', text: '#ebebff', glow: '#ffffff' },
      { background: '#030d01', text: '#3bff19', glow: '#ffffff' },
      { background: '#2d2400', text: '#ffcc00', glow: '#ffffff' },
      { background: '#fffbd3', text: '#ff5064', glow: '#ffe6f0' },
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

    ctx.filter = `drop-shadow(0px 0px 10px ${colorScheme.glow})`;
    for (let line = 0; line < numLines; line++) {
      ctx.fillStyle = setAlpha(colorScheme.text, 0.2 + random() / 4);

      const textIndex = (line * charsPerLine) % displayText.length;

      const lineText = displayText.slice(textIndex, textIndex + charsPerLine);

      const y = (charHeight + padding) * (line + 1);

      ctx.fillText(lineText, padding, y);

      ctx.fillStyle = colorScheme.text;
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

function setAlpha(hexColor, amount) {
  const alphaHex = Number(Math.floor(amount * 255)).toString(16);

  return hexColor + (alphaHex.length == 1 ? '0' + alphaHex : alphaHex);
}
