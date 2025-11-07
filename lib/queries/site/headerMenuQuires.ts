
import { gql } from "@apollo/client";

export const GET_HEADER_MENU = gql`
  query Menus {
    menuItems(where: { location: PRIMARY, parentDatabaseId: 0 }) {
      edges {
        node {
          label
          uri
          cssClasses
          description
          linkRelationship
          childItems {
            edges {
              node {
                label
                uri
                cssClasses
                description
                linkRelationship
                childItems {
                  edges {
                    node {
                      label
                      uri
                      description
                      cssClasses
                      linkRelationship
                      childItems {
                        edges {
                          node {
                            label
                            uri
                            description
                            cssClasses
                            linkRelationship
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`