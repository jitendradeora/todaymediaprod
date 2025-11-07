export interface AboutValue {
  ourValuesIconClass: string;
  ourValuesHeading: string;
  ourValuesDescription: string;
}

export interface WhatWeCoverItem {
  whatWeCoverTitle: string;
  whatWeCoverDescription: string;
}

export interface AboutPageData {
  page: {
    aboutUs: {
      pageIconClass: string;
      pageDescription: string;
      pageTitle: string;
      headingAboutSection: string;
      descriptionAboutSection: string;
      iconClassMission: string;
      missonHeading: string;
      missionDescription: string;
      visionIconClass: string;
      visionHeading: string;
      visionDescription: string;
      ourValuesSectionHeading: string;
      addValues: AboutValue[];
      whatWeCoverSectionHeading: string;
      whatWeCoverContent: WhatWeCoverItem[];
      ourTeamSectionHeading: string;
      ourTeamDescription: string;
      ctaHeading: string;
      ctaDescription: string;
      ctaLink: string;
    };
  };
}
