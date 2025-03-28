import { ObjectId } from 'bson';

type DBIncidentTranslation = {
    _id?: ObjectId;
    incident_id: number;
    language: string;
    title: string;
    description: string;
};

const items: DBIncidentTranslation[] = [
    {
        _id: new ObjectId("62f40cd14016f5858d723860"),
        incident_id: 1,
        language: "es",
        title: "Título del Incidente 1",
        description: "Descripción del incidente 1",
    },
    {
        _id: new ObjectId("62f40cd14016f5858d723861"),
        incident_id: 1,
        language: "fr",
        title: "Titre de l'incident 1",
        description: "Description du deuxième incident",
    },
];

export default items; 