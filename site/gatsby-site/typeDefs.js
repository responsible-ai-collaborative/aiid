const typeDefs = `
    type reportEmbedding {
        vector: [Float]
        from_text_hash: String
    }

    type incidentEmbedding {
        vector: [Float]
        from_reports: [Int]
    }

    type nlpSimilarIncident {
        incident_id: Int
        similarity: Float
    }

    type mongodbAiidprodEntities implements Node {
        entity_id: String
        name: String
    }

    type mongodbCustomDataUsers implements Node {
        userId: String
        first_name: String
        last_name: String
    }

    type mongodbAiidprodIncidentsTsne {
        x: Float
        y: Float
    }

    type mongodbAiidprodIncidents implements Node {
        title: String
        description: String
        date: String
        embedding: incidentEmbedding
        editors: [mongodbCustomDataUsers] @link(by: "userId")
        editor_notes: String
        nlp_similar_incidents: [nlpSimilarIncident]
        editor_similar_incidents: [Int]
        editor_dissimilar_incidents: [Int]
        flagged_dissimilar_incidents: [Int]
        reports: [mongodbAiidprodReports] @link(by: "report_number")
        incident_id: Int
        epoch_date_modified: Int
        Alleged_deployer_of_AI_system: [String]
        Alleged_developer_of_AI_system: [String]
        Alleged_harmed_or_nearly_harmed_parties: [String]
        tsne: mongodbAiidprodIncidentsTsne
        implicated_systems: [String]
    }
    
    type mongodbAiidprodSubmissions implements Node {
        nlp_similar_incidents: [nlpSimilarIncident]
        editor_similar_incidents: [Int]
        editor_dissimilar_incidents: [Int]
    }

    type mongodbAiidprodReports implements Node {
        title: String
        description: String
        language: String
        image_url: String
        url: String
        submitters: [String]
        date_published: Date
        date_submitted: Date
        date_modified: Date
        date_downloaded: Date
        source_domain: String
        mongodb_id: String
        text: String
        authors: [String]
        epoch_date_downloaded: Int
        epoch_date_modified: Int
        epoch_date_published: Int
        epoch_date_submitted: Int
        cloudinary_id: String
        tags: [String]
        plain_text: String
        embedding: reportEmbedding
        inputs_outputs: [String]
        report_number: Int
        is_incident_report: Boolean
        flag: Boolean
        quiet: Boolean
    }

    type mongodbAiidprodTaxaField_list implements Node {
        render_as: String
        hide_search: Boolean
        subfields: [Subfield]
        field_number: String
        short_name: String 
        long_name: String
        short_description: String
        long_description: String
        display_type: String
        mongo_type: String
        default: String
        placeholder: String
        permitted_values: [String]
        weight: Int
        instant_facet: Boolean
        required: Boolean
        public: Boolean
        complete_from: completeFrom
    }

    type mongodbAiidprodTaxaDummy_fields implements Node {
        field_number: String
        short_name: String
    }
    
    type mongodbAiidprodTaxa implements Node {
        field_list: [mongodbAiidprodTaxaField_list]
        complete_entities: Boolean
        namespace: String
        weight: Int
        description: String
        dummy_fields: [mongodbAiidprodTaxaDummy_fields]
        automatedClassifications: Boolean
    }

    type mongodbAiidprodClassificationsAttribute {
        short_name: String
        value_json: String
        notes: String
    }
    
    type mongodbAiidprodClassifications implements Node {
        incidents: [mongodbAiidprodIncidents] @link(by: "incident_id")
        reports: [mongodbAiidprodReports] @link(by: "report_number")
        namespace: String
        attributes: [mongodbAiidprodClassificationsAttribute]
        publish: Boolean
        notes: String
        fields: mongodbAiidprodClassificationsFields
    }

    type mongodbAiidprodClassificationsFields {
        geocode: mongodbAiidprodClassificationsFieldsGeocode
    }

    type mongodbAiidprodClassificationsFieldsGeocode {
        geometry: mongodbAiidprodClassificationsFieldsGeocodeGeometry
    }

    type mongodbAiidprodClassificationsFieldsGeocodeGeometry {
        location: mongodbAiidprodClassificationsFieldsGeocodeGeometryLocation
    }

    type mongodbAiidprodClassificationsFieldsGeocodeGeometryLocation {
        lat: Float
        lng: Float
    }

    type completeFrom {
        all: [String]
        current: [String]
        entities: Boolean
    }

    type Subfield {
        field_number: String
        short_name: String 
        long_name: String
        short_description: String
        long_description: String
        display_type: String
        mongo_type: String
        default: String
        placeholder: String
        permitted_values: [String]
        weight: Int
        instant_facet: Boolean
        required: Boolean
        public: Boolean
        complete_from: completeFrom
    }

    type mongodbTranslationsReports implements Node {
        title: String
        text: String
        report_number: Int
        language: String
    }

    type mongodbTranslationsIncidents implements Node {
        title: String
        description: String
        incident_id: Int
        language: String
    }

    type mongodbAiidprodDuplicates implements Node {
        duplicate_incident_number: Int
        true_incident_number: Int
    }

    type mongodbAiidprodEntityRelationships implements Node {
        is_symmetric: Boolean
        sub: [String]
        obj: [String]
        created_at: Date
        pred: String
    }
`;

module.exports = typeDefs;
