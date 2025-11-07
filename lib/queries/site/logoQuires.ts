
import { gql } from "@apollo/client";

export const GET_LOGO = gql`
  query logoQuery {
   siteInfo {
    siteUrl
    siteName
    siteDescription
  }
  siteLogoUrl
}`