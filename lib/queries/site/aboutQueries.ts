import { gql } from '@apollo/client';

export const GET_ABOUT_PAGE = gql`
  query aboutPageQuery {
    page(id: "about", idType: URI) {
      aboutUs {
        pageIconClass
        pageDescription
        pageTitle
        headingAboutSection
        descriptionAboutSection
        iconClassMission
        missonHeading
        missionDescription
        visionIconClass
        visionHeading
        visionDescription
        ourValuesSectionHeading
        addValues {
          ourValuesIconClass
          ourValuesHeading
          ourValuesDescription
        }
        whatWeCoverSectionHeading
        whatWeCoverContent {
          whatWeCoverTitle
          whatWeCoverDescription
        }
        ourTeamSectionHeading
        ourTeamDescription
        ctaHeading
        ctaDescription
        ctaLink
      }
    }
  }
`;
