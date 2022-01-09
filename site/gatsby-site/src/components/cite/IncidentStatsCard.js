import React from 'react';
import styled from 'styled-components';

const StatsContainer = styled.div`
  display: grid;
  max-width: 100%;
  grid-template-columns: 1fr 3fr;
  padding: 1.25rem;
`;

const IncidentCardContainer = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  .subhead {
    margin: 0;
    opacity: 0.4;
    padding-top: 10px;
  }
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
    <IncidentCardContainer className="card">
      <div className="card-header">
        <h4>Incident Stats</h4>
      </div>
      <StatsContainer className="card-body">
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
    </IncidentCardContainer>
  );
};

export default IncidentStatsCard;
