'use client';

import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitContactFormAction } from "@/lib/actions/submitContactForm";

interface ContactFormProps {
  formId: string;
  importantNoteTitle: string;
  importantNoteDescription: string;
}

export default function ContactForm({
  formId,
  importantNoteTitle,
  importantNoteDescription,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('formId', formId);

      const result = await submitContactFormAction(formDataToSend);

      if (result.success) {
        toast.success('✅ تم إرسال رسالتك بنجاح', {
          description: result.message || 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.',
          duration: 5000,
        });
        setSubmitStatus('success');
        setSubmitMessage(result.message || 'تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.');
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        // Reset status after 8 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
          setSubmitMessage('');
        }, 8000);
      } else {
        toast.error('❌ فشل إرسال الرسالة', {
          description: result.message || 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.',
          duration: 5000,
        });
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
        setTimeout(() => {
          setSubmitStatus('idle');
          setSubmitMessage('');
        }, 8000);
      }
    } catch (error) {
      toast.error('❌ حدث خطأ', {
        description: 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى لاحقاً.',
        duration: 5000,
      });
      setSubmitStatus('error');
      setSubmitMessage('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى لاحقاً.');
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl mb-6 text-right text-gray-900 dark:text-white">
          أرسل لنا رسالة
        </h2>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-right animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                  تم إرسال رسالتك بنجاح!
                </h3>
                <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                  {submitMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-right animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  فشل إرسال الرسالة
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                  {submitMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-right">
              <Label htmlFor="name" className="block mb-2">
                الاسم الكامل <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full text-right"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div className="text-right">
              <Label htmlFor="email" className="block mb-2">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full text-right"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-right">
              <Label htmlFor="phone" className="block mb-2">
                رقم الهاتف
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full text-right"
                placeholder="05xxxxxxxx"
              />
            </div>

            <div className="text-right">
              <Label htmlFor="subject" className="block mb-2">
                الموضوع <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full text-right"
                placeholder="موضوع الرسالة"
              />
            </div>
          </div>

          <div className="text-right">
            <Label htmlFor="message" className="block mb-2">
              الرسالة <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full text-right resize-none"
              placeholder="اكتب رسالتك هنا..."
            />
          </div>

          <div className="text-right">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#c90000] hover:bg-[#a00000] text-white px-8 py-3"
            >
              {isSubmitting ? (
                "جاري الإرسال..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  إرسال الرسالة
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Additional Information */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg text-right">
        <h3 className="text-lg mb-3 text-gray-900 dark:text-white">
          {importantNoteTitle}
        </h3>
        <div
          className="space-y-2 text-sm text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: importantNoteDescription }}
        />
      </div>
    </div>
  );
}
