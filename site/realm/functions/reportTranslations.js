exports = async (input, source) => {

  const translations = context.services.get('mongodb-atlas').db('translations').collection("reports_" + input);
    
  const translation = await translations.findOne({report_number: source.report_number});
  
  if(translation) {
  
    return { text: translation.text, title: translation.title };  
  }
  
  return {text: "", title: ""}
};
