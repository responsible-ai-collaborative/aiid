import EntityIncidentUpdated from './EntityIncidentUpdated';
import IncidentUpdate from './IncidentUpdate';
import MagicLink from './MagicLink';
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
    SubmissionApproved: SubmissionApproved,
    MagicLink: MagicLink,
};

export default templates;