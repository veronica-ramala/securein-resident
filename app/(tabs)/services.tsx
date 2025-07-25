import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AlertTriangle, Users, Phone, ShieldAlert, Flame, Ambulance, Building, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalization } from '../../context/LocalizationContext';
import { useNavigationPerformance } from '../../hooks/useNavigationPerformance';

function ServicesScreen() {
  const router = useRouter();
  const { t } = useLocalization();

  // Use performance optimization hook
  useNavigationPerformance();

  // Memoize navigation callbacks
  const navigateToEmergency = useCallback(() => {
    router.push('/(tabs)/emergency');
  }, [router]);
  
  const callEmergency = useCallback((service: string, number: string) => {
    alert(`${t('emergency.calling')} ${service} (${number})...`);
  }, [t]);
  
  // Memoize emergency contacts to prevent recreation on every render
  const emergencyContacts = useMemo(() => [
    { id: 'police', name: t('emergency.police'), number: '100', icon: AlertTriangle, color: '#0077B6', bgColor: '#E6F7FF' },
    { id: 'fire', name: t('emergency.fire'), number: '101', icon: Flame, color: '#F97316', bgColor: '#FFF7ED' },
    { id: 'ambulance', name: t('emergency.ambulance'), number: '108', icon: Ambulance, color: '#EF4444', bgColor: '#FEF2F2' },
    { id: 'security', name: t('emergency.societySecurity'), number: t('emergency.guard'), icon: ShieldAlert, color: '#0077B6', bgColor: '#E6F7FF' },
  ], [t]);

  const societyContacts = [
    { id: 'manager', name: t('emergency.societyManager'), number: '+91 98765 43210', icon: Building },
    { id: 'maintenance', name: t('emergency.maintenance'), number: '+91 98765 12345', icon: Building },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0077B6" />
      <View style={styles.container}>
        <LinearGradient
          colors={['#0077B6', '#90CAF9']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>{t('services.title')}</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>{t('services.availableServices')}</Text>
            <Text style={styles.sectionDescription}>
              {t('services.accessEssential')}
            </Text>
            
            {/* Services Grid Layout */}
            <View style={styles.servicesGrid}>
              {/* Society Contacts */}
              <Text style={styles.categoryTitle}>{t('emergency.societyContacts')}</Text>
              <View style={styles.gridRow}>
                {societyContacts.map(contact => (
                  <TouchableOpacity 
                    key={contact.id}
                    style={styles.gridCard}
                    onPress={() => callEmergency(contact.name, contact.number)}
                  >
                    <View style={[styles.gridIconContainer, { backgroundColor: '#F0F9FF' }]}>
                      <contact.icon size={28} color="#0369A1" />
                    </View>
                    <Text style={styles.gridCardTitle}>{contact.name}</Text>
                    <Text style={styles.gridCardSubtitle}>{contact.number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Emergency Contacts Grid - Moved to Bottom */}
              <Text style={styles.categoryTitle}>{t('emergency.emergencyContacts')}</Text>
              <View style={styles.gridRow}>
                {emergencyContacts.slice(0, 2).map(contact => (
                  <TouchableOpacity 
                    key={contact.id}
                    style={styles.gridCard}
                    onPress={() => callEmergency(contact.name, contact.number)}
                  >
                    <View style={[styles.gridIconContainer, { backgroundColor: contact.bgColor }]}>
                      <contact.icon size={28} color={contact.color} />
                    </View>
                    <Text style={styles.gridCardTitle}>{contact.name}</Text>
                    <Text style={styles.gridCardSubtitle}>{contact.number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <View style={styles.gridRow}>
                {emergencyContacts.slice(2, 4).map(contact => (
                  <TouchableOpacity 
                    key={contact.id}
                    style={styles.gridCard}
                    onPress={() => callEmergency(contact.name, contact.number)}
                  >
                    <View style={[styles.gridIconContainer, { backgroundColor: contact.bgColor }]}>
                      <contact.icon size={28} color={contact.color} />
                    </View>
                    <Text style={styles.gridCardTitle}>{contact.name}</Text>
                    <Text style={styles.gridCardSubtitle}>{contact.number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>{t('services.howToUse')}</Text>
              <Text style={styles.instructionText}>
                {t('services.instruction1')}
              </Text>
              <Text style={styles.instructionText}>
                {t('services.instruction2')}
              </Text>
              <Text style={styles.instructionText}>
                {t('services.instruction3')}
              </Text>
            </View>
            
            {/* Note */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                {t('services.note')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
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
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 0,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
    lineHeight: 22,
  },
  // New Grid Layout Styles
  servicesGrid: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  gridIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  gridCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginTop: 8,
    marginBottom: 16,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 24,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  featureButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  featureContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  instructionsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
    paddingLeft: 8,
  },
  noteContainer: {
    backgroundColor: 'rgba(18, 94, 138, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#125E8A',
    marginBottom: 24,
  },
  noteText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  }
});

export default memo(ServicesScreen);