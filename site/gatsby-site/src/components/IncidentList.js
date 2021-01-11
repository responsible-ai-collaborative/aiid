import React from 'react';

const IncidentList = ({ group }) => {
  return (
    <>
      {group.map((value, idx) => (
        <div key={`incident-group${idx}`}>
          <ul>
            {value['edges'].map((value) => (
              <li key={value['node']['id']}>
                {value['node']['date_published']}{' '}
                <a href={value['node']['url']}>{value['node']['title']}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default IncidentList;
