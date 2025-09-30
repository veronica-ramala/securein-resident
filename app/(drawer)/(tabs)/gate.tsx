import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, Share2, X } from 'lucide-react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

// Simple QR Code Component (placeholder for a real QR code library)
const QRCode = ({ size = 200, passType = 'visitor' }) => {
  // Different QR code patterns for visitor and VIP passes
  const isVIP = passType === 'vip';
  
  return (
    <View style={{ 
      width: size, 
      height: size, 
      backgroundColor: 'white', 
      justifyContent: 'center', 
      alignItems: 'center', 
      borderWidth: 1, 
      borderColor: '#E5E7EB',
      borderRadius: 8
    }}>
      <Svg width={size * 0.8} height={size * 0.8} viewBox="0 0 100 100">
        {/* Simple QR code pattern as SVG - slightly different for VIP */}
        <Rect x="10" y="10" width="80" height="80" fill="white" />
        <Rect x="20" y="20" width="20" height="20" fill="black" />
        <Rect x="60" y="20" width="20" height="20" fill="black" />
        <Rect x="20" y="60" width="20" height="20" fill="black" />
        {isVIP ? (
          <>
            <Rect x="45" y="45" width="35" height="35" fill="black" />
            <Circle cx="62.5" cy="62.5" r="10" fill="white" />
          </>
        ) : (
          <>
            <Rect x="50" y="50" width="30" height="30" fill="black" />
            <Rect x="30" y="30" width="10" height="10" fill="black" />
          </>
        )}
        <Rect x="70" y="70" width="10" height="10" fill="black" />
        <Rect x="30" y="50" width="10" height="10" fill="black" />
      </Svg>
      <Text style={{ 
        marginTop: 8, 
        fontWeight: '600', 
        color: isVIP ? '#047857' : '#D97706'
      }}>
        {isVIP ? 'VIP Pass' : 'Visitor Pass'}
      </Text>
    </View>
  );
};

export default function GatePage() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  
  // Visitor activity data
  const visitorActivity = [
    { name: 'John Doe', type: 'Visitor', time: '10:30 AM', status: 'entry' },
    { name: 'Maria Santos', type: 'Delivery', time: '2:15 PM', status: 'exit' },
    { name: 'Mike Johnson', type: 'Maintenance', time: '4:45 PM', status: 'entry' },
    { name: 'Sarah Williams', type: 'Guest', time: '6:20 PM', status: 'exit' },
  ];

  const openPassSelector = () => {
    setModalVisible(true);
  };

  const selectPass = (passType: 'visitor' | 'vip' | 'delivery' | 'cab') => {
    setModalVisible(false);
    
    if (passType === 'delivery') {
      // Navigate to delivery registration form
      router.push({
        pathname: '../(tabs)/delivery-registration',
        params: { passType }
      });
    } else if (passType === 'cab') {
      // Navigate to cab registration form
      router.push({
        pathname: '../(tabs)/cab-registration',
        params: { passType }
      });
    } else {
      // Navigate to visitor registration form
      router.push({
        pathname: '../(tabs)/visitor-registration',
        params: { passType }
      });
    }
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
          <Text style={styles.headerTitle}>Community Gate</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <TouchableOpacity 
          style={styles.gateButton} 
          onPress={openPassSelector}
        >
          <Text style={styles.gateButtonText}>Click to Generate Pass</Text>
        </TouchableOpacity>

        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Visitor Activity</Text>
          {visitorActivity.map((visitor, index) => (
            <View key={index} style={styles.activityCard}>
              <View style={styles.activityInfo}>
                <Text style={styles.visitorName}>{visitor.name}</Text>
                <Text style={styles.visitorType}>{visitor.type}</Text>
              </View>
              <View style={styles.activityMeta}>
                <Text style={styles.activityTime}>{visitor.time}</Text>
                <View style={[
                  styles.statusIndicator, 
                  visitor.status === 'entry' ? styles.entryStatus : styles.exitStatus
                ]} />
                <Text style={styles.statusText}>
                  {visitor.status === 'entry' ? 'Entered' : 'Exited'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pass Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Pass Type</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.passOption, styles.visitorPassOption]}
              onPress={() => selectPass('visitor')}
            >
              <View style={styles.passOptionContent}>
                <Text style={styles.passOptionTitle}>Visitor Pass</Text>
                <Text style={styles.passOptionDescription}>Standard access for visitors</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.passOption, styles.vipPassOption]}
              onPress={() => selectPass('vip')}
            >
              <View style={styles.passOptionContent}>
                <Text style={styles.passOptionTitle}>VIP Pass</Text>
                <Text style={styles.passOptionDescription}>Premium access for special guests</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.passOption, styles.deliveryPassOption]}
              onPress={() => selectPass('delivery')}
            >
              <View style={styles.passOptionContent}>
                <Text style={styles.passOptionTitle}>Delivery Pass</Text>
                <Text style={styles.passOptionDescription}>Quick access for delivery personnel</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.passOption, styles.cabPassOption]}
              onPress={() => selectPass('cab')}
            >
              <View style={styles.passOptionContent}>
                <Text style={styles.passOptionTitle}>Cab Pass</Text>
                <Text style={styles.passOptionDescription}>Access for ride hailing services</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 0,
    paddingBottom: 40,
  },
  gateButton: {
    backgroundColor: '#125E8A',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    height: 150,
    marginHorizontal: -5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
  },
  gateButtonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  qrContainer: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  visitorPassContainer: {
    backgroundColor: '#FEF3C7', // Light orange/yellow background
    borderWidth: 1,
    borderColor: '#D97706', // Orange/yellow border
  },
  vipPassContainer: {
    backgroundColor: '#ECFDF5', // Light green background
    borderWidth: 1,
    borderColor: '#10B981', // Green border
  },
  passTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  visitorPassTitle: {
    color: '#D97706', // Orange/yellow
  },
  vipPassTitle: {
    color: '#047857', // Darker green
  },
  qrInstructions: {
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B5563',
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginVertical: 5,
  },
  visitorShareButton: {
    backgroundColor: '#D97706', // Orange/yellow
  },
  vipShareButton: {
    backgroundColor: '#10B981', // Green
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  changePassButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
  changePassText: {
    color: '#4B5563',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  activitySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  visitorType: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  activityTime: {
    fontSize: 12,
    color: '#89AAE6',
    marginBottom: 5,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 3,
  },
  entryStatus: {
    backgroundColor: '#10B981', // green
  },
  exitStatus: {
    backgroundColor: '#F97316', // orange
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  passOption: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: 2,
  },
  visitorPassOption: {
    backgroundColor: '#FEF3C7', // Light orange/yellow background
    borderColor: '#D97706', // Orange/yellow border
  },
  vipPassOption: {
    backgroundColor: '#ECFDF5', // Light green background
    borderColor: '#10B981', // Green border
  },
  deliveryPassOption: {
    backgroundColor: '#FFF7ED', // Light orange background
    borderColor: '#F97316', // Orange border
  },
  cabPassOption: {
    backgroundColor: '#F3F4F6', // Light purple background
    borderColor: '#7C3AED', // Purple border
  },
  passOptionContent: {
    flexDirection: 'column',
  },
  passOptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  passOptionDescription: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 20,
  },
});