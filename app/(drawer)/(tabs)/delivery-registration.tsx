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
  Truck,
  Clock,
  ChevronLeft,
  ChevronDown,
  Check,
  Info,
  User,
} from 'lucide-react-native';

interface DeliveryFormData {
  flatNumber: string;
  deliveryApp: string;
  customDeliveryApp: string;
  estimatedDuration: string;
  estimatedArrival: Date;
}

export default function DeliveryRegistrationScreen() {
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

  const [formData, setFormData] = useState<DeliveryFormData>({
    flatNumber: userFlatNumber,
    deliveryApp: '',
    customDeliveryApp: '',
    estimatedDuration: '30',
    estimatedArrival: new Date(Date.now() + 30 * 60 * 1000),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeliveryAppDropdown, setShowDeliveryAppDropdown] = useState(false);
  const [deliveryAppSearch, setDeliveryAppSearch] = useState('');
  const deliveryApps = [ 'Zepto','Blinkit','Amazon','Flipkart','Swiggy','Zomato','BigBasket','Dunzo','Other' ];
  const durationOptions = [
    { label: '30 minutes', value: '30' },
    { label: '45 minutes', value: '45' },
    { label: '1 hour', value: '60' },
  ];

  const filteredDeliveryApps = deliveryApps.filter(app =>
    app.toLowerCase().includes(deliveryAppSearch.toLowerCase())
  );

  useEffect(() => {
    const durationInMinutes = parseInt(formData.estimatedDuration);
    const newArrivalTime = new Date(Date.now() + durationInMinutes * 60 * 1000);
    setFormData(prev => ({ ...prev, estimatedArrival: newArrivalTime }));
  }, [formData.estimatedDuration]);

  const validateForm = (): boolean => {
    if (!formData.flatNumber.trim()) {
      Alert.alert('Missing Info', 'Flat number is missing');
      return false;
    }
    if (!formData.deliveryApp.trim()) {
      Alert.alert('Validation Error', 'Please select delivery app');
      return false;
    }
    if (formData.deliveryApp === 'Other' && !formData.customDeliveryApp.trim()) {
      Alert.alert('Validation Error', 'Please enter the delivery app name');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const deliveryAppName = formData.deliveryApp === 'Other' ? formData.customDeliveryApp.trim() : formData.deliveryApp;
      const durationInMinutes = parseInt(formData.estimatedDuration);

      const { data, error } = await supabase.from('delivery_passes').insert([
        {
          flat_number: formData.flatNumber.trim(),
          delivery_company: deliveryAppName,
          duration: `${durationInMinutes} minutes`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]).select().single();

      if (error) {
        console.error('Supabase error:', error);
        Alert.alert('Error', 'Failed to save delivery pass');
        return;
      }

      Alert.alert('Success', 'Delivery pass created successfully', [
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
        colors={['#FF6B35', '#FF8C42']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('../(tabs)/gate')}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delivery Registration</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
          setShowDeliveryAppDropdown(false);
          setDeliveryAppSearch('');
        }}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Pass Type Info */}
            <View style={styles.passTypeCard}>
              <View style={styles.passTypeHeader}>
                <Truck size={24} color="#FF6B35" />
                <Text style={styles.passTypeTitle}>Delivery Pass</Text>
              </View>
              <Text style={styles.passTypeDescription}>
                Register your delivery to get a temporary access pass
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Flat Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Home size={16} color="#FF6B35" /> Flat Number *
                </Text>
                <TextInput
                  style={styles.input}
                  value={formData.flatNumber}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, flatNumber: text }))}
                  placeholder="Enter your flat number"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Delivery App Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Truck size={16} color="#FF6B35" /> Delivery App *
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowDeliveryAppDropdown(!showDeliveryAppDropdown)}
                >
                  <Text style={[styles.dropdownText, !formData.deliveryApp && styles.placeholderText]}>
                    {formData.deliveryApp || 'Select delivery app'}
                  </Text>
                  <ChevronDown size={20} color="#666" />
                </TouchableOpacity>
                
                {showDeliveryAppDropdown && (
                  <View style={styles.dropdownList}>
                    <View style={styles.searchContainer}>
                      <TextInput
                        style={styles.searchInput}
                        value={deliveryAppSearch}
                        onChangeText={setDeliveryAppSearch}
                        placeholder="Search delivery apps..."
                        placeholderTextColor="#999"
                      />
                    </View>
                    <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                      {filteredDeliveryApps.map((app) => (
                        <TouchableOpacity
                          key={app}
                          style={[
                            styles.dropdownItem,
                            formData.deliveryApp === app && styles.dropdownItemSelected
                          ]}
                          onPress={() => {
                            setFormData(prev => ({ ...prev, deliveryApp: app }));
                            setShowDeliveryAppDropdown(false);
                            setDeliveryAppSearch('');
                          }}
                        >
                          <Text style={[
                            styles.dropdownItemText,
                            formData.deliveryApp === app && styles.dropdownItemTextSelected
                          ]}>
                            {app}
                          </Text>
                          {formData.deliveryApp === app && (
                            <Check size={16} color="#FF6B35" />
                          )}
                        </TouchableOpacity>
                      ))}
                      {filteredDeliveryApps.length === 0 && (
                        <View style={styles.noResultsContainer}>
                          <Text style={styles.noResultsText}>No apps found</Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Custom Delivery App (if Other is selected) */}
              {formData.deliveryApp === 'Other' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Delivery App Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.customDeliveryApp}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, customDeliveryApp: text }))}
                    placeholder="Enter delivery app name"
                    placeholderTextColor="#999"
                  />
                </View>
              )}

              {/* Estimated Duration */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  <Clock size={16} color="#FF6B35" /> Estimated Duration
                </Text>
                <View style={styles.durationSelector}>
                  {durationOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.durationOption,
                        formData.estimatedDuration === option.value && styles.durationOptionSelected
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, estimatedDuration: option.value }))}
                    >
                      <Text style={[
                        styles.durationOptionText,
                        formData.estimatedDuration === option.value && styles.durationOptionTextSelected
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
                  <Info size={20} color="#FF6B35" />
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
                colors={isSubmitting ? ['#ccc', '#999'] : ['#FF6B35', '#FF8C42']}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Creating Pass...' : 'Create Delivery Pass'}
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
    color: '#FF6B35',
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
    backgroundColor: '#FFF3E0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#FF6B35',
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
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
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
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
    marginLeft: 8,
  },
  arrivalTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
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
