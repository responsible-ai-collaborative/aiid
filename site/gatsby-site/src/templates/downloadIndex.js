import Layout from 'components/Layout';
import React, { useEffect, useRef } from 'react';

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

  return (
    <Layout {...props}>
      <div className="p-4">
        <a ref={ref} href="/#" data-cy="download">
          Download Index
        </a>
      </div>
    </Layout>
  );
};

export default DownloadIndex;
