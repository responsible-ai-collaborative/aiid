import { useMutation } from '@apollo/client/react/hooks';
import { transformReportData } from '../utils/reports';
import { LOG_REPORT_HISTORY } from '../graphql/reports';
import { stripMarkdown } from '../utils/typography';

export function useLogReportHistory() {
  const [logReportHistoryMutation] = useMutation(LOG_REPORT_HISTORY);

  const logReportHistory = async (report, updates, user) => {
    const transformedReport = transformReportData(report, user);

    const updatedReport = {
      ...transformedReport,
      ...updates,
    };

    if (updates.text) {
      updatedReport.plain_text = await stripMarkdown(updates.text);
    }

    // Set the user as the last modifier
    updatedReport.modifiedBy = user && user.providerType != 'anon-user' ? user.id : '';

    await logReportHistoryMutation({ variables: { input: updatedReport } });
  };

  return { logReportHistory };
}
