import * as React from 'react';

const AnchorTag = ({ children: link, ...props }) => {
  let target = "_blank";
  if(props.href.indexOf("/") === 0) {
    target = "";
  }
  if (link) {
    return (
      <a href={props.href} target={target} rel="noopener noreferrer">
        {link}
      </a>
    );
  } else {
    return null;
  }
};

export default AnchorTag;
