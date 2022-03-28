import React from 'react';
import styled from 'styled-components';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
`;

const IncidentStatsCard = ({ incidentId, reportCount, incidentDate }) => {
  const STATS = [
    {
      key: 'incidentId',
      label: 'Incident ID',
    },
    {
      key: 'reportCount',
      label: 'Report Count',
    },
    {
      key: 'incidentDate',
      label: 'Incident Date',
    },
  ];

  if (reportCount === 0) {
    return null;
  }

  const stats = {
    incidentId,
    reportCount,
    incidentDate,
  };

  return (
    <StatsContainer>
      <div>
        {STATS.map((stat) => (
          <div key={stat.key}>{stat.label}</div>
        ))}
      </div>
      <div>
        {STATS.map((stat) => (
          <div key={stat.key}>{stats[stat.key]}</div>
        ))}
      </div>
    </StatsContainer>
  );
};

export default IncidentStatsCard;
