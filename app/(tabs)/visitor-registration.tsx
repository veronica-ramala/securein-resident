
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { supabase } from '@/lib/supabase';
import {
  User,
  Calendar,
  Clock,
  FileText,
  ChevronLeft,
  ChevronDown,
  Check,
} from 'lucide-react-native';

interface VisitorFormData {
  name: string;
  purpose: string;
  fromDate: Date | null;
  toDate: Date | null;
  fromTime: Date | null;
  toTime: Date | null;
}

export default function VisitorRegistrationScreen() {
  const router = useRouter();
  const { passType } = useLocalSearchParams<{ passType: string }>();
  
  const [formData, setFormData] = useState<VisitorFormData>({
    name: '',
    purpose: '',
    fromDate: null,
    toDate: null,
    fromTime: null,
    toTime: null,
  });

  const [showDatePicker, setShowDatePicker] = useState<{
    visible: boolean;
    type: 'fromDate' | 'toDate' | 'fromTime' | 'toTime';
  }>({ visible: false, type: 'fromDate' });

  const [showPurposePicker, setShowPurposePicker] = useState(false);

  const purposes = [
    'Business Meeting',
    'Personal Visit',
    'Delivery',
    'Maintenance',
    'Guest',
    'Service Provider',
    'Other',
  ];

  const vipPurposes = [
    'VIP Guest',
    'Business Executive',
    'Special Event',
    'Board Meeting',
    'Distinguished Visitor',
    'Other',
  ];

  const purposeOptions = passType === 'vip' ? vipPurposes : purposes;

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter visitor name');
      return false;
    }

    if (!formData.purpose) {
      Alert.alert('Validation Error', 'Please select purpose of visit');
      return false;
    }

    if (!formData.fromDate) {
      Alert.alert('Validation Error', 'Please select from date');
      return false;
    }

    if (!formData.toDate) {
      Alert.alert('Validation Error', 'Please select to date');
      return false;
    }

    if (!formData.fromTime) {
      Alert.alert('Validation Error', 'Please select from time');
      return false;
    }

    if (!formData.toTime) {
      Alert.alert('Validation Error', 'Please select to time');
      return false;
    }

    // Validate date range
    const fromDateOnly = dayjs(formData.fromDate).startOf('day');
    const toDateOnly = dayjs(formData.toDate).startOf('day');

    if (toDateOnly.isBefore(fromDateOnly)) {
      Alert.alert('Validation Error', 'To Date must be greater than or equal to From Date');
      return false;
    }

    // Create full datetime objects for proper comparison
    const fromDateTime = dayjs(formData.fromTime);
    const toDateTime = dayjs(formData.toTime);

    // If same date, validate time range
    if (fromDateOnly.isSame(toDateOnly)) {
      if (toDateTime.isBefore(fromDateTime) || toDateTime.isSame(fromDateTime)) {
        Alert.alert('Validation Error', 'To Time must be after From Time when dates are the same');
        return false;
      }
    }

    // Additional validation: ensure the complete from datetime is before to datetime
    if (toDateTime.isBefore(fromDateTime)) {
      Alert.alert('Validation Error', 'End date and time must be after start date and time');
      return false;
    }

    return true;
  };

  const handleDateTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker({ visible: false, type: 'fromDate' });
    }

    if (selectedDate) {
      const { type } = showDatePicker;
      
      if (type.includes('Time')) {
        // For time selection, combine with the corresponding date
        const correspondingDate = type === 'fromTime' ? formData.fromDate : formData.toDate;
        if (correspondingDate) {
          // Create a new date with the selected time but using the corresponding date
          const combinedDateTime = new Date(correspondingDate);
          combinedDateTime.setHours(selectedDate.getHours());
          combinedDateTime.setMinutes(selectedDate.getMinutes());
          combinedDateTime.setSeconds(0);
          combinedDateTime.setMilliseconds(0);
          
          setFormData(prev => ({
            ...prev,
            [type]: combinedDateTime,
          }));
        }
      } else {
        // For date selection, just set the date
        setFormData(prev => ({
          ...prev,
          [type]: selectedDate,
        }));

        // Reset dependent time fields when date changes
        if (type === 'fromDate' && formData.fromTime) {
          setFormData(prev => ({ ...prev, fromTime: null }));
        }
        if (type === 'toDate' && formData.toTime) {
          setFormData(prev => ({ ...prev, toTime: null }));
        }
      }
    }

    if (Platform.OS === 'ios') {
      // Keep picker open on iOS
    }
  };

  const showDateTimePicker = (type: 'fromDate' | 'toDate' | 'fromTime' | 'toTime') => {
    // Prevent time selection if corresponding date is not selected
    if (type === 'fromTime' && !formData.fromDate) {
      Alert.alert('Please select From Date first');
      return;
    }
    if (type === 'toTime' && !formData.toDate) {
      Alert.alert('Please select To Date first');
      return;
    }

    setShowDatePicker({ visible: true, type });
  };

  const hideDateTimePicker = () => {
    setShowDatePicker({ visible: false, type: 'fromDate' });
  };

  const formatDate = (date: Date | null): string => {
    return date ? dayjs(date).format('YYYY-MM-DD') : '';
  };

  const formatTime = (time: Date | null): string => {
    return time ? dayjs(time).format('hh:mm A') : '';
  };

  const formatDateTime = (date: Date | null): string => {
    return date ? dayjs(date).format('MMM DD, YYYY hh:mm A') : '';
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Use the actual datetime objects which already have correct date+time combinations
        const formattedVisitTime = dayjs(formData.fromTime).toISOString();
        const formattedExpiryTime = dayjs(formData.toTime).toISOString();

        const { data, error } = await supabase.from('visitor_pass').insert([
          {
            name: formData.name,
            purpose: formData.purpose,
            visit_date: formatDate(formData.fromDate),
            expiry_date: formatDate(formData.toDate),
            visit_time: formattedVisitTime,
            expiry_time: formattedExpiryTime,
            pass_type: passType || 'visitor',
          }
        ]).select().single();

        if (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to save to database');
          return;
        }

        // Navigate to QR generation screen with form data
        router.push({
          pathname: '/(tabs)/visitor-qr',
          params: {
            passType,
            visitorName: formData.name,
            purpose: formData.purpose,
            fromDate: formatDate(formData.fromDate),
            toDate: formatDate(formData.toDate),
            fromTime: formatTime(formData.fromTime),
            toTime: formatTime(formData.toTime),
            // Also pass the complete datetime for QR generation
            fromDateTime: formattedVisitTime,
            toDateTime: formattedExpiryTime,
          }
        });
      } catch (error) {
        console.error('Error saving visitor pass:', error);
        Alert.alert('Error', 'Failed to save visitor pass');
      }
    }
  };

  const getMinimumDate = (type: 'fromDate' | 'toDate' | 'fromTime' | 'toTime'): Date => {
    const now = new Date();
    
    switch (type) {
      case 'fromDate':
        return now;
      case 'toDate':
        return formData.fromDate || now;
      case 'fromTime':
        // If from date is today, minimum time is current time
        if (formData.fromDate && dayjs(formData.fromDate).isSame(dayjs(), 'day')) {
          return now;
        }
        // If from date is in future, any time is allowed
        return new Date(2000, 0, 1, 0, 0); // Arbitrary early time
      case 'toTime':
        // If to date is same as from date and from time is selected
        if (formData.toDate && formData.fromDate && formData.fromTime &&
            dayjs(formData.toDate).isSame(dayjs(formData.fromDate), 'day')) {
          // Minimum to time should be after from time
          const minTime = new Date(formData.fromTime);
          minTime.setMinutes(minTime.getMinutes() + 1); // At least 1 minute after
          return minTime;
        }
        // If to date is today, minimum time is current time
        if (formData.toDate && dayjs(formData.toDate).isSame(dayjs(), 'day')) {
          return now;
        }
        // If to date is in future, any time is allowed
        return new Date(2000, 0, 1, 0, 0); // Arbitrary early time
      default:
        return now;
    }
  };

  const getDateTimePickerMode = (type: 'fromDate' | 'toDate' | 'fromTime' | 'toTime') => {
    return type.includes('Date') ? 'date' : 'time';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={passType === 'vip' ? ['#047857', '#10B981'] : ['#125E8A', '#89AAE6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {passType === 'vip' ? 'VIP' : 'Visitor'} Registration
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.headerSubtitle}>
          Fill in the details to generate {passType === 'vip' ? 'VIP' : 'visitor'} pass
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>
            {passType === 'vip' ? 'VIP Guest' : 'Visitor'} Details
          </Text>

          {/* Visitor Name */}
          <View style={styles.inputContainer}>
            <User size={20} color={passType === 'vip' ? '#047857' : '#89AAE6'} />
            <TextInput
              style={styles.input}
              placeholder={`${passType === 'vip' ? 'VIP Guest' : 'Visitor'} Full Name *`}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholderTextColor="#666"
            />
          </View>

          {/* Purpose of Visit */}
          <Text style={styles.fieldLabel}>Purpose of Visit *</Text>
          <View style={styles.pickerWrapper}>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowPurposePicker(!showPurposePicker)}
            >
              <FileText size={20} color={passType === 'vip' ? '#047857' : '#89AAE6'} />
              <Text style={[styles.pickerText, !formData.purpose && styles.placeholderText]}>
                {formData.purpose || 'Select purpose of visit'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>

          </View>

          {/* Date Range */}
          <Text style={styles.fieldLabel}>Visit Duration *</Text>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.dateTimeLabel}>From Date</Text>
              <TouchableOpacity
                style={styles.dateTimeContainer}
                onPress={() => showDateTimePicker('fromDate')}
              >
                <Calendar size={20} color={passType === 'vip' ? '#047857' : '#89AAE6'} />
                <Text style={[styles.dateTimeText, !formData.fromDate && styles.placeholderText]}>
                  {formatDate(formData.fromDate) || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeColumn}>
              <Text style={styles.dateTimeLabel}>To Date</Text>
              <TouchableOpacity
                style={styles.dateTimeContainer}
                onPress={() => showDateTimePicker('toDate')}
              >
                <Calendar size={20} color={passType === 'vip' ? '#047857' : '#89AAE6'} />
                <Text style={[styles.dateTimeText, !formData.toDate && styles.placeholderText]}>
                  {formatDate(formData.toDate) || 'Select date'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Time Range */}
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.dateTimeLabel}>From Time</Text>
              <TouchableOpacity
                style={[
                  styles.dateTimeContainer,
                  !formData.fromDate && styles.disabledContainer,
                ]}
                onPress={() => showDateTimePicker('fromTime')}
                disabled={!formData.fromDate}
              >
                <Clock size={20} color={
                  !formData.fromDate 
                    ? '#ccc' 
                    : passType === 'vip' ? '#047857' : '#89AAE6'
                } />
                <Text style={[
                  styles.dateTimeText,
                  !formData.fromTime && styles.placeholderText,
                  !formData.fromDate && styles.disabledText,
                ]}>
                  {formatTime(formData.fromTime) || 'Select time'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeColumn}>
              <Text style={styles.dateTimeLabel}>To Time</Text>
              <TouchableOpacity
                style={[
                  styles.dateTimeContainer,
                  !formData.toDate && styles.disabledContainer,
                ]}
                onPress={() => showDateTimePicker('toTime')}
                disabled={!formData.toDate}
              >
                <Clock size={20} color={
                  !formData.toDate 
                    ? '#ccc' 
                    : passType === 'vip' ? '#047857' : '#89AAE6'
                } />
                <Text style={[
                  styles.dateTimeText,
                  !formData.toTime && styles.placeholderText,
                  !formData.toDate && styles.disabledText,
                ]}>
                  {formatTime(formData.toTime) || 'Select time'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Validation Info */}
          <View style={styles.validationInfo}>
            <Text style={styles.validationText}>
              • To Date must be greater than or equal to From Date
            </Text>
            <Text style={styles.validationText}>
              • If dates are the same, To Time must be after From Time
            </Text>
            <Text style={styles.validationText}>
              • Time selection is available only after selecting the corresponding date
            </Text>
            <Text style={styles.validationText}>
              • Times are automatically combined with their respective dates
            </Text>
            {formData.fromTime && (
              <Text style={[styles.validationText, { fontWeight: '600', color: '#047857' }]}>
                Start: {formatDateTime(formData.fromTime)}
              </Text>
            )}
            {formData.toTime && (
              <Text style={[styles.validationText, { fontWeight: '600', color: '#047857' }]}>
                End: {formatDateTime(formData.toTime)}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={passType === 'vip' ? ['#047857', '#10B981'] : ['#125E8A', '#89AAE6']}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>
              Generate {passType === 'vip' ? 'VIP' : 'Visitor'} Pass
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Date/Time Picker */}
      {showDatePicker.visible && (
        <DateTimePicker
          value={
            formData[showDatePicker.type] || 
            getMinimumDate(showDatePicker.type)
          }
          mode={getDateTimePickerMode(showDatePicker.type)}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateTimeChange}
          minimumDate={getMinimumDate(showDatePicker.type)}
          onTouchCancel={hideDateTimePicker}
        />
      )}

      {/* Purpose Selection Modal */}
      <Modal
        visible={showPurposePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPurposePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPurposePicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Purpose of Visit</Text>
            <ScrollView style={styles.purposeList} showsVerticalScrollIndicator={false}>
              {purposeOptions.map((purpose) => (
                <TouchableOpacity
                  key={purpose}
                  style={styles.purposeOption}
                  onPress={() => {
                    setFormData({ ...formData, purpose });
                    setShowPurposePicker(false);
                  }}
                >
                  <Text style={styles.purposeOptionText}>{purpose}</Text>
                  {formData.purpose === purpose && (
                    <Check size={16} color={passType === 'vip' ? '#047857' : '#125E8A'} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#F4D8CD',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
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
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 20,
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
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#125E8A',
    marginBottom: 10,
  },
  pickerWrapper: {
    marginBottom: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pickerText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  placeholderText: {
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 15,
    textAlign: 'center',
  },
  purposeList: {
    maxHeight: 300,
  },
  purposeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: 44,
  },
  purposeOptionText: {
    fontSize: 16,
    color: '#000',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  dateTimeColumn: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disabledContainer: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D0D0D0',
  },
  dateTimeText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
  disabledText: {
    color: '#ccc',
  },
  validationInfo: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  validationText: {
    fontSize: 12,
    color: '#0369A1',
    marginBottom: 5,
    lineHeight: 16,
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