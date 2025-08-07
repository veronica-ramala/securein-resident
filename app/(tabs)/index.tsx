import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Shield, Users, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, UserPlus, ShieldAlert, Key, Store, Building, MapPin, Sun, Cloud, CloudRain, Thermometer, Droplets, Wind, Heart, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useLocalization } from '../../context/LocalizationContext';
import { wp, hp, fontSize, spacing, s, vs, ms, RF, getResponsiveText, getLineHeight, isVerySmallDevice, isSmallDevice } from '../../utils/responsive';

// Custom Community Gate Icon Component
const CommunityGateIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Gate posts */}
      <Rect x="3" y="4" width="3" height="16" />
      <Rect x="18" y="4" width="3" height="16" />
      
      {/* Gate bars */}
      <Path d="M6 8 L18 8" />
      <Path d="M6 12 L18 12" />
      <Path d="M6 16 L18 16" />
      
      {/* Gate frame */}
      <Path d="M6 4 L18 4" />
      <Path d="M6 20 L18 20" />
      <Path d="M9 4 L9 20" strokeWidth={1.5} />
      <Path d="M15 4 L15 20" strokeWidth={1.5} />
    </Svg>
  );
};

// Custom Shuttle Racket Icon Component
const ShuttleRacketIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Racket handle */}
      <Path d="M12 20 L12 14" />
      
      {/* Racket head */}
      <Ellipse cx="12" cy="8" rx="6" ry="7" />
      
      {/* Racket strings - vertical */}
      <Path d="M9 3 L9 13" strokeWidth={1} />
      <Path d="M12 2 L12 14" strokeWidth={1} />
      <Path d="M15 3 L15 13" strokeWidth={1} />
      
      {/* Racket strings - horizontal */}
      <Path d="M7 5 L17 5" strokeWidth={1} />
      <Path d="M6 8 L18 8" strokeWidth={1} />
      <Path d="M7 11 L17 11" strokeWidth={1} />
      
      {/* Shuttle */}
      <Circle cx="18" cy="18" r="1.5" />
      <Path d="M18 16.5 L19 15 L20 15.5 L19.5 16.5 L18 16.5" fill={color} strokeWidth={1} />
    </Svg>
  );
};

// Custom Community Map Icon Component
const CommunityMapIcon = ({ size = 24, color = 'currentColor', ...props }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Map outline */}
      <Path d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3" />
      
      {/* Roads */}
      <Path d="M9 3v15" strokeWidth={1.5} />
      <Path d="M15 6v15" strokeWidth={1.5} />
      <Path d="M5 10h4" strokeWidth={1.5} />
      <Path d="M15 10h4" strokeWidth={1.5} />
      <Path d="M7 14h10" strokeWidth={1.5} />
      
      {/* Location pin */}
      <Circle cx="12" cy="10" r="1.5" fill={color} />
    </Svg>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { t, currentLanguage } = useLocalization();

  // Function to get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return t('features.goodMorning');
    } else if (hour >= 12 && hour < 18) {
      return t('features.goodAfternoon');
    } else {
      return t('features.goodEvening');
    }
  };

  // Multilingual motivational quotes
  const motivationalQuotes = {
    en: [
      "The only way to do great work is to love what you do.",
      "Believe you can and you're halfway there.",
      "It does not matter how slowly you go as long as you do not stop.",
      "Your attitude determines your direction.",
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "You are never too old to set another goal or to dream a new dream.",
      "The secret of getting ahead is getting started.",
      "Quality is not an act, it is a habit.",
      "Every accomplishment starts with the decision to try.",
      "Don't watch the clock; do what it does. Keep going.",
      "The only limit to our realization of tomorrow is our doubts of today.",
      "It always seems impossible until it's done.",
      "Aim for the moon. If you miss, you may hit a star.",
      "The best way to predict the future is to create it."
    ],
    hi: [
      "महान काम करने का एकमात्र तरीका यह है कि आप जो करते हैं उससे प्यार करें।",
      "विश्वास करें कि आप कर सकते हैं और आप आधे रास्ते पहुंच गए हैं।",
      "इससे कोई फर्क नहीं पड़ता कि आप कितनी धीरे जाते हैं जब तक आप रुकते नहीं।",
      "आपका दृष्टिकोण आपकी दिशा निर्धारित करता है।",
      "सफलता अंतिम नहीं है, असफलता घातक नहीं है: जारी रखने का साहस ही मायने रखता है।",
      "भविष्य उन लोगों का है जो अपने सपनों की सुंदरता में विश्वास करते हैं।",
      "आप कभी भी कोई नया लक्ष्य निर्धारित करने या नया सपना देखने के लिए बहुत बूढ़े नहीं हैं।",
      "आगे बढ़ने का रहस्य शुरुआत करना है।",
      "गुणवत्ता कोई कार्य नहीं, यह एक आदत है।",
      "हर उपलब्धि कोशिश करने के निर्णय से शुरू होती है।",
      "घड़ी मत देखो; वह जो करती है वही करो। चलते रहो।",
      "कल की हमारी प्राप्ति की एकमात्र सीमा आज के हमारे संदेह हैं।",
      "यह हमेशा असंभव लगता है जब तक यह हो नहीं जाता।",
      "चांद का निशाना लगाओ। अगर चूक गए, तो शायद किसी तारे से टकरा जाओ।",
      "भविष्य की भविष्यवाणी करने का सबसे अच्छा तरीका इसे बनाना है।"
    ],
    te: [
      "గొప్ప పని చేయడానికి ఏకైక మార్గం మీరు చేసే పనిని ప్రేమించడం.",
      "మీరు చేయగలరని నమ్మండి మరియు మీరు సగం దూరం చేరుకున్నారు.",
      "మీరు ఆగకుండా ఉన్నంత వరకు ఎంత నెమ్మదిగా వెళ్లినా పర్వాలేదు.",
      "మీ వైఖరి మీ దిశను నిర్ణయిస్తుంది.",
      "విజయం చివరిది కాదు, వైఫల్యం ప్రాణాంతకం కాదు: కొనసాగించే ధైర్యమే ముఖ్యం.",
      "భవిష్యత్తు వారి కలల అందంలో నమ్మకం ఉన్న వారిది.",
      "మీరు మరొక లక్ష్యం నిర్దేశించుకోవడానికి లేదా కొత్త కల కనడానికి ఎప్పుడూ చాలా వయస్సు కాదు.",
      "ముందుకు వెళ్లడంలో రహస్యం ప్రారంభించడం.",
      "నాణ్యత ఒక చర్య కాదు, అది ఒక అలవాటు.",
      "ప్రతి విజయం ప్రయత్నించాలని నిర్ణయించడంతో మొదలవుతుంది.",
      "గడియారాన్ని చూడకండి; అది చేసేది చేయండి. కొనసాగండి.",
      "రేపటి మన సాధనకు ఏకైక పరిమితి నేటి మన సందేహాలు.",
      "అది జరిగే వరకు ఎల్లప్పుడూ అసాధ్యంగా అనిపిస్తుంది.",
      "చంద్రుడిని లక్ష్యంగా పెట్టుకోండి. తప్పితే, మీరు ఒక నక్షత్రాన్ని తాకవచ్చు.",
      "భవిష్యత్తును అంచనా వేయడానికి ఉత్తమ మార్గం దానిని సృష్టించడం."
    ],
    es: [
      "La única forma de hacer un gran trabajo es amar lo que haces.",
      "Cree que puedes y ya estás a mitad de camino.",
      "No importa qué tan lento vayas mientras no te detengas.",
      "Tu actitud determina tu dirección.",
      "El éxito no es definitivo, el fracaso no es fatal: es el coraje de continuar lo que cuenta.",
      "El futuro pertenece a aquellos que creen en la belleza de sus sueños.",
      "Nunca eres demasiado viejo para establecer otra meta o soñar un nuevo sueño.",
      "El secreto para salir adelante es comenzar.",
      "La calidad no es un acto, es un hábito.",
      "Cada logro comienza con la decisión de intentar.",
      "No mires el reloj; haz lo que hace. Sigue adelante.",
      "El único límite para nuestra realización del mañana son nuestras dudas de hoy.",
      "Siempre parece imposible hasta que se hace.",
      "Apunta a la luna. Si fallas, puedes golpear una estrella.",
      "La mejor manera de predecir el futuro es crearlo."
    ],
    fr: [
      "La seule façon de faire du bon travail est d'aimer ce que vous faites.",
      "Croyez que vous pouvez et vous êtes à mi-chemin.",
      "Peu importe la lenteur avec laquelle vous allez tant que vous ne vous arrêtez pas.",
      "Votre attitude détermine votre direction.",
      "Le succès n'est pas définitif, l'échec n'est pas fatal : c'est le courage de continuer qui compte.",
      "L'avenir appartient à ceux qui croient en la beauté de leurs rêves.",
      "Vous n'êtes jamais trop vieux pour vous fixer un autre objectif ou rêver d'un nouveau rêve.",
      "Le secret pour aller de l'avant est de commencer.",
      "La qualité n'est pas un acte, c'est une habitude.",
      "Chaque accomplissement commence par la décision d'essayer.",
      "Ne regardez pas l'horloge ; faites ce qu'elle fait. Continuez.",
      "La seule limite à notre réalisation de demain sont nos doutes d'aujourd'hui.",
      "Cela semble toujours impossible jusqu'à ce que ce soit fait.",
      "Visez la lune. Si vous ratez, vous pourriez toucher une étoile.",
      "La meilleure façon de prédire l'avenir est de le créer."
    ],
    de: [
      "Der einzige Weg, großartige Arbeit zu leisten, ist zu lieben, was du tust.",
      "Glaube, dass du es kannst, und du bist schon zur Hälfte da.",
      "Es spielt keine Rolle, wie langsam du gehst, solange du nicht aufhörst.",
      "Deine Einstellung bestimmt deine Richtung.",
      "Erfolg ist nicht endgültig, Misserfolg ist nicht tödlich: Es ist der Mut weiterzumachen, der zählt.",
      "Die Zukunft gehört denen, die an die Schönheit ihrer Träume glauben.",
      "Du bist nie zu alt, um dir ein neues Ziel zu setzen oder einen neuen Traum zu träumen.",
      "Das Geheimnis des Vorankommens ist der Anfang.",
      "Qualität ist keine Handlung, sie ist eine Gewohnheit.",
      "Jede Leistung beginnt mit der Entscheidung zu versuchen.",
      "Schau nicht auf die Uhr; tu was sie tut. Mach weiter.",
      "Die einzige Grenze für unsere Verwirklichung von morgen sind unsere Zweifel von heute.",
      "Es scheint immer unmöglich, bis es getan ist.",
      "Ziele auf den Mond. Wenn du verfehlst, triffst du vielleicht einen Stern.",
      "Der beste Weg, die Zukunft vorherzusagen, ist sie zu erschaffen."
    ],
    it: [
      "L'unico modo per fare un ottimo lavoro è amare quello che fai.",
      "Credi di poterlo fare e sei già a metà strada.",
      "Non importa quanto lentamente vai finché non ti fermi.",
      "Il tuo atteggiamento determina la tua direzione.",
      "Il successo non è definitivo, il fallimento non è fatale: è il coraggio di continuare che conta.",
      "Il futuro appartiene a coloro che credono nella bellezza dei loro sogni.",
      "Non sei mai troppo vecchio per fissare un altro obiettivo o sognare un nuovo sogno.",
      "Il segreto per andare avanti è iniziare.",
      "La qualità non è un atto, è un'abitudine.",
      "Ogni risultato inizia con la decisione di provare.",
      "Non guardare l'orologio; fai quello che fa. Continua.",
      "L'unico limite alla nostra realizzazione di domani sono i nostri dubbi di oggi.",
      "Sembra sempre impossibile finché non viene fatto.",
      "Punta alla luna. Se manchi, potresti colpire una stella.",
      "Il modo migliore per predire il futuro è crearlo."
    ]
  };

  // Function to get a quote based on the current date and language
  const getQuoteOfTheDay = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Get quotes for current language, fallback to English if language not available
    const currentLanguageQuotes = motivationalQuotes[currentLanguage] || motivationalQuotes['en'];
    
    return currentLanguageQuotes[dayOfYear % currentLanguageQuotes.length];
  };

  // Get today's quote (will update when language changes)
  const todaysQuote = getQuoteOfTheDay();

  // Static weather data - Always showing Cloudy condition
  const weatherData = {
    location: t('weather.location'),
    temperature: 28,
    condition: t('weather.cloudy'),
    icon: "cloudy",
    humidity: 65,
    windSpeed: 12,
    feelsLike: 32,
    uvIndex: 6,
    visibility: 10,
    pressure: 1013,
    sunrise: "6:15 AM",
    sunset: "6:45 PM",
    hourlyForecast: [
      { time: "Now", temp: 28, icon: "cloudy" },
      { time: "2 PM", temp: 30, icon: "cloudy" },
      { time: "4 PM", temp: 32, icon: "cloudy" },
      { time: "6 PM", temp: 29, icon: "cloudy" },
      { time: "8 PM", temp: 26, icon: "cloudy" },
    ]
  };

  // Function to get weather icon
  const getWeatherIcon = (iconType, size = 24, color = "#4DD0E1") => {
    switch (iconType) {
      case "sunny":
        return <Sun size={size} color={color} />;
      case "partly-cloudy":
        return <Cloud size={size} color={color} />;
      case "cloudy":
        return <Cloud size={size} color={color} />; // Use the passed color for consistency
      case "rainy":
        return <CloudRain size={size} color="#3B82F6" />;
      default:
        return <Cloud size={size} color={color} />; // Default to cloudy icon
    }
  };

  // Resident alerts data - sorted by time (newest first)
  const residentAlertsData = [
    { 
      id: 1,
      title: t('alerts.waterShutdown'), 
      message: t('alerts.waterShutdownMsg'), 
      priority: 'high', 
      time: t('alerts.hoursAgo', { count: 2 }),
      timestamp: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
      read: false
    },
    {
      id: 4,
      title: 'Elevator Maintenance',
      message: 'Elevator in Block A will be under maintenance from 10 AM to 2 PM tomorrow.',
      priority: 'medium',
      time: '5 hours ago',
      timestamp: Date.now() - (5 * 60 * 60 * 1000), // 5 hours ago
      read: false
    },
    { 
      id: 2,
      title: t('alerts.newSecurityProtocol'), 
      message: t('alerts.newSecurityProtocolMsg'), 
      priority: 'medium', 
      time: t('alerts.dayAgo', { count: 1 }),
      timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: false
    },
    {
      id: 5,
      title: 'Parking Violation Notice',
      message: 'Vehicle parked in visitor slot without proper authorization. Please move immediately.',
      priority: 'high',
      time: '1 day ago',
      timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: true
    },
    {
      id: 6,
      title: 'Community Event Reminder',
      message: 'Annual sports day is scheduled for this weekend. Registration is still open.',
      priority: 'low',
      time: '2 days ago',
      timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true
    },
    { 
      id: 3,
      title: t('alerts.communityMeeting'), 
      message: t('alerts.communityMeetingMsg'), 
      priority: 'low', 
      time: t('alerts.daysAgo', { count: 3 }),
      timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true
    },
    {
      id: 7,
      title: 'Power Outage Alert',
      message: 'Scheduled power maintenance on Sunday from 6 AM to 8 AM. Please plan accordingly.',
      priority: 'medium',
      time: '3 days ago',
      timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true
    },
    {
      id: 8,
      title: 'New Resident Welcome',
      message: 'Please welcome the new family moving into Flat 304. Community orientation scheduled.',
      priority: 'low',
      time: '1 week ago',
      timestamp: Date.now() - (7 * 24 * 60 * 60 * 1000), // 1 week ago
      read: true
    }
  ];

  // Sort alerts by timestamp (newest first)
  const residentAlerts = residentAlertsData.sort((a, b) => b.timestamp - a.timestamp);

  // Calculate unread notifications count
  const unreadNotificationsCount = residentAlerts.filter(alert => !alert.read).length;

  const quickActions = [
    { icon: CommunityGateIcon, label: t('quickActions.gate'), color: '#4DD0E1' },
    { icon: Store, label: t('quickActions.store'), color: '#4DD0E1' },
    { icon: ShuttleRacketIcon, label: t('quickActions.facilities'), color: '#4DD0E1' },
    { icon: CommunityMapIcon, label: t('quickActions.communityMap'), color: '#4DD0E1' },
    { icon: Heart, label: t('elderMonitoring.title'), color: '#4DD0E1' },
  ];



  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1E88E5']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.residentText}>{t('features.resident')}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.bellContainer}
              onPress={() => {
                // Navigate to notifications screen
                router.push('/(tabs)/notifications');
              }}
            >
              <Bell size={24} color="#FFFFFF" />
              {unreadNotificationsCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.blankSection}>
          <Text style={styles.quoteTitle}>{t('features.quoteOfTheDay')}</Text>
          <View style={styles.quoteDivider} />
          <Text style={styles.quoteText}>"{todaysQuote}"</Text>
        </View>

        {/* Compact Weather Card */}
        <View style={styles.weatherCard}>
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.weatherGradient}
          >
            <View style={styles.weatherContent}>
              <View style={styles.weatherHeader}>
                <Thermometer size={s(16)} color="#FFFFFF" />
                <Text style={styles.weatherTitle}>{t('features.weatherReport')}</Text>
              </View>
              
              <View style={styles.weatherMain}>
                <View style={styles.weatherTempSection}>
                  <Text style={styles.weatherTemperature}>{weatherData.temperature}°C</Text>
                  <Text style={styles.weatherLocation}>{weatherData.location}</Text>
                </View>
                
                <View style={styles.weatherConditionSection}>
                  {getWeatherIcon(weatherData.icon, s(isVerySmallDevice ? 28 : 32), "#FFFFFF")}
                  <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>{t('features.quickActions')}</Text>
          
          {/* First row - Gate, Store, and Facilities (3 buttons) */}
          <View style={styles.quickActionsGridThree}>
            <TouchableOpacity 
              style={styles.actionCardThree}
              onPress={() => router.push('/gate')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(0, 119, 182, 0.1)', padding: s(8) }]}>
                <CommunityGateIcon size={28} color="#0077B6" />
              </View>
              <Text style={[styles.actionLabel, { fontSize: fontSize.tiny }]}>{getResponsiveText(t('quickActions.gate'), 12)}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCardThree}
              onPress={() => router.push('/store')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.1)', padding: s(8) }]}>
                <Store size={28} color="#8B5CF6" />
              </View>
              <Text style={[styles.actionLabel, { fontSize: fontSize.tiny }]}>{getResponsiveText(t('quickActions.store'), 12)}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCardThree}
              onPress={() => router.push('/facilities')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: s(8) }]}>
                <ShuttleRacketIcon size={28} color="#10B981" />
              </View>
              <Text style={[styles.actionLabel, { fontSize: fontSize.tiny }]}>{getResponsiveText(t('quickActions.facilities'), 12)}</Text>
            </TouchableOpacity>
          </View>

          {/* Second row - Community Map, Local Connect, and Elder Monitoring (3 buttons) */}
          <View style={styles.quickActionsGridThree}>
            <TouchableOpacity 
              style={styles.actionCardThree}
              onPress={() => router.push('/community-map')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: s(8) }]}>
                <CommunityMapIcon size={28} color="#F59E0B" />
              </View>
              <Text style={[styles.actionLabel, { fontSize: fontSize.tiny }]}>{getResponsiveText(t('quickActions.communityMap'), 12)}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCardThree}
              onPress={() => router.push('/local-connect')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(0, 119, 182, 0.1)', padding: s(8) }]}>
                <Users size={28} color="#0077B6" />
              </View>
              <Text style={[styles.actionLabel, { fontSize: fontSize.tiny }]}>{getResponsiveText(t('services.localConnect'), 12)}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCardThree}
              onPress={() => router.push('/elder-monitoring')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: 'rgba(220, 38, 38, 0.1)', padding: s(8) }]}>
                <Heart size={28} color="#DC2626" />
              </View>
              <Text style={[styles.actionLabel, { fontSize: fontSize.tiny }]}>{getResponsiveText(t('elderMonitoring.title'), 12)}</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.regular,
    paddingBottom: vs(20),
  },
  header: {
    paddingVertical: vs(10),
    paddingHorizontal: s(15),
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  greetingText: {
    fontSize: fontSize.regular,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: getLineHeight(fontSize.regular),
  },
  residentText: {
    fontSize: fontSize.small,
    color: '#F4D8CD',
    marginTop: vs(2),
    lineHeight: getLineHeight(fontSize.small),
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },

  bellContainer: {
    padding: s(8),
    borderRadius: s(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: s(2),
    right: s(2),
    backgroundColor: '#EF4444',
    borderRadius: s(10),
    minWidth: s(18),
    height: s(18),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(4),
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: fontSize.tiny,
    fontWeight: 'bold',
    lineHeight: fontSize.tiny,
  },
  appName: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: s(5),
    lineHeight: getLineHeight(fontSize.large),
  },
  content: {
    flex: 1,
    padding: spacing.regular,
    backgroundColor: '#F5F9FF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 0,
    paddingBottom: vs(40),
  },
  blankSection: {
    backgroundColor: '#FFFFFF',
    padding: spacing.medium,
    paddingTop: spacing.medium,
    paddingBottom: vs(20),
    borderRadius: 0,
    marginHorizontal: -spacing.regular,
    marginTop: vs(-10),
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    minHeight: vs(90),
    borderBottomLeftRadius: s(20),
    borderBottomRightRadius: s(20),
  },
  quoteTitle: {
    fontSize: fontSize.medium,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: vs(8),
    textAlign: 'center',
    lineHeight: getLineHeight(fontSize.medium),
  },
  quoteDivider: {
    height: 1,
    backgroundColor: 'rgba(30, 136, 229, 0.1)',
    width: '35%',
    alignSelf: 'center',
    marginBottom: vs(10),
  },
  quoteText: {
    fontSize: fontSize.small,
    color: '#4B5563',
    lineHeight: getLineHeight(fontSize.small),
    fontStyle: 'italic',
    textAlign: 'center',
  },
  quickActionsSection: {
    marginBottom: vs(35),
    marginTop: vs(15),
  },
  sectionTitle: {
    fontSize: fontSize.xlarge,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: vs(18),
    marginLeft: s(5),
    lineHeight: getLineHeight(fontSize.xlarge),
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: s(5),
    marginTop: vs(10),
  },
  actionCard: {
    width: wp(28),
    alignItems: 'center',
    marginBottom: vs(20),
    backgroundColor: '#FFFFFF',
    padding: s(12),
    paddingVertical: vs(20),
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: s(12),
  },
  actionIconContainer: {
    width: s(70),
    height: s(70),
    borderRadius: s(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(12),
    backgroundColor: '#F8F9FA',
  },
  actionLabel: {
    fontSize: fontSize.medium,
    fontWeight: '700',
    textAlign: 'center',
    color: '#4B5563',
    marginTop: vs(5),
    lineHeight: getLineHeight(fontSize.medium),
    flexWrap: 'wrap',
    maxWidth: wp(25),
  },

  // Compact Weather Card Styles
  weatherCard: {
    borderRadius: s(16),
    marginBottom: vs(20),
    marginTop: vs(5),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    width: '100%',
  },
  weatherGradient: {
    paddingHorizontal: s(16),
    paddingVertical: vs(16),
  },
  weatherContent: {
    flex: 1,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  weatherTitle: {
    fontSize: fontSize.medium,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: s(8),
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherTempSection: {
    flex: 1,
  },
  weatherTemperature: {
    fontSize: isVerySmallDevice ? fontSize.xxlarge : fontSize.huge,
    fontWeight: '300',
    color: '#FFFFFF',
    lineHeight: isVerySmallDevice ? fontSize.xxlarge * 1.1 : fontSize.huge * 1.1,
  },
  weatherLocation: {
    fontSize: fontSize.small,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
    marginTop: vs(2),
  },
  weatherConditionSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherCondition: {
    fontSize: fontSize.medium,
    color: '#FFFFFF',
    fontWeight: '500',
    marginTop: vs(4),
    textAlign: 'center',
  },
  weatherMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    flex: isSmallDevice ? 0 : 1,
    justifyContent: isSmallDevice ? 'flex-start' : 'center',
    minWidth: isSmallDevice ? 'auto' : wp(25),
  },
  weatherMetricValue: {
    fontSize: fontSize.tiny,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  weatherFeelsLike: {
    fontSize: isVerySmallDevice ? RF(9) : fontSize.tiny,
    color: '#FFFFFF',
    fontWeight: '500',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  // Compact Layout Styles for Very Small Devices
  weatherCompactLayout: {
    flex: 1,
    justifyContent: 'space-between',
    gap: vs(6),
  },
  weatherTempRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  weatherMetricsCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: s(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    flexWrap: 'wrap',
    gap: s(4),
  },
  weatherMetricCompact: {
    fontSize: RF(8),
    color: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flex: 1,
    textAlign: 'center',
    minWidth: wp(25),
  },

  // Small Device Layout Styles
  weatherMetricsRow: {
    flexDirection: 'column',
    gap: vs(4),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: s(10),
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
  },
  weatherMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    flex: 1,
    justifyContent: 'flex-start',
  },

  // Quick Actions Styles
  quickActionsSection: {
    marginTop: vs(25),
    marginBottom: vs(20),
  },
  sectionTitle: {
    fontSize: fontSize.large,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: vs(16),
    textAlign: 'left',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: s(8),
    marginBottom: vs(12),
  },
  quickActionsGridThree: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: s(6),
    marginBottom: vs(12),
    marginLeft: s(-16),
    paddingRight: s(16),
  },
  quickActionsGridTwo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: s(16),
    marginLeft: s(-8),
    paddingRight: s(16),
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    padding: s(12),
    alignItems: 'center',
    justifyContent: 'center',
    width: (wp(100) - spacing.regular * 2 - s(12)) / 2, // 2 columns with gap
    minHeight: vs(100),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionCardThree: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    padding: s(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: (wp(100) - spacing.regular * 2 - s(12)) / 3, // 3 columns with gap
    minHeight: vs(90),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionCardTwo: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    padding: s(14),
    alignItems: 'center',
    justifyContent: 'center',
    width: (wp(100) - spacing.regular * 2 - s(24)) / 2, // 2 columns with more gap
    minHeight: vs(100),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionIconContainer: {
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    borderRadius: s(12),
    padding: s(12),
    marginBottom: vs(8),
  },
  actionLabel: {
    fontSize: fontSize.small,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: getLineHeight(fontSize.small),
  },
});