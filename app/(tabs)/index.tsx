import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Shield, Users, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, UserPlus, ShieldAlert, Key, Store, Building, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';
import { useRouter } from 'expo-router';

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

  // Function to get appropriate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  // Array of motivational quotes
  const motivationalQuotes = [
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
    "The best way to predict the future is to create it.",
    "Opportunities don't happen. You create them.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Set your goals high, and don't stop till you get there.",
    "Success is not the key to happiness. Happiness is the key to success.",
    "Don't be afraid to give up the good to go for the great.",
    "The only person you are destined to become is the person you decide to be.",
    "The best revenge is massive success.",
    "Do what you can, with what you have, where you are.",
    "If you want to achieve greatness stop asking for permission.",
    "A year from now you may wish you had started today.",
    "The question isn't who is going to let me; it's who is going to stop me.",
    "Every day is a new beginning. Take a deep breath and start again.",
    "Your life does not get better by chance, it gets better by change.",
    "The way to get started is to quit talking and begin doing.",
    "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart."
  ];

  // Function to get a quote based on the current date
  const getQuoteOfTheDay = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    return motivationalQuotes[dayOfYear % motivationalQuotes.length];
  };

  // Get today's quote
  const todaysQuote = getQuoteOfTheDay();

  const quickActions = [
    { icon: CommunityGateIcon, label: 'Gate', color: '#0077B6' },
    { icon: Store, label: 'Store', color: '#8B5CF6' },
    { icon: ShuttleRacketIcon, label: 'Facilities', color: '#10B981' },
    { icon: CommunityMapIcon, label: 'Community Map', color: '#F59E0B' },
  ];

  const residentAlerts = [
    { title: 'Water Shutdown', message: 'Scheduled maintenance on water pipes. No water from 10AM-2PM tomorrow.', priority: 'high', time: '2 hours ago' },
    { title: 'New Security Protocol', message: 'Please update your visitor list in the Gate section.', priority: 'medium', time: '1 day ago' },
    { title: 'Community Meeting', message: 'Annual residents meeting this Saturday at 11AM in the clubhouse.', priority: 'low', time: '3 days ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0077B6', '#90CAF9']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.residentText}>Resident</Text>
          </View>
          <View style={styles.logoContainer}>
            <Shield size={20} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.blankSection}>
          <Text style={styles.quoteTitle}>Quote of the Day</Text>
          <View style={styles.quoteDivider} />
          <Text style={styles.quoteText}>"{todaysQuote}"</Text>
        </View>
        
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.actionCard}
                onPress={() => {
                  if (action.label === 'Gate') {
                    router.push('/gate');
                  } else if (action.label === 'Store') {
                    router.push('/store');
                  } else if (action.label === 'Facilities') {
                    router.push('/facilities');
                  } else if (action.label === 'Community Map') {
                    router.push('/community-map');
                  }
                }}
              >
                <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
                  <action.icon size={42} color="#FFFFFF" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.alertsContainer}>
          <Text style={styles.sectionTitle}>Resident Alerts</Text>
          <View style={styles.alertCard}>
            <View style={styles.alertCardHeader}>
              <Text style={styles.alertCardHeaderText}>Recent Notifications</Text>
            </View>
            {residentAlerts.map((alert, index) => (
              <View key={index} style={styles.alertItem}>
                <View style={styles.alertInfo}>
                  <View style={styles.alertHeader}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <View style={[styles.priorityBadge, 
                      alert.priority === 'high' ? styles.highPriorityBadge : 
                      alert.priority === 'medium' ? styles.mediumPriorityBadge : styles.lowPriorityBadge
                    ]} />
                  </View>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
                {index < residentAlerts.length - 1 && <View style={styles.alertDivider} />}
              </View>
            ))}
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  residentText: {
    fontSize: 12,
    color: '#F4D8CD',
    marginTop: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 0,
    paddingBottom: 40,
  },
  blankSection: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    paddingTop: 25,
    paddingBottom: 30,
    borderRadius: 0,
    marginHorizontal: -20,
    marginTop: -10,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    minHeight: 120,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 12,
    textAlign: 'center',
  },
  quoteDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    width: '40%',
    alignSelf: 'center',
    marginBottom: 15,
  },
  quoteText: {
    fontSize: 16,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 26,
    textAlign: 'center',
  },
  quickActionsSection: {
    marginBottom: 35,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 18,
    marginLeft: 5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 10,
  },
  actionCard: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    paddingVertical: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  actionIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#4B5563',
    marginTop: 5,
  },
  alertsContainer: {
    marginBottom: 30,
    marginTop: 10,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    padding: 0,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  alertCardHeader: {
    backgroundColor: 'rgba(0, 119, 182, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  alertCardHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  alertItem: {
    padding: 16,
  },
  alertDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    marginTop: 8,
  },
  alertInfo: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0077B6',
    flex: 1,
  },
  alertMessage: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 10,
    lineHeight: 22,
  },
  alertTime: {
    fontSize: 13,
    color: '#90CAF9',
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
  priorityBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  highPriorityBadge: {
    backgroundColor: '#EF4444',
  },
  mediumPriorityBadge: {
    backgroundColor: '#F59E0B',
  },
  lowPriorityBadge: {
    backgroundColor: '#10B981',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  highPriorityText: {
    color: '#EF4444',
  },
  mediumPriorityText: {
    color: '#F59E0B',
  },
  lowPriorityText: {
    color: '#10B981',  },
});