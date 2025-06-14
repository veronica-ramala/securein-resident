import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertTriangle, Users, Phone, ShieldAlert, Flame, Ambulance, Building, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ServicesScreen() {
  const router = useRouter();

  const navigateToEmergency = () => {
    router.push('/(tabs)/emergency');
  };
  
  const navigateToLocalConnect = () => {
    router.push('/(tabs)/local-connect');
  };
  
  const callEmergency = (service: string, number: string) => {
    alert(`Calling ${service} (${number})...`);
  };
  
  const emergencyContacts = [
    { id: 'police', name: 'Police', number: '100', icon: AlertTriangle, color: '#0077B6', bgColor: '#E6F7FF' },
    { id: 'fire', name: 'Fire', number: '101', icon: Flame, color: '#F97316', bgColor: '#FFF7ED' },
    { id: 'ambulance', name: 'Ambulance', number: '108', icon: Ambulance, color: '#EF4444', bgColor: '#FEF2F2' },
    { id: 'security', name: 'Society Security', number: 'Guard', icon: ShieldAlert, color: '#7C3AED', bgColor: '#F5F3FF' },
  ];

  const societyContacts = [
    { id: 'manager', name: 'Society Manager', number: '+91 98765 43210', icon: Building },
    { id: 'maintenance', name: 'Maintenance', number: '+91 98765 12345', icon: Building },
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
              <Text style={styles.headerTitle}>Services</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            <Text style={styles.sectionDescription}>
              Access essential services and contacts
            </Text>
            
            {/* Services Grid Layout */}
            <View style={styles.servicesGrid}>
              {/* Community Section - Moved to Top */}
              <Text style={styles.categoryTitle}>Community</Text>
              <TouchableOpacity 
                style={styles.featureButton}
                onPress={navigateToLocalConnect}
                activeOpacity={0.7}
              >
                <View style={styles.featureContent}>
                  <View style={[styles.featureIconContainer, { backgroundColor: '#7C3AED20' }]}>
                    <Users size={28} color="#7C3AED" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Local Connect</Text>
                    <Text style={styles.featureDescription}>
                      Connect with neighbors and local community members
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              {/* Society Contacts - Moved to Second */}
              <Text style={styles.categoryTitle}>Society Contacts</Text>
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
              <Text style={styles.categoryTitle}>Emergency Contacts</Text>
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
              <Text style={styles.instructionsTitle}>How to Use</Text>
              <Text style={styles.instructionText}>
                1. Tap on any contact card to call directly
              </Text>
              <Text style={styles.instructionText}>
                2. Use Local Connect to engage with your community
              </Text>
              <Text style={styles.instructionText}>
                3. For emergencies, call the appropriate number immediately
              </Text>
            </View>
            
            {/* Note */}
            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                Note: All contacts are available 24/7. For immediate assistance, 
                please use the appropriate contact above. In case of life-threatening situations, 
                dial 911 immediately.
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