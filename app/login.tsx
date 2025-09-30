  import React, { useState } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert
  } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { useRouter } from 'expo-router';
  import { Lock, User, Home, Phone, Mail, Eye, EyeOff } from 'lucide-react-native';
  import { useUserContext } from '../context/UserContext';
  import { useLocalization } from '../context/LocalizationContext';

  export default function LoginScreen() {
    const router = useRouter();
    const userContext = useUserContext();
    const login = userContext?.login || (() => {
      console.warn('Login function not available from UserContext');
    });
    const { t } = useLocalization();
    
    // State for form fields
    const [residentName, setResidentName] = useState('');
    const [flatNumber, setFlatNumber] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [contactType, setContactType] = useState<'phone' | 'email'>('phone'); // 'phone' or 'email'
    
    // Function to handle login
    const handleLogin = async () => {
      // Validate inputs
      if (!residentName.trim()) {
        Alert.alert(t('common.error'), 'Please enter your name');
        return;
      }
      
      if (!flatNumber.trim()) {
        Alert.alert(t('common.error'), 'Please enter your flat number');
        return;
      }
      
      if (!contactInfo.trim()) {
        Alert.alert(t('common.error'), `Please enter your ${contactType === 'phone' ? 'phone number' : 'email'}`);
        return;
      }
      
      if (!password.trim()) {
        Alert.alert(t('common.error'), 'Please enter your password');
        return;
      }
      
      // Validate email format if contact type is email
      if (contactType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactInfo)) {
          Alert.alert(t('common.error'), 'Please enter a valid email address');
          return;
        }
      }
      
      // Validate phone format if contact type is phone
      if (contactType === 'phone') {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(contactInfo)) {
          Alert.alert(t('common.error'), 'Please enter a valid phone number (format: 555-123-4567)');
          return;
        }
      }
      
      // For demo purposes, we'll use hardcoded credentials
      // In a real app, this would be an API call to verify credentials
      const defaultCredentials = {
        name: 'John Doe',
        flatNumber: 'A-101',
        phone: '555-123-4567',
        email: 'john.doe@example.com',
        password: 'password123'
      };
      
      // Check if credentials match
      const isNameMatch = residentName.toLowerCase() === defaultCredentials.name.toLowerCase();
      const isFlatMatch = flatNumber.toLowerCase() === defaultCredentials.flatNumber.toLowerCase();
      const isContactMatch = 
        (contactType === 'phone' && contactInfo === defaultCredentials.phone) ||
        (contactType === 'email' && contactInfo.toLowerCase() === defaultCredentials.email.toLowerCase());
      const isPasswordMatch = password === defaultCredentials.password;
      
      if (isNameMatch && isFlatMatch && isContactMatch && isPasswordMatch) {
        // Call the login function from context (safe to await even if it's not async)
        await Promise.resolve(login());

        // ✅ Directly enter the app shell (Drawer opens to Tabs via initialRouteName)
        router.replace('/(drawer)');

        // If you ever want to target Tabs explicitly:
        // router.replace('/(drawer)/(tabs)');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      }
    };
    
    // Function to toggle between phone and email
    const toggleContactType = () => {
      setContactType(contactType === 'phone' ? 'email' : 'phone');
      setContactInfo(''); // Clear the field when switching
    };
    
    // Function to fill demo credentials
    const fillDemoCredentials = () => {
      setResidentName('John Doe');
      setFlatNumber('A-101');
      setContactInfo(contactType === 'phone' ? '555-123-4567' : 'john.doe@example.com');
      setPassword('password123');
    };
    
    // Helper function to render icons
    const renderIcon = (Icon: any, size: number, color: string) => <Icon size={size} color={color} />;
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/login.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.headerText}>{t('features.communityApp')}</Text>
        </View>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Resident Login</Text>
              
              {/* Resident Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Resident Name</Text>
                <View style={styles.inputContainer}>
                  {renderIcon(User, 20, "#4DD0E1")}
                  <TextInput
                    style={styles.input}
                    value={residentName}
                    onChangeText={setResidentName}
                    placeholder="Enter your full name"
                    placeholderTextColor="#AAAAAA"
                  />
                </View>
              </View>
              
              {/* Flat Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Flat Number</Text>
                <View style={styles.inputContainer}>
                  {renderIcon(Home, 20, "#4DD0E1")}
                  <TextInput
                    style={styles.input}
                    value={flatNumber}
                    onChangeText={setFlatNumber}
                    placeholder="Enter your flat number (e.g., A-101)"
                    placeholderTextColor="#AAAAAA"
                  />
                </View>
              </View>
              
              {/* Contact Information (Phone/Email) */}
              <View style={styles.inputGroup}>
                <View style={styles.contactHeader}>
                  <Text style={styles.inputLabel}>
                    {contactType === 'phone' ? 'Phone Number' : 'Email Address'}
                  </Text>
                  <TouchableOpacity onPress={toggleContactType}>
                    <Text style={styles.toggleText}>
                      Use {contactType === 'phone' ? 'Email' : 'Phone'} Instead
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                  {renderIcon(contactType === 'phone' ? Phone : Mail, 20, "#4DD0E1")}
                  <TextInput
                    style={styles.input}
                    value={contactInfo}
                    onChangeText={setContactInfo}
                    placeholder={contactType === 'phone' 
                      ? "Enter your phone number (e.g., 555-123-4567)" 
                      : "Enter your email address"}
                    placeholderTextColor="#AAAAAA"
                    keyboardType={contactType === 'phone' ? 'phone-pad' : 'email-address'}
                    autoCapitalize={contactType === 'email' ? 'none' : 'sentences'}
                  />
                </View>
              </View>
              
              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  {renderIcon(Lock, 20, "#4DD0E1")}
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#AAAAAA"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      renderIcon(EyeOff, 20, "#4DD0E1") : 
                      renderIcon(Eye, 20, "#4DD0E1")}
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              
              {/* Demo Credentials Button */}
              <TouchableOpacity
                style={styles.demoButton}
                onPress={fillDemoCredentials}
              >
                <Text style={styles.demoButtonText}>Use Demo Credentials</Text>
              </TouchableOpacity>
              
              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © 2023 SecureIn Community App
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F9FF',
    },
    header: {
      paddingVertical: 30,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2196F3',
    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    logoImage: {
      width: 120,
      height: 80,
    },
    headerText: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    keyboardAvoid: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: 20,
    },
    formContainer: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 20,
    },
    formTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#1E88E5',
      marginBottom: 20,
      textAlign: 'center',
    },
    inputGroup: {
      marginBottom: 16,
    },
    contactHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    toggleText: {
      fontSize: 12,
      color: '#1E88E5',
      fontWeight: '600',
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: '#333333',
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#DDDBCB',
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: '#FFFFFF',
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      fontSize: 16,
      color: '#333333',
    },
    passwordInput: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 8,
      fontSize: 16,
      color: '#333333',
    },
    eyeIcon: {
      padding: 8,
    },
    loginButton: {
      backgroundColor: '#1E88E5',
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 10,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    demoButton: {
      backgroundColor: '#F5F9FF',
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 12,
      borderWidth: 1,
      borderColor: '#1E88E5',
    },
    demoButtonText: {
      color: '#1E88E5',
      fontSize: 14,
      fontWeight: '600',
    },
    forgotPasswordContainer: {
      alignItems: 'center',
      marginTop: 16,
    },
    forgotPasswordText: {
      color: '#1E88E5',
      fontSize: 14,
    },
    footer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 10,
    },
    footerText: {
      color: '#666666',
      fontSize: 12,
    },
  });
