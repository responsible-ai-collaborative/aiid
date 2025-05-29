
type DBIncidentLink = {
    incident_id: number;
    sameAs: string;
    source_namespace: string;
}

const incident_links: DBIncidentLink[] = [
    {
        incident_id: 1,
        sameAs: 'https://oecd.ai/en/incidents/2025-01-09-99fe',
        source_namespace: 'OECD',
    },
    {
        incident_id: 1,
        sameAs: 'https://oecd.ai/en/incidents/2025-03-20-e2d2',
        source_namespace: 'OECD',
    },
];

export default incident_links;
