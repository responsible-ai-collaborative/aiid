import React, { useState, useRef, useEffect } from 'react';


export default function Image({
  className,
  publicID,
  alt,
  height,
  transformation,
}) {
  return (
    <PlaceholderImage
      siteName="IncidentDatabase.AI"
      title="YouTube to crack down on inappropriate content masked as kids' cartoons"
      incidentNumber="No.100"
      height={height}
    />
  );
}

function PlaceholderImage({title, siteName, incidentNumber, height = 480}) {

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

  return <canvas ref={canvasRef} width={w} height={h}></canvas>
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
