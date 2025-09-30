
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
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { supabase } from '@/lib/supabase';
import { useUserContext } from '../../../context/UserContext';
import {
  User,
  Calendar,
  Clock,
  FileText,
  ChevronLeft,
  ChevronDown,
  Check,
  Info,
} from 'lucide-react-native';
// ✅ Step 1: Extract flat number from user address
const extractFlatNumber = (address: string): string => {
  if (!address) return '';
  // Match patterns like "Unit A-101" or "A-101" 
  const match = address.match(/Unit\s+([A-Za-z0-9\-\/]+)/i);
  if (match) return match[1];
  // Fallback to match patterns at the beginning like "A-101"
  const fallbackMatch = address.match(/^([A-Za-z0-9\-\/]+)/);
  return fallbackMatch ? fallbackMatch[1] : '';
};

// ✅ Step 2: Create a React Native compatible ID generator with house/flat number
const generateVisitorId = (flatNumber: string): string => {
  // Generate readable date and time format: YYYYMMDD-HHMM
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  const dateTimeString = `${year}${month}${day}-${hours}${minutes}`;
  
  // Format: FLAT-YYYYMMDD-HHMM (e.g., A-101-20250723-1639)
  return flatNumber ? `${flatNumber}-${dateTimeString}` : `GUEST-${dateTimeString}`;
};

interface VisitorFormData {
  name: string;
  phoneNumber: string;
  purpose: string;
  fromDate: Date | null;
  toDate: Date | null;
  fromTime: Date | null;
  toTime: Date | null;
}

export default function VisitorRegistrationScreen() {
  const router = useRouter();
  const { passType } = useLocalSearchParams<{ passType: string }>();
  const userContext = useUserContext();
  
  const [formData, setFormData] = useState<VisitorFormData>({
    name: '',
    phoneNumber: '',
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
  
  // 🔒 Loading state to prevent multiple submissions and ensure single QR generation
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      purpose: '',
      fromDate: null,
      toDate: null,
      fromTime: null,
      toTime: null,
    });
    setShowPurposePicker(false);
    setShowDatePicker({ visible: false, type: 'fromDate' });
  };

  // Reset form when screen is focused (user navigates back)
  useFocusEffect(
    React.useCallback(() => {
      resetForm();
    }, [])
  );

  const purposes = [
    'Business Meeting',
    'Personal Visit',
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

    if (!formData.phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter phone number');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
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
    // Since fromTime and toTime now contain combined date+time, use them directly
    const fromDateTime = dayjs(formData.fromTime);
    const toDateTime = dayjs(formData.toTime);

    // Validate that end datetime is after start datetime
    if (toDateTime.isBefore(fromDateTime) || toDateTime.isSame(fromDateTime)) {
      Alert.alert(
        'Validation Error', 
        'End date and time must be after start date and time. Please ensure at least 15 minutes difference.'
      );
      return false;
    }

    // Additional validation: ensure minimum duration (15 minutes)
    const durationMinutes = toDateTime.diff(fromDateTime, 'minutes');
    if (durationMinutes <= 0) {
      Alert.alert(
        'Validation Error', 
        'End date and time must be after start date and time. Please check your selection.'
      );
      return false;
    }
    
    if (durationMinutes < 15) {
      Alert.alert(
        'Validation Error', 
        'Visit duration must be at least 15 minutes. Please adjust your times.'
      );
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
        // For time selection, ensure corresponding date is selected first
        const correspondingDate = type === 'fromTime' ? formData.fromDate : formData.toDate;
        
        if (!correspondingDate) {
          Alert.alert(
            'Date Required', 
            `Please select ${type === 'fromTime' ? 'From Date' : 'To Date'} first before selecting time.`
          );
          return;
        }

        // Create a new Date object using the corresponding date
        const combinedDateTime = new Date(correspondingDate);
        // Set the time components from the selected time
        combinedDateTime.setHours(selectedDate.getHours());
        combinedDateTime.setMinutes(selectedDate.getMinutes());
        combinedDateTime.setSeconds(0);
        combinedDateTime.setMilliseconds(0);
        
        // Special validation for toTime to prevent zero or negative duration
        if (type === 'toTime' && formData.fromTime) {
          const durationMinutes = dayjs(combinedDateTime).diff(dayjs(formData.fromTime), 'minutes');
          
          if (durationMinutes <= 0) {
            Alert.alert(
              'Invalid Time Selection',
              'To Time must be after From Time. Please select a time that creates a positive duration.',
              [{ text: 'OK', style: 'default' }]
            );
            return; // Don't update the state with invalid time
          }
          
          if (durationMinutes < 15) {
            Alert.alert(
              'Minimum Duration Required',
              `Selected duration is ${durationMinutes} minutes. Please select a time that creates at least 15 minutes duration.`,
              [{ text: 'OK', style: 'default' }]
            );
            return; // Don't update the state with invalid time
          }
        }
        
        setFormData(prev => ({
          ...prev,
          [type]: combinedDateTime,
        }));
      } else {
        // For date selection, set the date and reset corresponding time
        setFormData(prev => {
          const newData = {
            ...prev,
            [type]: selectedDate,
          };
          
          // Reset corresponding time when date changes to avoid confusion
          if (type === 'fromDate') {
            newData.fromTime = null;
          } else if (type === 'toDate') {
            newData.toTime = null;
          }
          
          return newData;
        });
      }
    }

    if (Platform.OS === 'ios') {
      // Keep picker open on iOS for better UX
    }
  };

  const showDateTimePicker = (type: 'fromDate' | 'toDate' | 'fromTime' | 'toTime') => {
    // Prevent time selection if corresponding date is not selected
    if (type === 'fromTime' && !formData.fromDate) {
      Alert.alert(
        'Date Required', 
        'Please select From Date first before selecting From Time.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    
    if (type === 'toTime' && !formData.toDate) {
      Alert.alert(
        'Date Required', 
        'Please select To Date first before selecting To Time.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    // Additional validation for toTime - ensure fromTime is selected first
    if (type === 'toTime' && !formData.fromTime) {
      Alert.alert(
        'From Time Required', 
        'Please select From Time first before selecting To Time to ensure proper duration validation.',
        [{ text: 'OK', style: 'default' }]
      );
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
    // 🔒 STEP 0: Prevent multiple submissions
    if (isSubmitting) {
      Alert.alert('Please Wait', 'Your visitor pass is being generated. Please wait...');
      return;
    }

    // 🔒 STEP 1: Validate form completely before proceeding
    if (!validateForm()) {
      Alert.alert(
        'Form Incomplete',
        'Please fill out all required fields before generating the QR code.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 🔒 STEP 2: Format and validate data before database save
      const startDateTime = formData.fromTime!.toISOString();
      const endDateTime = formData.toTime!.toISOString();
      const generatedAt = new Date().toISOString();
      
      // Additional data integrity check
      if (!formData.name.trim() || !formData.phoneNumber.trim() || !formData.purpose.trim()) {
        Alert.alert('Error', 'Form data is invalid. Please check all fields.');
        return;
      }

      // ✅ Step 3: Get user's flat number and generate the custom visitor ID
      const userFlatNumber = userContext?.profileData?.address 
        ? extractFlatNumber(userContext.profileData.address)
        : '';
      
      const visitorId = generateVisitorId(userFlatNumber);
      console.log('🔍 User flat number:', userFlatNumber);
      console.log('🔍 Generated visitor ID:', visitorId);

      console.log('🔄 Saving visitor pass to database...');
      
      // Test database connection first
      try {
        const { data: testData, error: testError } = await supabase.from('visitor_passes').select('*').limit(1);
        if (testError) {
          console.error('❌ Database connection test failed:', testError);
          Alert.alert('Database Connection Error', `Cannot connect to database: ${testError.message}`);
          return;
        }
        console.log('✅ Database connection test successful');
        console.log('📋 Sample data from table:', testData);
      } catch (testErr) {
        console.error('❌ Database connection test error:', testErr);
        Alert.alert('Database Connection Error', 'Cannot connect to database. Please check your internet connection.');
        return;
      }
      
      // Debug: Log the data being inserted
      const insertData = {
        visitor_name: formData.name.trim(),
        phone_number: formData.phoneNumber.trim(),
        purpose: formData.purpose.trim(),
        pass_type: passType || 'visitor',
        status: 'active',
        visit_date: startDateTime,      // Use full timestamp for visit_date
        visit_time: startDateTime,      // Use full timestamp for visit_time
        created_at: generatedAt,
        updated_at: generatedAt,
        expiry_time: endDateTime,       // Use full timestamp for expiry_time
        visit_end_date: endDateTime,    // Use full timestamp for visit_end_date
        qr_code: visitorId,             // Use visitor ID in QR code field
      };
      
      // Validate that all required fields have values
      const requiredFields = ['visitor_name', 'phone_number', 'purpose', 'visit_date', 'visit_time', 'expiry_time', 'qr_code'];
      const missingFields = requiredFields.filter(field => !insertData[field as keyof typeof insertData]);
      
      if (missingFields.length > 0) {
        console.error('❌ Missing required fields:', missingFields);
        Alert.alert('Data Error', `Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      console.log('🔍 Data to insert:', JSON.stringify(insertData, null, 2));
      
      // ✅ Step 4: Insert into Supabase with custom visitor ID
      console.log('🚀 Attempting to insert data...');
      console.log('🕐 Start DateTime:', startDateTime);
      console.log('🕑 End DateTime:', endDateTime);
      console.log('🕒 Generated At:', generatedAt);
      
      const { data, error } = await supabase
        .from('visitor_passes')
        .insert([insertData])
        .select()
        .single();
      
      console.log('📊 Insert result - data:', data);
      if (error) {
        console.log('❌ Supabase insert failed:', error.message, error.details, error.hint);
      }

      // 🔒 STEP 5: Only proceed to QR generation if database save was successful
      if (error) {
        console.error('❌ Supabase error:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        Alert.alert(
          'Database Error', 
          `Failed to save visitor pass to database: ${error.message || 'Unknown error'}. Please try again.`,
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      // 🔒 STEP 6: Verify data was actually saved
      if (!data || !data.id) {
        console.error('❌ No data returned from database');
        Alert.alert(
          'Save Error', 
          'Visitor pass was not properly saved. QR code cannot be generated. Please try again.',
          [{ text: 'OK', style: 'default' }]
        );
        return;
      }

      console.log('✅ Visitor pass saved successfully with ID:', data.id);
      console.log('✅ Visitor ID for QR code:', visitorId);

      // ✅ Step 5: Prepare data for QR screen navigation
      const qrData = {
        id: data.id,
        visitorId: data.qr_code || visitorId, // ✅ Use the QR code from database (which contains our visitor ID)
        passType: passType || 'visitor',
        visitorName: formData.name.trim(),
        purpose: formData.purpose.trim(),
        fromDate: formatDate(formData.fromDate),
        toDate: formatDate(formData.toDate),
        fromTime: formatTime(formData.fromTime),
        toTime: formatTime(formData.toTime),
        fromDateTime: startDateTime,
        toDateTime: endDateTime,
        generatedAt: generatedAt,
        dbRecordId: data.id, // Include database record ID for verification
      };

      console.log('🎯 Navigating to QR generation with validated data...');

      // ✅ Step 6: Navigate to QR screen with complete, validated data
      router.push({
        pathname: '../(tabs)/visitor-qr',
        params: qrData
      });

      // ✅ Step 7: Reset form after successful navigation
      resetForm();

    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      Alert.alert(
        'Submission Error', 
        'An error occurred while processing your registration. QR code cannot be generated. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinimumDate = (type: 'fromDate' | 'toDate' | 'fromTime' | 'toTime'): Date => {
    const now = new Date();
    
    switch (type) {
      case 'fromDate':
        // From date cannot be in the past
        return now;
        
      case 'toDate':
        // To date cannot be before from date
        return formData.fromDate || now;
        
      case 'fromTime':
        if (!formData.fromDate) {
          return now; // Fallback, though this shouldn't happen due to validation
        }
        
        // If from date is today, minimum time is current time
        if (dayjs(formData.fromDate).isSame(dayjs(), 'day')) {
          return now;
        }
        
        // If from date is in future, any time is allowed (start from midnight)
        const fromDateMidnight = new Date(formData.fromDate);
        fromDateMidnight.setHours(0, 0, 0, 0);
        return fromDateMidnight;
        
      case 'toTime':
        if (!formData.toDate) {
          return now; // Fallback, though this shouldn't happen due to validation
        }
        
        // If to date is same as from date and from time is selected
        if (formData.fromDate && formData.fromTime &&
            dayjs(formData.toDate).isSame(dayjs(formData.fromDate), 'day')) {
          // Minimum to time should be at least 15 minutes after from time
          const minTime = new Date(formData.fromTime);
          minTime.setMinutes(minTime.getMinutes() + 15);
          return minTime;
        }
        
        // If to date is different from from date but from time exists
        if (formData.fromTime && formData.fromDate &&
            dayjs(formData.toDate).isAfter(dayjs(formData.fromDate), 'day')) {
          // For future dates, start from midnight but ensure it's after from time
          const toDateMidnight = new Date(formData.toDate);
          toDateMidnight.setHours(0, 0, 0, 0);
          return toDateMidnight;
        }
        
        // If to date is today, minimum time is current time or after from time
        if (dayjs(formData.toDate).isSame(dayjs(), 'day')) {
          if (formData.fromTime && dayjs(formData.toDate).isSame(dayjs(formData.fromDate), 'day')) {
            // Same day as from date, use from time + 15 minutes
            const minTime = new Date(formData.fromTime);
            minTime.setMinutes(minTime.getMinutes() + 15);
            return minTime > now ? minTime : now;
          }
          return now;
        }
        
        // If to date is in future, start from midnight
        const toDateMidnight = new Date(formData.toDate);
        toDateMidnight.setHours(0, 0, 0, 0);
        return toDateMidnight;
        
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
        colors={passType === 'vip' ? ['#047857', '#10B981'] : ['#D97706', '#F59E0B']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => router.push('../(tabs)/gate')} 
            style={styles.backButton}
          >
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

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>
            {passType === 'vip' ? 'VIP Guest' : 'Visitor'} Details
          </Text>

          {/* Visitor Name */}
          <View style={styles.inputContainer}>
            <User size={20} color={passType === 'vip' ? '#047857' : '#D97706'} />
            <TextInput
              style={styles.input}
              placeholder={`${passType === 'vip' ? 'VIP Guest' : 'Visitor'} Full Name *`}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholderTextColor="#666"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <FileText size={20} color={passType === 'vip' ? '#047857' : '#D97706'} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number *"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              keyboardType="phone-pad"
              placeholderTextColor="#666"
              returnKeyType="done"
              maxLength={10}
            />
          </View>

          {/* Purpose of Visit */}
          <Text style={styles.fieldLabel}>Purpose of Visit *</Text>
          <View style={styles.pickerWrapper}>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowPurposePicker(!showPurposePicker)}
            >
              <FileText size={20} color={passType === 'vip' ? '#047857' : '#D97706'} />
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
                <Calendar size={20} color={passType === 'vip' ? '#047857' : '#D97706'} />
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
                <Calendar size={20} color={passType === 'vip' ? '#047857' : '#D97706'} />
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
                    : passType === 'vip' ? '#047857' : '#D97706'
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
                  (!formData.toDate || !formData.fromTime) && styles.disabledContainer,
                ]}
                onPress={() => showDateTimePicker('toTime')}
                disabled={!formData.toDate || !formData.fromTime}
              >
                <Clock size={20} color={
                  (!formData.toDate || !formData.fromTime)
                    ? '#ccc' 
                    : passType === 'vip' ? '#047857' : '#D97706'
                } />
                <Text style={[
                  styles.dateTimeText,
                  !formData.toTime && styles.placeholderText,
                  (!formData.toDate || !formData.fromTime) && styles.disabledText,
                ]}>
                  {formatTime(formData.toTime) || 'Select time'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Icon for Time Instructions */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 8 }}>
            <Info size={18} color="#2563eb" />
            <Text style={{ color: '#1e293b', fontSize: 13, marginLeft: 6, flex: 1 }}>
              🕒 Please select a valid time slot with at least a 15-minute gap between start and end time.
            </Text>
          </View>

          {/* Validation Info */}
          <View style={styles.validationInfo}>
            <Text style={styles.validationText}>
              • To Date must be greater than or equal to From Date
            </Text>
            <Text style={styles.validationText}>
              • To Time must be selected after From Time to ensure positive duration
            </Text>
            <Text style={styles.validationText}>
              • Minimum visit duration is 15 minutes (zero or negative duration not allowed)
            </Text>
            <Text style={styles.validationText}>
              • Time selection requires corresponding date to be selected first
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
            {formData.fromTime && formData.toTime && (() => {
              const durationMinutes = dayjs(formData.toTime).diff(dayjs(formData.fromTime), 'minutes');
              const isValidDuration = durationMinutes >= 15;
              const displayDuration = Math.max(0, durationMinutes);
              
              // Format duration in a more readable way
              const formatDuration = (minutes: number) => {
                if (minutes < 60) {
                  return `${minutes} minutes`;
                } else {
                  const hours = Math.floor(minutes / 60);
                  const remainingMinutes = minutes % 60;
                  return remainingMinutes > 0 
                    ? `${hours}h ${remainingMinutes}m` 
                    : `${hours} hour${hours > 1 ? 's' : ''}`;
                }
              };
              
              let warningText = '';
              if (durationMinutes <= 0) {
                warningText = ' ⚠️ Invalid: End time must be after start time';
              } else if (durationMinutes < 15) {
                warningText = ' ⚠️ Minimum 15 minutes required';
              }
              
              return (
                <Text style={[
                  styles.validationText, 
                  { 
                    fontWeight: '600', 
                    color: isValidDuration && durationMinutes > 0 ? '#047857' : '#DC2626' 
                  }
                ]}>
                  Duration: {formatDuration(displayDuration)}{warningText}
                </Text>
              );
            })()}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={
              isSubmitting 
                ? ['#9CA3AF', '#6B7280'] 
                : passType === 'vip' ? ['#047857', '#10B981'] : ['#D97706', '#F59E0B']
            }
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting 
                ? 'Generating Pass...' 
                : `Generate ${passType === 'vip' ? 'VIP' : 'Visitor'} Pass`
              }
            </Text>
          </LinearGradient>
        </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

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
                    <Check size={16} color={passType === 'vip' ? '#047857' : '#D97706'} />
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
  keyboardAvoidingView: {
    flex: 1,
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
    color: '#D97706',
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
    color: '#D97706',
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
    color: '#D97706',
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
  submitButtonDisabled: {
    opacity: 0.7,
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
