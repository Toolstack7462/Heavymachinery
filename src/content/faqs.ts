/**
 * ============================================================================
 *  FAQs — answers restricted to what the company profile actually states
 * ============================================================================
 *  No commercial terms (rates, minimum hire periods, daily/weekly pricing,
 *  response times, delivery charges, insurance or payment conditions) appear
 *  here: none of them are documented, and inventing them would put terms the
 *  company never agreed to in front of a buyer.
 * ============================================================================
 */

import type { L } from "@/i18n/localized";

export interface Faq {
  question: L;
  answer: L;
}

export const faqs: Faq[] = [
  {
    question: {
      en: "What equipment does Jowain Yanbu Est. supply?",
      ar: "ما المعدات التي توفّرها مؤسسة Jowain Yanbu Est.؟",
    },
    answer: {
      en: "Five groups: heavy lifting (mobile, rough terrain and crawler cranes), material handling and access (scissor and man lifts, forklifts, telehandlers), construction and earthmoving equipment, transportation (trailers, trucks and tankers), and site power and support equipment.",
      ar: "خمس مجموعات: الرفع الثقيل (رافعات متحركة ورافعات للطرق الوعرة ورافعات زاحفة)، ومناولة المواد والوصول الآمن (مقصّات ورافعات أفراد ورافعات شوكية ورافعات تلسكوبية)، ومعدات الإنشاء وأعمال الحفر، والنقل (مقاطر وشاحنات وصهاريج)، ومعدات الطاقة والمساندة في الموقع.",
    },
  },
  {
    question: {
      en: "What crane capacities are available?",
      ar: "ما حمولات الرافعات المتاحة؟",
    },
    answer: {
      en: "Certified mobile cranes from 20 tonnes to 1200 tonnes, rough terrain cranes from 25 tonnes to 120 tonnes, and crawler cranes from 55 tonnes to 3200 tonnes.",
      ar: "رافعات متحركة معتمدة من 20 طناً إلى 1200 طن، ورافعات للطرق الوعرة من 25 طناً إلى 120 طناً، ورافعات زاحفة من 55 طناً إلى 3200 طن.",
    },
  },
  {
    question: {
      en: "Do you provide operators and drivers?",
      ar: "هل توفّرون مشغّلين وسائقين؟",
    },
    answer: {
      en: "Yes. Qualified operators and drivers are provided upon request, for the equipment and transportation they are qualified to run.",
      ar: "نعم. يُوفَّر مشغّلون وسائقون مؤهّلون عند الطلب، للمعدات وأعمال النقل التي يحملون تأهيلاً لتشغيلها.",
    },
  },
  {
    question: {
      en: "Where do you operate?",
      ar: "ما نطاق عملكم الجغرافي؟",
    },
    answer: {
      en: "The company is based in Yanbu Al Bahr and provides equipment and transportation coverage across the Kingdom of Saudi Arabia.",
      ar: "تتّخذ المؤسسة من ينبع البحر مقراً لها، وتوفّر تغطية بالمعدات وخدمات النقل في مختلف مناطق المملكة العربية السعودية.",
    },
  },
  {
    question: {
      en: "Which industries do you serve?",
      ar: "أي القطاعات تخدمون؟",
    },
    answer: {
      en: "Oil & gas, petrochemical, construction & infrastructure, and power & energy.",
      ar: "النفط والغاز، والبتروكيماويات، والإنشاء والبنية التحتية، والطاقة والكهرباء.",
    },
  },
  {
    question: {
      en: "How long has the company been operating?",
      ar: "منذ متى تعمل المؤسسة؟",
    },
    answer: {
      en: "Jowain Yanbu Est. was established in 1992, giving us over 30 years of experience in heavy equipment rental and transportation.",
      ar: "تأسّست مؤسسة Jowain Yanbu Est. عام 1992، أي بخبرة تتجاوز 30 عاماً في تأجير المعدات الثقيلة وخدمات النقل.",
    },
  },
  {
    question: {
      en: "Can you confirm exact models and specifications?",
      ar: "هل يمكن تأكيد الطرازات والمواصفات الدقيقة؟",
    },
    answer: {
      en: "Yes. Exact models, capacities and configurations are confirmed with your quotation. Tell us the task, the site and the timing, and we will recommend the right unit.",
      ar: "نعم. تُحدَّد الطرازات والحمولات والتجهيزات بدقة مع عرض السعر. أخبرنا بطبيعة العمل والموقع والتوقيت وسنرشّح الوحدة المناسبة.",
    },
  },
  {
    question: {
      en: "How do I request equipment or transportation?",
      ar: "كيف أطلب معدات أو خدمة نقل؟",
    },
    answer: {
      en: "Use the request form on this site, or email us. Include the equipment or service, the project location and how long you need it, and our team will respond with availability.",
      ar: "استخدم نموذج الطلب في هذا الموقع أو راسلنا بالبريد الإلكتروني. اذكر المعدات أو الخدمة المطلوبة، وموقع المشروع، والمدة المطلوبة، وسيوافيك فريقنا بالتوفّر.",
    },
  },
];
