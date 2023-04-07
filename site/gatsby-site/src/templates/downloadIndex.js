import React, { useEffect, useRef } from 'react';
import { useMenuContext } from 'contexts/MenuContext';

const DownloadIndex = (props) => {
  const {
    pageContext: { data },
  } = props;

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      const file = new Blob([JSON.stringify(data)], { type: 'text/plain' });

      ref.current.href = URL.createObjectURL(file);

      ref.current.download = 'index.json';
    }
  }, [ref]);

  const { isCollapsed, collapseMenu } = useMenuContext();

  useEffect(() => {
    if (isCollapsed) {
      collapseMenu(false);
    }
  }, []);

  return (
    <>
      <div className="p-4">
        <a ref={ref} href="/#" data-cy="download">
          Download Index
        </a>
      </div>
    </>
  );
};

export default DownloadIndex;
