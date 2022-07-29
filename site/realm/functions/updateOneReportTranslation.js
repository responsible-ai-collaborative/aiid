exports = async (input) => {
  
  const translations = context.services.get('mongodb-atlas').db('translations').collection("reports_" + input.language);
  
  const update = {
    title: input.title,
    text: input.text,
    plain_text: input.plain_text
  };
  
  await translations.updateOne({report_number: input.report_number}, {$set: {... update}}, {upsert: true});
  
  
  const reports = context.services.get('mongodb-atlas').db('aiidprod').collection("reports");

  const report = await reports.find({report_number: input.report_number}).limit(1).next();
  
  
  return report;
};
