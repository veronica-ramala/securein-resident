import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, ChevronLeft, Plus, Car, Home, Dog, Trash2, Save, Camera, Image as ImageIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useUserContext } from '../../../context/UserContext';
import { useSmartNavigation } from '@/hooks/useBackHandler';

export default function EditProfileScreen() {
  const router = useRouter();
  const { navigateBack } = useSmartNavigation();
  const userContext = useUserContext();
  const profileData = userContext?.profileData || {
    name: '',
    phone: '',
    profession: '',
    email: '',
    address: '',
    profilePhoto: null,
    familyMembers: [],
    vehicles: [],
    pets: []
  };
  const updateProfileData = userContext?.updateProfileData || (() => {
    console.warn('updateProfileData function not available from UserContext');
  });
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(profileData.profilePhoto);
  
  // Use data from context
  const [profile, setProfile] = useState({
    name: profileData.name,
    phone: profileData.phone,
    profession: profileData.profession || '',
    email: profileData.email,
    address: profileData.address,
    familyMembers: profileData.familyMembers,
    vehicles: profileData.vehicles,
    pets: profileData.pets
  });

  // Define renderIcon function to handle icon rendering
  const renderIcon = (Icon: any, size: number, color: string) => {
    return <Icon size={size} color={color} />;
  };
  
  // Function to request camera permissions
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Please allow camera access to take profile photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };
  
  // Function to request gallery permissions
  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Please allow gallery access to select profile photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };
  
  // Function to take a photo with camera
  const takePhoto = async () => {
    const hasCameraPermission = await requestCameraPermission();
    if (!hasCameraPermission) return;
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
      setPhotoModalVisible(false);
    }
  };
  
  // Function to select photo from gallery
  const selectFromGallery = async () => {
    const hasGalleryPermission = await requestGalleryPermission();
    if (!hasGalleryPermission) return;
    
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
      setPhotoModalVisible(false);
    }
  };

  // Handler for adding a new family member
  const addFamilyMember = () => {
    const newId = (profile.familyMembers.length + 1).toString();
    const newMember = { 
      id: newId, 
      name: 'New Family Member', 
      relation: 'Relation', 
      phone: '555-000-0000' 
    };
    setProfile({
      ...profile,
      familyMembers: [...profile.familyMembers, newMember]
    });
  };

  // Handler for adding a new vehicle
  const addVehicle = () => {
    const newId = (profile.vehicles.length + 1).toString();
    const newVehicle = { 
      id: newId, 
      make: 'New', 
      model: 'Vehicle', 
      year: '2023', 
      color: 'Color', 
      licensePlate: 'License' 
    };
    setProfile({
      ...profile,
      vehicles: [...profile.vehicles, newVehicle]
    });
  };

  // Handler for adding a new pet
  const addPet = () => {
    const newId = (profile.pets.length + 1).toString();
    const newPet = { 
      id: newId, 
      name: 'New Pet', 
      type: 'Type', 
      breed: 'Breed' 
    };
    setProfile({
      ...profile,
      pets: [...profile.pets, newPet]
    });
  };
  
  // Handlers for removing items
  const removeFamilyMember = (id: string) => {
    setProfile({
      ...profile,
      familyMembers: profile.familyMembers.filter((member: any) => member.id !== id)
    });
  };
  
  const removeVehicle = (id: string) => {
    setProfile({
      ...profile,
      vehicles: profile.vehicles.filter((vehicle: any) => vehicle.id !== id)
    });
  };
  
  const removePet = (id: string) => {
    setProfile({
      ...profile,
      pets: profile.pets.filter((pet: any) => pet.id !== id)
    });
  };

  // Handler for saving all changes
  const saveChanges = () => {
    // In a real app, you would save this to a database or API
    // For this demo, we'll just show a success message
    
    // Validate data before saving
    if (!profile.name.trim()) {
      alert('Full name cannot be empty!');
      return;
    }
    
    if (!profile.phone.trim()) {
      alert('Phone number cannot be empty!');
      return;
    }
    
    if (!profile.email.trim()) {
      alert('Email address cannot be empty!');
      return;
    }
    
    // Check family members data
    for (let member of profile.familyMembers) {
      if (!member.name.trim()) {
        alert('Family member name cannot be empty!');
        return;
      }
    }
    
    // Check vehicles data
    for (let vehicle of profile.vehicles) {
      if (!vehicle.make.trim() || !vehicle.model.trim()) {
        alert('Vehicle make and model cannot be empty!');
        return;
      }
    }
    
    // Check pets data
    for (let pet of profile.pets) {
      if (!pet.name.trim()) {
        alert('Pet name cannot be empty!');
        return;
      }
    }
    
    // Save the data to our context
    updateProfileData({
      ...profile,
      profilePhoto: profilePhoto
    });
    
    alert('Profile information saved successfully!');
    router.push('../(tabs)/profile'); // Go back to profile page
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#125E8A', '#89AAE6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.push('../(tabs)/profile')}
          >
            {renderIcon(ChevronLeft, 24, "#FFFFFF")}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
              ) : (
                renderIcon(User, 40, "#125E8A")
              )}
            </View>
            <TouchableOpacity 
              style={styles.changePhotoButton}
              onPress={() => setPhotoModalVisible(true)}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
          
          {/* Photo Selection Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={photoModalVisible}
            onRequestClose={() => setPhotoModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Update Profile Photo</Text>
                
                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={takePhoto}
                >
                  <Camera size={24} color="#125E8A" />
                  <Text style={styles.modalOptionText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={selectFromGallery}
                >
                  <ImageIcon size={24} color="#125E8A" />
                  <Text style={styles.modalOptionText}>Choose from Gallery</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalOption, styles.cancelOption]}
                  onPress={() => setPhotoModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput 
                style={styles.input}
                value={profile.name}
                onChangeText={(text) => setProfile({...profile, name: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input}
                value={profile.phone}
                onChangeText={(text) => setProfile({...profile, phone: text})}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profession</Text>
              <TextInput 
                style={styles.input}
                value={profile.profession}
                onChangeText={(text) => setProfile({...profile, profession: text})}
                placeholder="Enter your profession"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput 
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => setProfile({...profile, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Residential Address</Text>
              <TextInput 
                style={styles.input}
                value={profile.address}
                onChangeText={(text) => setProfile({...profile, address: text})}
              />
            </View>
          </View>

          {/* Family Members Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Family Members</Text>
              <TouchableOpacity onPress={addFamilyMember} style={styles.addButton}>
                {renderIcon(Plus, 16, "#125E8A")}
              </TouchableOpacity>
            </View>
            
            {profile.familyMembers.map((member: any) => (
              <View key={member.id} style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  {renderIcon(User, 20, "#125E8A")}
                </View>
                <View style={styles.infoDetails}>
                  <TextInput 
                    style={styles.itemInput}
                    value={member.name}
                    onChangeText={(text) => {
                      const updatedMembers = profile.familyMembers.map((m: any) => 
                        m.id === member.id ? {...m, name: text} : m
                      );
                      setProfile({...profile, familyMembers: updatedMembers});
                    }}
                  />
                  <TextInput 
                    style={styles.itemInput}
                    value={member.relation}
                    onChangeText={(text) => {
                      const updatedMembers = profile.familyMembers.map((m: any) => 
                        m.id === member.id ? {...m, relation: text} : m
                      );
                      setProfile({...profile, familyMembers: updatedMembers});
                    }}
                  />
                  <TextInput 
                    style={styles.itemInput}
                    value={member.phone}
                    keyboardType="phone-pad"
                    onChangeText={(text) => {
                      const updatedMembers = profile.familyMembers.map((m: any) => 
                        m.id === member.id ? {...m, phone: text} : m
                      );
                      setProfile({...profile, familyMembers: updatedMembers});
                    }}
                  />
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => removeFamilyMember(member.id)}
                >
                  {renderIcon(Trash2, 18, "#EF4444")}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Vehicles Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vehicles</Text>
              <TouchableOpacity onPress={addVehicle} style={styles.addButton}>
                {renderIcon(Plus, 16, "#125E8A")}
              </TouchableOpacity>
            </View>
            
            {profile.vehicles.map((vehicle: any) => (
              <View key={vehicle.id} style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  {renderIcon(Car, 20, "#125E8A")}
                </View>
                <View style={styles.infoDetails}>
                  <View style={styles.vehicleRow}>
                    <TextInput 
                      style={[styles.itemInput, {width: '30%'}]}
                      value={vehicle.year}
                      keyboardType="number-pad"
                      onChangeText={(text) => {
                        const updatedVehicles = profile.vehicles.map((v: any) => 
                          v.id === vehicle.id ? {...v, year: text} : v
                        );
                        setProfile({...profile, vehicles: updatedVehicles});
                      }}
                    />
                    <TextInput 
                      style={[styles.itemInput, {width: '30%'}]}
                      value={vehicle.make}
                      onChangeText={(text) => {
                        const updatedVehicles = profile.vehicles.map((v: any) => 
                          v.id === vehicle.id ? {...v, make: text} : v
                        );
                        setProfile({...profile, vehicles: updatedVehicles});
                      }}
                    />
                    <TextInput 
                      style={[styles.itemInput, {width: '30%'}]}
                      value={vehicle.model}
                      onChangeText={(text) => {
                        const updatedVehicles = profile.vehicles.map((v: any) => 
                          v.id === vehicle.id ? {...v, model: text} : v
                        );
                        setProfile({...profile, vehicles: updatedVehicles});
                      }}
                    />
                  </View>
                  <View style={styles.labeledInput}>
                    <Text style={styles.smallLabel}>Color:</Text>
                    <TextInput 
                      style={styles.itemInput}
                      value={vehicle.color}
                      onChangeText={(text) => {
                        const updatedVehicles = profile.vehicles.map((v: any) => 
                          v.id === vehicle.id ? {...v, color: text} : v
                        );
                        setProfile({...profile, vehicles: updatedVehicles});
                      }}
                    />
                  </View>
                  <View style={styles.labeledInput}>
                    <Text style={styles.smallLabel}>License Plate:</Text>
                    <TextInput 
                      style={styles.itemInput}
                      value={vehicle.licensePlate}
                      onChangeText={(text) => {
                        const updatedVehicles = profile.vehicles.map((v: any) => 
                          v.id === vehicle.id ? {...v, licensePlate: text} : v
                        );
                        setProfile({...profile, vehicles: updatedVehicles});
                      }}
                    />
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => removeVehicle(vehicle.id)}
                >
                  {renderIcon(Trash2, 18, "#EF4444")}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Pets Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pets</Text>
              <TouchableOpacity onPress={addPet} style={styles.addButton}>
                {renderIcon(Plus, 16, "#125E8A")}
              </TouchableOpacity>
            </View>
            
            {profile.pets.map((pet: any) => (
              <View key={pet.id} style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  {renderIcon(Dog, 20, "#125E8A")}
                </View>
                <View style={styles.infoDetails}>
                  <TextInput 
                    style={styles.itemInput}
                    value={pet.name}
                    onChangeText={(text) => {
                      const updatedPets = profile.pets.map((p: any) => 
                        p.id === pet.id ? {...p, name: text} : p
                      );
                      setProfile({...profile, pets: updatedPets});
                    }}
                  />
                  <TextInput 
                    style={styles.itemInput}
                    value={pet.type}
                    onChangeText={(text) => {
                      const updatedPets = profile.pets.map((p: any) => 
                        p.id === pet.id ? {...p, type: text} : p
                      );
                      setProfile({...profile, pets: updatedPets});
                    }}
                  />
                  <View style={styles.labeledInput}>
                    <Text style={styles.smallLabel}>Breed:</Text>
                    <TextInput 
                      style={styles.itemInput}
                      value={pet.breed}
                      onChangeText={(text) => {
                        const updatedPets = profile.pets.map((p: any) => 
                          p.id === pet.id ? {...p, breed: text} : p
                        );
                        setProfile({...profile, pets: updatedPets});
                      }}
                    />
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => removePet(pet.id)}
                >
                  {renderIcon(Trash2, 18, "#EF4444")}
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Fixed Floating Save Button */}
          <View style={styles.floatingButtonContainer}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveChanges}
            >
              {renderIcon(Save, 24, "#FFFFFF")}
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footer} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: '#125E8A',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 16,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(18, 94, 138, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(18, 94, 138, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoDetails: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  infoSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  infoDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  floatingButtonContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#125E8A',
    borderRadius: 10,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
  footer: {
    height: 40,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  itemInput: {
    fontSize: 14,
    color: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 4,
    marginBottom: 4,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  labeledInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  smallLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
    width: 80,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#1F2937',
  },
  cancelOption: {
    justifyContent: 'center',
    marginTop: 10,
    borderBottomWidth: 0,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
  },
});