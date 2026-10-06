export type AdminLanguage = 'en' | 'hi';

export const adminTranslations = {
  en: {
    // Brand & Header
    commandCenter: 'Apex Campus Command Center',
    unifiedWardenDesk: 'Chief Warden & Administrative Controller',
    langToggle: 'हिन्दी',
    roleDirector: 'Director',
    roleWarden: 'Chief Warden',
    roleSecurity: 'Gate Security',
    roleAccounts: 'Finance & Accounts',
    liveSystemSync: 'LIVE SYNC',
    quickScan: 'Turnstile Scanner',

    // Sidebar Sections
    secDashboard: 'Dashboard Overview',
    secHospitalTriage: 'Hospital Triage & SOS',
    secAdoptionHub: 'College Adoption Hub',
    secOnboarding: 'Student Onboarding',
    secResidents: 'Residents Roster',
    secComplaints: 'Grievance Resolution',
    secWhosOut: "Who's Out & Passes",
    secVisitors: 'Visitor Management',
    secVehicles: 'Vehicle Parking',
    secBilling: 'Dues & Cashier Desk',
    secNotices: 'Broadcast Notices',
    secMenu: 'Mess Kitchen & Menu',
    secGallery: 'College Activity Gallery',
    secCalendar: 'College Calendar & Events',
    secManagerProfile: 'Manager Profile Desk',
    secInventory: 'Hostel Inventory',
    secCompliance: 'Audit & Compliance',
    secTurnstileScanner: 'Gate Turnstile Scanner',

    // Manager Profile Section
    mgrDeskTitle: 'Chief Warden & Administrative Manager Desk',
    mgrDeskSubtitle: 'Live controller profile with photo, office hours, and announcements shown on student apps',
    mgrEditBtn: 'Edit Manager Profile',
    mgrPhotoUpload: 'Upload Profile Photo',
    mgrFullName: 'Manager Full Name',
    mgrDesignation: 'Official Designation',
    mgrVisitingHours: 'Official Visiting Hours',
    mgrOfficeLocation: 'Office Room / Location',
    mgrDirectPhone: 'Direct Desk Phone',
    mgrEmergencyLine: '24x7 Emergency Line',
    mgrOfficialEmail: 'Official College Email',
    mgrDutyStatus: 'Current Duty Status',
    mgrAnnouncement: 'Student Desk Announcement Note',
    mgrSaveBtn: 'Save & Broadcast to Student Apps',

    // College Gallery Section
    galleryTitle: 'Campus Activity Gallery Studio',
    gallerySubtitle: 'Upload, manage, and broadcast campus activity photos and videos to student resident devices in real-time',
    uploadMedia: 'Upload New Photo / Video',
    activityTitle: 'Activity / Event Title',
    activityCategory: 'Category',
    activityDate: 'Date of Activity',
    activityDesc: 'Caption / Story',
    pinToTop: 'Pin to top of student feed',
    publishActivity: 'Publish Activity to Gallery',
    deleteActivity: 'Delete',
    totalMoments: 'Total Moments Published',

    // College Calendar Section
    calendarTitle: 'College Academic Calendar Studio',
    calendarSubtitle: 'Schedule examinations, national holidays, athletic matches, and hostel events in real-time',
    scheduleNewEvent: 'Schedule New College Event',
    eventTitle: 'Event Title',
    eventCategory: 'Event Category',
    startDate: 'Start Date',
    endDate: 'End Date',
    eventTime: 'Event Timing',
    eventVenue: 'Venue / Location',
    eventDesc: 'Guidelines & Instructions',
    isExamAlert: 'Mark as Examination Schedule',
    isHolidayAlert: 'Mark as Campus Holiday',
    publishEvent: 'Schedule Event & Broadcast',
    totalEvents: 'Total Events Scheduled',

    // Stats Bar
    statActiveResidents: 'Active Residents',
    statTurnstileOut: 'Currently Out on Pass',
    statOpenComplaints: 'Open Maintenance Tickets',
    statPendingApprovals: 'Pending Registrations',
    statMonthlyDues: 'Total Monthly Dues'
  },
  hi: {
    // Brand & Header
    commandCenter: 'एपेक्स कैंपस कमांड सेंटर',
    unifiedWardenDesk: 'चीफ वार्डन एवं प्रशासनिक कंट्रोलर',
    langToggle: 'English',
    roleDirector: 'निदेशक',
    roleWarden: 'चीफ वार्डन',
    roleSecurity: 'गेट सुरक्षा गार्ड',
    roleAccounts: 'लेखा व खजांची',
    liveSystemSync: 'लाइव सिंक',
    quickScan: 'टर्नस्टाइल स्कैनर',

    // Sidebar Sections
    secDashboard: 'डैशबोर्ड अवलोकन',
    secHospitalTriage: 'इमरजेंसी ट्रायज व SOS',
    secAdoptionHub: 'अडॉप्शन हब',
    secOnboarding: 'छात्र प्रवेश व सत्यापन',
    secResidents: 'हॉस्टल निवासी सूची',
    secComplaints: 'शिकायत निवारण प्रणाली',
    secWhosOut: 'बाहर गए छात्र व आउटपास',
    secVisitors: 'अतिथि / आगंतुक डेस्क',
    secVehicles: 'वाहन व पार्किंग पास',
    secBilling: 'शुल्क रसीद व बकाया',
    secNotices: 'सूचना प्रसारण (Broadcast)',
    secMenu: 'मेस किचन व दैनिक मेनू',
    secGallery: 'कॉलेज गतिविधि गैलरी',
    secCalendar: 'कॉलेज कैलेंडर व कार्यक्रम',
    secManagerProfile: 'वार्डन प्रोफ़ाइल डेस्क',
    secInventory: 'हॉस्टल इन्वेंटरी',
    secCompliance: 'ऑडिट व अनुपालन',
    secTurnstileScanner: 'गेट टर्नस्टाइल स्कैनर',

    // Manager Profile Section
    mgrDeskTitle: 'चीफ वार्डन व प्रशासनिक प्रबंधक डेस्क',
    mgrDeskSubtitle: 'फोटो, मिलने के समय व घोषणाओं सहित लाइव प्रोफ़ाइल जो छात्र ऐप पर सीधे प्रदर्शित होती है',
    mgrEditBtn: 'प्रोफ़ाइल संपादित करें',
    mgrPhotoUpload: 'प्रोफ़ाइल फोटो अपलोड करें',
    mgrFullName: 'प्रबंधक का पूरा नाम',
    mgrDesignation: 'आधिकारिक पदनाम',
    mgrVisitingHours: 'मिलने का आधिकारिक समय',
    mgrOfficeLocation: 'कार्यालय कमरा / स्थान',
    mgrDirectPhone: 'सीधा डेस्क फोन',
    mgrEmergencyLine: '24x7 आपातकालीन नंबर',
    mgrOfficialEmail: 'आधिकारिक कॉलेज ईमेल',
    mgrDutyStatus: 'वर्तमान उपस्थिति स्थिति',
    mgrAnnouncement: 'छात्रों के लिए संदेश / घोषणा',
    mgrSaveBtn: 'सहेजें व छात्र ऐप पर प्रसारित करें',

    // College Gallery Section
    galleryTitle: 'कैंपस गतिविधि गैलरी स्टूडियो',
    gallerySubtitle: 'छात्रों के फोन पर वास्तविक समय में प्रसारित करने के लिए फोटो व वीडियो अपलोड व प्रबंधित करें',
    uploadMedia: 'नई फोटो / वीडियो अपलोड करें',
    activityTitle: 'गतिविधि / कार्यक्रम का नाम',
    activityCategory: 'श्रेणी (Category)',
    activityDate: 'आयोजन की तिथि',
    activityDesc: 'विवरण / कहानी',
    pinToTop: 'छात्र फीड में सबसे ऊपर पिन करें',
    publishActivity: 'गैलरी में प्रकाशित करें',
    deleteActivity: 'हटाएं',
    totalMoments: 'कुल प्रकाशित गतिविधियां',

    // College Calendar Section
    calendarTitle: 'कॉलेज शैक्षणिक कैलेंडर स्टूडियो',
    calendarSubtitle: 'परीक्षाएं, राष्ट्रीय छुट्टियां, खेल प्रतियोगिताएं व हॉस्टल बैठकों को वास्तविक समय में शेड्यूल करें',
    scheduleNewEvent: 'नया कॉलेज कार्यक्रम शेड्यूल करें',
    eventTitle: 'कार्यक्रम का नाम',
    eventCategory: 'कार्यक्रम की श्रेणी',
    startDate: 'आरंभ तिथि',
    endDate: 'समाप्ति तिथि',
    eventTime: 'कार्यक्रम का समय',
    eventVenue: 'स्थान / वेन्यू',
    eventDesc: 'दिशानिर्देश व निर्देश',
    isExamAlert: 'परीक्षा अनुसूची के रूप में चिह्नित करें',
    isHolidayAlert: 'कैंपस अवकाश के रूप में चिह्नित करें',
    publishEvent: 'कार्यक्रम शेड्यूल करें व प्रसारित करें',
    totalEvents: 'कुल निर्धारित कार्यक्रम',

    // Stats Bar
    statActiveResidents: 'सक्रिय छात्र निवासी',
    statTurnstileOut: 'कैंपस से बाहर गए छात्र',
    statOpenComplaints: 'सक्रिय मेंटेनेंस शिकायतें',
    statPendingApprovals: 'लंबित छात्र सत्यापन',
    statMonthlyDues: 'कुल मासिक बकाया राशि'
  }
};

export function getAdminTranslation(lang: AdminLanguage) {
  return adminTranslations[lang] || adminTranslations.en;
}
