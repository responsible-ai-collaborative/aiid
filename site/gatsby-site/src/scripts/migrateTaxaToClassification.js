const csv = require('csvtojson');

const path = require('path');

const fs = require('fs');

const csvFileName = './src/scripts/rawClassifications.csv';

const csvFilePath = path.resolve(csvFileName);

const outFilePath = './classifications.json';

// i = 5 is the first row
// i < 5 is for headers and subheaders
// i = 3 => columns names
// field1 => incident_id

const nodes = [];

let subheaders = null;

const harmTypesFields = [
  'field22',
  'field23',
  'field24',
  'field25',
  'field26',
  'field27',
  'field28',
  'field29',
];

const harmBasisFields = [
  'field33',
  'field34',
  'field35',
  'field36',
  'field37',
  'field38',
  'field39',
  'field40',
  'field41',
  'field42',
  'field43',
  'field44',
  'field45',
  'field46',
];

const infraSectorsFields = [
  'field48',
  'field49',
  'field50',
  'field51',
  'field52',
  'field53',
  'field54',
  'field55',
  'field56',
  'field57',
  'field58',
  'field59',
  'field60',
  'field61',
  'field62',
  'field63',
];

const aiFunctionFields = ['field75', 'field76', 'field77', 'field78'];

const sysIntegratedFields = [
  'field83',
  'field84',
  'field85',
  'field86',
  'field87',
  'field88',
  'field89',
];

const problemNatureFields = ['field91', 'field92', 'field93', 'field94'];

const getTechPurveyorArray = (r) => {
  const techArray = [r.field13, r.field15, r.field17];

  return techArray.filter((t) => t !== '');
};

const getArrayForSubfields = (r, fields) => {
  let resultsArray = [];

  fields.forEach((field) => {
    resultsArray.push({
      name: subheaders[field],
      value: r[field],
    });
  });

  return resultsArray
    .filter((type) => type.value !== 'FALSE' && type.value !== '')
    .map((type) => {
      if (type.name.includes('Other')) {
        return `${type.name}: ${type.value}`;
      }
      return type.name;
    });
};

const convertStringToDate = (dateStr) => {
  try {
    return new Date(dateStr).toISOString();
  } catch (error) {
    return dateStr;
  }
};

const getClassification = (r) => {
  return {
    Annotator: r.field2,
    'Annotation Status': r.field3,
    Reviewer: r.field4,
    'Quality Control': r.field5 ? true : false,
    'Full Description': r.field6,
    'Short Description': r.field7,
    // For dates use timezone? or timestamp
    'Beginning Date': convertStringToDate(r.field8),
    'Ending Date': convertStringToDate(r.field9),
    Location: r.field10,
    'Near Miss': r.field11,
    'Named Entities': r.field12.replace('/,/g', ';').split(';'),
    'Technology Purveyor': getTechPurveyorArray(r),
    Intent: r.field19,
    Severity: r.field20,
    // Has also value Unclear/unknown
    'Lives Lost': r.field31 === 'Yes' ? true : false,
    'Harm Distribution Basis': getArrayForSubfields(r, harmBasisFields),
    // missing from classification collection
    'Harm Type': getArrayForSubfields(r, harmTypesFields),
    'Infrastructure Sectors': getArrayForSubfields(r, infraSectorsFields),
    // not yet in taxonomy fields
    'Finacial Cost': r.field65,
    'Laws Implicated': r.field66,
    'AI System Description': r.field67,
    'Data Inputs': r.field68,
    'System Developer': r.field69,
    'Sector of Deployment': r.field70,
    'Public Sector Deployment': r.field71,
    'Nature of End User': r.field72,
    'Level of Autonomy': r.field73,
    'Relevant AI functions': getArrayForSubfields(r, aiFunctionFields),
    'AI Techniques': r.field80,
    'AI Applications': r.field81.replace('/,/g', ';').split(';'),
    'Physical System': getArrayForSubfields(r, sysIntegratedFields),
    'Problem Nature': getArrayForSubfields(r, problemNatureFields),
    Notes: r.field96,
  };
};

const main = () => {
  csv({
    noheader: true,
  })
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      const noHeadersJsonObj = jsonObj.splice(5);

      subheaders = jsonObj[4];

      noHeadersJsonObj.forEach((r) => {
        nodes.push({
          incident_id: parseInt(r.field1),
          namespace: 'CSET',
          classifications: getClassification(r),
        });
      });

      console.log('========================');
      console.log(nodes);

      fs.writeFileSync(outFilePath, JSON.stringify(nodes, null, 4));
    });
};

main();
