import Home from '@/components/HomePage';
import { Metadata } from 'next';
import { fetchHomePageSEO } from '@/lib/api/home';
import { generateHomeMetadata } from '@/lib/metadata';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  try {
    const homeData = await fetchHomePageSEO();
    return generateHomeMetadata(homeData.seo);
  } catch (error) {
    console.error('Error generating home metadata:', error);
    return generateHomeMetadata();
  }
}

const page = async () => {
  return (
    <>
      <Home />
    </>
  );
};

export default page;