import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Edit, Bell, User, HelpCircle, Globe, Check, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUserContext } from '../../../context/UserContext';
import { useLocalization } from '../../../context/LocalizationContext';
import OpenDrawerButton from '../../../components/OpenDrawerButton';
import { s, vs, fontSize } from '../../../utils/responsive';

export default function ProfileScreen() {
  const router = useRouter();
  const userContext = useUserContext();
  const profileData = userContext?.profileData || {
    name: '',
    profession: '',
    address: '',
    profilePhoto: null,
  };
  const logout = userContext?.logout || (() => {
    console.warn('Logout function not available from UserContext');
  });

  const { t, currentLanguage, setLanguage, availableLanguages } = useLocalization();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const getCurrentLanguageName = () => {
    const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);
    return currentLang ? currentLang.name : 'English';
  };

  const handleLanguageSelect = async (language: any) => {
    try {
      await setLanguage(language.code);
      setLanguageModalVisible(false);
      Alert.alert(
        t('profile.languageChanged'),
        t('profile.languageChangedDesc', { language: language.name }),
        [{ text: t('common.ok') }]
      );
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(t('common.error'), 'Failed to change language');
    }
  };

  const renderIcon = (Icon: any, size: number, color: string) => <Icon size={size} color={color} />;

  return (
    <SafeAreaView style={styles.container}>
      {/* App in-screen header (prevents “double header”) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <OpenDrawerButton />
        </View>
        <Text style={styles.headerTitle}>{t('profile.title')}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profileData?.profilePhoto ? (
              <Image source={{ uri: profileData.profilePhoto }} style={styles.profileImage} />
            ) : (
              renderIcon(User, 40, '#0077B6')
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profileData?.name ?? ''}</Text>
            <Text style={styles.profileProfession}>{profileData?.profession ?? ''}</Text>
            <Text style={styles.profileUnit}>{profileData?.address ? profileData.address.split(',')[0] : ''}</Text>
            <Text style={styles.profileMember}>{t('profile.memberSince')}</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.accountSettings')}</Text>

          {/* Edit Profile */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('../(tabs)/edit-profile')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#0077B615' }]}>
              {renderIcon(Edit, 20, '#0077B6')}
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{t('profile.editProfile')}</Text>
              <Text style={styles.menuDescription}>{t('profile.editProfileDesc')}</Text>
            </View>
          </TouchableOpacity>

          {/* Language */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#10B98115' }]}>
              {renderIcon(Globe, 20, '#10B981')}
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{t('profile.language')}</Text>
              <Text style={styles.menuDescription}>
                {t('profile.languageDesc', { language: getCurrentLanguageName() })}
              </Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert(t('profile.notificationSettings'), t('profile.comingSoon'))}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#F59E0B15' }]}>
              {renderIcon(Bell, 20, '#F59E0B')}
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{t('profile.notificationSettings')}</Text>
              <Text style={styles.menuDescription}>{t('profile.notificationDesc')}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => {
                setNotificationsEnabled(value);
                Alert.alert(
                  t('profile.notificationSettings'),
                  value ? t('profile.notificationsEnabled') : t('profile.notificationsDisabled')
                );
              }}
              trackColor={{ false: '#D1D5DB', true: '#F59E0B' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D5DB"
            />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert(t('profile.helpSupport'), t('profile.comingSoon'))}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#EC489915' }]}>
              {renderIcon(HelpCircle, 20, '#EC4899')}
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>{t('profile.helpSupport')}</Text>
              <Text style={styles.menuDescription}>{t('profile.helpSupportDesc')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            logout();
            router.replace('/login');
          }}
        >
          {renderIcon(LogOut, 18, '#FFFFFF')}
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>{t('profile.version')}</Text>
          <Text style={styles.copyrightText}>{t('profile.copyright')}</Text>
        </View>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('languageModal.title')}</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setLanguageModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
              {availableLanguages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    currentLanguage === language.code && styles.selectedLanguageItem,
                  ]}
                  onPress={() => handleLanguageSelect(language)}
                >
                  <View style={styles.languageInfo}>
                    <Text
                      style={[
                        styles.languageName,
                        currentLanguage === language.code && styles.selectedLanguageName,
                      ]}
                    >
                      {language.name}
                    </Text>
                    <Text
                      style={[
                        styles.languageNative,
                        currentLanguage === language.code && styles.selectedLanguageNative,
                      ]}
                    >
                      {language.nativeName}
                    </Text>
                  </View>
                  {currentLanguage === language.code && <Check size={20} color="#4DD0E1" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },

  // In-screen header (matches Home tab style)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(12),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: { width: s(40), alignItems: 'center', justifyContent: 'center', marginRight: s(6) },
  headerRight: { width: s(40) },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: fontSize.large, fontWeight: '700', color: '#1E293B' },

  content: { flex: 1, padding: 20 },

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
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 15,
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  profileProfession: { fontSize: 14, fontStyle: 'italic', color: '#4B5563', marginBottom: 4 },
  profileUnit: { fontSize: 14, color: '#4B5563', marginBottom: 2 },
  profileMember: { fontSize: 12, color: '#6B7280' },

  section: {
    backgroundColor: '#FFFFFF', padding: 16, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#125E8A', marginBottom: 16 },

  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  iconContainer: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuText: { flex: 1, marginRight: 8 },
  menuTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  menuDescription: { fontSize: 12, color: '#6B7280' },

  logoutButton: {
    backgroundColor: '#EF4444',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  logoutText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16, marginLeft: 8 },

  footer: { alignItems: 'center', marginBottom: 30 },
  versionText: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  copyrightText: { fontSize: 12, color: '#9CA3AF' },

  profileImage: { width: 80, height: 80, borderRadius: 40 },

  // Language modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: {
    backgroundColor: '#FFFFFF', borderRadius: 16, width: '100%', maxHeight: '80%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 8,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  modalCloseButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontSize: 16, color: '#6B7280', fontWeight: 'bold' },

  languageList: { maxHeight: 400 },
  languageItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  selectedLanguageItem: { backgroundColor: '#F0FDF4', borderBottomColor: '#10B981' },
  languageInfo: { flex: 1 },
  languageName: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  selectedLanguageName: { color: '#10B981' },
  languageNative: { fontSize: 14, color: '#6B7280' },
  selectedLanguageNative: { color: '#059669' },
});
