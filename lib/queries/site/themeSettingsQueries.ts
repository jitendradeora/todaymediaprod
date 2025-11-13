import { gql } from "@apollo/client";

// This query works in GraphQL IDE
export const GET_THEME_SETTINGS = gql`
  query GetThemeSettings {
    themeSettings {
      themeOptionsFields {
        announceBarMessage
        socialLinkBlockHeading
        socialLinks {
          seelctSocialPlatform
          socialLinkUrl
        }
        socialLinkBlockMenu {
          menuItemLabel
          menuItemLink
        }
        footerMenu1Title
        footer_menu1_item_label_link {
          footer_menu1_item_label
          footer_menu1_item_link
        }
        footer_menu2_title
        footerMenu2ItemLabelLink {
          footer_menu2_item_label
          footer_menu2_item_link
        }
        footer_about_heading
        footer_about_description
        copyrightText1
        copyrightText2
      }
    }
  }
`;

export const GET_HOME_PAGE_AD_BANNERS = gql`
  query HomePageAdBanners {
    themeSettings {
      themeOptionsFields {
        homePageAdBanner1
        homePageAdBanner2
        homePageAdBanner3
        homePageAdBanner4
        homePageAdBanner5
        homePageAdBanner6
        homePageAdBanner7
        homePageAdBanner8
        homePageAdBanner9
        homePageAdBanner10
        homePageAdBanner11
        homePageAdBanner12
        articlePageAdBanner
      }
    }
  }
`;

export const GET_HEADER_AD_BANNER = gql`
  query GetHeaderAdBanner {
    themeSettings {
      themeOptionsFields {
        headerAdBanner
      }
    }
  }
`;

export const GET_HEAD_BODY_FOOTER_CODE = gql`
  query GetHeadBodyFooterCode {
    themeSettings {
      themeOptionsFields {
        headTagCode
        bodyTagCode
        footerTagCode
      }
    }
  }
`;