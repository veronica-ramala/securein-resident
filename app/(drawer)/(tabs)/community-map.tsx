import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Info, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function CommunityMapPage() {
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;
  
  // Points of interest in the community
  const pointsOfInterest = [
    { id: '1', name: 'Main Gate', description: 'Main entrance to the community' },
    { id: '2', name: 'Clubhouse', description: 'Community clubhouse and event space' },
    { id: '3', name: 'Swimming Pool', description: 'Olympic-sized swimming pool' },
    { id: '4', name: 'Tennis Courts', description: 'Professional tennis courts' },
    { id: '5', name: 'Gymnasium', description: 'Fully equipped fitness center' },
    { id: '6', name: 'Children\'s Park', description: 'Playground for children' },
    { id: '7', name: 'Walking Trail', description: '2 km walking/jogging path' },
    { id: '8', name: 'Community Garden', description: 'Shared garden space' },
  ];

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
          <Text style={styles.headerTitle}>Community Map</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionIntro}>
          Explore our community layout and locate facilities, amenities, and key points of interest.
        </Text>
        
        <View style={styles.mapContainer}>
          <Image 
            source={require('../../../assets/images/map.jpg')} 
            style={[styles.mapImage, { width: windowWidth - 40 }]}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Points of Interest</Text>
          {pointsOfInterest.map((poi) => (
            <View key={poi.id} style={styles.legendItem}>
              <MapPin size={16} color="#F59E0B" />
              <View style={styles.legendText}>
                <Text style={styles.poiName}>{poi.name}</Text>
                <Text style={styles.poiDescription}>{poi.description}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.infoCard}>
          <Info size={20} color="#125E8A" />
          <Text style={styles.infoTitle}>Community Map Guide</Text>
          <Text style={styles.infoText}>
            • Tap on the map to expand for a better view{'\n'}
            • Use two fingers to zoom in and out{'\n'}
            • Points of interest are marked with orange pins{'\n'}
            • Residential blocks are labeled A through F{'\n'}
            • Emergency exits are marked in red{'\n'}
            • For navigation assistance, please contact the guard house
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
    padding: 20,
  },
  sectionIntro: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 20,
  },
  mapContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapImage: {
    height: 300,
    borderRadius: 8,
  },
  legendContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  legendText: {
    marginLeft: 8,
    flex: 1,
  },
  poiName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  poiDescription: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
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