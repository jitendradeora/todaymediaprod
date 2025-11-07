'use server';

import { submitContactForm } from '@/lib/api/contact';

export async function submitContactFormAction(formData: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const formId = formData.get('formId') as string;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        success: false,
        message: 'الرجاء ملء جميع الحقول المطلوبة',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'الرجاء إدخال بريد إلكتروني صحيح',
      };
    }

    const result = await submitContactForm(
      { name, email, phone, subject, message },
      formId
    );

    // Ensure we return a serializable object
    return {
      success: result.success,
      message: result.message,
    };
  } catch (error) {
    console.error('Error in submitContactFormAction:', error);
    return {
      success: false,
      message: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
    };
  }
}
