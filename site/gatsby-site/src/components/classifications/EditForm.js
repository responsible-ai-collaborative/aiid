import { getClassificationsArray } from 'utils/cite';
import TaxonomyForm from 'components/taxa/TaxonomyForm';

export default function EditForm({
  allTaxonomies,
  allClassifications,
  row,
  editFormRef,
  onSubmit,
  currentTaxonomy,
}) {
  const taxonomyFormObj = {
    classificationsArray: [],
    namespace: '',
    taxonomyFields: [],
  };

  const taxaData = allTaxonomies.filter((taxa) => taxa.namespace === currentTaxonomy)[0];

  taxonomyFormObj.namespace = taxaData.namespace;
  taxonomyFormObj.taxonomyFields = taxaData.field_list.map((f) => {
    return {
      display_type: f.display_type,
      long_name: f.long_name,
      public: f.public,
      short_description: f.short_description,
      short_name: f.short_name,
      weight: f.weight,
    };
  });

  const classificationObj = allClassifications.filter(
    (report) => report.incident_id === row.values.IncidentId
  );

  taxonomyFormObj.classificationsArray = getClassificationsArray(
    classificationObj.length > 0 ? classificationObj[0].classifications : null,
    taxaData
  );

  if (classificationObj.length === 1) {
    taxonomyFormObj.notes = classificationObj[0].notes;
  }

  return (
    <div className="bootstrap">
      <TaxonomyForm
        ref={editFormRef}
        namespace={taxaData.namespace}
        incidentId={row.values.IncidentId}
        onSubmit={onSubmit}
      />
    </div>
  );
}
