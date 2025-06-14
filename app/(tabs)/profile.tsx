import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Settings, LogOut, Edit, Bell, User, HelpCircle, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUserContext } from '../../context/UserContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { profileData, logout } = useUserContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Define renderIcon function to handle icon rendering
  const renderIcon = (Icon: any, size: number, color: string) => {
    return <Icon size={size} color={color} />;
  };

  const profileActions = [
    {
      id: '1',
      title: 'Edit Profile',
      description: 'Update your personal information',
      icon: Edit,
      color: '#125E8A',
      action: () => router.push('/(tabs)/edit-profile'),
    },
    {
      id: '2',
      title: 'Security',
      description: 'Change password and security settings',
      icon: Lock,
      color: '#10B981',
      action: () => router.push('/(tabs)/security'),
    },
    {
      id: '3',
      title: 'Notification Settings',
      description: 'Customize notification preferences',
      icon: Bell,
      color: '#F59E0B',
      action: () => alert('Notification settings coming soon!'),
      hasSwitch: true,
      switchValue: notificationsEnabled,
      onSwitchChange: (value: boolean) => {
        setNotificationsEnabled(value);
        alert(value ? 'Notifications enabled' : 'Notifications disabled');
      }
    },

    {
      id: '4',
      title: 'Help & Support',
      description: 'Get assistance with the app',
      icon: HelpCircle,
      color: '#EC4899',
      action: () => alert('Help & Support feature coming soon!'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#125E8A', '#89AAE6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profileData.profilePhoto ? (
              <Image source={{ uri: profileData.profilePhoto }} style={styles.profileImage} />
            ) : (
              renderIcon(User, 40, "#125E8A")
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profileProfession}>{profileData.profession}</Text>
            <Text style={styles.profileUnit}>{profileData.address.split(',')[0]}</Text>
            <Text style={styles.profileMember}>Member since 2022</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          {profileActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.menuItem}
              onPress={action.action}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
                {renderIcon(action.icon, 20, action.color)}
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{action.title}</Text>
                <Text style={styles.menuDescription}>{action.description}</Text>
              </View>
              {action.hasSwitch && (
                <Switch
                  value={action.switchValue}
                  onValueChange={action.onSwitchChange}
                  trackColor={{ false: '#D1D5DB', true: '#F59E0B' }}
                  thumbColor={action.switchValue ? '#FFFFFF' : '#FFFFFF'}
                  ios_backgroundColor="#D1D5DB"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            logout();
            router.replace('/login');
          }}
        >
          {renderIcon(LogOut, 18, "#FFFFFF")}
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2023 SecureIn Community App</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(250, 245, 245, 0.27)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  profileProfession: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#4B5563',
    marginBottom: 4,
  },
  profileUnit: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 2,
  },
  profileMember: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    marginRight: 8,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});