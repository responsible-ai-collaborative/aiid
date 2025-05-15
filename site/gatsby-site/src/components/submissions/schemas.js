import * as yup from 'yup';
import { dateRegExp, isPastDate } from '../../utils/date';

const incident_title = yup
  .string()
  .nullable()
  .default('')
  .min(6, '*Title must have at least 6 characters')
  .max(500, "*Titles can't be longer than 500 characters");

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

const implicated_systems = yup.array(
  yup
    .string()
    .min(3, 'Implicated AI systems must have at least 3 characters')
    .max(200, "Implicated AI systems can't be longer than 200 characters")
);

const incident_ids = yup.array(yup.number().integer().positive());

const incident_date = yup
  .date()
  .nullable()
  .transform((curr, orig) => (orig === '' ? null : curr));

const description = yup
  .string()
  .nullable()
  .default('')
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
  description: yup.string().when('incident_ids', {
    is: (incident_ids) => !incident_ids || incident_ids.length == 0,
    then: yup.string().required('*Description is required'),
    otherwise: yup.string().nullable(),
  }),
  developers: yup.string().when('incident_ids', {
    is: (incident_ids) => !incident_ids || incident_ids.length == 0,
    then: yup.string().required('*Alleged developers is required'),
    otherwise: yup.string().nullable(),
  }),
  deployers: yup.string().when('incident_ids', {
    is: (incident_ids) => !incident_ids || incident_ids.length == 0,
    then: yup.string().required('*Alleged deployers is required'),
    otherwise: yup.string().nullable(),
  }),
  harmed_parties: yup.string().when('incident_ids', {
    is: (incident_ids) => !incident_ids || incident_ids.length == 0,
    then: yup.string().required('*Alleged Harmed Parties is required'),
    otherwise: yup.string().nullable(),
  }),
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
    .test(isPastDate)
    .required('*Date published is required'),
  date_downloaded: yup
    .string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .test(isPastDate)
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
  incident_ids,
  incident_date: yup.string().when('incident_ids', {
    is: (incident_ids) => !incident_ids || incident_ids.length == 0,
    then: yup.string().required('*Incident Date is required'),
    otherwise: yup.string().nullable(),
  }),
  incident_title: yup.string().when('incident_ids', {
    is: (incident_ids) => !incident_ids || incident_ids.length == 0,
    then: yup.string().required('*Incident title is required'),
    otherwise: yup.string().nullable(),
  }),
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
  editor_notes: yup.string().nullable(),
});

export const issueSchema = yup.object().shape({
  title: yup
    .string()
    .min(6, '*Title must have at least 6 characters')
    .max(500, "*Titles can't be longer than 500 characters")
    .required('*Title is required'),
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
      .min(3, '*Submitters must have at least 3 characters')
      .max(200, "*Submitters can't be longer than 200 characters")
  ),
  text: yup
    .string()
    .min(80, `*Text must have at least 80 characters`)
    .max(50000, `*Text can’t be longer than 50000 characters`)
    .required('*Text is required'),
  date_published: yup
    .string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .test(isPastDate)
    .required('*Date published is required'),
  date_downloaded: yup
    .string()
    .matches(dateRegExp, '*Date is not valid, must be `YYYY-MM-DD`')
    .test(isPastDate)
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
  incident_ids: yup.mixed(),
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
  editor_notes: yup.string().nullable(),
});

export const incidentSchema = schema.shape({
  incident_title: incident_title.required('*Incident Title is required'),
  developers: developers.required('*Alleged developer of AI system is required'),
  deployers: deployers.required('*Alleged deployer of AI system is required'),
  harmed_parties: harmed_parties.required('*Alleged harmed or nearly harmed parties is required'),
  description: description.required('*Description is required'),
  incident_date: incident_date.required('*Incident Date required'),
  incident_ids: yup.mixed(),
  implicated_systems,
});

export const reportSchema = schema.shape({
  incident_ids: incident_ids.required('*Incident ID(s) must be a number'),
});
