import { ObjectId } from 'bson';

type DBIncidentTranslation = {
    _id?: ObjectId;
    incident_id: number;
    language: string;
    title: string;
    description: string;
    created_at: Date;
    dirty?: boolean;
};

const items: DBIncidentTranslation[] = [
    {
        _id: new ObjectId("62f40cd14016f5858d723860"),
        incident_id: 1,
        language: "es",
        title: "Título del Incidente 1",
        description: "Descripción del incidente 1",
        created_at: new Date(2024, 0, 1),
    },
    {
        _id: new ObjectId("62f40cd14016f5858d723861"),
        incident_id: 1,
        language: "fr",
        title: "Titre de l'incident 1",
        description: "Description de l'incident 1",
        created_at: new Date(2024, 0, 2),
    },
    {
        _id: new ObjectId("62f40cd14016f5858d723862"),
        incident_id: 2,
        language: "es",
        title: "Título del incidente 2 actualizado. Listo para volver a traducir.",
        description: "Descripción del incidente 2 actualizado. Listo para volver a traducir.",
        created_at: new Date(2024, 0, 3),
        dirty: true,
    }
];

export default items; 