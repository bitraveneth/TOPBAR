/**
 * TOPBAR
 * Designed and developed by Alex
 * GitHub: https://github.com/bitraveneth
 * Contact: meetalex@protonmail.com
 */

export const exhibitionDefaults = {
  eyebrow: 'Global Showcase',
  title: 'Exhibitions & Global Events',
  helper: 'Explore TOPBAR participation in global vape and trade exhibitions.',
  events: [
    { id: 'ex-01', name: 'ShishaMesse Frankfurt', date: 'May 08 - May 10, 2026', place: 'Frankfurt, Germany', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-01.jpg' },
    { id: 'ex-02', name: 'The Vaper Expo UK', date: 'May 08 - May 10, 2026', place: 'Birmingham, United Kingdom', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-02.jpg' },
    { id: 'ex-03', name: 'National Convenience Show', date: 'April 13 - April 15, 2026', place: 'Birmingham, United Kingdom', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-03.jpg' },
    { id: 'ex-04', name: 'EVO NXT Prague', date: 'April 17 - April 18, 2026', place: 'Prague, Czech Republic', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-04.jpg' },
    { id: 'ex-05', name: 'VAPEXPO PARIS', date: 'March 22 - March 23, 2026', place: 'Paris, France (Expo Porte de Versailles - Pavillon 6)', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-05.jpg' },
    { id: 'ex-06', name: 'THE UK FOOD & DRINK SHOWS', date: 'April 13 - April 15, 2026', place: 'Birmingham, United Kingdom (NEC)', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-06.jpg' },
    { id: 'ex-07', name: 'TABACCO PLUS EXPO (TPE)', date: 'March 31 - April 02, 2026', place: 'Las Vegas, United States', booth: 'GB 54', year: 2026, image: '/assets/images/exhibition/exhibition-07.jpg' },
    { id: 'ex-08', name: 'T2000 In Tour', date: 'March 21 - March 22, 2026', place: 'Catania, Italy', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-08.jpg' },
    { id: 'ex-09', name: 'CHAMPS TRADE SHOW', date: 'February 2026', place: 'To Be Determined', booth: 'To Be Determined', year: 2026, image: '/assets/images/exhibition/exhibition-09.jpg' },
    { id: 'ex-10', name: 'WT Middle East', date: 'November 10 - November 11, 2025', place: 'Dubai, UAE', booth: 'HC 27', year: 2025, image: '/assets/images/exhibition/exhibition-10.jpg' },
    { id: 'ex-11', name: 'T2000 In Tour', date: 'October 04 - October 05, 2025', place: 'Carrara', booth: 'GB40', year: 2025, image: '/assets/images/exhibition/exhibition-11.jpg' },
    { id: 'ex-12', name: 'VAPER EXPO UK', date: 'October 2025', place: 'Birmingham, United Kingdom', booth: 'GB 72', year: 2025, image: '/assets/images/exhibition/exhibition-12.jpg' },
    { id: 'ex-13', name: 'VAPEXPRO', date: 'September 27 - September 28, 2025', place: 'EXPO XXI Exhibition Center, Warsaw', booth: 'A3', year: 2025, image: '/assets/images/exhibition/exhibition-01.jpg' },
    { id: 'ex-14', name: 'INTERTABAC', date: 'September 2025', place: 'Dortmund, Germany', booth: 'GB 80', year: 2025, image: '/assets/images/exhibition/exhibition-02.jpg' },
    { id: 'ex-15', name: 'VAPE CLUB SHOW', date: 'August 30 - August 31, 2025', place: 'Moscow, Crocus Expo', booth: '505', year: 2025, image: '/assets/images/exhibition/exhibition-03.jpg' },
    { id: 'ex-16', name: 'WORLD VAPE SHOW', date: 'June 18 - June 20, 2025', place: 'Dubai, United Arab Emirates', booth: '2155', year: 2025, image: '/assets/images/exhibition/exhibition-04.jpg' },
    { id: 'ex-17', name: 'VAPEXPO SPAIN', date: 'May 31 - June 01, 2025', place: 'Madrid, Spain', booth: 'B11', year: 2025, image: '/assets/images/exhibition/exhibition-05.jpg' },
    { id: 'ex-18', name: 'VAPER EXPO UK', date: 'May 09 - May 11, 2025', place: 'NEC Birmingham, UK', booth: 'B110', year: 2025, image: '/assets/images/exhibition/exhibition-06.jpg' },
    { id: 'ex-19', name: 'SHISHAMESSE', date: 'April 25 - April 27, 2025', place: 'Messe Frankfurt, Germany', booth: '6D + 5E', year: 2025, image: '/assets/images/exhibition/exhibition-07.jpg' },
    { id: 'ex-20', name: 'VAPEXPO', date: 'March 23 - March 24, 2025', place: 'Centre de Congres Lyon, France', booth: '100', year: 2025, image: '/assets/images/exhibition/exhibition-08.jpg' },
  ],
}

function file(id, title, type, size) {
  return { id, title, url: '', type, size }
}

export const downloadDefaults = {
  eyebrow: 'Resource Center',
  title: 'Downloads',
  intro: 'Access official TOPBAR manuals, quick start guides, safety files, and compliance documents.',
  groups: [
    {
      id: 'dl-8000',
      title: 'TOPBAR 8000 Puffs',
      files: [
        file('dl-8000-manual', 'TOPBAR 8000 User Manual', 'PDF', '3.1 MB'),
        file('dl-8000-quick', 'TOPBAR 8000 Quick Start Guide', 'PDF', '1.4 MB'),
      ],
    },
    {
      id: 'dl-40000',
      title: 'TOPBAR 40000 Puffs',
      files: [
        file('dl-40000-manual', 'TOPBAR 40000 User Manual', 'PDF', '3.6 MB'),
        file('dl-40000-quick', 'TOPBAR 40000 Quick Start Guide', 'PDF', '1.7 MB'),
      ],
    },
    {
      id: 'dl-50000',
      title: 'TOPBAR 50000 Puffs',
      files: [
        file('dl-50000-manual', 'TOPBAR 50000 User Manual', 'PDF', '4.3 MB'),
        file('dl-50000-safety', 'TOPBAR 50000 Setup & Safety Guide', 'PDF', '2.2 MB'),
      ],
    },
    {
      id: 'dl-60000',
      title: 'TOPBAR 60000 Puffs',
      files: [
        file('dl-60000-manual', 'TOPBAR 60000 User Manual', 'PDF', '4.6 MB'),
        file('dl-60000-safety', 'TOPBAR 60000 Setup & Safety Guide', 'PDF', '2.5 MB'),
      ],
    },
  ],
  resources: [
    file('dl-warranty', 'Warranty Terms & Conditions', 'PDF', '0.8 MB'),
    file('dl-sds', 'Product Safety Datasheet', 'PDF', '1.5 MB'),
    file('dl-certs', 'Compliance Certificates Pack', 'ZIP', '8.3 MB'),
  ],
}

export const supportDefaults = {
  eyebrow: 'Help Center',
  title: 'Hello, How can we help you?',
  helper: 'Or choose a category to quickly find the help you need',
  email: 'support@topbarofficial.com',
  notice: 'Email support@topbarofficial.com and include your product model, issue type, and country/region.',
  topics: [
    {
      id: 'warranty',
      icon: 'warranty',
      title: 'Warranty Claim',
      heading: 'Warranty Claim Support',
      description: 'Submit product warranty requests with purchase details, serial information, and issue summary.',
      details: [
        'Required: product model, purchase date, country/region',
        'Recommended: package code and product photos',
        'Response target: within 24-48 business hours',
      ],
      formTitle: 'Warranty Claim Form',
      issueType: 'Warranty Claim',
      lockIssueType: true,
    },
    {
      id: 'wholesale',
      icon: 'wholesale',
      title: 'Wholesale Request',
      heading: 'Wholesale & Distributor Requests',
      description: 'Contact TOPBAR for business cooperation, retail supply, and regional distribution opportunities.',
      details: [
        'Share company name and business type',
        'Provide target market and monthly demand',
        'Our business team will follow up with pricing and terms',
      ],
      formTitle: 'Wholesale Request Form',
      issueType: 'Business / Distributor Inquiry',
      lockIssueType: true,
    },
    {
      id: 'counterfeit',
      icon: 'counterfeit',
      title: 'Report Counterfeit',
      heading: 'Counterfeit Product Report',
      description: 'Help us protect customers by reporting suspected fake products or unauthorized sellers.',
      details: [
        'Attach store/platform information and location',
        'Upload product images and packaging code if possible',
        'Our compliance team investigates each report',
      ],
      formTitle: 'Report Counterfeit Form',
      issueType: 'Counterfeit Report',
      lockIssueType: true,
    },
    {
      id: 'contact',
      icon: 'contact',
      title: 'Contact Us',
      heading: 'Contact TOPBAR Support',
      description: 'For order, product, or usage issues, contact our global support team directly.',
      details: [
        'Email: support@topbarofficial.com',
        'Service hours: Mon-Fri, 09:00-18:00 (UTC+8)',
        'Support language: English',
      ],
      formTitle: 'Contact Us Form',
      issueType: '',
      lockIssueType: false,
    },
    {
      id: 'faq',
      icon: 'faq',
      title: 'FAQ',
      heading: 'Frequently Asked Questions',
      description: 'Browse common questions about wholesale, ingredients, shipping, safety, and product usage.',
      details: [
        'Tap any question below to view the answer',
        'Answers cover wholesale, shipping, safety, and usage',
        'Contact us if you need more help',
      ],
      formTitle: 'FAQ Contact Form',
      issueType: 'General FAQ Inquiry',
      lockIssueType: true,
    },
  ],
  faqs: [
    { id: 'faq-01', q: 'What is your wholesale pricing?', a: 'We offer competitive wholesale prices. Once your application is approved, our sales team will share details with you.' },
    { id: 'faq-02', q: 'Do you offer wholesale discounts, and what are the minimum order requirements?', a: 'Wholesale prices vary by location and order size. Complete the wholesale request form, and we will provide full pricing information.' },
    { id: 'faq-03', q: 'Are there marketing materials or display kits provided?', a: 'Marketing materials are distributed through authorised distributors. Retailers should contact their assigned distributor. If they cannot assist, feel free to reach out to us at support@etopbarvape.com, and we will help guide you to the appropriate resources.' },
    { id: 'faq-04', q: 'What are the shipping timelines and customs support?', a: 'Shipping timelines depend on your location and distributor. For international orders, customs clearance is typically handled by the distributor or shipping partner. Most shipments include tracking numbers. For region-specific details, please contact your assigned distributor.' },
    { id: 'faq-05', q: 'Can vaping cause an allergy?', a: 'Our vapes contain Propylene Glycol (PG), Vegetable Glycerin (VG), nicotine, and flavourings. Some people may be sensitive, so please check the packaging for allergen information.' },
    { id: 'faq-06', q: 'Is vaping harmful to the human body?', a: 'Vapes are intended for adult smokers only. They are smoke-free products that vaporise an e-liquid containing nicotine and flavours. Nicotine is addictive and not risk-free, but because e-cigarettes do not burn tobacco, they may be a better choice for adults than continuing to smoke.' },
    { id: 'faq-07', q: 'How does age verification work?', a: 'Topbar does not sell products directly to consumers. Instead, our distributors and retailers handle all sales and are responsible for verifying that customers meet the legal age requirement before purchase. This process may include checking your name, date of birth, and address. Please note that age verification methods may vary depending on your country or region, based on local laws and regulations.' },
    { id: 'faq-08', q: 'What are the main ingredients of e-liquid?', a: 'Our e-liquid is made with Propylene Glycol (PG) and Vegetable Glycerin (VG), both food-grade or pharmaceutical-grade. We also use a mix of natural and artificial flavours, plus nicotine. If you have allergies to fruits, nuts, or gluten, we recommend avoiding vapes, as some flavourings could cause a reaction.' },
    { id: 'faq-09', q: 'What should I do if the device tastes burnt?', a: 'A burnt taste usually means the e-liquid is low or the coil is overheated. Replace the device or the pod if it continues.' },
  ],
}
