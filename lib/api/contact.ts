import apolloClient from '@/lib/client/ApolloClient';
import { GET_CONTACT_PAGE } from '@/lib/queries/site/contactQueries';
import { SEOData } from '@/types/articles';

export interface ContactPageData {
  sectiontitle: string;
  sectionSubtitle: string;
  phoneTitle: string;
  phoneNumbers: Array<{
    phoneNumber: string;
  }>;
  addressText: string;
  addressTitle: string;
  emailTitle: string;
  emails: Array<{
    emails: string;
  }>;
  importantNoteTitle: string;
  importantNoteDescription: string;
  formId: string;
  seo?: SEOData;
}

/**
 * Fetch contact page data from WordPress
 */
export async function fetchContactPage(): Promise<ContactPageData | null> {
  try {
    const { data } = await apolloClient.query<{
      page: {
        contact: Omit<ContactPageData, 'seo'>;
        seoCustomOptions?: SEOData;
      };
    }>({
      query: GET_CONTACT_PAGE,
      fetchPolicy: 'network-only',
    });

    if (!data?.page?.contact) {
      console.error('Contact page data not found');
      return null;
    }

    // Merge SEO data into contact page data
    return {
      ...data.page.contact,
      seo: data.page.seoCustomOptions,
    };
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return null;
  }
}

/**
 * Submit contact form to WordPress Contact Form 7 REST API
 */
export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}, formId: string): Promise<{ success: boolean; message: string }> {
  try {
    const wpApiUrl = process.env.NEXT_PUBLIC_DB_URI || 'https://biva.todaymedia.net';
    const endpoint = `${wpApiUrl}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`;

    // Create FormData for CF7
    const formDataToSend = new FormData();
    
    // Required CF7 fields
    formDataToSend.append('_wpcf7', formId);
    formDataToSend.append('_wpcf7_version', '5.9.8');
    formDataToSend.append('_wpcf7_locale', 'ar');
    formDataToSend.append('_wpcf7_unit_tag', `wpcf7-f${formId}-o1`);
    formDataToSend.append('_wpcf7_container_post', '0');
    
    // Form fields
    formDataToSend.append('your-name', formData.name);
    formDataToSend.append('your-email', formData.email);
    formDataToSend.append('your-phone', formData.phone || '');
    formDataToSend.append('your-subject', formData.subject);
    formDataToSend.append('your-message', formData.message);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formDataToSend,
    });

    // Parse response
    const result = await response.json();

    // Handle rest_no_route error (CF7 not available or wrong form ID)
    if (result.code === 'rest_no_route') {
      return {
        success: false,
        message: 'خطأ في إعداد نموذج الاتصال. الرجاء التواصل معنا مباشرة عبر البريد الإلكتروني أو الهاتف.',
      };
    }

    // Handle CF7 response
    if (result.status === 'mail_sent') {
      return {
        success: true,
        message: result.message || 'تم إرسال رسالتك بنجاح!',
      };
    } else if (result.status === 'validation_failed') {
      return {
        success: false,
        message: result.message || 'يرجى التحقق من البيانات المدخلة والمحاولة مرة أخرى.',
      };
    } else if (result.status === 'mail_failed') {
      return {
        success: false,
        message: 'فشل إرسال البريد الإلكتروني. حاول مرة أخرى.',
      };
    } else {
      return {
        success: false,
        message: result.message || 'حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.',
      };
    }
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
    };
  }
}
