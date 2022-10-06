import React from 'react';
import { useUserContext } from 'contexts/userContext';
import Actions from 'components/discover/Actions';
import IncidentReportCard, { CardActions } from 'components/IncidentReportCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

const IncidentCard = ({ item, authorsModal, submittersModal, flagReportModal }) => {
  const { isRole } = useUserContext();

  return (
    <IncidentReportCard
      id={`r${item.report_number}`}
      report={item}
      className="mt-2 mb-2 IncidentCard"
      style={{ maxWidth: '800px' }}
    >
      <CardActions className="justify-around text-muted-gray">
        <Actions
          item={item}
          authorsModal={authorsModal}
          flagReportModal={flagReportModal}
          submittersModal={submittersModal}
        />
        {isRole('incident_editor') && (
          <a
            data-cy="edit-report"
            href={`/cite/edit?report_number=${item.report_number}`}
            style={{ color: 'inherit' }}
            title="edit"
          >
            <Button variant="link">
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          </a>
        )}
      </CardActions>
    </IncidentReportCard>
  );
};

export default IncidentCard;
