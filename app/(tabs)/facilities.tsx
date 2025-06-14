import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Clock, Calendar, Info, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function FacilitiesPage() {
  const router = useRouter();
  
  // Facilities data
  const facilities = [
    {
      id: '1',
      name: 'Swimming Pool',
      description: 'Olympic-sized swimming pool with dedicated lanes for lap swimming and a separate kids area.',
      image: 'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '6:00 AM - 10:00 PM',
      location: 'Block A, Ground Floor'
    },
    {
      id: '2',
      name: 'Gymnasium',
      description: 'Fully equipped gym with cardio machines, free weights, and strength training equipment.',
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '5:00 AM - 11:00 PM',
      location: 'Block B, First Floor'
    },
    {
      id: '3',
      name: 'Clubhouse',
      description: 'Spacious clubhouse for community events, parties, and gatherings.',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '9:00 AM - 9:00 PM',
      location: 'Central Plaza'
    },
    {
      id: '4',
      name: 'Indoor Games',
      description: 'Indoor games area with table tennis, billiards, chess, and carrom boards.',
      image: 'https://images.pexels.com/photos/344034/pexels-photo-344034.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '10:00 AM - 8:00 PM',
      location: 'Block C, Ground Floor'
    },
    {
      id: '5',
      name: 'Tennis Court',
      description: 'Professional-grade tennis court with night lighting and seating area.',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '6:00 AM - 9:00 PM',
      location: 'West Side, Open Area'
    },
  ];

  const bookSlot = (facilityId: string, facilityName: string) => {
    console.log(`Booking slot for ${facilityName} (ID: ${facilityId})`);
    // Add booking functionality here or navigate to a booking screen
    alert(`Booking system for ${facilityName} will be available soon!`);
  };

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
          <Text style={styles.headerTitle}>Community Facilities</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionIntro}>
          Explore and book our premium community facilities, designed for your comfort and enjoyment.
        </Text>
        
        {facilities.map((facility) => (
          <View key={facility.id} style={styles.facilityCard}>
            <Image 
              source={{ uri: facility.image }} 
              style={styles.facilityImage}
            />
            <View style={styles.facilityContent}>
              <Text style={styles.facilityName}>{facility.name}</Text>
              <Text style={styles.facilityDescription}>{facility.description}</Text>
              
              <View style={styles.facilityDetails}>
                <View style={styles.detailItem}>
                  <Clock size={14} color="#125E8A" />
                  <Text style={styles.detailText}>{facility.timings}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MapPin size={14} color="#125E8A" />
                  <Text style={styles.detailText}>{facility.location}</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => bookSlot(facility.id, facility.name)}
              >
                <Calendar size={16} color="white" style={{ marginRight: 5 }} />
                <Text style={styles.bookButtonText}>Book Slot</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <View style={styles.infoCard}>
          <Info size={20} color="#125E8A" />
          <Text style={styles.infoTitle}>Facility Usage Guidelines</Text>
          <Text style={styles.infoText}>
            • Bookings must be made at least 24 hours in advance{'\n'}
            • Cancellations should be done 12 hours before the slot{'\n'}
            • Children below 12 must be accompanied by adults{'\n'}
            • Please adhere to the timings mentioned{'\n'}
            • Maintain cleanliness in all facilities{'\n'}
            • Report any issues to the maintenance staff
          </Text>
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
  sectionIntro: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 20,
  },
  facilityCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  facilityImage: {
    width: '100%',
    height: 150,
  },
  facilityContent: {
    padding: 15,
  },
  facilityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 5,
  },
  facilityDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  facilityDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 6,
  },
  bookButton: {
    backgroundColor: '#125E8A',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  bookButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#F4D8CD',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#125E8A',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
});