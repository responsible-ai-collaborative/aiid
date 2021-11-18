import { useEffect } from 'react';

const DownloadIndex = ({ pageContext: { data } }) => {
  useEffect(() => {
    var a = document.createElement('a');

    var file = new Blob([JSON.stringify(data)], { type: 'text/plain' });

    a.href = URL.createObjectURL(file);
    a.download = 'new_index.json';
    a.click();
  }, [data]);

  return null;
};

export default DownloadIndex;
