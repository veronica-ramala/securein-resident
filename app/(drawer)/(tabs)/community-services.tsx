import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Phone, Clock } from 'lucide-react-native';

export default function CommunityServicesScreen() {
  const router = useRouter();

  // Empty services array
  const services = [];

  // No call functionality needed

  const renderServiceCard = (service) => {
    return (
      <View key={service.id} style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{service.name.charAt(0)}</Text>
          </View>
          <Text style={styles.serviceName}>{service.name}</Text>
        </View>
        
        <Text style={styles.serviceDescription}>{service.description}</Text>
        
        <View style={styles.serviceDetail}>
          <Clock size={16} color="#4B5563" style={styles.detailIcon} />
          <Text style={styles.serviceInfo}>{service.timing}</Text>
        </View>
        
        <View style={styles.serviceDetail}>
          <Phone size={16} color="#4B5563" style={styles.detailIcon} />
          <Text style={styles.serviceInfo}>{service.contact}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#125E8A" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('../(tabs)/services')}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Community Services</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionIntro}>
            
          </Text>

          {services.map(service => renderServiceCard(service))}
          
          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>Important Note</Text>
            <Text style={styles.noteText}>
              All service providers are pre-screened and approved by the community management.
              For any issues or feedback regarding these services, please contact the community office.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#125E8A',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#125E8A',
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 5,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginTop: 0,
  },
  sectionIntro: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    paddingBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
    padding: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#125E8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    flex: 1,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  serviceInfo: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  // Call button styles removed
  noteCard: {
    backgroundColor: 'rgba(244, 216, 205, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(18, 94, 138, 0.2)',
    padding: 16,
    marginVertical: 10,
    marginBottom: 30,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
});