import React from 'react';

const IncidentList = ({ group }) => {
  return (
    <>
      {group.map((value, idx) => (
        <div key={`incident-group${idx}`}>
          <ul>
            {value['edges'].map((value) => (
              <li key={value['node']['id']} className="flex">
                <span className='font-["Arial"] mr-4'>{value['node']['date_published']}</span>
                <a className="flex-1" href={`#${value['node']['mongodb_id']}`}>
                  {value['node']['title']}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

export default IncidentList;
