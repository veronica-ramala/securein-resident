import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Clock, MapPin, Phone, ExternalLink, ShoppingCart, Pill } from 'lucide-react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

// Store type to show different content based on selection
type StoreType = 'general' | 'medical';

export default function StorePage() {
  const router = useRouter();
  const [activeStore, setActiveStore] = useState<StoreType>('general');
  
  // Store data
  const storeData = {
    general: {
      name: "General Store",
      description: "Your one-stop shop for groceries, household items, and daily essentials.",
      address: "Building 3, Community Center",
      phone: "+1 (555) 123-4567",
      timings: [
        { day: "Monday - Friday", hours: "8:00 AM - 9:00 PM" },
        { day: "Saturday", hours: "9:00 AM - 8:00 PM" },
        { day: "Sunday", hours: "10:00 AM - 6:00 PM" }
      ],
      image: "https://placehold.co/600x400/DDDBCB/125E8A?text=General+Store"
    },
    medical: {
      name: "Medical Store",
      description: "Pharmacy and medical supplies for all your healthcare needs.",
      address: "Building 5, Near Main Gate",
      phone: "+1 (555) 987-6543",
      timings: [
        { day: "Monday - Friday", hours: "8:00 AM - 10:00 PM" },
        { day: "Saturday", hours: "8:00 AM - 9:00 PM" },
        { day: "Sunday", hours: "9:00 AM - 7:00 PM" }
      ],
      image: "https://placehold.co/600x400/DDDBCB/125E8A?text=Medical+Store"
    }
  };

  // Get current store data based on selection
  const currentStore = storeData[activeStore];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#125E8A', '#89AAE6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Community Stores</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.storeCardsContainer}>
          <TouchableOpacity 
            style={[styles.storeCard, activeStore === 'general' && styles.activeStoreCard]} 
            onPress={() => setActiveStore('general')}
          >
            <View style={styles.storeCardContent}>
              <ShoppingCart 
                size={20} 
                color={activeStore === 'general' ? '#125E8A' : '#6B7280'} 
              />
              <Text style={[styles.storeCardText, activeStore === 'general' && styles.activeStoreCardText]}>
                General Store
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.storeCard, activeStore === 'medical' && styles.activeStoreCard]} 
            onPress={() => setActiveStore('medical')}
          >
            <View style={styles.storeCardContent}>
              <Pill 
                size={20} 
                color={activeStore === 'medical' ? '#125E8A' : '#6B7280'} 
              />
              <Text style={[styles.storeCardText, activeStore === 'medical' && styles.activeStoreCardText]}>
                Medical Store
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.storeInfoWrapper}>
          <View style={styles.storeHeader}>
            {activeStore === 'general' ? (
              <ShoppingCart size={16} color="#125E8A" style={styles.storeHeaderIcon} />
            ) : (
              <Pill size={16} color="#125E8A" style={styles.storeHeaderIcon} />
            )}
            <Text style={styles.storeHeaderText}>{currentStore.name}</Text>
          </View>
          
          <Text style={styles.storeDescription}>{currentStore.description}</Text>
          
          <View style={styles.storeContactInfo}>
            <View style={styles.contactItem}>
              <MapPin size={14} color="#125E8A" style={styles.contactIcon} />
              <Text style={styles.contactText}>{currentStore.address}</Text>
            </View>
            
            <View style={styles.contactItem}>
              <Phone size={14} color="#125E8A" style={styles.contactIcon} />
              <Text style={styles.contactText}>{currentStore.phone}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.timingsSection}>
          <View style={styles.sectionHeader}>
            <Clock size={14} color="#125E8A" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Store Timings</Text>
          </View>
          
          {currentStore.timings.map((timing, index) => (
            <View key={index} style={styles.timingRow}>
              <Text style={styles.timingDay}>{timing.day}</Text>
              <Text style={styles.timingHours}>{timing.hours}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity style={styles.contactButton}>
          <Phone size={14} color="white" style={{ marginRight: 6 }} />
          <Text style={styles.contactButtonText}>Contact Store</Text>
        </TouchableOpacity>
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
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  storeCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  storeCard: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeStoreCard: {
    backgroundColor: 'white',
    borderColor: '#125E8A',
  },
  storeCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeCardText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  activeStoreCardText: {
    color: '#125E8A',
  },
  storeInfoWrapper: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeHeaderIcon: {
    marginRight: 6,
  },
  storeHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#125E8A',
  },
  storeDescription: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 10,
  },
  storeContactInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactIcon: {
    marginRight: 6,
  },
  contactText: {
    fontSize: 13,
    color: '#4B5563',
  },
  timingsSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#125E8A',
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timingDay: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  timingHours: {
    fontSize: 13,
    color: '#6B7280',
  },
  contactButton: {
    backgroundColor: '#125E8A',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});