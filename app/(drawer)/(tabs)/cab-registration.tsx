import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import dayjs from 'dayjs';
import { supabase } from '@/lib/supabase';
import { useUserContext } from '../../../context/UserContext';
import {
  Home,
  Car,
  Clock,
  ChevronLeft,
  ChevronDown,
  Check,
  Info,
  User,
} from 'lucide-react-native';

interface CabFormData {
  flatNumber: string;
  rideHailingApp: string;
  customRideApp: string;
  vehicle: string;
  customVehicle: string;
  duration: string;
  estimatedArrival: Date;
}

export default function CabRegistrationScreen() {
  const router = useRouter();
  const { passType } = useLocalSearchParams<{ passType: string }>();
  const userContext = useUserContext();

  const extractFlatNumber = (address: string): string => {
    if (!address) return '';
    const match = address.match(/Unit\s+([A-Za-z0-9\-\/]+)/i);
    if (match) return match[1];
    const fallbackMatch = address.match(/^([A-Za-z0-9\-\/]+)/);
    return fallbackMatch ? fallbackMatch[1] : '';
  };

  const userFlatNumber = userContext?.profileData?.address 
    ? extractFlatNumber(userContext.profileData.address)
    : '';

  const [formData, setFormData] = useState<CabFormData>({
    flatNumber: userFlatNumber,
    rideHailingApp: '',
    customRideApp: '',
    vehicle: '',
    customVehicle: '',
    duration: '30',
    estimatedArrival: new Date(Date.now() + 30 * 60 * 1000),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRideAppDropdown, setShowRideAppDropdown] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [rideAppSearch, setRideAppSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');
  
  const rideHailingApps = ['Ola', 'Rapido', 'Uber', 'Other'];
  const vehicleTypes = ['Bike', 'Auto', 'Car', 'Other'];
  const durationOptions = [
    { label: '30 minutes', value: '30' },
    { label: '45 minutes', value: '45' },
    { label: '1 hour', value: '60' },
  ];

  const filteredRideApps = rideHailingApps.filter(app =>
    app.toLowerCase().includes(rideAppSearch.toLowerCase())
  );

  const filteredVehicleTypes = vehicleTypes.filter(vehicle =>
    vehicle.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  useEffect(() => {
    const durationInMinutes = parseInt(formData.duration);
    const newArrivalTime = new Date(Date.now() + durationInMinutes * 60 * 1000);
    setFormData(prev => ({ ...prev, estimatedArrival: newArrivalTime }));
  }, [formData.duration]);

  const validateForm = (): boolean => {
    if (!formData.flatNumber.trim()) {
      Alert.alert('Missing Info', 'Flat number is missing');
      return false;
    }
    if (!formData.rideHailingApp.trim()) {
      Alert.alert('Validation Error', 'Please select ride hailing app');
      return false;
    }
    if (formData.rideHailingApp === 'Other' && !formData.customRideApp.trim()) {
      Alert.alert('Validation Error', 'Please enter the ride hailing app name');
      return false;
    }
    if (!formData.vehicle.trim()) {
      Alert.alert('Validation Error', 'Please select vehicle type');
      return false;
    }
    if (formData.vehicle === 'Other' && !formData.customVehicle.trim()) {
      Alert.alert('Validation Error', 'Please enter the vehicle type');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const rideAppName = formData.rideHailingApp === 'Other' ? formData.customRideApp.trim() : formData.rideHailingApp;
      const vehicleType = formData.vehicle === 'Other' ? formData.customVehicle.trim() : formData.vehicle;
      const durationInMinutes = parseInt(formData.duration);

      const { data, error } = await supabase.from('cab_passes').insert([
        {
          flat_number: formData.flatNumber.trim(),
          ride_hailing_app: rideAppName,
          vehicle_type: vehicleType,
          duration: `${durationInMinutes} minutes`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]).select().single();

      if (error) {
        console.error('Supabase error:', error);
        Alert.alert('Error', 'Failed to save cab pass');
        return;
      }

      Alert.alert('Success', 'Cab pass created successfully', [
        { text: 'OK', onPress: () => router.push('../(tabs)/gate') }
      ]);

    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7C3AED', '#A855F7']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('../(tabs)/gate')}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cab Registration</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
          setShowRideAppDropdown(false);
          setShowVehicleDropdown(false);
          setRideAppSearch('');
          setVehicleSearch('');
        }}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Pass Type Info */}
            <View style={styles.passTypeCard}>
              <View style={styles.passTypeHeader}>
                <Car size={24} color="#7C3AED" />
                <Text style={styles.passTypeTitle}>Cab Pass</Text>
              </View>
              <Text style={styles.passTypeDescription}>
                Register your cab ride to get a temporary access pass
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Flat Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Home size={16} color="#7C3AED" /> Flat Number *
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.flatNumber}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, flatNumber: text }))}
                  placeholder="Enter your flat number"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Ride Hailing App Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Car size={16} color="#7C3AED" /> Ride Hailing App *
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowRideAppDropdown(!showRideAppDropdown)}
                >
                  <Text style={[styles.dropdownText, !formData.rideHailingApp && styles.placeholderText]}>
                    {formData.rideHailingApp || 'Select ride hailing app'}
                  </Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
                
                {showRideAppDropdown && (
                  <View style={styles.dropdownList}>
                    <View style={styles.searchContainer}>
                      <TextInput
                        style={styles.searchInput}
                        value={rideAppSearch}
                        onChangeText={setRideAppSearch}
                        placeholder="Search ride apps..."
                        placeholderTextColor="#999"
                      />
                    </View>
                    <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                      {filteredRideApps.map((app) => (
                        <TouchableOpacity
                          key={app}
                          style={[
                            styles.dropdownItem,
                            formData.rideHailingApp === app && styles.dropdownItemSelected
                          ]}
                          onPress={() => {
                            setFormData(prev => ({ ...prev, rideHailingApp: app }));
                            setShowRideAppDropdown(false);
                            setRideAppSearch('');
                          }}
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            formData.rideHailingApp === app && styles.dropdownItemTextSelected
                          ]}>
                            {app}
                          </Text>
                          {formData.rideHailingApp === app && (
                            <Check size={16} color="#7C3AED" />
                          )}
                        </TouchableOpacity>
                      ))}
                      {filteredRideApps.length === 0 && (
                        <View style={styles.noResultsContainer}>
                          <Text style={styles.noResultsText}>No apps found</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Custom Ride App (if Other is selected) */}
              {formData.rideHailingApp === 'Other' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ride Hailing App Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.customRideApp}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, customRideApp: text }))}
                    placeholder="Enter ride hailing app name"
                    placeholderTextColor="#999"
                  />
                </View>
              )}

              {/* Vehicle Type Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Car size={16} color="#7C3AED" /> Vehicle Type *
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowVehicleDropdown(!showVehicleDropdown)}
                >
                  <Text style={[styles.dropdownText, !formData.vehicle && styles.placeholderText]}>
                    {formData.vehicle || 'Select vehicle type'}
                  </Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
                
                {showVehicleDropdown && (
                  <View style={styles.dropdownList}>
                    <View style={styles.searchContainer}>
                      <TextInput
                        style={styles.searchInput}
                        value={vehicleSearch}
                        onChangeText={setVehicleSearch}
                        placeholder="Search vehicle types..."
                        placeholderTextColor="#999"
                      />
                    </View>
                    <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                      {filteredVehicleTypes.map((vehicle) => (
                        <TouchableOpacity
                          key={vehicle}
                          style={[
                            styles.dropdownItem,
                            formData.vehicle === vehicle && styles.dropdownItemSelected
                          ]}
                          onPress={() => {
                            setFormData(prev => ({ ...prev, vehicle }));
                            setShowVehicleDropdown(false);
                            setVehicleSearch('');
                          }}
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            formData.vehicle === vehicle && styles.dropdownItemTextSelected
                          ]}>
                            {vehicle}
                          </Text>
                          {formData.vehicle === vehicle && (
                            <Check size={16} color="#7C3AED" />
                          )}
                        </TouchableOpacity>
                      ))}
                      {filteredVehicleTypes.length === 0 && (
                        <View style={styles.noResultsContainer}>
                          <Text style={styles.noResultsText}>No vehicle types found</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Custom Vehicle (if Other is selected) */}
              {formData.vehicle === 'Other' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Vehicle Type *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.customVehicle}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, customVehicle: text }))}
                    placeholder="Enter vehicle type"
                    placeholderTextColor="#999"
                  />
                </View>
              )}

              {/* Duration */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Clock size={16} color="#7C3AED" /> Duration
                </Text>
                <View style={styles.durationSelector}>
                  {durationOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.durationOption,
                        formData.duration === option.value && styles.durationOptionSelected
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, duration: option.value }))}
                    >
                      <Text style={[
                        styles.durationOptionText,
                        formData.duration === option.value && styles.durationOptionTextSelected
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Estimated Arrival Time */}
              <View style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Info size={20} color="#7C3AED" />
                  <Text style={styles.infoTitle}>Estimated Arrival</Text>
                </View>
                <Text style={styles.arrivalTime}>
                  {dayjs(formData.estimatedArrival).format('h:mm A')}
                </Text>
                <Text style={styles.arrivalDate}>
                  {dayjs(formData.estimatedArrival).format('MMM DD, YYYY')}
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={isSubmitting ? ['#ccc', '#999'] : ['#7C3AED', '#A855F7']}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Creating Pass...' : 'Create Cab Pass'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  passTypeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  passTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginLeft: 10,
  },
  passTypeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 5,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333',
  },
  dropdownScrollView: {
    maxHeight: 180,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemSelected: {
    backgroundColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  durationSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  durationOptionSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  durationOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  durationOptionTextSelected: {
    color: '#FFFFFF',
  },
  infoCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
    marginLeft: 8,
  },
  arrivalTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  arrivalDate: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    padding: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});