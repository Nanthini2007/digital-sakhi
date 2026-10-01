export interface JourneyStep {
  stepNumber: number;
  totalSteps: number;
  titleTa: string;
  titleEn: string;
  descriptionTa: string;
  descriptionEn: string;
  simpleAnalogyTa: string; // Used when "I'm Stuck" is triggered
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
    descriptionTa: "தமிழ்நாட்டில் தகுதியுள்ள குடும்பத் தலைவிகளுக்கு மாதம் ₹1,000 உரிமைத் தொகை வழங்கும் வரலாற்று சிறப்புமிக்க திட்டம்.",
    descriptionEn: "Tamil Nadu Government scheme providing ₹1,000 per month financial aid to eligible women heads of households.",
    officialUrl: "https://kmut.tn.gov.in",
    allowedDomains: ["kmut.tn.gov.in", "tn.gov.in", "tnesevai.tn.gov.in"],
    keywords: [
      "உரிமைத் தொகை", "மகளிர் உரிமை", "1000 ரூபாய்", "1000", "kmut", "magalir urimai", 
      "1000 rupees", "family head", "குடும்பத் தலைவி", "மகளிர் திட்டம்"
    ],
    eligibilityTa: [
      "21 வயது பூர்த்தியடைந்த குடும்பத் தலைவிகள் (1979 முதல் 2003க்குள் பிறந்தவர்கள்)",
      "குடும்ப ஆண்ட வருமானம் ₹2.5 லட்சத்திற்கு மிகாமல் இருக்க வேண்டும்",
      "ஆண்டு மின் நுகர்வு 3600 யூனிட்டிற்கு குறைவாக இருக்க வேண்டும்",
      "சொந்தமாக 4 சக்கர வாகனம் (கார், டிராக்டர்) வைத்திருக்கக் கூடாது"
    ],
    eligibilityEn: [
      "Female heads of family who completed 21 years of age",
      "Annual family income less than ₹2.5 Lakhs",
      "Annual electricity consumption below 3600 units",
      "Family should not own 4-wheeler vehicle (car/jeep)"
    ],
    documentsTa: [
      "குடும்ப அட்டை (Smart Ration Card)",
      "ஆதார் அட்டை (Aadhaar Card)",
      "வங்கி கணக்கு புத்தகம் (Bank Passbook with Aadhaar link)",
      "மின் கட்டண ரசீது / இணைப்பு எண் (EB Consumer Number)"
    ],
    documentsEn: [
      "Smart Ration Card / Family Card",
      "Aadhaar Card",
      "Bank Account Passbook (Aadhaar Seeded)",
      "Electricity Bill Connection Number"
    ],
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        titleTa: "ரேஷன் கார்டு மற்றும் வயது சரிபார்ப்பு",
        titleEn: "Check Ration Card & Age",
        descriptionTa: "உங்கள் குடும்ப அட்டையில் பெயர் இருக்கிறதா மற்றும் வயது 21 தாண்டியுள்ளதா என்று பாருங்கள்.",
        descriptionEn: "Ensure your name is listed as head/member in Ration Card and age is above 21.",
        simpleAnalogyTa: "உங்கள் ரேஷன் கார்டை எடுங்கள். அதில் உங்கள் பெயர் குடும்பத் தலைவியாகவோ அல்லது பெண் உறுப்பினராகவோ இருக்க வேண்டும். வயது 21 முடிஞ்சிருக்கணும்!",
        simpleAnalogyEn: "Take your Smart Ration Card. Your name should be on it, and your age must be 21 or older.",
        actionRequiredTa: "உங்கள் ஸ்மார்ட் ரேஷன் கார்டு மற்றும் ஆதாரை அருகில் வைத்துக் கொள்ளுங்கள்.",
        actionRequiredEn: "Keep your Smart Ration card and Aadhaar card near you."
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        titleTa: "வங்கி கணக்கில் ஆதார் இணைப்பு",
        titleEn: "Link Bank Account with Aadhaar",
        descriptionTa: "பணம் நேரடியாக வர உங்கள் வங்கி கணக்கில் ஆதார் இணைக்கப்பட்டிருக்க வேண்டும் (Aadhaar Seeding).",
        descriptionEn: "Your bank account must be linked with Aadhaar (DBT enabled) to receive ₹1000.",
        simpleAnalogyTa: "உங்கள் வங்கி புத்தகத்தின் முதல் பக்கத்தைப் பாருங்கள். உங்கள் வங்கி கணக்குடன் ஆதார் சேர்ந்திருக்க வேண்டும். பயப்பட வேண்டாம், அருகில் உள்ள வங்கி அல்லது அஞ்சலகத்தில் இதை உடனே செய்ய முடியும்!",
        simpleAnalogyEn: "Check your bank passbook. Is your Aadhaar linked to your account? If not, visit your local Post Office or Bank branch.",
        actionRequiredTa: "வங்கி புத்தகத்தின் கணக்கு எண் மற்றும் IFSC குறியீட்டை சரிபார்க்கவும்.",
        actionRequiredEn: "Verify Bank account number and IFSC code on passbook."
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        titleTa: "இ-சேவை மையம் / நியாயவிலைக்கடை விண்ணப்பம்",
        titleEn: "Submit via e-Sevai or Fair Price Shop",
        descriptionTa: "அரசு நடத்தும் சிறப்பு முகாம் அல்லது இ-சேவை மையம் மூலம் விண்ணப்பிக்கலாம்.",
        descriptionEn: "Submit your application form at local e-Sevai center or special camp with token.",
        simpleAnalogyTa: "உங்களுக்கு கம்ப்யூட்டர் இயக்கத் தெரியாவிட்டாலும் பரவாயில்லை! ரேஷன் கடையில் தரும் விண்ணப்ப படிவத்தில் சகி காட்டும் விவரங்களை நிரப்பி கொடுத்தால் போதும்.",
        simpleAnalogyEn: "Even if you don't know how to use computers, just bring your documents to your local e-Sevai center or Ration Shop camp!",
        actionRequiredTa: "சகாயதா விவரங்களைச் சரிபார்க்க அதிகாரப்பூர்வ இணையதளத்தை அழுத்தவும்.",
        actionRequiredEn: "Click 'Open Official Website' to check application status on official portal.",
        officialWebActionTa: "kmut.tn.gov.in போர்ட்டலை திறக்கவும்",
        officialWebActionEn: "Open official kmut.tn.gov.in portal"
      }
    ]
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
    descriptionTa: "கர்ப்பிணி தாய்மார்கள் மற்றும் பாலூட்டும் தாய்மார்களுக்கு ஊட்டச்சத்து மற்றும் நிதி உதவி வழங்கும் மத்திய அரசு திட்டம்.",
    descriptionEn: "Maternity benefit program providing cash incentives for pregnant women and lactating mothers.",
    officialUrl: "https://pmmvy.wcd.gov.in",
    allowedDomains: ["pmmvy.wcd.gov.in", "wcd.nic.in", "india.gov.in", "tn.gov.in"],
    keywords: [
      "கர்ப்பிணி", "தாய்மை", "pmmvy", "5000", "மタニட்டி", "பிரசவம்", "குழந்தை",
      "pregnant", "maternity", "baby", "mother", "5000 rupees"
    ],
    eligibilityTa: [
      "19 வயதுக்கு மேற்பட்ட கர்ப்பிணி பெண்கள்",
      "குடும்பத்தில் முதல் குழந்தைக்கு இந்த நிதி உதவி வழங்கப்படும்",
      "மத்திய அல்லது மாநில அரசு பணியில் இருக்கக் கூடாது"
    ],
    eligibilityEn: [
      "Pregnant women aged 19 years or above",
      "Applicable for the first living child of the family",
      "Must not be a regular employee of Central/State Government"
    ],
    documentsTa: [
      "ஆதார் அட்டை (Aadhaar Card)",
      "வங்கி கணக்கு புத்தகத்தின் முதல் பக்கம் (Bank Passbook)",
      "தாய் சேய் நல அட்டை / RCH ID (Mother & Child Protection Card)"
    ],
    documentsEn: [
      "Aadhaar Card of Mother",
      "Bank Account Passbook (first page with IFSC code)",
      "Mother and Child Protection (MCP) Card with RCH ID"
    ],
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        titleTa: "தகுதி சரிபார்ப்பு (Eligibility Check)",
        titleEn: "Check Your Eligibility",
        descriptionTa: "நீங்கள் இந்த ₹5,000 உதவித்தொகை பெற தகுதியானவரா என்று உறுதிப்படுத்துங்கள்.",
        descriptionEn: "Confirm if you are eligible for the ₹5,000 maternity benefit.",
        simpleAnalogyTa: "உங்கள் வயது 19-க்கு மேல் இருக்க வேண்டும், இது உங்கள் முதல் குழந்தையாக இருக்க வேண்டும். நிரந்தர அரசு வேலை இல்லை என்றால் நீங்கள் தகுதி உடையவர்!",
        simpleAnalogyEn: "You must be 19+ years old, and this must be your first baby. If you don't hold a permanent gov job, you are eligible!",
        actionRequiredTa: "உங்கள் வயதையும் இது முதல் குழந்தையா என்பதையும் உறுதி செய்யுங்கள்.",
        actionRequiredEn: "Confirm your age and whether this is your first pregnancy."
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        titleTa: "3 முக்கிய ஆவணங்களை தயார் செய்தல்",
        titleEn: "Prepare 3 Simple Documents",
        descriptionTa: "வங்கி புத்தகம், ஆதார் மற்றும் தாய் சேய் அட்டை ஆகியவற்றை உங்களிடம் எடுத்து வையுங்கள்.",
        descriptionEn: "Keep your Bank passbook, Aadhaar card, and Mother-Child Protection Card ready.",
        simpleAnalogyTa: "கவலைப்படாதீங்க! உங்கள் வங்கி புத்தகத்தின் முதல் பக்கத்தை எடுங்கள். அதில் உங்கள் படம், கணக்கு எண் மற்றும் வங்கி பெயர் தெளிவாக இருக்க வேண்டும்.",
        simpleAnalogyEn: "Don't worry! Open the first page of your green/blue bank book. Check that your photo and bank account number are visible.",
        actionRequiredTa: "உங்கள் வங்கி புத்தகத்தில் ஆதார் எண் இணைந்துள்ளதா என்று சரிபாருங்கள்.",
        actionRequiredEn: "Check if your bank account is linked to your Aadhaar card."
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        titleTa: "அருகிலுள்ள அங்கன்வாடி மையத்தை அணுகுதல்",
        titleEn: "Visit Nearby Anganwadi Center",
        descriptionTa: "உங்கள் ஆவணங்களுடன் கிராமத்து அங்கன்வாடி அல்லது ஆஷா (ASHA) பணியாளரை சந்திக்கவும்.",
        descriptionEn: "Take your documents to your village Anganwadi worker or ASHA sister.",
        simpleAnalogyTa: "கணினியில் நீங்கள் எதையும் தட்டச்சு செய்ய வேண்டியதில்லை. சகி தயாரித்த 'சகாயதா கார்டை' உங்கள் ஊர் அங்கன்வாடி டீச்சரிடம் காட்டினால் போதும்!",
        simpleAnalogyEn: "You don't need to type anything on a computer! Just show the Sahayata Card created by Sakhi to your village Anganwadi teacher.",
        actionRequiredTa: "சகாயதா கார்டை பதிவிறக்கம் செய்து அங்கன்வாடி பணியாளரிடம் காண்பிக்கவும்.",
        actionRequiredEn: "Download Sahayata Card and show it to your local Anganwadi worker.",
        officialWebActionTa: "அரசு அதிகாரப்பூர்வ போர்ட்டலை பார்க்க 'Open Official Website' அழுத்தவும்.",
        officialWebActionEn: "Click 'Open Official Website' to view official guidelines."
      }
    ]
  },
  pudhumai_penn: {
    id: "pudhumai_penn",
    nameTa: "புதுமைப் பெண் திட்டம் (Pudhumai Penn Scheme)",
    nameEn: "Pudhumai Penn Higher Education Assistance Scheme",
    category: "Education Benefit / மாணவிகள் கல்வி உதவித்தொகை",
    taglineTa: "அரசுப் பள்ளி மாணவிகளுக்கு மாதம் ₹1,000 கல்வி உதவித் தொகை",
    taglineEn: "₹1,000 monthly assistance for female students from gov schools",
    benefitAmountTa: "மாதம்தோறும் ₹1,000 நேரடியாக வங்கி கணக்கில்",
    benefitAmountEn: "₹1,000 per month credited to student bank account",
    descriptionTa: "6 முதல் 12 ஆம் வகுப்பு வரை அரசுப் பள்ளிகளில் படித்து உயர்கல்வி சேரும் மாணவிகளுக்கு தமிழ்நாடு அரசு வழங்கும் நிதி உதவி.",
    descriptionEn: "Tamil Nadu government scheme providing financial support for girls who studied in government schools for higher education.",
    officialUrl: "https://penkalvi.tn.gov.in",
    allowedDomains: ["penkalvi.tn.gov.in", "tn.gov.in", "tndce.tn.gov.in"],
    keywords: [
      "புதுமை பெண்", "மாணவி", "கல்வி", "கல்லூரி", "1000", "பள்ளி", "pudhumai penn", 
      "penkalvi", "college", "school girl", "1000 scholarship"
    ],
    eligibilityTa: [
      "6 ஆம் வகுப்பு முதல் 12 ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்திருக்க வேண்டும்",
      "கல்லூரி / பட்டயப்படிப்பு (Diploma / Degree / ITI) பயிலும் பெண் மாணவி"
    ],
    eligibilityEn: [
      "Studied 6th to 12th standard in Tamil Nadu Government Schools",
      "Currently pursuing Higher Education (Degree/Diploma/ITI)"
    ],
    documentsTa: [
      "பள்ளி மாற்றுச் சான்றிதழ் (TC / Bonafide Certificate)",
      "10 & 12 ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்",
      "மாணவியின் வங்கி கணக்கு புத்தகம் & ஆதார்"
    ],
    documentsEn: [
      "School Transfer Certificate or Bonafide Certificate",
      "10th & 12th Marksheets",
      "Student's Bank Passbook and Aadhaar Card"
    ],
    steps: [
      {
        stepNumber: 1,
        totalSteps: 3,
        titleTa: "பள்ளி தகுதி சரிபார்ப்பு",
        titleEn: "School Study Verification",
        descriptionTa: "6 முதல் 12 வரை அரசுப் பள்ளியில் படித்ததை உறுதி செய்யுங்கள்.",
        descriptionEn: "Confirm that you studied 6th to 12th in a Tamil Nadu Government school.",
        simpleAnalogyTa: "நீங்கள் 6-வது வகுப்பிலிருந்து 12-வது வரை அரசுப் பள்ளியில் படித்திருந்தால் இந்த ₹1,000 மாதம் மாதம் உங்களுக்குக் கிடைக்கும்!",
        simpleAnalogyEn: "If you studied in a government school from 6th to 12th standard, you will get ₹1,000 every month for your college education!",
        actionRequiredTa: "உங்கள் பள்ளி மாற்றுச் சான்றிதழ் (TC) எடுத்து வையுங்கள்.",
        actionRequiredEn: "Keep your school Transfer Certificate (TC) ready."
      },
      {
        stepNumber: 2,
        totalSteps: 3,
        titleTa: "கல்லூரி போனாஃபைட் சான்றிதழ்",
        titleEn: "Get College Bonafide Certificate",
        descriptionTa: "நீங்கள் கல்லூரியில் படிக்கிறீர்கள் என்பதற்கான சான்றிதழைப் பெறுங்கள்.",
        descriptionEn: "Obtain a Bonafide Certificate from your college office.",
        simpleAnalogyTa: "உங்கள் கல்லூரி ஆபீஸுக்குச் சென்று 'புதுமைப் பெண் திட்டத்திற்கு Bonafide வேண்டும்' என்று கேளுங்கள்.",
        simpleAnalogyEn: "Go to your college office and ask for a 'Bonafide Certificate for Pudhumai Penn scheme'.",
        actionRequiredTa: "கல்லூரி முதல்வரிடம் சான்றிதழ் வாங்கவும்.",
        actionRequiredEn: "Collect the signed certificate from college office."
      },
      {
        stepNumber: 3,
        totalSteps: 3,
        titleTa: "இணையதளப் பதிவு",
        titleEn: "Online Portal Handoff",
        descriptionTa: "Penkalvi போர்ட்டலில் அல்லது கல்லூரி உதவி மையத்தில் பதிவு செய்தல்.",
        descriptionEn: "Registration at Penkalvi portal or college nodal officer cell.",
        simpleAnalogyTa: "கல்லூரி நோடல் ஆபீஸரிடம் உங்கள் விவரங்களைக் கொடுத்தால் அவர்களே இணையத்தில் ஏற்றி விடுவார்கள்.",
        simpleAnalogyEn: "Hand over your documents to your college nodal coordinator; they will submit your details online.",
        actionRequiredTa: "விவரங்களை சரிபார்க்க அதிகாரப்பூர்வ தளத்தை அழுத்தவும்.",
        actionRequiredEn: "Click 'Open Official Website' to verify penkalvi portal."
      }
    ]
  }
};

/**
 * Helper to match user text to a known service
 */
export function findServiceByQuery(query: string): GovernmentService {
  const q = query.toLowerCase();
  for (const serviceId in TRUSTED_SERVICES) {
    const service = TRUSTED_SERVICES[serviceId];
    for (const kw of service.keywords) {
      if (q.includes(kw.toLowerCase())) {
        return service;
      }
    }
  }
  // Default to KMUT or PMMVY
  return TRUSTED_SERVICES.kmut;
}

/**
 * Check if domain is in allowed list
 */
export function isAllowedDomain(urlStr: string, allowedDomains: string[]): boolean {
  try {
    const url = new URL(urlStr);
    return allowedDomains.some(domain => url.hostname.endsWith(domain));
  } catch {
    return false;
  }
}
