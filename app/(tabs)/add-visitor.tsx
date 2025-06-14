import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, User, MapPin, Clock, FileText, Share, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function AddVisitorScreen() {
  const [visitorData, setVisitorData] = useState({
    name: '',
    houseNumber: '',
    purpose: '',
    date: '',
    time: '',
    photo: null as string | null,
  });

  const purposes = ['Delivery', 'Guest', 'Maintenance', 'Maid', 'Other'];
  const [selectedPurpose, setSelectedPurpose] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to add photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVisitorData({ ...visitorData, photo: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setVisitorData({ ...visitorData, photo: result.assets[0].uri });
    }
  };

  const handleSubmit = () => {
    if (!visitorData.name || !visitorData.houseNumber || !selectedPurpose) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Simulate visitor pass generation and sharing
    Alert.alert(
      'Visitor Added Successfully!',
      'Visitor pass has been generated. Would you like to share it?',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Share Now', onPress: () => shareQRCode() },
      ]
    );

    // Reset form
    setVisitorData({
      name: '',
      houseNumber: '',
      purpose: '',
      date: '',
      time: '',
      photo: null,
    });
    setSelectedPurpose('');
  };

  const shareQRCode = () => {
    Alert.alert('Visitor Pass Shared', 'Visitor pass has been shared via WhatsApp!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0077B6', '#90CAF9']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Add New Visitor</Text>
        <Text style={styles.headerSubtitle}>Fill in visitor details to generate visitor pass</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.photoSection}>
          <Text style={styles.sectionLabel}>Visitor Photo</Text>
          <View style={styles.photoContainer}>
            {visitorData.photo ? (
              <Image source={{ uri: visitorData.photo }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <User size={40} color="#89AAE6" />
              </View>
            )}
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                <Camera size={20} color="#125E8A" />
                <Text style={styles.photoButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                <FileText size={20} color="#125E8A" />
                <Text style={styles.photoButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Visitor Details</Text>
          
          <View style={styles.inputContainer}>
            <User size={20} color="#89AAE6" />
            <TextInput
              style={styles.input}
              placeholder="Visitor's Full Name *"
              value={visitorData.name}
              onChangeText={(text) => setVisitorData({ ...visitorData, name: text })}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <MapPin size={20} color="#89AAE6" />
            <TextInput
              style={styles.input}
              placeholder="House Number *"
              value={visitorData.houseNumber}
              onChangeText={(text) => setVisitorData({ ...visitorData, houseNumber: text })}
              placeholderTextColor="#666"
            />
          </View>

          <Text style={styles.purposeLabel}>Purpose of Visit *</Text>
          <View style={styles.purposeContainer}>
            {purposes.map((purpose) => (
              <TouchableOpacity
                key={purpose}
                style={[
                  styles.purposeButton,
                  selectedPurpose === purpose && styles.purposeButtonSelected
                ]}
                onPress={() => setSelectedPurpose(purpose)}
              >
                <Text style={[
                  styles.purposeText,
                  selectedPurpose === purpose && styles.purposeTextSelected
                ]}>{purpose}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeInput}>
              <Clock size={20} color="#89AAE6" />
              <TextInput
                style={styles.input}
                placeholder="Expected Date"
                value={visitorData.date}
                onChangeText={(text) => setVisitorData({ ...visitorData, date: text })}
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.dateTimeInput}>
              <Clock size={20} color="#89AAE6" />
              <TextInput
                style={styles.input}
                placeholder="Expected Time"
                value={visitorData.time}
                onChangeText={(text) => setVisitorData({ ...visitorData, time: text })}
                placeholderTextColor="#666"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={['#0077B6', '#90CAF9']}
            style={styles.submitButtonGradient}
          >
            <Share size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Generate Visitor Pass</Text>
          </LinearGradient>
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#F4D8CD',
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  photoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 15,
  },
  photoContainer: {
    alignItems: 'center',
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F4D8CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#89AAE6',
    borderStyle: 'dashed',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4D8CD',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 5,
  },
  photoButtonText: {
    color: '#125E8A',
    fontWeight: '600',
    fontSize: 14,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  purposeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#125E8A',
    marginBottom: 10,
  },
  purposeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  purposeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F4D8CD',
    borderWidth: 1,
    borderColor: '#89AAE6',
  },
  purposeButtonSelected: {
    backgroundColor: '#125E8A',
    borderColor: '#125E8A',
  },
  purposeText: {
    color: '#125E8A',
    fontWeight: '600',
    fontSize: 14,
  },
  purposeTextSelected: {
    color: '#FFFFFF',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dateTimeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    marginBottom: 30,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    gap: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});