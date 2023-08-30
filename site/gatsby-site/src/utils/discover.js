const VIEW_TYPES = { INCIDENTS: 'incidents', REPORTS: 'reports' };

export { VIEW_TYPES };

export function citationReportUrl(item, viewType) {
  let path = null;

  if (viewType === VIEW_TYPES.INCIDENTS) {
    path = '/cite/' + item.incident_id;
  } else {
    if (item.is_incident_report) {
      path = '/cite/' + item.incident_id + '#r' + item.objectID;
    } else {
      path = `/reports/${item.report_number}`;
    }
  }

  return path;
}
