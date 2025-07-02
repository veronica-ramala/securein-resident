export const translations = {
  en: {
    // Common
    common: {
      ok: 'OK',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      all: 'All',
    },
    
    // Profile Screen
    profile: {
      title: 'Profile',
      accountSettings: 'Account Settings',
      editProfile: 'Edit Profile',
      editProfileDesc: 'Update your personal information',
      language: 'Language',
      languageDesc: 'Current: {{language}}',
      notificationSettings: 'Notification Settings',
      notificationDesc: 'Customize notification preferences',
      helpSupport: 'Help & Support',
      helpSupportDesc: 'Get assistance with the app',
      logout: 'Log Out',
      memberSince: 'Member since 2022',
      version: 'Version 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: 'Language Changed',
      languageChangedDesc: 'Language has been changed to {{language}}. The app will restart to apply changes.',
      notificationsEnabled: 'Notifications enabled',
      notificationsDisabled: 'Notifications disabled',
      comingSoon: 'Coming soon!',
    },
    
    // Language Modal
    languageModal: {
      title: 'Select Language',
    },
    
    // Home Screen
    home: {
      title: 'Home',
      welcome: 'Welcome',
      dashboard: 'Dashboard',
    },
    
    // Login Screen
    login: {
      title: 'Login',
      email: 'Email',
      password: 'Password',
      loginButton: 'Login',
      forgotPassword: 'Forgot Password?',
      dontHaveAccount: "Don't have an account?",
      signUp: 'Sign Up',
    },
    
    // Navigation
    navigation: {
      home: 'Home',
      profile: 'Profile',
      settings: 'Settings',
      notifications: 'Notifications',
    },
    
    // Visitor Management
    visitor: {
      management: 'Visitor Management',
      addVisitor: 'Add Visitor',
      myVisitors: 'My Visitors',
      visitorName: 'Visitor Name',
      visitorPhone: 'Visitor Phone',
      purpose: 'Purpose of Visit',
      expectedTime: 'Expected Time',
      approve: 'Approve',
      reject: 'Reject',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      noVisitors: 'No visitors found',
    },
    
    // Emergency/SOS
    emergency: {
      sos: 'SOS',
      sosAlert: 'Send SOS Alert',
      emergency: 'Emergency',
      sendAlert: 'Send Alert',
      alertSent: 'Alert Sent',
      alertSentDesc: 'Emergency alert has been sent to security and community members',
      medical: 'Medical Emergency',
      fire: 'Fire Emergency',
      security: 'Security Issue',
      other: 'Other Emergency',
      police: 'Police',
      ambulance: 'Ambulance',
      societySecurity: 'Society Security',
      emergencyContacts: 'Emergency Contacts',
      societyContacts: 'Society Contacts',
      societyManager: 'Society Manager',
      maintenance: 'Maintenance',
      calling: 'Calling',
      guard: 'Guard',
    },
    
    // App Features
    features: {
      welcome: 'Welcome',
      dashboard: 'Dashboard',
      quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity',
      communityServices: 'Community Services',
      facilities: 'Facilities',
      announcements: 'Announcements',
      quoteOfTheDay: 'Quote of the Day',
      weatherReport: 'Weather Report',
      residentAlerts: 'Resident Alerts',
      communityApp: 'Community App',
      resident: 'Resident',
      goodMorning: 'Good Morning',
      goodAfternoon: 'Good Afternoon',
      goodEvening: 'Good Evening',
      notifications: 'Notifications',
    },
    
    // Weather
    weather: {
      sunny: 'Sunny',
      cloudy: 'Cloudy',
      rainy: 'Rainy',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      location: 'Hyderabad, India',
    },
    
    // Quick Actions
    quickActions: {
      gate: 'Gate',
      store: 'Store',
      facilities: 'Facilities',
      communityMap: 'Community Map',
    },
    
    // Alerts
    alerts: {
      waterShutdown: 'Water Shutdown',
      waterShutdownMsg: 'Scheduled maintenance on water pipes. No water from 10AM-2PM tomorrow.',
      newSecurityProtocol: 'New Security Protocol',
      newSecurityProtocolMsg: 'Please update your visitor list in the Gate section.',
      communityMeeting: 'Community Meeting',
      communityMeetingMsg: 'Annual residents meeting this Saturday at 11AM in the clubhouse.',
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      hoursAgo: '{{count}} hours ago',
      dayAgo: '{{count}} day ago',
      daysAgo: '{{count}} days ago',
    },
    
    // Services
    services: {
      title: 'Services',
      communityServices: 'Community Services',
      localConnect: 'Local Connect',
      localConnectDesc: 'Connect with neighbors and local community members',
      availableServices: 'Available Services',
      accessEssential: 'Access essential services and contacts',
      howToUse: 'How to Use',
      instruction1: '1. Tap on any contact card to call directly',
      instruction2: '2. Use Local Connect to engage with your community',
      instruction3: '3. For emergencies, call the appropriate number immediately',
      note: 'Note: All contacts are available 24/7. For immediate assistance, please use the appropriate contact above. In case of life-threatening situations, dial 911 immediately.',
    },
    
    // Navigation
    navigation: {
      home: 'Home',
      services: 'Services',
      buySell: 'Mutual Market',
      profile: 'Profile',
      settings: 'Settings',
      notifications: 'Notifications',
    },
    
    // Weather
    weather: {
      location: 'Hyderabad, India',
      sunny: 'Sunny',
      cloudy: 'Cloudy',
      rainy: 'Rainy',
      feels: 'Feels',
    },
    
    // Elder Monitoring
    elderMonitoring: {
      title: 'Elder Monitoring',
      suraaksha: 'Suraaksha',
      description: 'Suraaksha is a heart-placed wearable that acts as a silent guardian for your elderly parents—tracking vital signs with precision and sending alerts before problems arise. It\'s like placing a pocket-sized health companion at the center of their well-being, always watching, always ready.',
      keyFeatures: 'Key Features',
      heartRateMonitoring: 'Heart Rate Monitoring',
      heartRateDesc: 'Continuous heart rate tracking with real-time alerts for irregularities',
      vitalSignsTracking: 'Vital Signs Tracking',
      vitalSignsDesc: 'Monitor blood pressure, oxygen levels, and other critical health metrics',
      emergencyAlerts: 'Emergency Alerts',
      emergencyAlertsDesc: 'Instant notifications to family members and caregivers during emergencies',
      fallDetection: 'Fall Detection',
      fallDetectionDesc: 'Advanced sensors detect falls and automatically send help alerts',
    },
    
    // Events
    events: {
      title: 'Events',
      communityEvents: 'Community Events',
      upcomingEvents: 'Upcoming Events',
      pastEvents: 'Past Events',
      regularEvents: 'Regular Events',
      specialEvents: 'Special Events',
      eventDetails: 'Event Details',
      date: 'Date',
      time: 'Time',
      location: 'Location',
      description: 'Description',
      attendees: 'Attendees',
      rsvp: 'RSVP',
      attending: 'Attending',
      notAttending: 'Not Attending',
      maybe: 'Maybe',
      noEvents: 'No events scheduled',
      createEvent: 'Create Event',
      editEvent: 'Edit Event',
      deleteEvent: 'Delete Event',
      eventCreated: 'Event created successfully',
      eventUpdated: 'Event updated successfully',
      eventDeleted: 'Event deleted successfully',
      searchPlaceholder: 'Search events by title, location, or organizer...',
      noEventsFound: 'No events found matching your search.',
      interestedButton: "I'm Interested",
      organizedBy: 'by',
    },
    
    // Mutual Market
    buySell: {
      title: 'Mutual Market',
      marketplace: 'Community Marketplace',
      buyItems: 'Buy Items',
      sellItems: 'Sell Items',
      myListings: 'My Listings',
      categories: 'Categories',
      searchPlaceholder: 'Search items...',
      price: 'Price',
      condition: 'Condition',
      seller: 'Seller',
      buyer: 'Buyer',
      contact: 'Contact',
      description: 'Description',
      images: 'Images',
      postAd: 'Post Ad',
      editAd: 'Edit Ad',
      deleteAd: 'Delete Ad',
      markAsSold: 'Mark as Sold',
      sold: 'Sold',
      available: 'Available',
      new: 'New',
      used: 'Used',
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      electronics: 'Electronics',
      furniture: 'Furniture',
      clothing: 'Clothing',
      books: 'Books',
      sports: 'Sports',
      other: 'Other',
      noItems: 'No items found',
      contactSeller: 'Contact Seller',
      itemPosted: 'Item posted successfully',
      itemUpdated: 'Item updated successfully',
      itemDeleted: 'Item deleted successfully',
    },
  },
  
  hi: {
    // Common
    common: {
      ok: 'ठीक है',
      cancel: 'रद्द करें',
      save: 'सेव करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      back: 'वापस',
      next: 'आगे',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      warning: 'चेतावनी',
      info: 'जानकारी',
      all: 'सभी',
    },
    
    // Profile Screen
    profile: {
      title: 'प्रोफ़ाइल',
      accountSettings: 'खाता सेटिंग्स',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      editProfileDesc: 'अपनी व्यक्तिगत जानकारी अपडेट करें',
      language: 'भाषा',
      languageDesc: 'वर्तमान: {{language}}',
      notificationSettings: 'सूचना सेटिंग्स',
      notificationDesc: 'सूचना प्राथमिकताएं अनुकूलित करें',
      helpSupport: 'सहायता और समर्थन',
      helpSupportDesc: 'ऐप के साथ सहायता प्राप्त करें',
      logout: 'लॉग आउट',
      memberSince: '2022 से सदस्य',
      version: 'संस्करण 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: 'भाषा बदली गई',
      languageChangedDesc: 'भाषा {{language}} में बदल दी गई है। परिवर्तन लागू करने के लिए ऐप पुनः आरंभ होगा।',
      notificationsEnabled: 'सूचनाएं सक्षम',
      notificationsDisabled: 'सूचनाएं अक्षम',
      comingSoon: 'जल्द आ रहा है!',
    },
    
    // Language Modal
    languageModal: {
      title: 'भाषा चुनें',
    },
    
    // Home Screen
    home: {
      title: 'होम',
      welcome: 'स्वागत',
      dashboard: 'डैशबोर्ड',
    },
    
    // Login Screen
    login: {
      title: 'लॉगिन',
      email: 'ईमेल',
      password: 'पासवर्ड',
      loginButton: 'लॉगिन',
      forgotPassword: 'पासवर्ड भूल गए?',
      dontHaveAccount: 'खाता नहीं है?',
      signUp: 'साइन अप',
    },
    
    // Navigation
    navigation: {
      home: 'होम',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      notifications: 'सूचनाएं',
    },
    
    // Visitor Management
    visitor: {
      management: 'आगंतुक प्रबंधन',
      addVisitor: 'आगंतुक जोड़ें',
      myVisitors: 'मेरे आगंतुक',
      visitorName: 'आगंतुक का नाम',
      visitorPhone: 'आगंतुक का फोन',
      purpose: 'मिलने का उद्देश्य',
      expectedTime: 'अपेक्षित समय',
      approve: 'स्वीकृत करें',
      reject: 'अस्वीकार करें',
      pending: 'लंबित',
      approved: 'स्वीकृत',
      rejected: 'अस्वीकृत',
      noVisitors: 'कोई आगंतुक नहीं मिला',
    },
    
    // Emergency/SOS
    emergency: {
      sos: 'एसओएस',
      sosAlert: 'एसओएस अलर्ट भेजें',
      emergency: 'आपातकाल',
      sendAlert: 'अलर्ट भेजें',
      alertSent: 'अलर्ट भेजा गया',
      alertSentDesc: 'आपातकालीन अलर्ट सुरक्षा और समुदाय के सदस्यों को भेजा गया है',
      medical: 'चिकित्सा आपातकाल',
      fire: 'आग की आपातकाल',
      security: 'सुरक्षा समस्या',
      other: 'अन्य आपातकाल',
      police: 'पुलिस',
      ambulance: 'एम्बुलेंस',
      societySecurity: 'सोसाइटी सिक्योरिटी',
      emergencyContacts: 'आपातकालीन संपर्क',
      societyContacts: 'सोसाइटी संपर्क',
      societyManager: 'सोसाइटी मैनेजर',
      maintenance: 'रखरखाव',
      calling: 'कॉल कर रहे हैं',
      guard: 'गार्ड',
    },
    
    // App Features
    features: {
      welcome: 'स्वागत है',
      dashboard: 'डैशबोर्ड',
      quickActions: 'त्वरित कार्य',
      recentActivity: 'हाल की गतिविधि',
      communityServices: 'सामुदायिक सेवाएं',
      facilities: 'सुविधाएं',
      announcements: 'घोषणाएं',
      quoteOfTheDay: 'आज का विचार',
      weatherReport: 'मौसम रिपोर्ट',
      residentAlerts: 'निवासी अलर्ट',
      communityApp: 'कम्युनिटी ऐप',
      resident: 'निवासी',
      goodMorning: 'सुप्रभात',
      goodAfternoon: 'नमस्कार',
      goodEvening: 'शुभ संध्या',
      notifications: 'सूचनाएं',
    },
    
    // Weather
    weather: {
      sunny: 'धूप',
      cloudy: 'बादल',
      rainy: 'बारिश',
      temperature: 'तापमान',
      humidity: 'नमी',
      windSpeed: 'हवा की गति',
      location: 'हैदराबाद, भारत',
    },
    
    // Quick Actions
    quickActions: {
      gate: 'गेट',
      store: 'स्टोर',
      facilities: 'सुविधाएं',
      communityMap: 'कम्युनिटी मैप',
    },
    
    // Alerts
    alerts: {
      waterShutdown: 'पानी बंद',
      waterShutdownMsg: 'पानी की पाइप में रखरखाव का काम। कल सुबह 10 बजे से दोपहर 2 बजे तक पानी नहीं आएगा।',
      newSecurityProtocol: 'नया सुरक्षा प्रोटोकॉल',
      newSecurityProtocolMsg: 'कृपया गेट सेक्शन में अपनी विज़िटर लिस्ट अपडेट करें।',
      communityMeeting: 'कम्युनिटी मीटिंग',
      communityMeetingMsg: 'इस शनिवार सुबह 11 बजे क्लबहाउस में वार्षिक निवासी बैठक।',
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम',
      hoursAgo: '{{count}} घंटे पहले',
      dayAgo: '{{count}} दिन पहले',
      daysAgo: '{{count}} दिन पहले',
    },
    
    // Services
    services: {
      title: 'सेवाएं',
      communityServices: 'सामुदायिक सेवाएं',
      localConnect: 'लोकल कनेक्ट',
      localConnectDesc: 'पड़ोसियों और स्थानीय समुदाय के सदस्यों से जुड़ें',
      availableServices: 'उपलब्ध सेवाएं',
      accessEssential: 'आवश्यक सेवाओं और संपर्कों तक पहुंच',
      howToUse: 'उपयोग कैसे करें',
      instruction1: '1. सीधे कॉल करने के लिए किसी भी संपर्क कार्ड पर टैप करें',
      instruction2: '2. अपने समुदाय से जुड़ने के लिए लोकल कनेक्ट का उपयोग करें',
      instruction3: '3. आपातकाल के लिए, तुरंत उपयुक्त नंबर पर कॉल करें',
      note: 'नोट: सभी संपर्क 24/7 उपलब्ध हैं। तत्काल सहायता के लिए, कृपया ऊपर दिए गए उपयुक्त संपर्क का उपयोग करें। जीवन-घातक स्थितियों के मामले में, तुरंत 911 डायल करें।',
    },
    
    // Navigation
    navigation: {
      home: 'होम',
      services: 'सेवाएं',
      buySell: 'खरीदें और बेचें',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      notifications: 'सूचनाएं',
    },
    
    // Weather
    weather: {
      location: 'हैदराबाद, भारत',
      sunny: 'धूप',
      cloudy: 'बादल',
      rainy: 'बारिश',
      feels: 'महसूस',
    },
    
    // Elder Monitoring
    elderMonitoring: {
      title: 'बुजुर्ग निगरानी',
      suraaksha: 'सुरक्षा',
      description: 'सुरक्षा एक हृदय-स्थापित पहनने योग्य उपकरण है जो आपके बुजुर्ग माता-पिता के लिए एक मूक संरक्षक का काम करता है—सटीकता के साथ महत्वपूर्ण संकेतों को ट्रैक करता है और समस्याएं उत्पन्न होने से पहले अलर्ट भेजता है। यह उनकी भलाई के केंद्र में एक पॉकेट-साइज़ स्वास्थ्य साथी रखने जैसा है, हमेशा देखता रहता है, हमेशा तैयार रहता है।',
      keyFeatures: 'मुख्य विशेषताएं',
      heartRateMonitoring: 'हृदय गति निगरानी',
      heartRateDesc: 'अनियमितताओं के लिए रीयल-टाइम अलर्ट के साथ निरंतर हृदय गति ट्रैकिंग',
      vitalSignsTracking: 'महत्वपूर्ण संकेत ट्रैकिंग',
      vitalSignsDesc: 'रक्तचाप, ऑक्सीजन स्तर और अन्य महत्वपूर्ण स्वास्थ्य मेट्रिक्स की निगरानी करें',
      emergencyAlerts: 'आपातकालीन अलर्ट',
      emergencyAlertsDesc: 'आपातकाल के दौरान परिवार के सदस्यों और देखभाल करने वालों को तत्काल सूचनाएं',
      fallDetection: 'गिरावट का पता लगाना',
      fallDetectionDesc: 'उन्नत सेंसर गिरावट का पता लगाते हैं और स्वचालित रूप से सहायता अलर्ट भेजते हैं',
    },
    
    // Events
    events: {
      title: 'कार्यक्रम',
      communityEvents: 'सामुदायिक कार्यक्रम',
      upcomingEvents: 'आगामी कार्यक्रम',
      pastEvents: 'पिछले कार्यक्रम',
      regularEvents: 'नियमित कार्यक्रम',
      specialEvents: 'विशेष कार्यक्रम',
      eventDetails: 'कार्यक्रम विवरण',
      date: 'तारीख',
      time: 'समय',
      location: 'स्थान',
      description: 'विवरण',
      attendees: 'उपस्थित लोग',
      rsvp: 'आरएसवीपी',
      attending: 'उपस्थित होना',
      notAttending: 'उपस्थित नहीं होना',
      maybe: 'शायद',
      noEvents: 'कोई कार्यक्रम निर्धारित नहीं',
      createEvent: 'कार्यक्रम बनाएं',
      editEvent: 'कार्यक्रम संपादित करें',
      deleteEvent: 'कार्यक्रम हटाएं',
      eventCreated: 'कार्यक्रम सफलतापूर्वक बनाया गया',
      eventUpdated: 'कार्यक्रम सफलतापूर्वक अपडेट किया गया',
      eventDeleted: 'कार्यक्रम सफलतापूर्वक हटाया गया',
      searchPlaceholder: 'शीर्षक, स्थान या आयोजक द्वारा कार्यक्रम खोजें...',
      noEventsFound: 'आपकी खोज से मेल खाने वाले कोई कार्यक्रम नहीं मिले।',
      interestedButton: 'मुझे दिलचस्पी है',
      organizedBy: 'द्वारा',
    },
    
    // Mutual Market
    buySell: {
      title: 'पारस्परिक बाज़ार',
      marketplace: 'सामुदायिक बाज़ार',
      buyItems: 'वस्तुएं खरीदें',
      sellItems: 'वस्तुएं बेचें',
      myListings: 'मेरी सूचियां',
      categories: 'श्रेणियां',
      searchPlaceholder: 'वस्तुएं खोजें...',
      price: 'कीमत',
      condition: 'स्थिति',
      seller: 'विक्रेता',
      buyer: 'खरीदार',
      contact: 'संपर्क',
      description: 'विवरण',
      images: 'चित्र',
      postAd: 'विज्ञापन पोस्ट करें',
      editAd: 'विज्ञापन संपादित करें',
      deleteAd: 'विज्ञापन हटाएं',
      markAsSold: 'बेचा गया के रूप में चिह्नित करें',
      sold: 'बेचा गया',
      available: 'उपलब्ध',
      new: 'नया',
      used: 'इस्तेमाल किया गया',
      excellent: 'उत्कृष्ट',
      good: 'अच्छा',
      fair: 'ठीक',
      electronics: 'इलेक्ट्रॉनिक्स',
      furniture: 'फर्नीचर',
      clothing: 'कपड़े',
      books: 'किताबें',
      sports: 'खेल',
      other: 'अन्य',
      noItems: 'कोई वस्तु नहीं मिली',
      contactSeller: 'विक्रेता से संपर्क करें',
      itemPosted: 'वस्तु सफलतापूर्वक पोस्ट की गई',
      itemUpdated: 'वस्तु सफलतापूर्वक अपडेट की गई',
      itemDeleted: 'वस्तु सफलतापूर्वक हटाई गई',
    },
  },
  
  te: {
    // Common
    common: {
      ok: 'సరే',
      cancel: 'రద్దు చేయి',
      save: 'సేవ్ చేయి',
      delete: 'తొలగించు',
      edit: 'సవరించు',
      back: 'వెనుకకు',
      next: 'తదుపరి',
      loading: 'లోడ్ అవుతోంది...',
      error: 'లోపం',
      success: 'విజయం',
      warning: 'హెచ్చరిక',
      info: 'సమాచారం',
      all: 'అన్నీ',
    },
    
    // Profile Screen
    profile: {
      title: 'ప్రొఫైల్',
      accountSettings: 'ఖాతా సెట్టింగ్‌లు',
      editProfile: 'ప్రొఫైల్ సవరించు',
      editProfileDesc: 'మీ వ్యక్తిగత సమాచారాన్ని అప్‌డేట్ చేయండి',
      language: 'భాష',
      languageDesc: 'ప్రస్తుత: {{language}}',
      notificationSettings: 'నోటిఫికేషన్ సెట్టింగ్‌లు',
      notificationDesc: 'నోటిఫికేషన్ ప్రాధాన్యతలను అనుకూలీకరించండి',
      helpSupport: 'సహాయం & మద్దతు',
      helpSupportDesc: 'యాప్‌తో సహాయం పొందండి',
      logout: 'లాగ్ అవుట్',
      memberSince: '2022 నుండి సభ్యుడు',
      version: 'వెర్షన్ 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: 'భాష మార్చబడింది',
      languageChangedDesc: 'భాష {{language}}కి మార్చబడింది. మార్పులను వర్తింపజేయడానికి యాప్ పునఃప్రారంభమవుతుంది.',
      notificationsEnabled: 'నోటిఫికేషన్‌లు ప్రారంభించబడ్డాయి',
      notificationsDisabled: 'నోటిఫికేషన్‌లు నిలిపివేయబడ్డాయి',
      comingSoon: 'త్వరలో వస్తోంది!',
    },
    
    // Language Modal
    languageModal: {
      title: 'భాష ఎంచుకోండి',
    },
    
    // Home Screen
    home: {
      title: 'హోమ్',
      welcome: 'స్వాగతం',
      dashboard: 'డ్యాష్‌బోర్డ్',
    },
    
    // Login Screen
    login: {
      title: 'లాగిన్',
      email: 'ఇమెయిల్',
      password: 'పాస్‌వర్డ్',
      loginButton: 'లాగిన్',
      forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
      dontHaveAccount: 'ఖాతా లేదా?',
      signUp: 'సైన్ అప్',
    },
    
    // Emergency/SOS
    emergency: {
      sos: 'SOS',
      sosAlert: 'SOS అలర్ట్ పంపండి',
      emergency: 'అత్యవసరం',
      sendAlert: 'అలర్ట్ పంపండి',
      alertSent: 'అలర్ట్ పంపబడింది',
      alertSentDesc: 'అత్యవసర అలర్ట్ భద్రత మరియు కమ్యూనిటీ సభ్యులకు పంపబడింది',
      medical: 'వైద్య అత్యవసరం',
      fire: 'అగ్ని అత్యవసరం',
      security: 'భద్రతా సమస్య',
      other: 'ఇతర అత్యవసరం',
      police: 'పోలీసు',
      ambulance: 'అంబులెన్స్',
      societySecurity: 'సొసైటీ సెక్యూరిటీ',
      emergencyContacts: 'అత్యవసర సంపర్కాలు',
      societyContacts: 'సొసైటీ సంపర్కాలు',
      societyManager: 'సొసైటీ మేనేజర్',
      maintenance: 'నిర్వహణ',
      calling: 'కాల్ చేస్తున్నాం',
      guard: 'గార్డ్',
    },
    
    // Services
    services: {
      title: 'సేవలు',
      communityServices: 'కమ్యూనిటీ సేవలు',
      localConnect: 'లోకల్ కనెక్ట్',
      localConnectDesc: 'పొరుగువారు మరియు స్థానిక కమ్యూనిటీ సభ్యులతో కనెక్ట్ అవ్వండి',
      availableServices: 'అందుబాటులో ఉన్న సేవలు',
      accessEssential: 'అవసరమైన సేవలు మరియు సంపర్కాలను యాక్సెస్ చేయండి',
      howToUse: 'ఎలా ఉపయోగించాలి',
      instruction1: '1. నేరుగా కాల్ చేయడానికి ఏదైనా సంపర్క కార్డ్‌పై ట్యాప్ చేయండి',
      instruction2: '2. మీ కమ్యూనిటీతో నిమగ్నం కావడానికి లోకల్ కనెక్ట్‌ను ఉపయోగించండి',
      instruction3: '3. అత్యవసర పరిస్థితుల కోసం, వెంటనే తగిన నంబర్‌కు కాల్ చేయండి',
      note: 'గమనిక: అన్ని సంపర్కాలు 24/7 అందుబాటులో ఉన్నాయి. తక్షణ సహాయం కోసం, దయచేసి పైన ఉన్న తగిన సంపర్కాన్ని ఉపయోగించండి. ప్రాణాంతక పరిస్థితుల విషయంలో, వెంటనే 911కి డయల్ చేయండి.',
    },
    
    // Navigation
    navigation: {
      home: 'హోమ్',
      services: 'సేవలు',
      buySell: 'కొనండి & అమ్మండి',
      profile: 'ప్రొఫైల్',
      settings: 'సెట్టింగ్‌లు',
      notifications: 'నోటిఫికేషన్‌లు',
    },
    
    // Weather
    weather: {
      location: 'హైదరాబాద్, భారతదేశం',
      sunny: 'ఎండ',
      cloudy: 'మేఘాలు',
      rainy: 'వర్షం',
      feels: 'అనుభవం',
    },
    
    // Quick Actions
    quickActions: {
      gate: 'గేట్',
      store: 'స్టోర్',
      facilities: 'సౌకర్యాలు',
      communityMap: 'కమ్యూనిటీ మ్యాప్',
    },
    
    // Alerts
    alerts: {
      waterShutdown: 'నీటి సరఫరా నిలిపివేత',
      waterShutdownMsg: 'రేపు ఉదయం 10 గంటల నుండి మధ్యాహ్నం 2 గంటల వరకు నీటి సరఫరా నిలిపివేయబడుతుంది',
      newSecurityProtocol: 'కొత్త భద్రతా ప్రోటోకాల్',
      newSecurityProtocolMsg: 'అన్ని సందర్శకులు ఇప్పుడు గేట్ వద్ద ID ప్రూఫ్ చూపాలి',
      communityMeeting: 'కమ్యూనిటీ మీటింగ్',
      communityMeetingMsg: 'ఈ శనివారం ఉదయం 11 గంటలకు క్లబ్‌హౌస్‌లో వార్షిక నివాసుల సమావేశం',
      high: 'అధిక',
      medium: 'మధ్యమ',
      low: 'తక్కువ',
      hoursAgo: '{{count}} గంటల క్రితం',
      dayAgo: '{{count}} రోజు క్రితం',
      daysAgo: '{{count}} రోజుల క్రితం',
    },
    
    // App Features
    features: {
      goodMorning: 'శుభోదయం',
      goodAfternoon: 'శుభ మధ్యాహ్నం',
      goodEvening: 'శుభ సాయంత్రం',
      notifications: 'నోటిఫికేషన్లు',
      resident: 'నివాసి',
      quickActions: 'త్వరిత చర్యలు',
      residentAlerts: 'నివాసుల హెచ్చరికలు',
      recentActivity: 'ఇటీవలి కార్యకలాపాలు',
      quoteOfTheDay: 'రోజు కోట్',
      weatherReport: 'వాతావరణ నివేదిక',
    },
    
    // Weather
    weather: {
      location: 'హైదరాబాద్, భారతదేశం',
      sunny: 'ఎండ',
      cloudy: 'మేఘాలు',
      rainy: 'వర్షం',
      feels: 'అనుభవం',
    },
    
    // Elder Monitoring
    elderMonitoring: {
      title: 'వృద్ధుల పర్యవేక్షణ',
      suraaksha: 'సురక్ష',
      description: 'సురక్ష అనేది మీ వృద్ధ తల్లిదండ్రుల కోసం నిశ్శబ్ద సంరక్షకుడిగా పనిచేసే హృదయ-స్థాపిత ధరించగలిగే పరికరం—కీలక సంకేతాలను ఖచ్చితత్వంతో ట్రాక్ చేస్తుంది మరియు సమస్యలు తలెత్తే ముందు హెచ్చరికలను పంపుతుంది. ఇది వారి శ్రేయస్సు కేంద్రంలో పాకెట్-సైజ్ ఆరోగ్య సహచరుడిని ఉంచడం లాంటిది, ఎల్లప్పుడూ చూస్తూ, ఎల్లప్పుడూ సిద్ధంగా ఉంటుంది.',
      keyFeatures: 'ముఖ్య లక్షణాలు',
      heartRateMonitoring: 'హృదయ స్పందన పర్యవేక్షణ',
      heartRateDesc: 'అసమానతల కోసం రియల్-టైమ్ హెచ్చరికలతో నిరంతర హృదయ స్పందన ట్రాకింగ్',
      vitalSignsTracking: 'కీలక సంకేతాల ట్రాకింగ్',
      vitalSignsDesc: 'రక్తపోటు, ఆక్సిజన్ స్థాయిలు మరియు ఇతర కీలక ఆరోగ్య మెట్రిక్‌లను పర్యవేక్షించండి',
      emergencyAlerts: 'అత్యవసర హెచ్చరికలు',
      emergencyAlertsDesc: 'అత్యవసర పరిస్థితుల్లో కుటుంబ సభ్యులు మరియు సంరక్షకులకు తక్షణ నోటిఫికేషన్‌లు',
      fallDetection: 'పతన గుర్తింపు',
      fallDetectionDesc: 'అధునాతన సెన్సార్లు పతనాలను గుర్తించి స్వయంచాలకంగా సహాయ హెచ్చరికలను పంపుతాయి',
    },
    
    // Events
    events: {
      title: 'కార్యక్రమాలు',
      communityEvents: 'కమ్యూనిటీ కార్యక్రమాలు',
      upcomingEvents: 'రాబోయే కార్యక్రమాలు',
      pastEvents: 'గత కార్యక్రమాలు',
      regularEvents: 'సాధారణ కార్యక్రమాలు',
      specialEvents: 'ప్రత్యేక కార్యక్రమాలు',
      eventDetails: 'కార్యక్రమ వివరాలు',
      date: 'తేదీ',
      time: 'సమయం',
      location: 'స్థానం',
      description: 'వివరణ',
      attendees: 'హాజరైనవారు',
      rsvp: 'ఆర్‌ఎస్‌వీపీ',
      attending: 'హాజరవుతున్నారు',
      notAttending: 'హాజరవడం లేదు',
      maybe: 'బహుశా',
      noEvents: 'ఎటువంటి కార్యక్రమాలు షెడ్యూల్ చేయబడలేదు',
      createEvent: 'కార్యక్రమం సృష్టించండి',
      editEvent: 'కార్యక్రమం సవరించండి',
      deleteEvent: 'కార్యక్రమం తొలగించండి',
      eventCreated: 'కార్యక్రమం విజయవంతంగా సృష్టించబడింది',
      eventUpdated: 'కార్యక్రమం విజయవంతంగా అప్‌డేట్ చేయబడింది',
      eventDeleted: 'కార్యక్రమం విజయవంతంగా తొలగించబడింది',
      searchPlaceholder: 'శీర్షిక, స్థానం లేదా నిర్వాహకుడి ద్వారా కార్యక్రమాలను వెతకండి...',
      noEventsFound: 'మీ శోధనకు సరిపోలే కార్యక్రమాలు కనుగొనబడలేదు.',
      interestedButton: 'నాకు ఆసక్తి ఉంది',
      organizedBy: 'ద్వారా',
    },
    
    // Mutual Market
    buySell: {
      title: 'పరస్పర మార్కెట్',
      marketplace: 'కమ్యూనిటీ మార్కెట్‌ప్లేస్',
      buyItems: 'వస్తువులు కొనుగోలు చేయండి',
      sellItems: 'వస్తువులు అమ్మండి',
      myListings: 'నా జాబితాలు',
      categories: 'వర్గాలు',
      searchPlaceholder: 'వస్తువులను వెతకండి...',
      price: 'ధర',
      condition: 'పరిస్థితి',
      seller: 'అమ్మకందారు',
      buyer: 'కొనుగోలుదారు',
      contact: 'సంప్రదించండి',
      description: 'వివరణ',
      images: 'చిత్రాలు',
      postAd: 'ప్రకటన పోస్ట్ చేయండి',
      editAd: 'ప్రకటన సవరించండి',
      deleteAd: 'ప్రకటన తొలగించండి',
      markAsSold: 'అమ్మబడినట్లు గుర్తించండి',
      sold: 'అమ్మబడింది',
      available: 'అందుబాటులో ఉంది',
      new: 'కొత్త',
      used: 'ఉపయోగించిన',
      excellent: 'అద్భుతమైన',
      good: 'మంచి',
      fair: 'సరైన',
      electronics: 'ఎలక్ట్రానిక్స్',
      furniture: 'ఫర్నిచర్',
      clothing: 'దుస్తులు',
      books: 'పుస్తకాలు',
      sports: 'క్రీడలు',
      other: 'ఇతర',
      noItems: 'ఎటువంటి వస్తువులు కనుగొనబడలేదు',
      contactSeller: 'అమ్మకందారుని సంప్రదించండి',
      itemPosted: 'వస్తువు విజయవంతంగా పోస్ట్ చేయబడింది',
      itemUpdated: 'వస్తువు విజయవంతంగా అప్‌డేట్ చేయబడింది',
      itemDeleted: 'వస్తువు విజయవంతంగా తొలగించబడింది',
    },
  },
  
  es: {
    // Common
    common: {
      ok: 'OK',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Atrás',
      next: 'Siguiente',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      warning: 'Advertencia',
      info: 'Información',
      all: 'Todos',
    },
    
    // Profile Screen
    profile: {
      title: 'Perfil',
      accountSettings: 'Configuración de Cuenta',
      editProfile: 'Editar Perfil',
      editProfileDesc: 'Actualiza tu información personal',
      language: 'Idioma',
      languageDesc: 'Actual: {{language}}',
      notificationSettings: 'Configuración de Notificaciones',
      notificationDesc: 'Personaliza las preferencias de notificación',
      helpSupport: 'Ayuda y Soporte',
      helpSupportDesc: 'Obtén asistencia con la aplicación',
      logout: 'Cerrar Sesión',
      memberSince: 'Miembro desde 2022',
      version: 'Versión 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: 'Idioma Cambiado',
      languageChangedDesc: 'El idioma ha sido cambiado a {{language}}. La aplicación se reiniciará para aplicar los cambios.',
      notificationsEnabled: 'Notificaciones habilitadas',
      notificationsDisabled: 'Notificaciones deshabilitadas',
      comingSoon: '¡Próximamente!',
    },
    
    // Language Modal
    languageModal: {
      title: 'Seleccionar Idioma',
    },
    
    // Home Screen
    home: {
      title: 'Inicio',
      welcome: 'Bienvenido',
      dashboard: 'Panel',
    },
    
    // Login Screen
    login: {
      title: 'Iniciar Sesión',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      loginButton: 'Iniciar Sesión',
      forgotPassword: '¿Olvidaste tu contraseña?',
      dontHaveAccount: '¿No tienes una cuenta?',
      signUp: 'Registrarse',
    },
    
    // Emergency/SOS
    emergency: {
      sos: 'SOS',
      sosAlert: 'Enviar Alerta SOS',
      emergency: 'Emergencia',
      sendAlert: 'Enviar Alerta',
      alertSent: 'Alerta Enviada',
      alertSentDesc: 'La alerta de emergencia ha sido enviada a seguridad y miembros de la comunidad',
      medical: 'Emergencia Médica',
      fire: 'Emergencia de Incendio',
      security: 'Problema de Seguridad',
      other: 'Otra Emergencia',
      police: 'Policía',
      ambulance: 'Ambulancia',
      societySecurity: 'Seguridad de la Sociedad',
      emergencyContacts: 'Contactos de Emergencia',
      societyContacts: 'Contactos de la Sociedad',
      societyManager: 'Gerente de la Sociedad',
      maintenance: 'Mantenimiento',
      calling: 'Llamando',
      guard: 'Guardia',
    },
    
    // Services
    services: {
      title: 'Servicios',
      communityServices: 'Servicios Comunitarios',
      localConnect: 'Conexión Local',
      localConnectDesc: 'Conéctate con vecinos y miembros de la comunidad local',
      availableServices: 'Servicios Disponibles',
      accessEssential: 'Accede a servicios esenciales y contactos',
      howToUse: 'Cómo Usar',
      instruction1: '1. Toca cualquier tarjeta de contacto para llamar directamente',
      instruction2: '2. Usa Conexión Local para interactuar con tu comunidad',
      instruction3: '3. Para emergencias, llama inmediatamente al número apropiado',
      note: 'Nota: Todos los contactos están disponibles 24/7. Para asistencia inmediata, por favor usa el contacto apropiado arriba. En caso de situaciones que amenacen la vida, marca 911 inmediatamente.',
    },
    
    // Navigation
    navigation: {
      home: 'Inicio',
      services: 'Servicios',
      buySell: 'Comprar y Vender',
      profile: 'Perfil',
      settings: 'Configuración',
      notifications: 'Notificaciones',
    },
    
    // Weather
    weather: {
      location: 'Hyderabad, India',
      sunny: 'Soleado',
      cloudy: 'Nublado',
      rainy: 'Lluvioso',
      feels: 'Se siente',
    },
    
    // Quick Actions
    quickActions: {
      gate: 'Puerta',
      store: 'Tienda',
      facilities: 'Instalaciones',
      communityMap: 'Mapa Comunitario',
    },
    
    // Alerts
    alerts: {
      waterShutdown: 'Corte de Agua',
      waterShutdownMsg: 'El suministro de agua se cortará mañana de 10 AM a 2 PM',
      newSecurityProtocol: 'Nuevo Protocolo de Seguridad',
      newSecurityProtocolMsg: 'Todos los visitantes ahora deben mostrar identificación en la puerta',
      communityMeeting: 'Reunión Comunitaria',
      communityMeetingMsg: 'Reunión anual de residentes este sábado a las 11 AM en el club',
      high: 'Alto',
      medium: 'Medio',
      low: 'Bajo',
      hoursAgo: 'hace {{count}} horas',
      dayAgo: 'hace {{count}} día',
      daysAgo: 'hace {{count}} días',
    },
    
    // App Features
    features: {
      goodMorning: 'Buenos días',
      goodAfternoon: 'Buenas tardes',
      goodEvening: 'Buenas noches',
      notifications: 'Notificaciones',
      resident: 'Residente',
      quickActions: 'Acciones Rápidas',
      residentAlerts: 'Alertas de Residentes',
      recentActivity: 'Actividad Reciente',
      quoteOfTheDay: 'Cita del Día',
      weatherReport: 'Reporte del Tiempo',
    },
    
    // Events
    events: {
      title: 'Eventos',
      communityEvents: 'Eventos Comunitarios',
      upcomingEvents: 'Próximos Eventos',
      pastEvents: 'Eventos Pasados',
      regularEvents: 'Eventos Regulares',
      specialEvents: 'Eventos Especiales',
      eventDetails: 'Detalles del Evento',
      date: 'Fecha',
      time: 'Hora',
      location: 'Ubicación',
      description: 'Descripción',
      attendees: 'Asistentes',
      rsvp: 'RSVP',
      attending: 'Asistiendo',
      notAttending: 'No Asistiendo',
      maybe: 'Tal vez',
      noEvents: 'No hay eventos programados',
      createEvent: 'Crear Evento',
      editEvent: 'Editar Evento',
      deleteEvent: 'Eliminar Evento',
      eventCreated: 'Evento creado exitosamente',
      eventUpdated: 'Evento actualizado exitosamente',
      eventDeleted: 'Evento eliminado exitosamente',
      searchPlaceholder: 'Buscar eventos por título, ubicación u organizador...',
      noEventsFound: 'No se encontraron eventos que coincidan con tu búsqueda.',
      interestedButton: 'Me Interesa',
      organizedBy: 'por',
    },
    
    // Mutual Market
    buySell: {
      title: 'Mercado Mutuo',
      marketplace: 'Mercado Comunitario',
      buyItems: 'Comprar Artículos',
      sellItems: 'Vender Artículos',
      myListings: 'Mis Anuncios',
      categories: 'Categorías',
      searchPlaceholder: 'Buscar artículos...',
      price: 'Precio',
      condition: 'Condición',
      seller: 'Vendedor',
      buyer: 'Comprador',
      contact: 'Contacto',
      description: 'Descripción',
      images: 'Imágenes',
      postAd: 'Publicar Anuncio',
      editAd: 'Editar Anuncio',
      deleteAd: 'Eliminar Anuncio',
      markAsSold: 'Marcar como Vendido',
      sold: 'Vendido',
      available: 'Disponible',
      new: 'Nuevo',
      used: 'Usado',
      excellent: 'Excelente',
      good: 'Bueno',
      fair: 'Regular',
      electronics: 'Electrónicos',
      furniture: 'Muebles',
      clothing: 'Ropa',
      books: 'Libros',
      sports: 'Deportes',
      other: 'Otro',
      noItems: 'No se encontraron artículos',
      contactSeller: 'Contactar Vendedor',
      itemPosted: 'Artículo publicado exitosamente',
      itemUpdated: 'Artículo actualizado exitosamente',
      itemDeleted: 'Artículo eliminado exitosamente',
    },
    
    // Elder Monitoring
    elderMonitoring: {
      title: 'Monitoreo de Ancianos',
      suraaksha: 'Suraaksha',
      description: 'Suraaksha es un dispositivo portátil centrado en el corazón que actúa como un guardián silencioso para sus padres ancianos, rastreando signos vitales con precisión y enviando alertas antes de que surjan problemas. Es como tener un compañero de salud de tamaño de bolsillo en el centro de su bienestar, siempre vigilando, siempre listo.',
      keyFeatures: 'Características Clave',
      heartRateMonitoring: 'Monitoreo de Frecuencia Cardíaca',
      heartRateDesc: 'Seguimiento continuo de la frecuencia cardíaca con alertas en tiempo real para irregularidades',
      vitalSignsTracking: 'Seguimiento de Signos Vitales',
      vitalSignsDesc: 'Monitorear presión arterial, niveles de oxígeno y otras métricas de salud críticas',
      emergencyAlerts: 'Alertas de Emergencia',
      emergencyAlertsDesc: 'Notificaciones instantáneas a familiares y cuidadores durante emergencias',
      fallDetection: 'Detección de Caídas',
      fallDetectionDesc: 'Sensores avanzados detectan caídas y envían automáticamente alertas de ayuda',
    },
  },
  
  fr: {
    // Common
    common: {
      ok: 'OK',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      back: 'Retour',
      next: 'Suivant',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      warning: 'Avertissement',
      info: 'Information',
      all: 'Tous',
    },
    
    // Profile Screen
    profile: {
      title: 'Profil',
      accountSettings: 'Paramètres du Compte',
      editProfile: 'Modifier le Profil',
      editProfileDesc: 'Mettez à jour vos informations personnelles',
      language: 'Langue',
      languageDesc: 'Actuel: {{language}}',
      notificationSettings: 'Paramètres de Notification',
      notificationDesc: 'Personnalisez les préférences de notification',
      helpSupport: 'Aide et Support',
      helpSupportDesc: 'Obtenez de l\'aide avec l\'application',
      logout: 'Se Déconnecter',
      memberSince: 'Membre depuis 2022',
      version: 'Version 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: 'Langue Modifiée',
      languageChangedDesc: 'La langue a été changée en {{language}}. L\'application va redémarrer pour appliquer les changements.',
      notificationsEnabled: 'Notifications activées',
      notificationsDisabled: 'Notifications désactivées',
      comingSoon: 'Bientôt disponible!',
    },
    
    // Language Modal
    languageModal: {
      title: 'Sélectionner la Langue',
    },
    
    // Home Screen
    home: {
      title: 'Accueil',
      welcome: 'Bienvenue',
      dashboard: 'Tableau de Bord',
    },
    
    // Login Screen
    login: {
      title: 'Connexion',
      email: 'Email',
      password: 'Mot de Passe',
      loginButton: 'Se Connecter',
      forgotPassword: 'Mot de passe oublié?',
      dontHaveAccount: 'Vous n\'avez pas de compte?',
      signUp: 'S\'inscrire',
    },
    
    // Emergency/SOS
    emergency: {
      sos: 'SOS',
      sosAlert: 'Envoyer Alerte SOS',
      emergency: 'Urgence',
      sendAlert: 'Envoyer Alerte',
      alertSent: 'Alerte Envoyée',
      alertSentDesc: 'L\'alerte d\'urgence a été envoyée à la sécurité et aux membres de la communauté',
      medical: 'Urgence Médicale',
      fire: 'Urgence Incendie',
      security: 'Problème de Sécurité',
      other: 'Autre Urgence',
      police: 'Police',
      ambulance: 'Ambulance',
      societySecurity: 'Sécurité de la Société',
      emergencyContacts: 'Contacts d\'Urgence',
      societyContacts: 'Contacts de la Société',
      societyManager: 'Gestionnaire de la Société',
      maintenance: 'Maintenance',
      calling: 'Appel en cours',
      guard: 'Garde',
    },
    
    // Services
    services: {
      title: 'Services',
      communityServices: 'Services Communautaires',
      localConnect: 'Connexion Locale',
      localConnectDesc: 'Connectez-vous avec les voisins et les membres de la communauté locale',
      availableServices: 'Services Disponibles',
      accessEssential: 'Accédez aux services essentiels et aux contacts',
      howToUse: 'Comment Utiliser',
      instruction1: '1. Appuyez sur n\'importe quelle carte de contact pour appeler directement',
      instruction2: '2. Utilisez Connexion Locale pour interagir avec votre communauté',
      instruction3: '3. Pour les urgences, appelez immédiatement le numéro approprié',
      note: 'Note: Tous les contacts sont disponibles 24h/24 et 7j/7. Pour une assistance immédiate, veuillez utiliser le contact approprié ci-dessus. En cas de situations mettant la vie en danger, composez le 911 immédiatement.',
    },
    
    // Navigation
    navigation: {
      home: 'Accueil',
      services: 'Services',
      buySell: 'Acheter et Vendre',
      profile: 'Profil',
      settings: 'Paramètres',
      notifications: 'Notifications',
    },
    
    // Weather
    weather: {
      location: 'Hyderabad, Inde',
      sunny: 'Ensoleillé',
      cloudy: 'Nuageux',
      rainy: 'Pluvieux',
      feels: 'Ressenti',
    },
    
    // Quick Actions
    quickActions: {
      gate: 'Portail',
      store: 'Magasin',
      facilities: 'Installations',
      communityMap: 'Carte Communautaire',
    },
    
    // Alerts
    alerts: {
      waterShutdown: 'Coupure d\'Eau',
      waterShutdownMsg: 'L\'approvisionnement en eau sera coupé demain de 10h à 14h',
      newSecurityProtocol: 'Nouveau Protocole de Sécurité',
      newSecurityProtocolMsg: 'Tous les visiteurs doivent maintenant montrer une pièce d\'identité à la porte',
      communityMeeting: 'Réunion Communautaire',
      communityMeetingMsg: 'Réunion annuelle des résidents ce samedi à 11h au club',
      high: 'Élevé',
      medium: 'Moyen',
      low: 'Faible',
      hoursAgo: 'il y a {{count}} heures',
      dayAgo: 'il y a {{count}} jour',
      daysAgo: 'il y a {{count}} jours',
    },
    
    // App Features
    features: {
      goodMorning: 'Bonjour',
      goodAfternoon: 'Bon après-midi',
      goodEvening: 'Bonsoir',
      notifications: 'Notifications',
      resident: 'Résident',
      quickActions: 'Actions Rapides',
      residentAlerts: 'Alertes Résidents',
      recentActivity: 'Activité Récente',
      quoteOfTheDay: 'Citation du Jour',
      weatherReport: 'Rapport Météo',
    },
    
    // Events
    events: {
      title: 'Événements',
      communityEvents: 'Événements Communautaires',
      upcomingEvents: 'Événements à Venir',
      pastEvents: 'Événements Passés',
      regularEvents: 'Événements Réguliers',
      specialEvents: 'Événements Spéciaux',
      eventDetails: 'Détails de l\'Événement',
      date: 'Date',
      time: 'Heure',
      location: 'Lieu',
      description: 'Description',
      attendees: 'Participants',
      rsvp: 'RSVP',
      attending: 'Participant',
      notAttending: 'Ne Participe Pas',
      maybe: 'Peut-être',
      noEvents: 'Aucun événement programmé',
      createEvent: 'Créer un Événement',
      editEvent: 'Modifier l\'Événement',
      deleteEvent: 'Supprimer l\'Événement',
      eventCreated: 'Événement créé avec succès',
      eventUpdated: 'Événement mis à jour avec succès',
      eventDeleted: 'Événement supprimé avec succès',
      searchPlaceholder: 'Rechercher des événements par titre, lieu ou organisateur...',
      noEventsFound: 'Aucun événement trouvé correspondant à votre recherche.',
      interestedButton: 'Je suis Intéressé',
      organizedBy: 'par',
    },
    
    // Mutual Market
    buySell: {
      title: 'Marché Mutuel',
      marketplace: 'Marché Communautaire',
      buyItems: 'Acheter des Articles',
      sellItems: 'Vendre des Articles',
      myListings: 'Mes Annonces',
      categories: 'Catégories',
      searchPlaceholder: 'Rechercher des articles...',
      price: 'Prix',
      condition: 'État',
      seller: 'Vendeur',
      buyer: 'Acheteur',
      contact: 'Contact',
      description: 'Description',
      images: 'Images',
      postAd: 'Publier une Annonce',
      editAd: 'Modifier l\'Annonce',
      deleteAd: 'Supprimer l\'Annonce',
      markAsSold: 'Marquer comme Vendu',
      sold: 'Vendu',
      available: 'Disponible',
      new: 'Neuf',
      used: 'Utilisé',
      excellent: 'Excellent',
      good: 'Bon',
      fair: 'Correct',
      electronics: 'Électronique',
      furniture: 'Meubles',
      clothing: 'Vêtements',
      books: 'Livres',
      sports: 'Sports',
      other: 'Autre',
      noItems: 'Aucun article trouvé',
      contactSeller: 'Contacter le Vendeur',
      itemPosted: 'Article publié avec succès',
      itemUpdated: 'Article mis à jour avec succès',
      itemDeleted: 'Article supprimé avec succès',
    },
    
    // Elder Monitoring
    elderMonitoring: {
      title: 'Surveillance des Aînés',
      suraaksha: 'Suraaksha',
      description: 'Suraaksha est un dispositif portable centré sur le cœur qui agit comme un gardien silencieux pour vos parents âgés, suivant les signes vitaux avec précision et envoyant des alertes avant que les problèmes ne surviennent. C\'est comme avoir un compagnon de santé de la taille d\'une poche au centre de leur bien-être, toujours vigilant, toujours prêt.',
      keyFeatures: 'Caractéristiques Clés',
      heartRateMonitoring: 'Surveillance du Rythme Cardiaque',
      heartRateDesc: 'Suivi continu du rythme cardiaque avec alertes en temps réel pour les irrégularités',
      vitalSignsTracking: 'Suivi des Signes Vitaux',
      vitalSignsDesc: 'Surveiller la pression artérielle, les niveaux d\'oxygène et autres métriques de santé critiques',
      emergencyAlerts: 'Alertes d\'Urgence',
      emergencyAlertsDesc: 'Notifications instantanées aux membres de la famille et aux soignants pendant les urgences',
      fallDetection: 'Détection de Chute',
      fallDetectionDesc: 'Des capteurs avancés détectent les chutes et envoient automatiquement des alertes d\'aide',
    },
  },
  
  de: {
    // Common
    common: {
      ok: 'OK',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      back: 'Zurück',
      next: 'Weiter',
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      warning: 'Warnung',
      info: 'Information',
      all: 'Alle',
    },
    
    // Profile Screen
    profile: {
      title: 'Profil',
      accountSettings: 'Kontoeinstellungen',
      editProfile: 'Profil Bearbeiten',
      editProfileDesc: 'Aktualisieren Sie Ihre persönlichen Informationen',
      language: 'Sprache',
      languageDesc: 'Aktuell: {{language}}',
      notificationSettings: 'Benachrichtigungseinstellungen',
      notificationDesc: 'Benachrichtigungseinstellungen anpassen',
      helpSupport: 'Hilfe & Support',
      helpSupportDesc: 'Hilfe zur App erhalten',
      logout: 'Abmelden',
      memberSince: 'Mitglied seit 2022',
      version: 'Version 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: 'Sprache Geändert',
      languageChangedDesc: 'Die Sprache wurde auf {{language}} geändert. Die App wird neu gestartet, um die Änderungen anzuwenden.',
      notificationsEnabled: 'Benachrichtigungen aktiviert',
      notificationsDisabled: 'Benachrichtigungen deaktiviert',
      comingSoon: 'Demnächst verfügbar!',
    },
    
    // Language Modal
    languageModal: {
      title: 'Sprache Auswählen',
    },
    
    // Home Screen
    home: {
      title: 'Startseite',
      welcome: 'Willkommen',
      dashboard: 'Dashboard',
    },
    
    // Login Screen
    login: {
      title: 'Anmelden',
      email: 'E-Mail',
      password: 'Passwort',
      loginButton: 'Anmelden',
      forgotPassword: 'Passwort vergessen?',
      dontHaveAccount: 'Haben Sie kein Konto?',
      signUp: 'Registrieren',
    },
    
    // Emergency/SOS
    emergency: {
      sos: 'SOS',
      sosAlert: 'SOS-Alarm senden',
      emergency: 'Notfall',
      sendAlert: 'Alarm senden',
      alertSent: 'Alarm gesendet',
      alertSentDesc: 'Der Notfallalarm wurde an die Sicherheit und Gemeinschaftsmitglieder gesendet',
      medical: 'Medizinischer Notfall',
      fire: 'Feuer-Notfall',
      security: 'Sicherheitsproblem',
      other: 'Anderer Notfall',
      police: 'Polizei',
      ambulance: 'Krankenwagen',
      societySecurity: 'Gesellschaftssicherheit',
      emergencyContacts: 'Notfallkontakte',
      societyContacts: 'Gesellschaftskontakte',
      societyManager: 'Gesellschaftsmanager',
      maintenance: 'Wartung',
      calling: 'Anrufen',
      guard: 'Wache',
    },
    
    // Services
    services: {
      title: 'Dienste',
      communityServices: 'Gemeinschaftsdienste',
      localConnect: 'Lokale Verbindung',
      localConnectDesc: 'Verbinden Sie sich mit Nachbarn und lokalen Gemeinschaftsmitgliedern',
      availableServices: 'Verfügbare Dienste',
      accessEssential: 'Zugang zu wesentlichen Diensten und Kontakten',
      howToUse: 'Wie zu verwenden',
      instruction1: '1. Tippen Sie auf eine beliebige Kontaktkarte, um direkt anzurufen',
      instruction2: '2. Verwenden Sie Lokale Verbindung, um mit Ihrer Gemeinschaft zu interagieren',
      instruction3: '3. Für Notfälle rufen Sie sofort die entsprechende Nummer an',
      note: 'Hinweis: Alle Kontakte sind 24/7 verfügbar. Für sofortige Hilfe verwenden Sie bitte den entsprechenden Kontakt oben. In lebensbedrohlichen Situationen wählen Sie sofort 911.',
    },
    
    // Navigation
    navigation: {
      home: 'Startseite',
      services: 'Dienste',
      profile: 'Profil',
      settings: 'Einstellungen',
      notifications: 'Benachrichtigungen',
    },
    
    // Weather
    weather: {
      location: 'Hyderabad, Indien',
      sunny: 'Sonnig',
      cloudy: 'Bewölkt',
      rainy: 'Regnerisch',
      feels: 'Gefühlt',
    },
    
    // Quick Actions
    quickActions: {
      gate: 'Tor',
      store: 'Geschäft',
      facilities: 'Einrichtungen',
      communityMap: 'Gemeinschaftskarte',
    },
    
    // Alerts
    alerts: {
      waterShutdown: 'Wasserabschaltung',
      waterShutdownMsg: 'Die Wasserversorgung wird morgen von 10 bis 14 Uhr abgeschaltet',
      newSecurityProtocol: 'Neues Sicherheitsprotokoll',
      newSecurityProtocolMsg: 'Alle Besucher müssen jetzt einen Ausweis am Tor vorzeigen',
      communityMeeting: 'Gemeinschaftstreffen',
      communityMeetingMsg: 'Jährliches Bewohnertreffen diesen Samstag um 11 Uhr im Clubhaus',
      high: 'Hoch',
      medium: 'Mittel',
      low: 'Niedrig',
      hoursAgo: 'vor {{count}} Stunden',
      dayAgo: 'vor {{count}} Tag',
      daysAgo: 'vor {{count}} Tagen',
    },
    
    // App Features
    features: {
      goodMorning: 'Guten Morgen',
      goodAfternoon: 'Guten Tag',
      goodEvening: 'Guten Abend',
      notifications: 'Benachrichtigungen',
      resident: 'Bewohner',
      quickActions: 'Schnelle Aktionen',
      residentAlerts: 'Bewohner-Benachrichtigungen',
      recentActivity: 'Letzte Aktivität',
      quoteOfTheDay: 'Zitat des Tages',
      weatherReport: 'Wetterbericht',
    },
    
    // Events
    events: {
      title: 'Veranstaltungen',
      communityEvents: 'Gemeinschaftsveranstaltungen',
      upcomingEvents: 'Kommende Veranstaltungen',
      pastEvents: 'Vergangene Veranstaltungen',
      regularEvents: 'Regelmäßige Veranstaltungen',
      specialEvents: 'Besondere Veranstaltungen',
      eventDetails: 'Veranstaltungsdetails',
      date: 'Datum',
      time: 'Zeit',
      location: 'Ort',
      description: 'Beschreibung',
      attendees: 'Teilnehmer',
      rsvp: 'RSVP',
      attending: 'Teilnehmend',
      notAttending: 'Nicht Teilnehmend',
      maybe: 'Vielleicht',
      noEvents: 'Keine Veranstaltungen geplant',
      createEvent: 'Veranstaltung Erstellen',
      editEvent: 'Veranstaltung Bearbeiten',
      deleteEvent: 'Veranstaltung Löschen',
      eventCreated: 'Veranstaltung erfolgreich erstellt',
      eventUpdated: 'Veranstaltung erfolgreich aktualisiert',
      eventDeleted: 'Veranstaltung erfolgreich gelöscht',
      searchPlaceholder: 'Veranstaltungen nach Titel, Ort oder Organisator suchen...',
      noEventsFound: 'Keine Veranstaltungen gefunden, die Ihrer Suche entsprechen.',
      interestedButton: 'Ich bin Interessiert',
      organizedBy: 'von',
    },
    
    // Mutual Market
    buySell: {
      title: 'Gegenseitiger Markt',
      marketplace: 'Gemeinschaftsmarktplatz',
      buyItems: 'Artikel Kaufen',
      sellItems: 'Artikel Verkaufen',
      myListings: 'Meine Anzeigen',
      categories: 'Kategorien',
      searchPlaceholder: 'Artikel suchen...',
      price: 'Preis',
      condition: 'Zustand',
      seller: 'Verkäufer',
      buyer: 'Käufer',
      contact: 'Kontakt',
      description: 'Beschreibung',
      images: 'Bilder',
      postAd: 'Anzeige Veröffentlichen',
      editAd: 'Anzeige Bearbeiten',
      deleteAd: 'Anzeige Löschen',
      markAsSold: 'Als Verkauft Markieren',
      sold: 'Verkauft',
      available: 'Verfügbar',
      new: 'Neu',
      used: 'Gebraucht',
      excellent: 'Ausgezeichnet',
      good: 'Gut',
      fair: 'Angemessen',
      electronics: 'Elektronik',
      furniture: 'Möbel',
      clothing: 'Kleidung',
      books: 'Bücher',
      sports: 'Sport',
      other: 'Andere',
      noItems: 'Keine Artikel gefunden',
      contactSeller: 'Verkäufer Kontaktieren',
      itemPosted: 'Artikel erfolgreich veröffentlicht',
      itemUpdated: 'Artikel erfolgreich aktualisiert',
      itemDeleted: 'Artikel erfolgreich gelöscht',
    },
    
    // Elder Monitoring
    elderMonitoring: {
      title: 'Seniorenüberwachung',
      suraaksha: 'Suraaksha',
      description: 'Suraaksha ist ein herzfokussiertes tragbares Gerät, das als stiller Wächter für Ihre älteren Eltern fungiert und Vitalzeichen mit Präzision verfolgt und Warnungen sendet, bevor Probleme auftreten. Es ist, als hätte man einen taschengroßen Gesundheitsbegleiter im Zentrum ihres Wohlbefindens, immer wachsam, immer bereit.',
      keyFeatures: 'Hauptmerkmale',
      heartRateMonitoring: 'Herzfrequenzüberwachung',
      heartRateDesc: 'Kontinuierliche Herzfrequenzverfolgung mit Echtzeit-Warnungen bei Unregelmäßigkeiten',
      vitalSignsTracking: 'Vitalzeichenverfolgung',
      vitalSignsDesc: 'Überwachung von Blutdruck, Sauerstoffwerten und anderen kritischen Gesundheitsmetriken',
      emergencyAlerts: 'Notfallwarnungen',
      emergencyAlertsDesc: 'Sofortige Benachrichtigungen an Familienmitglieder und Betreuer während Notfällen',
      fallDetection: 'Sturzerkennung',
      fallDetectionDesc: 'Erweiterte Sensoren erkennen Stürze und senden automatisch Hilfswarnungen',
    },
  },
  
  it: {
    // Common
    common: {
      ok: 'OK',
      cancel: 'Annulla',
      save: 'Salva',
      delete: 'Elimina',
      edit: 'Modifica',
      back: 'Indietro',
      next: 'Avanti',
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
      warning: 'Avviso',
      info: 'Informazione',
      all: 'Tutti',
    },
    
    // Profile Screen
    profile: {
      title: 'Profilo',
      accountSettings: 'Impostazioni Account',
      editProfile: 'Modifica Profilo',
      editProfileDesc: 'Aggiorna le tue informazioni personali',
      language: 'Lingua',
      languageDesc: 'Attuale: {{language}}',
      notificationSettings: 'Impostazioni Notifiche',
      notificationDesc: 'Personalizza le preferenze di notifica',
      helpSupport: 'Aiuto e Supporto',
      helpSupportDesc: 'Ottieni assistenza con l\'app',
      logout: 'Disconnetti',
      memberSince: 'Membro dal 2022',
      version: 'Versione 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: 'Lingua Cambiata',
      languageChangedDesc: 'La lingua è stata cambiata in {{language}}. L\'app si riavvierà per applicare le modifiche.',
      notificationsEnabled: 'Notifiche abilitate',
      notificationsDisabled: 'Notifiche disabilitate',
      comingSoon: 'Prossimamente!',
    },
    
    // Language Modal
    languageModal: {
      title: 'Seleziona Lingua',
    },
    
    // Home Screen
    home: {
      title: 'Home',
      welcome: 'Benvenuto',
      dashboard: 'Dashboard',
    },
    
    // Login Screen
    login: {
      title: 'Accedi',
      email: 'Email',
      password: 'Password',
      loginButton: 'Accedi',
      forgotPassword: 'Password dimenticata?',
      dontHaveAccount: 'Non hai un account?',
      signUp: 'Registrati',
    },
    
    // Emergency/SOS
    emergency: {
      sos: 'SOS',
      sosAlert: 'Invia Allarme SOS',
      emergency: 'Emergenza',
      sendAlert: 'Invia Allarme',
      alertSent: 'Allarme Inviato',
      alertSentDesc: 'L\'allarme di emergenza è stato inviato alla sicurezza e ai membri della comunità',
      medical: 'Emergenza Medica',
      fire: 'Emergenza Incendio',
      security: 'Problema di Sicurezza',
      other: 'Altra Emergenza',
      police: 'Polizia',
      ambulance: 'Ambulanza',
      societySecurity: 'Sicurezza della Società',
      emergencyContacts: 'Contatti di Emergenza',
      societyContacts: 'Contatti della Società',
      societyManager: 'Manager della Società',
      maintenance: 'Manutenzione',
      calling: 'Chiamando',
      guard: 'Guardia',
    },
    
    // Services
    services: {
      title: 'Servizi',
      communityServices: 'Servizi Comunitari',
      localConnect: 'Connessione Locale',
      localConnectDesc: 'Connettiti con i vicini e i membri della comunità locale',
      availableServices: 'Servizi Disponibili',
      accessEssential: 'Accedi a servizi essenziali e contatti',
      howToUse: 'Come Usare',
      instruction1: '1. Tocca qualsiasi carta di contatto per chiamare direttamente',
      instruction2: '2. Usa Connessione Locale per interagire con la tua comunità',
      instruction3: '3. Per le emergenze, chiama immediatamente il numero appropriato',
      note: 'Nota: Tutti i contatti sono disponibili 24/7. Per assistenza immediata, utilizza il contatto appropriato sopra. In caso di situazioni pericolose per la vita, componi immediatamente il 911.',
    },
    
    // Navigation
    navigation: {
      home: 'Home',
      services: 'Servizi',
      profile: 'Profilo',
      settings: 'Impostazioni',
      notifications: 'Notifiche',
    },
    
    // Weather
    weather: {
      location: 'Hyderabad, India',
      sunny: 'Soleggiato',
      cloudy: 'Nuvoloso',
      rainy: 'Piovoso',
      feels: 'Percepito',
    },
    
    // Quick Actions
    quickActions: {
      gate: 'Cancello',
      store: 'Negozio',
      facilities: 'Strutture',
      communityMap: 'Mappa Comunitaria',
    },
    
    // Alerts
    alerts: {
      waterShutdown: 'Interruzione Acqua',
      waterShutdownMsg: 'La fornitura d\'acqua sarà interrotta domani dalle 10 alle 14',
      newSecurityProtocol: 'Nuovo Protocollo di Sicurezza',
      newSecurityProtocolMsg: 'Tutti i visitatori devono ora mostrare un documento d\'identità al cancello',
      communityMeeting: 'Riunione Comunitaria',
      communityMeetingMsg: 'Riunione annuale dei residenti questo sabato alle 11 nel club',
      high: 'Alto',
      medium: 'Medio',
      low: 'Basso',
      hoursAgo: '{{count}} ore fa',
      dayAgo: '{{count}} giorno fa',
      daysAgo: '{{count}} giorni fa',
    },
    
    // App Features
    features: {
      goodMorning: 'Buongiorno',
      goodAfternoon: 'Buon pomeriggio',
      goodEvening: 'Buonasera',
      notifications: 'Notifiche',
      resident: 'Residente',
      quickActions: 'Azioni Rapide',
      residentAlerts: 'Avvisi Residenti',
      recentActivity: 'Attività Recente',
      quoteOfTheDay: 'Citazione del Giorno',
      weatherReport: 'Bollettino Meteo',
    },
    
    // Events
    events: {
      title: 'Eventi',
      communityEvents: 'Eventi Comunitari',
      upcomingEvents: 'Prossimi Eventi',
      pastEvents: 'Eventi Passati',
      regularEvents: 'Eventi Regolari',
      specialEvents: 'Eventi Speciali',
      eventDetails: 'Dettagli Evento',
      date: 'Data',
      time: 'Ora',
      location: 'Luogo',
      description: 'Descrizione',
      attendees: 'Partecipanti',
      rsvp: 'RSVP',
      attending: 'Partecipando',
      notAttending: 'Non Partecipando',
      maybe: 'Forse',
      noEvents: 'Nessun evento programmato',
      createEvent: 'Crea Evento',
      editEvent: 'Modifica Evento',
      deleteEvent: 'Elimina Evento',
      eventCreated: 'Evento creato con successo',
      eventUpdated: 'Evento aggiornato con successo',
      eventDeleted: 'Evento eliminato con successo',
      searchPlaceholder: 'Cerca eventi per titolo, luogo o organizzatore...',
      noEventsFound: 'Nessun evento trovato corrispondente alla tua ricerca.',
      interestedButton: 'Sono Interessato',
      organizedBy: 'da',
    },
    
    // Mutual Market
    buySell: {
      title: 'Mercato Reciproco',
      marketplace: 'Mercato Comunitario',
      buyItems: 'Compra Articoli',
      sellItems: 'Vendi Articoli',
      myListings: 'I Miei Annunci',
      categories: 'Categorie',
      searchPlaceholder: 'Cerca articoli...',
      price: 'Prezzo',
      condition: 'Condizione',
      seller: 'Venditore',
      buyer: 'Compratore',
      contact: 'Contatto',
      description: 'Descrizione',
      images: 'Immagini',
      postAd: 'Pubblica Annuncio',
      editAd: 'Modifica Annuncio',
      deleteAd: 'Elimina Annuncio',
      markAsSold: 'Segna come Venduto',
      sold: 'Venduto',
      available: 'Disponibile',
      new: 'Nuovo',
      used: 'Usato',
      excellent: 'Eccellente',
      good: 'Buono',
      fair: 'Discreto',
      electronics: 'Elettronica',
      furniture: 'Mobili',
      clothing: 'Abbigliamento',
      books: 'Libri',
      sports: 'Sport',
      other: 'Altro',
      noItems: 'Nessun articolo trovato',
      contactSeller: 'Contatta Venditore',
      itemPosted: 'Articolo pubblicato con successo',
      itemUpdated: 'Articolo aggiornato con successo',
      itemDeleted: 'Articolo eliminato con successo',
    },
    
    // Navigation
    navigation: {
      home: 'Home',
      services: 'Servizi',
      buySell: 'Compra e Vendi',
      profile: 'Profilo',
      settings: 'Impostazioni',
      notifications: 'Notifiche',
    },
  },
  
  pt: {
    // Common
    common: {
      ok: 'OK',
      cancel: 'Cancelar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      back: 'Voltar',
      next: 'Próximo',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      warning: 'Aviso',
      info: 'Informação',
    },
    
    // Profile Screen
    profile: {
      title: 'Perfil',
      accountSettings: 'Configurações da Conta',
      editProfile: 'Editar Perfil',
      editProfileDesc: 'Atualize suas informações pessoais',
      language: 'Idioma',
      languageDesc: 'Atual: {{language}}',
      notificationSettings: 'Configurações de Notificação',
      notificationDesc: 'Personalize as preferências de notificação',
      helpSupport: 'Ajuda e Suporte',
      helpSupportDesc: 'Obtenha assistência com o aplicativo',
      logout: 'Sair',
      memberSince: 'Membro desde 2022',
      version: 'Versão 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: 'Idioma Alterado',
      languageChangedDesc: 'O idioma foi alterado para {{language}}. O aplicativo será reiniciado para aplicar as alterações.',
      notificationsEnabled: 'Notificações habilitadas',
      notificationsDisabled: 'Notificações desabilitadas',
      comingSoon: 'Em breve!',
    },
    
    // Language Modal
    languageModal: {
      title: 'Selecionar Idioma',
    },
    
    // Home Screen
    home: {
      title: 'Início',
      welcome: 'Bem-vindo',
      dashboard: 'Painel',
    },
    
    // Login Screen
    login: {
      title: 'Entrar',
      email: 'Email',
      password: 'Senha',
      loginButton: 'Entrar',
      forgotPassword: 'Esqueceu a senha?',
      dontHaveAccount: 'Não tem uma conta?',
      signUp: 'Cadastrar',
    },
    
    // Navigation
    navigation: {
      home: 'Início',
      profile: 'Perfil',
      settings: 'Configurações',
      notifications: 'Notificações',
    },
  },
  
  ru: {
    // Common
    common: {
      ok: 'ОК',
      cancel: 'Отмена',
      save: 'Сохранить',
      delete: 'Удалить',
      edit: 'Редактировать',
      back: 'Назад',
      next: 'Далее',
      loading: 'Загрузка...',
      error: 'Ошибка',
      success: 'Успех',
      warning: 'Предупреждение',
      info: 'Информация',
    },
    
    // Profile Screen
    profile: {
      title: 'Профиль',
      accountSettings: 'Настройки Аккаунта',
      editProfile: 'Редактировать Профиль',
      editProfileDesc: 'Обновите вашу личную информацию',
      language: 'Язык',
      languageDesc: 'Текущий: {{language}}',
      notificationSettings: 'Настройки Уведомлений',
      notificationDesc: 'Настройте предпочтения уведомлений',
      helpSupport: 'Помощь и Поддержка',
      helpSupportDesc: 'Получите помощь с приложением',
      logout: 'Выйти',
      memberSince: 'Участник с 2022',
      version: 'Версия 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: 'Язык Изменен',
      languageChangedDesc: 'Язык был изменен на {{language}}. Приложение перезапустится для применения изменений.',
      notificationsEnabled: 'Уведомления включены',
      notificationsDisabled: 'Уведомления отключены',
      comingSoon: 'Скоро!',
    },
    
    // Language Modal
    languageModal: {
      title: 'Выберите Язык',
    },
    
    // Home Screen
    home: {
      title: 'Главная',
      welcome: 'Добро пожаловать',
      dashboard: 'Панель',
    },
    
    // Login Screen
    login: {
      title: 'Войти',
      email: 'Email',
      password: 'Пароль',
      loginButton: 'Войти',
      forgotPassword: 'Забыли пароль?',
      dontHaveAccount: 'Нет аккаунта?',
      signUp: 'Регистрация',
    },
    
    // Navigation
    navigation: {
      home: 'Главная',
      profile: 'Профиль',
      settings: 'Настройки',
      notifications: 'Уведомления',
    },
  },
  
  ja: {
    // Common
    common: {
      ok: 'OK',
      cancel: 'キャンセル',
      save: '保存',
      delete: '削除',
      edit: '編集',
      back: '戻る',
      next: '次へ',
      loading: '読み込み中...',
      error: 'エラー',
      success: '成功',
      warning: '警告',
      info: '情報',
    },
    
    // Profile Screen
    profile: {
      title: 'プロフィール',
      accountSettings: 'アカウント設定',
      editProfile: 'プロフィール編集',
      editProfileDesc: '個人情報を更新',
      language: '言語',
      languageDesc: '現在: {{language}}',
      notificationSettings: '通知設定',
      notificationDesc: '通知設定をカスタマイズ',
      helpSupport: 'ヘルプ＆サポート',
      helpSupportDesc: 'アプリのサポートを受ける',
      logout: 'ログアウト',
      memberSince: '2022年からのメンバー',
      version: 'バージョン 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: '言語が変更されました',
      languageChangedDesc: '言語が{{language}}に変更されました。変更を適用するためにアプリが再起動します。',
      notificationsEnabled: '通知が有効になりました',
      notificationsDisabled: '通知が無効になりました',
      comingSoon: '近日公開！',
    },
    
    // Language Modal
    languageModal: {
      title: '言語を選択',
    },
    
    // Home Screen
    home: {
      title: 'ホーム',
      welcome: 'ようこそ',
      dashboard: 'ダッシュボード',
    },
    
    // Login Screen
    login: {
      title: 'ログイン',
      email: 'メール',
      password: 'パスワード',
      loginButton: 'ログイン',
      forgotPassword: 'パスワードを忘れた？',
      dontHaveAccount: 'アカウントをお持ちでない？',
      signUp: 'サインアップ',
    },
    
    // Navigation
    navigation: {
      home: 'ホーム',
      profile: 'プロフィール',
      settings: '設定',
      notifications: '通知',
    },
  },
  
  ko: {
    // Common
    common: {
      ok: '확인',
      cancel: '취소',
      save: '저장',
      delete: '삭제',
      edit: '편집',
      back: '뒤로',
      next: '다음',
      loading: '로딩 중...',
      error: '오류',
      success: '성공',
      warning: '경고',
      info: '정보',
    },
    
    // Profile Screen
    profile: {
      title: '프로필',
      accountSettings: '계정 설정',
      editProfile: '프로필 편집',
      editProfileDesc: '개인 정보 업데이트',
      language: '언어',
      languageDesc: '현재: {{language}}',
      notificationSettings: '알림 설정',
      notificationDesc: '알림 기본 설정 사용자 지정',
      helpSupport: '도움말 및 지원',
      helpSupportDesc: '앱 지원 받기',
      logout: '로그아웃',
      memberSince: '2022년부터 회원',
      version: '버전 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: '언어가 변경됨',
      languageChangedDesc: '언어가 {{language}}(으)로 변경되었습니다. 변경사항을 적용하기 위해 앱이 다시 시작됩니다.',
      notificationsEnabled: '알림이 활성화됨',
      notificationsDisabled: '알림이 비활성화됨',
      comingSoon: '곧 출시!',
    },
    
    // Language Modal
    languageModal: {
      title: '언어 선택',
    },
    
    // Home Screen
    home: {
      title: '홈',
      welcome: '환영합니다',
      dashboard: '대시보드',
    },
    
    // Login Screen
    login: {
      title: '로그인',
      email: '이메일',
      password: '비밀번호',
      loginButton: '로그인',
      forgotPassword: '비밀번호를 잊으셨나요?',
      dontHaveAccount: '계정이 없으신가요?',
      signUp: '가입하기',
    },
    
    // Navigation
    navigation: {
      home: '홈',
      profile: '프로필',
      settings: '설정',
      notifications: '알림',
    },
  },
  
  zh: {
    // Common
    common: {
      ok: '确定',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      back: '返回',
      next: '下一步',
      loading: '加载中...',
      error: '错误',
      success: '成功',
      warning: '警告',
      info: '信息',
    },
    
    // Profile Screen
    profile: {
      title: '个人资料',
      accountSettings: '账户设置',
      editProfile: '编辑个人资料',
      editProfileDesc: '更新您的个人信息',
      language: '语言',
      languageDesc: '当前: {{language}}',
      notificationSettings: '通知设置',
      notificationDesc: '自定义通知偏好',
      helpSupport: '帮助与支持',
      helpSupportDesc: '获取应用帮助',
      logout: '退出登录',
      memberSince: '2022年起的会员',
      version: '版本 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: '语言已更改',
      languageChangedDesc: '语言已更改为{{language}}。应用将重新启动以应用更改。',
      notificationsEnabled: '通知已启用',
      notificationsDisabled: '通知已禁用',
      comingSoon: '即将推出！',
    },
    
    // Language Modal
    languageModal: {
      title: '选择语言',
    },
    
    // Home Screen
    home: {
      title: '首页',
      welcome: '欢迎',
      dashboard: '仪表板',
    },
    
    // Login Screen
    login: {
      title: '登录',
      email: '邮箱',
      password: '密码',
      loginButton: '登录',
      forgotPassword: '忘记密码？',
      dontHaveAccount: '没有账户？',
      signUp: '注册',
    },
    
    // Navigation
    navigation: {
      home: '首页',
      profile: '个人资料',
      settings: '设置',
      notifications: '通知',
    },
  },
  
  ar: {
    // Common
    common: {
      ok: 'موافق',
      cancel: 'إلغاء',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      back: 'رجوع',
      next: 'التالي',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      warning: 'تحذير',
      info: 'معلومات',
    },
    
    // Profile Screen
    profile: {
      title: 'الملف الشخصي',
      accountSettings: 'إعدادات الحساب',
      editProfile: 'تعديل الملف الشخصي',
      editProfileDesc: 'تحديث معلوماتك الشخصية',
      language: 'اللغة',
      languageDesc: 'الحالية: {{language}}',
      notificationSettings: 'إعدادات الإشعارات',
      notificationDesc: 'تخصيص تفضيلات الإشعارات',
      helpSupport: 'المساعدة والدعم',
      helpSupportDesc: 'احصل على المساعدة مع التطبيق',
      logout: 'تسجيل الخروج',
      memberSince: 'عضو منذ 2022',
      version: 'الإصدار 1.0.0',
      copyright: '© 2023 SecureIn Community App',
      languageChanged: 'تم تغيير اللغة',
      languageChangedDesc: 'تم تغيير اللغة إلى {{language}}. سيتم إعادة تشغيل التطبيق لتطبيق التغييرات.',
      notificationsEnabled: 'تم تفعيل الإشعارات',
      notificationsDisabled: 'تم إلغاء تفعيل الإشعارات',
      comingSoon: 'قريباً!',
    },
    
    // Language Modal
    languageModal: {
      title: 'اختر اللغة',
    },
    
    // Home Screen
    home: {
      title: 'الرئيسية',
      welcome: 'مرحباً',
      dashboard: 'لوحة التحكم',
    },
    
    // Login Screen
    login: {
      title: 'تسجيل الدخول',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      loginButton: 'تسجيل الدخول',
      forgotPassword: 'نسيت كلمة المرور؟',
      dontHaveAccount: 'ليس لديك حساب؟',
      signUp: 'إنشاء حساب',
    },
    
    // Navigation
    navigation: {
      home: 'الرئيسية',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      notifications: 'الإشعارات',
    },
  },
};