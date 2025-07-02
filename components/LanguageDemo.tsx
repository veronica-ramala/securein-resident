import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { Users, ShieldAlert, Globe, Check } from 'lucide-react-native';
import { useLocalization } from '../context/LocalizationContext';

export default function LanguageDemo() {
  const { t, currentLanguage, setLanguage, availableLanguages } = useLocalization();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleSOSAlert = () => {
    Alert.alert(
      t('emergency.alertSent'),
      t('emergency.alertSentDesc'),
      [{ text: t('common.ok') }]
    );
  };

  const getCurrentLanguageName = () => {
    const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);
    return currentLang ? currentLang.nativeName : 'English';
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('features.welcome')}</Text>
      
      {/* Language Switcher */}
      <TouchableOpacity style={styles.languageButton} onPress={() => setLanguageModalVisible(true)}>
        <Globe size={20} color="#0077B6" />
        <Text style={styles.languageButtonText}>
          {getCurrentLanguageName()} - {t('languageModal.title')}
        </Text>
      </TouchableOpacity>

      {/* Visitor Management Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={24} color="#0077B6" />
          <Text style={styles.sectionTitle}>{t('visitor.management')}</Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>{t('visitor.addVisitor')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>{t('visitor.myVisitors')}</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency/SOS Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ShieldAlert size={24} color="#EF4444" />
          <Text style={styles.sectionTitle}>{t('emergency.emergency')}</Text>
        </View>
        <TouchableOpacity style={[styles.actionButton, styles.sosButton]} onPress={handleSOSAlert}>
          <Text style={[styles.actionButtonText, styles.sosButtonText]}>
            {t('emergency.sosAlert')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Demo Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('features.quickActions')}</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• {t('features.communityServices')}</Text>
          <Text style={styles.featureItem}>• {t('features.facilities')}</Text>
          <Text style={styles.featureItem}>• {t('features.announcements')}</Text>
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('languageModal.title')}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setLanguageModalVisible(false)}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
              {availableLanguages.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    currentLanguage === language.code && styles.selectedLanguageItem
                  ]}
                  onPress={() => handleLanguageSelect(language)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={[
                      styles.languageName,
                      currentLanguage === language.code && styles.selectedLanguageName
                    ]}>
                      {language.name}
                    </Text>
                    <Text style={[
                      styles.languageNative,
                      currentLanguage === language.code && styles.selectedLanguageNative
                    ]}>
                      {language.nativeName}
                    </Text>
                  </View>
                  {currentLanguage === language.code && (
                    <Check size={20} color="#10B981" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077B6',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0077B6',
    justifyContent: 'center',
    gap: 8,
  },
  languageButtonText: {
    color: '#0077B6',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  actionButton: {
    backgroundColor: '#0077B6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  sosButton: {
    backgroundColor: '#EF4444',
  },
  sosButtonText: {
    color: '#FFFFFF',
  },
  featureList: {
    marginTop: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 0,
    width: '85%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  languageList: {
    maxHeight: 400,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedLanguageItem: {
    backgroundColor: '#F0FDF4',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  selectedLanguageName: {
    color: '#10B981',
  },
  languageNative: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedLanguageNative: {
    color: '#059669',
  },
});