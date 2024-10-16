import EntityIncidentUpdated from './EntityIncidentUpdated';
import IncidentUpdate from './IncidentUpdate';
import NewEntityIncident from './NewEntityIncident';
import NewIncident from './NewIncident';
import NewReportAddedToAnIncident from './NewReportAddedToAnIncident';
import SubmissionApproved from './SubmissionApproved';

const templates: Record<string, string> = {
    EntityIncidentUpdated: EntityIncidentUpdated,
    IncidentUpdate: IncidentUpdate,
    NewEntityIncident: NewEntityIncident,
    NewIncident: NewIncident,
    NewReportAddedToAnIncident: NewReportAddedToAnIncident,
    SubmissionApproved: SubmissionApproved
};

export default templates;