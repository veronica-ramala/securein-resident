import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, ShieldAlert, Flame, Ambulance, Building } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalization } from '../../context/LocalizationContext';
import { useNavigationPerformance } from '../../hooks/useNavigationPerformance';

function ServicesScreen() {
  const { t } = useLocalization();

  // Perf optimization (keeps transitions smooth)
  useNavigationPerformance();

  const callEmergency = useCallback((service: string, number: string) => {
    alert(`${t('emergency.calling')} ${service} (${number})...`);
  }, [t]);

  // Memoize emergency contacts
  const emergencyContacts = useMemo(() => [
    { id: 'police', name: t('emergency.police'), number: '100', icon: AlertTriangle, color: '#4DD0E1', bgColor: '#F5F9FF' },
    { id: 'fire', name: t('emergency.fire'), number: '101', icon: Flame, color: '#4DD0E1', bgColor: '#F5F9FF' },
    { id: 'ambulance', name: t('emergency.ambulance'), number: '108', icon: Ambulance, color: '#EF5350', bgColor: '#FEF2F2' },
    { id: 'security', name: t('emergency.societySecurity'), number: t('emergency.guard'), icon: ShieldAlert, color: '#4DD0E1', bgColor: '#F5F9FF' },
  ], [t]);

  const societyContacts = [
    { id: 'manager', name: t('emergency.societyManager'), number: '+91 98765 43210', icon: Building },
    { id: 'maintenance', name: t('emergency.maintenance'), number: '+91 98765 12345', icon: Building },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <View style={styles.container}>
        <LinearGradient colors={['#2196F3', '#1E88E5']} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>{t('services.title')}</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>{t('services.availableServices')}</Text>
            <Text style={styles.sectionDescription}>{t('services.accessEssential')}</Text>

            {/* Services Grid */}
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
                    <View style={[styles.gridIconContainer, { backgroundColor: '#F5F9FF' }]}>
                      <contact.icon size={28} color="#4DD0E1" />
                    </View>
                    <Text style={styles.gridCardTitle}>{contact.name}</Text>
                    <Text style={styles.gridCardSubtitle}>{contact.number}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Emergency Contacts */}
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
              <Text style={styles.instructionText}>{t('services.instruction1')}</Text>
              <Text style={styles.instructionText}>{t('services.instruction2')}</Text>
              <Text style={styles.instructionText}>{t('services.instruction3')}</Text>
            </View>

            {/* Note */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>{t('services.note')}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F9FF' },
  container: { flex: 1, backgroundColor: '#F5F9FF' },
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
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  scrollView: { flex: 1, backgroundColor: '#F5F9FF' },
  content: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#F5F9FF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 0,
    paddingBottom: 40,
  },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E88E5', marginBottom: 8 },
  sectionDescription: { fontSize: 16, color: '#4B5563', marginBottom: 24, lineHeight: 22 },
  servicesGrid: { width: '100%' },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
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
  gridCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 4, textAlign: 'center' },
  gridCardSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  categoryTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E88E5', marginTop: 8, marginBottom: 16 },
  instructionsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  instructionsTitle: { fontSize: 18, fontWeight: 'bold', color: '#125E8A', marginBottom: 12 },
  instructionText: { fontSize: 14, color: '#4B5563', marginBottom: 8, paddingLeft: 8 },
  noteContainer: {
    backgroundColor: 'rgba(18, 94, 138, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#125E8A',
    marginBottom: 24,
  },
  noteText: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
});

export default memo(ServicesScreen);
