
import { ObjectId } from 'bson';

type DBReportTranslation = {
    _id?: ObjectId;
    report_number: number;
    text: string;
    title: string;
    plain_text: string;
    language: string;
    created_at: Date;
};

const items: DBReportTranslation[] = [
    {
        _id: new ObjectId("62f40cd14016f5858d72385d"),
        report_number: 3,
        text: "SAN DIEGO — En una típica carrera de último minuto, Jannette Navarro",
        title: "Trabajando cualquier cosa menos de 9 a 5",
        plain_text: "SAN DIEGO — En una típica carrera de último minuto, Jannette Navarro",
        language: "es",
        created_at: new Date(1555113600000),
    }
]

export default items;