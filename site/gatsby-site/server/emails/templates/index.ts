import ConfirmEmail from './ConfirmEmail';
import EntityIncidentUpdated from './EntityIncidentUpdated';
import IncidentUpdate from './IncidentUpdate';
import NewEntityIncident from './NewEntityIncident';
import NewIncident from './NewIncident';
import NewReportAddedToAnIncident from './NewReportAddedToAnIncident';
import PasswordReset from './PasswordReset';
import SubmissionApproved from './SubmissionApproved';

const templates: Record<string, any> = {
    ConfirmEmail: ConfirmEmail,
    EntityIncidentUpdated: EntityIncidentUpdated,
    IncidentUpdate: IncidentUpdate,
    NewEntityIncident: NewEntityIncident,
    NewIncident: NewIncident,
    NewReportAddedToAnIncident: NewReportAddedToAnIncident,
    PasswordReset: PasswordReset,
    SubmissionApproved: SubmissionApproved
};

export default templates;