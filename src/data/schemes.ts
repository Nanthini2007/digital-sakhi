export interface JourneyStep {
  stepNumber: number;
  totalSteps: number;
  titleTa: string;
  titleEn: string;
  descriptionTa: string;
  descriptionEn: string;
  simpleAnalogyTa: string;
  simpleAnalogyEn: string;
  actionRequiredTa: string;
  actionRequiredEn: string;
  documentRequired?: string;
  officialWebActionTa?: string;
  officialWebActionEn?: string;
}

export interface GovernmentService {
  id: string;
  nameTa: string;
  nameEn: string;
  category: string;
  taglineTa: string;
  taglineEn: string;
  benefitAmountTa: string;
  benefitAmountEn: string;
  descriptionTa: string;
  descriptionEn: string;
  officialUrl: string;
  allowedDomains: string[];
  eligibilityTa: string[];
  eligibilityEn: string[];
  documentsTa: string[];
  documentsEn: string[];
  steps: JourneyStep[];
  keywords: string[];
}

export const TRUSTED_SERVICES: Record<string, GovernmentService> = {
  kmut: {
    id: "kmut",
    nameTa: "கலைஞர் மகளிர் உரிமைத் திட்டம் (KMUT)",
    nameEn: "Kalaignar Magalir Urimai Thittam (KMUT)",
    category: "Basic Income / மகளிர் உரிமைத் தொகை",
    taglineTa: "குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 நிதி உதவி",
    taglineEn: "₹1,000 monthly rights grant for female heads of family",
    benefitAmountTa: "மாதம்தோறும் ₹1,000 நேரடியாக வங்கி கணக்கில்",
    benefitAmountEn: "₹1,000 credited directly to woman's bank account every month",
    descriptionTa:
      "தமிழ்நாட்டில் தகுதியுள்ள குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 உரிமைத் தொகை வழங்கும் திட்டம்.",
    descriptionEn:
      "Tamil Nadu Government scheme providing ₹1,000 per month financial aid to eligible women heads of households.",
    officialUrl: "https://kmut.tn.gov.in",
    allowedDomains: ["kmut.tn.gov.in", "tn.gov.in", "tnesevai.tn.gov.in"],
    keywords: [
      "உரிமைத் தொகை",
      "மகளிர் உரிமை",
      "1000 ரூபாய்",
      "1000",
      "kmut",
      "magalir urimai",
      "1000 rupees",
      "family head",
      "குடும்பத் தலைவி",
      "மகளிர் திட்டம்",
      "women rights",
      "monthly 1000",
    ],
    eligibilityTa: [
      "21 வயது பூர்த்தியடைந்த குடும்பத் தலைவிகள்",
      "குடும்ப ஆண்ட வருமானம் ₹2.5 லட்சத்திற்கு மிகாமல் இருக்க வேண்டும்",
      "ஆண்டு மின் நுகர்வு 3600 யூனிட்டிற்கு குறைவாக இருக்க வேண்டும்",
      "சொந்தமாக 4 சக்கர வாகனம் வைத்திருக்கக் கூடாது",
    ],
    eligibilityEn: [
      "Female heads of family who completed 21 years of age",
      "Annual family income less than ₹2.5 Lakhs",
      "Annual electricity consumption below 3600 units",
      "Family should not own a 4-wheeler vehicle",
    ],
    documentsTa: [
      "குடும்ப அட்டை (Smart Ration Card)",
      "ஆதார் அட்டை (Aadhaar Card)",
      "வங்கி கணக்கு புத்தகம் (Bank Passbook with Aadhaar link)",
      "மின் கட்டண ரசீது / இணைப்பு எண் (EB Consumer Number)",
    ],
    documentsEn: [
      "Smart Ration Card / Family Card",
      "Aadhaar Card",
      "Bank Account Passbook (Aadhaar Seeded)",
      "Electricity Bill Connection Number",
    ],
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        titleTa: "ரேஷன் கார்டு மற்றும் வயது சரிபார்ப்பு",
        titleEn: "Check Ration Card & Age",
        descriptionTa:
          "உங்கள் குடும்ப அட்டையில் பெயர் இருக்கிறதா மற்றும் வயது 21 முடிந்திருக்கிறதா என்று பாருங்கள்.",
        descriptionEn:
          "Ensure your name is listed on the Ration Card and that you have completed 21 years.",
        simpleAnalogyTa:
          "உங்கள் ரேஷன் கார்டை எடுங்கள். அதில் உங்கள் பெயர் இருக்க வேண்டும். வயது 21 முடிந்திருக்க வேண்டும்.",
        simpleAnalogyEn:
          "Take your Smart Ration Card. Your name should be on it, and you must have completed 21 years.",
        actionRequiredTa:
          "உங்கள் ஸ்மார்ட் ரேஷன் கார்டு மற்றும் ஆதாரை அருகில் வைத்துக் கொள்ளுங்கள்.",
        actionRequiredEn:
          "Keep your Smart Ration Card and Aadhaar Card near you.",
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        titleTa: "வங்கி கணக்கில் ஆதார் இணைப்பு",
        titleEn: "Link Bank Account with Aadhaar",
        descriptionTa:
          "பணம் நேரடியாக வர உங்கள் வங்கி கணக்கில் ஆதார் இணைக்கப்பட்டிருக்க வேண்டும்.",
        descriptionEn:
          "Your bank account must be linked with Aadhaar to receive the benefit.",
        simpleAnalogyTa:
          "உங்கள் வங்கி புத்தகத்தின் முதல் பக்கத்தைப் பாருங்கள். உங்கள் வங்கி கணக்குடன் ஆதார் சேர்ந்திருக்க வேண்டும்.",
        simpleAnalogyEn:
          "Check your bank passbook. Your Aadhaar should be linked with your bank account.",
        actionRequiredTa:
          "வங்கி புத்தகத்தின் கணக்கு எண் மற்றும் IFSC குறியீட்டை சரிபார்க்கவும்.",
        actionRequiredEn:
          "Verify the bank account number and IFSC code on your passbook.",
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        titleTa: "இ-சேவை மையம் / நியாயவிலைக்கடை விண்ணப்பம்",
        titleEn: "Submit via e-Sevai or Fair Price Shop",
        descriptionTa:
          "அரசு நடத்தும் சிறப்பு முகாம் அல்லது இ-சேவை மையம் மூலம் விண்ணப்பிக்கலாம்.",
        descriptionEn:
          "Submit your application through the appropriate government service center or camp.",
        simpleAnalogyTa:
          "கம்ப்யூட்டர் இயக்கத் தெரியாவிட்டாலும் பரவாயில்லை. அருகிலுள்ள சேவை மையத்தில் உதவி கேட்கலாம்.",
        simpleAnalogyEn:
          "Even if you don't know how to use a computer, you can ask for help at the service center.",
        actionRequiredTa:
          "அதிகாரப்பூர்வ இணையதளத்தைத் திறந்து தகவல்களைச் சரிபார்க்கவும்.",
        actionRequiredEn:
          "Open the official website to verify the information.",
        officialWebActionTa: "kmut.tn.gov.in போர்ட்டலை திறக்கவும்",
        officialWebActionEn: "Open the official kmut.tn.gov.in portal",
      },
    ],
  },

  pmmvy: {
    id: "pmmvy",
    nameTa: "பிரதம மந்திரி மாத்ரு வந்தனா யோஜனா (PMMVY)",
    nameEn: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    category: "Maternity Benefit / கர்ப்பிணி உதவித்தொகை",
    taglineTa: "முதல் குழந்தைக்கு ₹5,000 கர்ப்பகால நிதி உதவி",
    taglineEn: "₹5,000 Maternity Cash Benefit for First Child",
    benefitAmountTa: "₹5,000 (3 தவணைகளில் வங்கி கணக்கில் நேரடியாக சேரும்)",
    benefitAmountEn: "₹5,000 directly deposited to bank account in 3 installments",
    descriptionTa:
      "கர்ப்பிணி தாய்மார்கள் மற்றும் பாலூட்டும் தாய்மார்களுக்கு ஊட்டச்சத்து மற்றும் நிதி உதவி வழங்கும் மத்திய அரசு திட்டம்.",
    descriptionEn:
      "Maternity benefit program providing cash incentives for pregnant women and lactating mothers.",
    officialUrl: "https://pmmvy.wcd.gov.in",
    allowedDomains: [
      "pmmvy.wcd.gov.in",
      "wcd.nic.in",
      "india.gov.in",
      "tn.gov.in",
    ],
    keywords: [
      "கர்ப்பிணி",
      "தாய்மை",
      "pmmvy",
      "5000",
      "பிரசவம்",
      "குழந்தை",
      "pregnant",
      "maternity",
      "baby",
      "mother",
      "5000 rupees",
      "pregnancy",
      "maternity benefit",
    ],
    eligibilityTa: [
      "19 வயதுக்கு மேற்பட்ட கர்ப்பிணி பெண்கள்",
      "குடும்பத்தில் முதல் குழந்தைக்கு இந்த நிதி உதவி வழங்கப்படும்",
      "மத்திய அல்லது மாநில அரசு பணியில் இருக்கக் கூடாது",
    ],
    eligibilityEn: [
      "Pregnant women aged 19 years or above",
      "Applicable for the first living child of the family",
      "Must not be a regular employee of Central/State Government",
    ],
    documentsTa: [
      "ஆதார் அட்டை (Aadhaar Card)",
      "வங்கி கணக்கு புத்தகத்தின் முதல் பக்கம் (Bank Passbook)",
      "தாய் சேய் நல அட்டை / RCH ID (Mother & Child Protection Card)",
    ],
    documentsEn: [
      "Aadhaar Card of Mother",
      "Bank Account Passbook",
      "Mother and Child Protection Card with RCH ID",
    ],
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        titleTa: "தகுதி சரிபார்ப்பு",
        titleEn: "Check Your Eligibility",
        descriptionTa:
          "நீங்கள் இந்த ₹5,000 உதவித்தொகை பெற தகுதியானவரா என்று உறுதிப்படுத்துங்கள்.",
        descriptionEn:
          "Confirm if you are eligible for the ₹5,000 maternity benefit.",
        simpleAnalogyTa:
          "உங்கள் வயது 19 அல்லது அதற்கு மேல் இருக்க வேண்டும். இது முதல் குழந்தைக்கான திட்டமாகும்.",
        simpleAnalogyEn:
          "You must be 19 or older. This benefit is for the first living child.",
        actionRequiredTa:
          "உங்கள் வயதையும் இது முதல் குழந்தைக்கான விண்ணப்பமா என்பதையும் உறுதி செய்யுங்கள்.",
        actionRequiredEn:
          "Confirm your age and whether this is for your first living child.",
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        titleTa: "3 முக்கிய ஆவணங்களை தயார் செய்தல்",
        titleEn: "Prepare 3 Simple Documents",
        descriptionTa:
          "வங்கி புத்தகம், ஆதார் மற்றும் தாய் சேய் அட்டை ஆகியவற்றை தயார் செய்யுங்கள்.",
        descriptionEn:
          "Keep your bank passbook, Aadhaar card, and Mother-Child Protection Card ready.",
        simpleAnalogyTa:
          "உங்கள் வங்கி புத்தகத்தின் முதல் பக்கத்தை எடுத்துக் கொள்ளுங்கள். கணக்கு விவரங்கள் தெளிவாக இருக்க வேண்டும்.",
        simpleAnalogyEn:
          "Keep the first page of your bank passbook ready with the account details visible.",
        actionRequiredTa:
          "உங்கள் வங்கி கணக்கில் தேவையான ஆதார் இணைப்பு உள்ளதா என்று சரிபாருங்கள்.",
        actionRequiredEn:
          "Check whether your bank account has the required Aadhaar linkage.",
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        titleTa: "அருகிலுள்ள அங்கன்வாடி மையத்தை அணுகுதல்",
        titleEn: "Visit Nearby Anganwadi Center",
        descriptionTa:
          "உங்கள் ஆவணங்களுடன் அங்கன்வாடி அல்லது சம்பந்தப்பட்ட பணியாளரை அணுகவும்.",
        descriptionEn:
          "Take your documents to the appropriate Anganwadi or authorized worker.",
        simpleAnalogyTa:
          "கணினியில் நீங்கள் எல்லாவற்றையும் செய்ய வேண்டியதில்லை. அருகிலுள்ள அங்கன்வாடி பணியாளரிடம் உதவி கேட்கலாம்.",
        simpleAnalogyEn:
          "You don't need to do everything on a computer. Ask the local Anganwadi worker for help.",
        actionRequiredTa:
          "தேவையான ஆவணங்களுடன் அருகிலுள்ள அங்கன்வாடி மையத்தை அணுகவும்.",
        actionRequiredEn:
          "Visit the nearby Anganwadi center with the required documents.",
        officialWebActionTa:
          "அரசு அதிகாரப்பூர்வ போர்ட்டலை பார்க்க 'Open Official Website' அழுத்தவும்.",
        officialWebActionEn:
          "Click 'Open Official Website' to view official guidelines.",
      },
    ],
  },

  pudhumai_penn: {
    id: "pudhumai_penn",
    nameTa: "புதுமைப் பெண் திட்டம்",
    nameEn: "Pudhumai Penn Higher Education Assistance Scheme",
    category: "Education Benefit / மாணவிகள் கல்வி உதவித்தொகை",
    taglineTa: "அரசுப் பள்ளி மாணவிகளுக்கு மாதம் ₹1,000 கல்வி உதவித் தொகை",
    taglineEn:
      "₹1,000 monthly assistance for female students from government schools",
    benefitAmountTa: "மாதம்தோறும் ₹1,000 நேரடியாக வங்கி கணக்கில்",
    benefitAmountEn:
      "₹1,000 per month credited to student bank account",
    descriptionTa:
      "6 முதல் 12 ஆம் வகுப்பு வரை அரசுப் பள்ளிகளில் படித்து உயர்கல்வி சேரும் மாணவிகளுக்கு வழங்கப்படும் நிதி உதவி.",
    descriptionEn:
      "Financial support for eligible female students entering higher education after studying in government schools.",
    officialUrl: "https://penkalvi.tn.gov.in",
    allowedDomains: [
      "penkalvi.tn.gov.in",
      "tn.gov.in",
      "tndce.tn.gov.in",
    ],
    keywords: [
      "புதுமை பெண்",
      "மாணவி",
      "கல்வி",
      "கல்லூரி",
      "1000",
      "பள்ளி",
      "pudhumai penn",
      "penkalvi",
      "college",
      "school girl",
      "1000 scholarship",
      "student",
      "scholarship",
      "education",
    ],
    eligibilityTa: [
      "6 ஆம் வகுப்பு முதல் 12 ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்திருக்க வேண்டும்",
      "கல்லூரி / பட்டயப்படிப்பு / ITI பயிலும் பெண் மாணவி",
    ],
    eligibilityEn: [
      "Studied 6th to 12th standard in Tamil Nadu Government Schools",
      "Currently pursuing Higher Education such as Degree, Diploma or ITI",
    ],
    documentsTa: [
      "பள்ளி மாற்றுச் சான்றிதழ் (TC / Bonafide Certificate)",
      "10 & 12 ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்",
      "மாணவியின் வங்கி கணக்கு புத்தகம் & ஆதார்",
    ],
    documentsEn: [
      "School Transfer Certificate or Bonafide Certificate",
      "10th & 12th Marksheets",
      "Student's Bank Passbook and Aadhaar Card",
    ],
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        titleTa: "பள்ளி தகுதி சரிபார்ப்பு",
        titleEn: "School Study Verification",
        descriptionTa:
          "6 முதல் 12 வரை அரசுப் பள்ளியில் படித்ததை உறுதி செய்யுங்கள்.",
        descriptionEn:
          "Confirm that you studied 6th to 12th in a Tamil Nadu Government school.",
        simpleAnalogyTa:
          "6-வது வகுப்பிலிருந்து 12-வது வரை அரசுப் பள்ளியில் படித்திருந்தால், அடுத்த படிப்புக்கான உதவி கிடைக்கலாம்.",
        simpleAnalogyEn:
          "If you studied in a government school from 6th to 12th, you may be eligible for higher-education assistance.",
        actionRequiredTa:
          "உங்கள் பள்ளி மாற்றுச் சான்றிதழ் அல்லது Bonafide Certificate தயார் வைத்துக் கொள்ளுங்கள்.",
        actionRequiredEn:
          "Keep your school Transfer Certificate or Bonafide Certificate ready.",
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        titleTa: "கல்லூரி போனாஃபைட் சான்றிதழ்",
        titleEn: "Get College Bonafide Certificate",
        descriptionTa:
          "நீங்கள் கல்லூரியில் படிக்கிறீர்கள் என்பதற்கான சான்றிதழைப் பெறுங்கள்.",
        descriptionEn:
          "Obtain a Bonafide Certificate from your college office.",
        simpleAnalogyTa:
          "கல்லூரி ஆபீஸுக்குச் சென்று புதுமைப் பெண் திட்டத்திற்கான Bonafide வேண்டும் என்று கேளுங்கள்.",
        simpleAnalogyEn:
          "Ask your college office for a Bonafide Certificate for the Pudhumai Penn scheme.",
        actionRequiredTa:
          "கல்லூரி அலுவலகத்திலிருந்து சான்றிதழைப் பெறுங்கள்.",
        actionRequiredEn:
          "Collect the required certificate from your college office.",
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        titleTa: "இணையதளப் பதிவு",
        titleEn: "Online Portal Handoff",
        descriptionTa:
          "Penkalvi போர்ட்டல் அல்லது கல்லூரி உதவி மையம் மூலம் பதிவு செய்யலாம்.",
        descriptionEn:
          "Registration can be completed through the Penkalvi portal or college support cell.",
        simpleAnalogyTa:
          "கல்லூரி நோடல் ஆபீஸரிடம் உங்கள் விவரங்களைக் கொடுத்து உதவி பெறலாம்.",
        simpleAnalogyEn:
          "Give your details to the college nodal coordinator and ask for help with the online process.",
        actionRequiredTa:
          "விவரங்களை சரிபார்க்க அதிகாரப்பூர்வ தளத்தைத் திறக்கவும்.",
        actionRequiredEn:
          "Open the official portal to verify the information.",
        officialWebActionTa:
          "அதிகாரப்பூர்வ Penkalvi தளத்தை திறக்கவும்.",
        officialWebActionEn:
          "Open the official Penkalvi portal.",
      },
    ],
  },
};

/**
 * Match a user's query to the most relevant trusted government service.
 *
 * The old implementation returned the first matching keyword.
 * That could cause a generic keyword such as "1000" to select the
 * wrong scheme. This version scores all services and chooses the
 * service with the strongest keyword match.
 */
export function findServiceByQuery(query: string): GovernmentService {
  const q = query.toLowerCase().trim();

  // Empty query: preserve the existing KMUT demo fallback.
  if (!q) {
    return TRUSTED_SERVICES.kmut;
  }

  let bestService: GovernmentService | null = null;
  let bestScore = 0;

  for (const serviceId in TRUSTED_SERVICES) {
    const service = TRUSTED_SERVICES[serviceId];

    let score = 0;

    for (const kw of service.keywords) {
      const keyword = kw.toLowerCase().trim();

      if (!keyword) continue;

      if (q.includes(keyword)) {
        // Longer keywords are more specific.
        score += keyword.length;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestService = service;
    }
  }

  if (bestService) {
    return bestService;
  }

  // Keep KMUT as the fallback so existing demo/journey behaviour
  // does not break.
  return TRUSTED_SERVICES.kmut;
}

/**
 * Check if domain is in allowed list.
 */
export function isAllowedDomain(
  urlStr: string,
  allowedDomains: string[]
): boolean {
  try {
    const url = new URL(urlStr);

    return allowedDomains.some(
      (domain) =>
        url.hostname === domain ||
        url.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}