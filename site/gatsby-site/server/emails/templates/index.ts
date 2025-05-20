import EntityIncidentUpdated from './EntityIncidentUpdated';
import IncidentUpdate from './IncidentUpdate';
import Login from './Login';
import Signup from './Signup';
import NewEntityIncident from './NewEntityIncident';
import NewIncident from './NewIncident';
import NewReportAddedToAnIncident from './NewReportAddedToAnIncident';
import SubmissionApproved from './SubmissionApproved';
import AIIncidentBriefing from './AIIncidentBriefing';

const templates: Record<string, string> = {
    EntityIncidentUpdated,
    IncidentUpdate,
    NewEntityIncident,
    NewIncident,
    NewReportAddedToAnIncident,
    SubmissionApproved,
    Login,
    Signup,
    AIIncidentBriefing,
};

export default templates;