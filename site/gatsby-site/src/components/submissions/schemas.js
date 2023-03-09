import * as yup from 'yup';
import { dateRegExp } from '../../utils/date';

const developers = yup.array(
  yup
    .string()
    .min(3, 'Alleged Developer must have at least 3 characters')
    .max(200, "Alleged Developers can't be longer than 200 characters")
);

const deployers = yup.array(
  yup
    .string()
    .min(3, 'Alleged Deployers must have at least 3 characters')
    .max(200, "Alleged Deployers can't be longer than 200 characters")
);

const harmed_parties = yup.array(
  yup
    .string()
    .min(3, 'Harmed Parties must have at least 3 characters')
    .max(200, "Harmed Parties can't be longer than 200 characters")
);

const incident_id = yup.number().integer().positive();

const incident_date = yup
  .date()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr));

const description = yup
  .string()
  .matches(/^.{3,}/, {
    excludeEmptyString: true,
    message: 'Description must have at least 3 characters',
  })
  .matches(/^.{3,500}/, {
    excludeEmptyString: true,
    message: "Description can't be longer than 500 characters",
  })
  .nullable();

export const schema = yup.object().shape({
  title: yup
    .string()
    .min(6, '*Title must have at least 6 characters')
    .max(500, "*Titles can't be longer than 500 characters")
    .required('*Title is required'),
  description,
  developers,
  deployers,
  harmed_parties,
  authors: yup
    .array(
      yup
        .string()
        .min(3, '*Authors must have at least 3 characters')
        .max(200, "*Authors can't be longer than 200 characters")
    )
    .required('*Author is required. Anonymous or the publication can be entered.'),
  submitters: yup.array(
    yup
      .string()
      .min(3, '*Submitter must have at least 3 characters')
      .max(200, "*Submitter list can't be longer than 200 characters")
  ),
  text: yup
    .string()
    .min(80, `*Text must have at least 80 characters`)
    .max(50000, `*Text can’t be longer than 50000 characters`)
    .required('*Text is required'),
  date_published: yup
    .string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .required('*Date published is required'),
  date_downloaded: yup
    .string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .required('*Date downloaded required'),
  url: yup
    .string()
    .url('*Must enter URL in http://www.example.com format')
    .required('*URL required'),
  image_url: yup
    .string()
    .matches(/((https?):\/\/)(\S)*$/, {
      message: '*Must enter URL in http://www.example.com/images/preview.png format',
      excludeEmptyString: true,
    })
    .optional()
    .nullable(),
  incident_id,
  incident_date,
  incident_title: yup.string().nullable(),
  incident_editors: yup
    .string()
    .matches(/^.{3,}$/, {
      excludeEmptyString: true,
      message: 'Incident Editor must have at least 3 characters',
    })
    .matches(/^.{3,200}$/, {
      excludeEmptyString: true,
      message: "Incident Editor can't be longer than 200 characters",
    })
    .nullable(),
  editor_notes: yup.string(),
});

export const incidentSchema = schema.shape({
  developers: developers.required(),
  deployers: deployers.required(),
  harmed_parties: harmed_parties.required(),
  description: description.required('*Description is required.'),
  incident_date: incident_date.required('*Incident Date required'),
  incident_id: yup.mixed(),
});

export const reportSchema = schema.shape({
  incident_id: incident_id.required('*Must be a number'),
});

export const issueSchema = schema.shape({
  incident_id: yup.mixed(),
});
