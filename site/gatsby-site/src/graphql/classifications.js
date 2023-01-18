import gql from 'graphql-tag';

export const FIND_CLASSIFICATION = gql`
  query FindCSETClassifications($query: ClassificationQueryInput) {
    classifications(query: $query) {
      _id
      incident_id
      notes
      namespace
      attributes {
        short_name
        mongo_type
        value_json
        value {
          bool
          string
          array
        }
      }
    }
  }
`;

export const FIND_CSET_CLASSIFICATION = gql`
  query FindCSETClassifications($query: ClassificationQueryInput) {
    classifications(query: $query) {
      _id
      incident_id
      notes
      namespace
      classifications {
        AIApplications
        AISystemDescription
        AITechniques
        AnnotationStatus
        Annotator
        BeginningDate
        DataInputs
        EndingDate
        FinancialCost
        FullDescription
        HarmDistributionBasis
        HarmType
        InfrastructureSectors
        Intent
        LawsImplicated
        LevelOfAutonomy
        LivesLost
        Location
        NamedEntities
        NatureOfEndUser
        NearMiss
        PhysicalSystem
        ProblemNature
        PublicSectorDeployment
        Publish
        RelevantAIFunctions
        Reviewer
        SectorOfDeployment
        Severity
        ShortDescription
        SystemDeveloper
        TechnologyPurveyor
      }
    }
  }
`;

export const UPDATE_CSET_CLASSIFICATION = gql`
  mutation UpsertClassification(
    $query: ClassificationQueryInput
    $data: ClassificationInsertInput!
  ) {
    upsertOneClassification(query: $query, data: $data) {
      _id
      incident_id
      notes
      namespace
      classifications {
        AIApplications
        AISystemDescription
        AITechniques
        AnnotationStatus
        Annotator
        BeginningDate
        DataInputs
        EndingDate
        FinancialCost
        FullDescription
        HarmDistributionBasis
        HarmType
        InfrastructureSectors
        Intent
        LawsImplicated
        LevelOfAutonomy
        LivesLost
        Location
        NamedEntities
        NatureOfEndUser
        NearMiss
        PhysicalSystem
        ProblemNature
        PublicSectorDeployment
        Publish
        RelevantAIFunctions
        Reviewer
        SectorOfDeployment
        Severity
        ShortDescription
        SystemDeveloper
        TechnologyPurveyor
      }
    }
  }
`;

export const FIND_CSET2_CLASSIFICATION = gql`
  query FindCSET2Classifications($query: ClassificationQueryInput) {
    classifications(query: $query) {
      _id
      incident_id
      notes
      namespace
      classifications {
        AIApplications
        AISystemDescription
        AITechniques
        AnnotationStatus
        Annotator
        BeginningDate
        DataInputs
        EndingDate
        FinancialCost
        FullDescription
        HarmDistributionBasis
        HarmType
        InfrastructureSectors
        Intent
        LawsImplicated
        LevelOfAutonomy
        LivesLost
        Location
        NamedEntities
        NatureOfEndUser
        NearMiss
        PhysicalSystem
        ProblemNature
        PublicSectorDeployment
        Publish
        RelevantAIFunctions
        Reviewer
        SectorOfDeployment
        Severity
        ShortDescription
        SystemDeveloper
        TechnologyPurveyor
      }
    }
  }
`;

export const UPDATE_CLASSIFICATION = gql`
  mutation UpsertClassification(
    $query: ClassificationQueryInput
    $data: ClassificationInsertInput!
  ) {
    upsertOneClassification(query: $query, data: $data) {
      _id
      incident_id
      notes
      namespace
      attributes {
        short_name
        mongo_type
        value {
          bool
          string
          array
        }
        value_json
      }
    }
  }
`;

export const UPDATE_CSET2_CLASSIFICATION = gql`
  mutation UpsertClassification(
    $query: ClassificationQueryInput
    $data: ClassificationInsertInput!
  ) {
    upsertOneClassification(query: $query, data: $data) {
      _id
      incident_id
      notes
      namespace
      classifications {
        AIApplications
        AISystemDescription
        AITechniques
        AnnotationStatus
        Annotator
        BeginningDate
        DataInputs
        EndingDate
        FinancialCost
        FullDescription
        HarmDistributionBasis
        HarmType
        InfrastructureSectors
        Intent
        LawsImplicated
        LevelOfAutonomy
        LivesLost
        Location
        NamedEntities
        NatureOfEndUser
        NearMiss
        PhysicalSystem
        ProblemNature
        PublicSectorDeployment
        Publish
        RelevantAIFunctions
        Reviewer
        SectorOfDeployment
        Severity
        ShortDescription
        SystemDeveloper
        TechnologyPurveyor
      }
    }
  }
`;
