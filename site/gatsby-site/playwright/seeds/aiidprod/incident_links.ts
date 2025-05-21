
// Define the shape of an incident link seed
type DBIncidentLink = {
    incident_id: number;
    sameAs: string;
    source_namespace: string;
}

// Seed data for incident_links collection
const incident_links: DBIncidentLink[] = [
    {
        incident_id: 1,
        sameAs: 'https://oecd.ai/en/incidents/2025-01-09-99fe',
        source_namespace: 'OECD',
    },
];

export default incident_links;
