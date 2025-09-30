import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSmartNavigation } from '@/hooks/useBackHandler';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { navigateBack } = useSmartNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    // Password should be at least 8 characters with at least one uppercase, one lowercase, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert('Error', 'Please confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        'Invalid Password', 
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
      );
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll assume the current password is correct
      // In a real app, you would verify this with your backend
      
      Alert.alert(
        'Success', 
        'Your password has been changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordInput = (
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    showPassword: boolean,
    toggleShowPassword: () => void
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <Lock size={20} color="#6B7280" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={toggleShowPassword}
          style={styles.eyeIcon}
        >
          {showPassword ? (
            <EyeOff size={20} color="#6B7280" />
          ) : (
            <Eye size={20} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#125E8A', '#89AAE6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={navigateBack}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Change Password</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.infoCard}>
            <Lock size={24} color="#125E8A" />
            <Text style={styles.infoTitle}>Security Settings</Text>
            <Text style={styles.infoDescription}>
              Keep your account secure by using a strong password. Your password should be at least 8 characters long and include uppercase letters, lowercase letters, and numbers.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Current Password</Text>
              {renderPasswordInput(
                currentPassword,
                setCurrentPassword,
                'Enter your current password',
                showCurrentPassword,
                () => setShowCurrentPassword(!showCurrentPassword)
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>New Password</Text>
              {renderPasswordInput(
                newPassword,
                setNewPassword,
                'Enter your new password',
                showNewPassword,
                () => setShowNewPassword(!showNewPassword)
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Confirm New Password</Text>
              {renderPasswordInput(
                confirmPassword,
                setConfirmPassword,
                'Confirm your new password',
                showConfirmPassword,
                () => setShowConfirmPassword(!showConfirmPassword)
              )}
            </View>

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={styles.requirementItem}>• At least 8 characters long</Text>
              <Text style={styles.requirementItem}>• At least one uppercase letter (A-Z)</Text>
              <Text style={styles.requirementItem}>• At least one lowercase letter (a-z)</Text>
              <Text style={styles.requirementItem}>• At least one number (0-9)</Text>
            </View>

            <TouchableOpacity
              style={[styles.changePasswordButton, isLoading && styles.disabledButton]}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              <Text style={styles.changePasswordButtonText}>
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginTop: 10,
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  passwordRequirements: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#125E8A',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#125E8A',
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  changePasswordButton: {
    backgroundColor: '#125E8A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#125E8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  changePasswordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});