
import client from "@/lib/client/ApolloClient";
import { GET_LOGO } from "../../queries/site/logoQuires";

export interface SiteInfo {
  siteUrl: string;
  siteName: string;
  siteDescription: string;
}

export interface LogoDataType {
  siteInfo: SiteInfo;
  siteLogoUrl: string;
}

export async function LogoData(): Promise<LogoDataType | null> {
  try {
    const result = await client.query<LogoDataType>({
      query: GET_LOGO,
      fetchPolicy: 'network-only',
    });

    if (result.error) {
      console.error("Logo query error:", result.error);
      return null;
    }

    return result.data || null;
  } catch (error) {
    console.error("Error fetching logo data:", error);
    return null;
  }
}
