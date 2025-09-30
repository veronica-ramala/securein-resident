import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Heart, Shield, Activity, Bell, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLocalization } from '../../../context/LocalizationContext';
import ResponsiveText from '../../../components/ResponsiveText';
import { wp, hp, fontSize, spacing, s, vs, ms, getResponsiveText } from '../../../utils/responsive';

export default function ElderMonitoringScreen() {
  const router = useRouter();
  const { t } = useLocalization();

  const features = [
    {
      icon: Heart,
      title: t('elderMonitoring.heartRateMonitoring'),
      description: t('elderMonitoring.heartRateDesc'),
      color: '#EF4444'
    },
    {
      icon: Activity,
      title: t('elderMonitoring.vitalSignsTracking'),
      description: t('elderMonitoring.vitalSignsDesc'),
      color: '#10B981'
    },
    {
      icon: Bell,
      title: t('elderMonitoring.emergencyAlerts'),
      description: t('elderMonitoring.emergencyAlertsDesc'),
      color: '#F59E0B'
    },
    {
      icon: Shield,
      title: t('elderMonitoring.fallDetection'),
      description: t('elderMonitoring.fallDetectionDesc'),
      color: '#B91C1C'
    }
  ];



  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#DC2626', '#EF4444']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Heart size={24} color="#FFFFFF" />
            <Text style={styles.headerTitle}>{t('elderMonitoring.title')}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Suraaksha Introduction Card */}
        <View style={styles.introCard}>
          <LinearGradient
            colors={['#DC2626', '#EF4444']}
            style={styles.introGradient}
          >
            <View style={styles.introContent}>
              <View style={styles.introHeader}>
                <Heart size={32} color="#FFFFFF" />
                <Text style={styles.introTitle}>{t('elderMonitoring.suraaksha')}</Text>
              </View>
              <Image 
                source={require('../../../assets/images/suraaksha .jpg')}
                style={styles.suraakshaImage}
              />
              <Text style={styles.introDescription}>
                {t('elderMonitoring.description')}
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('elderMonitoring.keyFeatures')}</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                  <feature.icon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  introCard: {
    marginBottom: 25,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  introGradient: {
    padding: 20,
  },
  introContent: {
    alignItems: 'center',
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  suraakshaImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginVertical: 20,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    resizeMode: 'contain',
  },
  introDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.95,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },

});