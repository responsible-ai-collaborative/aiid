import { graphql } from 'gatsby';

export const ClassificationFieldsFragment = graphql`
  fragment ClassificationFields on mongodbAiidprodClassificationsConnection {
    nodes {
      incident_id
      id
      namespace
      classifications {
        Annotation_Status
        Annotator
        Ending_Date
        Beginning_Date
        Full_Description
        Intent
        Location
        Named_Entities
        Near_Miss
        Quality_Control
        Reviewer
        Severity
        Short_Description
        Technology_Purveyor
        AI_Applications
        AI_System_Description
        AI_Techniques
        Data_Inputs
        Financial_Cost
        Harm_Distribution_Basis
        Harm_Type
        Infrastructure_Sectors
        Laws_Implicated
        Level_of_Autonomy
        Lives_Lost
        Nature_of_End_User
        Physical_System
        Problem_Nature
        Public_Sector_Deployment
        Relevant_AI_functions
        Sector_of_Deployment
        System_Developer
        Publish
      }
      fields {
        geocode {
          geometry {
            location {
              lat
              lng
            }
          }
        }
      }
    }
  }
`;
