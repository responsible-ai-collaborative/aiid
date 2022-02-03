import gql from 'graphql-tag';

export const FIND_RESOURCE_CLASSIFICATION = gql`
  query FindResourceClassifications($query: ResourceQueryInput) {
    resources(query: $query) {
      _id
      incident_id
      notes
      namespace
      classifications {
        DatasheetsForDatasets
        Publish
      }
    }
  }
`;

export const UPDATE_RESOURCE_CLASSIFICATION = gql`
  mutation UpsertResourceClassification($query: ResourceQueryInput, $data: ResourceInsertInput!) {
    upsertOneResource(query: $query, data: $data) {
      _id
      incident_id
      notes
      namespace
      classifications {
        DatasheetsForDatasets
        Publish
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
        Notes
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
        Notes
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
