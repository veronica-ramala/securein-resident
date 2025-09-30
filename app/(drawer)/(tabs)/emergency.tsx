import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldAlert, Phone, MapPin, Heart, Flame, AlertTriangle, Ambulance, Building, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function EmergencyScreen() {
  const router = useRouter();
  
  const callEmergency = (service: string, number: string) => {
    Alert.alert('Emergency Call', `Calling ${service} (${number})...`);
  };
  
  const goBack = () => {
    router.push('../(tabs)/services');
  };

  const emergencyContacts = [
    { id: 'police', name: 'Police', number: '100', icon: AlertTriangle, color: '#125E8A', bgColor: '#E6F7FF' },
    { id: 'fire', name: 'Fire', number: '101', icon: Flame, color: '#F97316', bgColor: '#FFF7ED' },
    { id: 'ambulance', name: 'Ambulance', number: '108', icon: Ambulance, color: '#EF4444', bgColor: '#FEF2F2' },
    { id: 'security', name: 'Society Security', number: 'Guard', icon: ShieldAlert, color: '#7C3AED', bgColor: '#F5F3FF' },
  ];

  const societyContacts = [
    { id: 'manager', name: 'Society Manager', number: '+91 98765 43210', icon: Building },
    { id: 'maintenance', name: 'Maintenance', number: '+91 98765 12345', icon: Building },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <ShieldAlert size={22} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.emergencySection}>
            <Text style={styles.sectionTitle}>Emergency Services</Text>
            
            {emergencyContacts.map(contact => (
              <TouchableOpacity 
                key={contact.id}
                style={styles.contactCard}
                onPress={() => callEmergency(contact.name, contact.number)}
              >
                <View style={[styles.iconContainer, { backgroundColor: contact.bgColor }]}>
                  <contact.icon size={24} color={contact.color} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
                <View style={styles.callButton}>
                  <Phone size={18} color="#125E8A" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.societySection}>
            <Text style={styles.sectionTitle}>Society Contacts</Text>
            
            {societyContacts.map(contact => (
              <TouchableOpacity 
                key={contact.id}
                style={styles.contactCard}
                onPress={() => callEmergency(contact.name, contact.number)}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#F0F9FF' }]}>
                  <contact.icon size={24} color="#0369A1" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactNumber}>{contact.number}</Text>
                </View>
                <View style={styles.callButton}>
                  <Phone size={18} color="#125E8A" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.locationSection}>
            <View style={styles.locationCard}>
              <MapPin size={22} color="#125E8A" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>Your Location</Text>
                <Text style={styles.locationText}>Apartment 3B, Sunset Residency{'\n'}Block A, Phase 2</Text>
              </View>
            </View>
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
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 32, // Same width as back button for balance
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  emergencySection: {
    marginBottom: 24,
  },
  societySection: {
    marginBottom: 24,
  },
  locationSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 12,
    marginLeft: 4,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 14,
    color: '#6B7280',
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
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
});