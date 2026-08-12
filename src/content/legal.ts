/**
 * ============================================================================
 *  LEGAL PAGES — website privacy policy and terms of use
 * ============================================================================
 *  Plain-language, bilingual, and limited to what this website actually does:
 *  it collects the enquiry details a visitor types into the form, and nothing
 *  else. There is no analytics vendor, no advertising pixel and no cookie
 *  banner because the site sets no tracking cookies.
 *
 *  Jurisdiction is the Kingdom of Saudi Arabia, where the business operates.
 *  These pages should still be reviewed by the client's legal counsel before
 *  launch — that note belongs in docs/MISSING-INFO.md, not on the public page.
 * ============================================================================
 */

import type { L } from "@/i18n/localized";

export interface LegalSection {
  heading: L;
  body: L[];
}

export const privacySections: LegalSection[] = [
  {
    heading: { en: "Information we collect", ar: "المعلومات التي نجمعها" },
    body: [
      {
        en: "When you send an enquiry through this website we collect the details you provide: your name, company, email address, optional telephone number, the equipment or service you are asking about, the project location and duration, and your message.",
        ar: "عند إرسال استفسار عبر هذا الموقع نجمع البيانات التي تقدّمها: الاسم، والشركة، والبريد الإلكتروني، ورقم الهاتف (اختياري)، والمعدات أو الخدمة المطلوبة، وموقع المشروع ومدته، ونص رسالتك.",
      },
      {
        en: "This website does not set advertising or tracking cookies, and does not build a profile of your browsing.",
        ar: "لا يستخدم هذا الموقع ملفات تعريف ارتباط للإعلانات أو التتبّع، ولا ينشئ ملفاً لسلوكك في التصفّح.",
      },
    ],
  },
  {
    heading: { en: "How we use it", ar: "كيف نستخدمها" },
    body: [
      {
        en: "We use your details only to respond to your enquiry, prepare a quotation and provide the equipment or transportation you have asked about. We do not sell personal information.",
        ar: "نستخدم بياناتك للردّ على استفسارك وإعداد عرض السعر وتوفير المعدات أو خدمة النقل المطلوبة فقط. ولا نبيع المعلومات الشخصية.",
      },
    ],
  },
  {
    heading: { en: "Sharing", ar: "مشاركة البيانات" },
    body: [
      {
        en: "Enquiry details may pass through service providers who operate this website and our email systems. They may process the information only on our instructions, and where the law requires disclosure we comply with it.",
        ar: "قد تمرّ بيانات الاستفسار عبر مزوّدي خدمات يشغّلون هذا الموقع وأنظمة بريدنا الإلكتروني، ولا يجوز لهم معالجتها إلا بتوجيه منّا. وعندما يلزم القانون بالإفصاح فإننا نلتزم به.",
      },
    ],
  },
  {
    heading: { en: "Retention", ar: "مدة الاحتفاظ" },
    body: [
      {
        en: "We keep enquiry records for as long as needed to answer and manage your request, and to meet legal or accounting requirements.",
        ar: "نحتفظ بسجلات الاستفسارات طوال المدة اللازمة للردّ على طلبك وإدارته، وللوفاء بالمتطلبات القانونية والمحاسبية.",
      },
    ],
  },
  {
    heading: { en: "Your rights", ar: "حقوقك" },
    body: [
      {
        en: "You may ask us for a copy of the information you have shared, ask us to correct it, or ask us to delete it. Contact us using the details on the Contact page.",
        ar: "يمكنك أن تطلب نسخة من المعلومات التي شاركتها، أو تصحيحها، أو حذفها. تواصل معنا عبر بيانات صفحة «اتصل بنا».",
      },
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    heading: { en: "Use of this website", ar: "استخدام هذا الموقع" },
    body: [
      {
        en: "This website provides general information about our heavy equipment rental and transportation services. By using it you agree to use it lawfully and not to disrupt or misuse it.",
        ar: "يوفّر هذا الموقع معلومات عامة عن خدماتنا في تأجير المعدات الثقيلة والنقل. وباستخدامه فإنك توافق على استخدامه بشكل مشروع وعلى عدم تعطيله أو إساءة استخدامه.",
      },
    ],
  },
  {
    heading: { en: "No binding quotation", ar: "لا يُعدّ عرض سعر ملزماً" },
    body: [
      {
        en: "Equipment listings, capacities and descriptions on this website are for guidance and do not form a binding offer. Availability, exact specifications and commercial terms are confirmed in a written quotation.",
        ar: "قوائم المعدات وحمولاتها وأوصافها في هذا الموقع للاسترشاد ولا تشكّل عرضاً ملزماً. ويُؤكَّد التوفّر والمواصفات الدقيقة والشروط التجارية في عرض سعر مكتوب.",
      },
    ],
  },
  {
    heading: { en: "Intellectual property", ar: "الملكية الفكرية" },
    body: [
      {
        en: "The content, branding and design of this website belong to Jowain Yanbu Est. unless stated otherwise, and may not be copied without permission. Client logos shown on this website remain the property of their respective owners.",
        ar: "محتوى هذا الموقع وهويته وتصميمه ملك لمؤسسة Jowain Yanbu Est. ما لم يُذكر خلاف ذلك، ولا يجوز نسخها دون إذن. وتبقى شعارات العملاء المعروضة في هذا الموقع ملكاً لأصحابها.",
      },
    ],
  },
  {
    heading: { en: "Limitation of liability", ar: "حدود المسؤولية" },
    body: [
      {
        en: "We make reasonable efforts to keep this website accurate and current, but provide it as it stands, without warranties. We are not liable for loss arising from reliance on website content in place of a written quotation or contract.",
        ar: "نبذل جهوداً معقولة للحفاظ على دقة هذا الموقع وحداثته، لكننا نقدّمه على حالته دون ضمانات. ولا نتحمّل مسؤولية أي خسارة تنشأ عن الاعتماد على محتوى الموقع بدلاً من عرض سعر أو عقد مكتوب.",
      },
    ],
  },
  {
    heading: { en: "Governing law", ar: "القانون الحاكم" },
    body: [
      {
        en: "These terms are governed by the laws of the Kingdom of Saudi Arabia.",
        ar: "تخضع هذه الشروط لأنظمة المملكة العربية السعودية.",
      },
    ],
  },
];
