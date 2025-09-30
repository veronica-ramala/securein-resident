

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Share as RNShare,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  Download,
  Check,
} from 'lucide-react-native';
import { useUserContext } from '../../../context/UserContext';
import Svg, { Rect, Circle } from 'react-native-svg';
import QRCodeSVG from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
// Import MediaLibrary conditionally to handle Expo Go limitations
let MediaLibrary: any = null;
try {
  MediaLibrary = require('expo-media-library');
} catch (error) {
  console.log('MediaLibrary not available in this environment (Expo Go limitation)');
}
// Import react-native-share conditionally to avoid errors in Expo Go
let Share: any = null;
try {
  Share = require('react-native-share').default;
} catch (error) {
  console.log('react-native-share not available, will use fallback methods');
}

// Enhanced QR Code Component
type QRCodeProps = {
  size?: number;
  passType?: string;
  data: {
    dbRecordId?: string;
    visitorId?: string;
    visitorName?: string;
    purpose?: string;
    fromDate?: string;
    toDate?: string;
    fromTime?: string;
    toTime?: string;
    passType?: string;
    generatedAt?: string;
  };
};
const QRCode = ({ size = 200, passType = 'visitor', data }: QRCodeProps) => {
  const isVIP = passType === 'vip';
  
  return (
    <View style={[
      styles.qrCodeContainer,
      { 
        width: size + 40, 
        height: size + 80,
        backgroundColor: isVIP ? '#ECFDF5' : '#FEF9C3',
        borderColor: isVIP ? '#10B981' : '#D97706',
      }
    ]}>
      <Text style={[
        styles.qrTitle,
        { color: isVIP ? '#047857' : '#D97706' }
      ]}>
        {isVIP ? 'VIP PASS' : 'VISITOR PASS'}
      </Text>
      
      <View style={{ 
        width: size, 
        height: size, 
        backgroundColor: 'white', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#E5E7EB',
        borderRadius: 8,
        marginVertical: 10,
      }}>
        <QRCodeSVG
          value={data.visitorId || data.dbRecordId || 'VISITOR-PASS'} // ✅ Use the visitor ID first, then fallback to dbRecordId
          size={size * 0.8}
        />
      </View>
      
      <Text style={[
        styles.qrSubtitle,
        { color: isVIP ? '#047857' : '#D97706' }
      ]}>
        Scan for Entry/Exit
      </Text>
    </View>
  );
};

export default function VisitorQRScreen() {
  const router = useRouter();
  const qrViewRef = useRef<View | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);
  const userContext = useUserContext();
  const residentName = userContext?.profileData?.name || 'Resident';
  const params = useLocalSearchParams<{
    passType: string;
    visitorName: string;
    purpose: string;
    fromDate: string;
    toDate: string;
    fromTime: string;
    toTime: string;
    fromDateTime?: string;
    toDateTime?: string;
    dbRecordId?: string;      // <-- Added for validation and linter fix
    generatedAt?: string;     // <-- Added for validation and linter fix
    visitorId?: string;       // <-- Added for visitor ID
  }>();

  // 🔒 CRITICAL: Validate that all required form data is present
  React.useEffect(() => {
    const requiredFields = [
      'passType',
      'visitorName', 
      'purpose',
      'fromDate',
      'toDate', 
      'fromTime',
      'toTime',
      'dbRecordId',      // <-- Require this
      'generatedAt',     // <-- Require this
    ];

    const missingFields = requiredFields.filter(field => !params[field as keyof typeof params]);
    
    if (missingFields.length > 0) {
      Alert.alert(
        'Invalid Access',
        'QR code can only be generated after completing the registration form. Please fill out the form first.',
        [
          {
            text: 'Go to Registration',
            onPress: () => router.replace('../(tabs)/visitor-registration'),
            style: 'default'
          }
        ],
        { cancelable: false }
      );
      return;
    }

    // Additional validation for form data integrity
    if (!params.visitorName?.trim() || 
        !params.purpose?.trim() || 
        !params.fromDate?.trim() || 
        !params.toDate?.trim() ||
        !params.fromTime?.trim() || 
        !params.toTime?.trim()) {
      Alert.alert(
        'Incomplete Data',
        'Registration form data is incomplete. Please complete the registration form first.',
        [
          {
            text: 'Go to Registration',
            onPress: () => router.replace('../(tabs)/visitor-registration'),
            style: 'default'
          }
        ],
        { cancelable: false }
      );
      return;
    }
  }, [params, router]);

  const isVIP = params.passType === 'vip';

  // Fallback sharing method using React Native's built-in Share API
  const handleFallbackShare = async (imageUri?: string) => {
    try {
      const shareMessage = `🎫 ${isVIP ? 'VIP' : 'Visitor'} Pass for ${params.visitorName}

📋 Purpose: ${params.purpose}
📅 Valid From: ${params.fromDate} ${params.fromTime}
📅 Valid Until: ${params.toDate} ${params.toTime}

${params.dbRecordId ? `🆔 Pass ID: #${params.dbRecordId}` : ''}

📱 Please show this QR code at the gate for entry.

Generated by SecureIN App`;
      
      const shareOptions: any = {
        message: shareMessage,
        title: `${isVIP ? 'VIP' : 'Visitor'} Access Pass - ${params.visitorName}`,
      };

      // Try to include image URI for both platforms
      if (imageUri) {
        shareOptions.url = imageUri;
      }

      const result = await RNShare.share(shareOptions);
      
      if (result.action === RNShare.sharedAction) {
        Alert.alert(
          'Success!',
          'Pass details shared successfully! The recipient will receive the pass information and can save the image if supported by their device.',
          [{ text: 'OK' }]
        );
      } else if (result.action === RNShare.dismissedAction) {
        console.log('User dismissed share dialog');
      }
    } catch (error) {
      console.error('Fallback share error:', error);
      
      // Try one more time with just text
      try {
        const textOnlyOptions = {
          message: `${isVIP ? 'VIP' : 'Visitor'} Pass for ${params.visitorName}\n\nPurpose: ${params.purpose}\nValid: ${params.fromDate} ${params.fromTime} - ${params.toDate} ${params.toTime}\n\nPass ID: #${params.dbRecordId || 'N/A'}\n\nPlease show this information at the gate for entry.`,
        };
        
        await RNShare.share(textOnlyOptions);
        Alert.alert(
          'Shared as Text',
          'Pass details shared as text message. Please also save the QR code image separately.',
          [{ text: 'OK' }]
        );
      } catch (textError) {
        console.error('Text-only share also failed:', textError);
        Alert.alert(
          'Share Failed',
          'Unable to share the pass. Please try saving it to your photos instead and share manually.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleShare = async () => {
    if (isSharing) return; // Prevent multiple shares
    
    setIsSharing(true);
    let tempUri: string | null = null;
    
    // Create share message outside try block for broader scope
    const shareMessage = `🎫 ${isVIP ? 'VIP' : 'Visitor'} Pass for ${params.visitorName}

📋 Purpose: ${params.purpose}
📅 Valid From: ${params.fromDate} ${params.fromTime}
📅 Valid Until: ${params.toDate} ${params.toTime}

${params.dbRecordId ? `🆔 Pass ID: #${params.dbRecordId}` : ''}

📱 Please show this QR code at the gate for entry.

Generated by SecureIN App`;
    
    try {
      // Capture the entire pass card view as an image with original dimensions
      tempUri = await captureRef(qrViewRef, {
        format: 'png',
        quality: 1.0, // High quality for QR code clarity
        result: 'tmpfile',
        // Remove fixed dimensions to capture the actual card size (320x500+)
      });

      console.log('Captured image URI:', tempUri);

      // Ensure the file exists before sharing
      const fileInfo = await FileSystem.getInfoAsync(tempUri);
      if (!fileInfo.exists) {
        throw new Error('Failed to capture image');
      }

      console.log('File info:', fileInfo);

      // Wait a moment to ensure file is fully written
      await new Promise(resolve => setTimeout(resolve, 500));

      // Try advanced sharing first (with image support)
      console.log('Attempting advanced share with image...');
      
      if (Share && typeof Share.open === 'function') {
        // Use react-native-share for better image sharing support
        await tryAdvancedShare(tempUri, shareMessage);
        return;
      }

      // Fallback to React Native's built-in Share API (text only)
      console.log('Advanced sharing not available, using React Native Share API...');
      
      Alert.alert(
        'Share Options',
        'Choose how you want to share the pass:',
        [
          { 
            text: 'Save & Share Manually', 
            onPress: async () => {
              await handleSave();
              Alert.alert(
                'Saved to Photos',
                'The QR code has been saved to your photos. You can now manually share it from your gallery.',
                [{ text: 'OK' }]
              );
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );

    } catch (error: any) {
      console.error('Error with React Native share:', error);
      
      // Try advanced sharing if React Native share fails
      if (tempUri) {
        await tryAdvancedShare(tempUri, shareMessage);
      } else {
        Alert.alert(
          'Share Failed',
          'Unable to share the pass. Please try saving it to your photos instead.',
          [
            { text: 'Save to Photos', onPress: handleSave },
            { text: 'OK', style: 'cancel' }
          ]
        );
      }
    } finally {
      // Clean up temporary file with delay
      if (tempUri) {
        setTimeout(async () => {
          try {
            await FileSystem.deleteAsync(tempUri!, { idempotent: true });
            console.log('Temporary file cleaned up');
          } catch (cleanupError) {
            console.log('Cleanup error (non-critical):', cleanupError);
          }
        }, 3000); // 3 second delay
      }
      
      setIsSharing(false);
    }
  };

  // Advanced sharing using react-native-share (when available)
  const tryAdvancedShare = async (imageUri: string, shareMessage: string) => {
    if (!Share || typeof Share.open !== 'function') {
      console.log('Advanced sharing not available - falling back to save & manual share');
      
      // Automatically save to photos and inform user
      try {
        await handleSave();
        Alert.alert(
          'Image Saved!',
          'The QR code has been saved to your photos. You can now share it manually from your gallery app.',
          [
            { text: 'Open Gallery', onPress: () => {
              // On Android, we can't directly open gallery, but we can inform user
              Alert.alert(
                'Find Your Image',
                'Look for the QR code image in your Photos/Gallery app. It was just saved.',
                [{ text: 'OK' }]
              );
            }},
            { text: 'OK', style: 'cancel' }
          ]
        );
      } catch (saveError) {
        console.error('Save error:', saveError);
        Alert.alert(
          'Save Failed',
          'Unable to save the QR code. Please try again.',
          [{ text: 'OK' }]
        );
      }
      return;
    }

    try {
      // Verify the image file exists before sharing
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error('Image file not found');
      }

      console.log('Sharing image file:', fileInfo);

      // Create a proper filename for WhatsApp compatibility
      const timestamp = new Date().toISOString().slice(0, 10);
      const visitorName = params.visitorName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Visitor';
      const filename = `QR_Pass_${visitorName}_${timestamp}.png`;

      // For Android, copy the file to a more accessible location first
      if (Platform.OS === 'android') {
        try {
          // Create a copy in the cache directory with a proper name
          const cacheDir = FileSystem.cacheDirectory;
          const newPath = `${cacheDir}${filename}`;
          
          // Copy the file to cache directory
          await FileSystem.copyAsync({
            from: imageUri,
            to: newPath
          });
          
          // Verify the copied file exists
          const copiedFileInfo = await FileSystem.getInfoAsync(newPath);
          if (!copiedFileInfo.exists) {
            throw new Error('Failed to copy file to cache');
          }
          
          console.log('File copied to cache:', newPath);
          
          // Use the copied file for sharing with WhatsApp-optimized options
          const androidShareOptions = {
            title: `${isVIP ? 'VIP' : 'Visitor'} Access Pass`,
            url: newPath,
            type: 'image/png',
            filename: filename,
            failOnCancel: false,
            showAppsToView: true,
            // Don't include message with image for better WhatsApp compatibility
            // WhatsApp works better with just the image
          };
          
          console.log('Android share options:', androidShareOptions);
          const result = await Share.open(androidShareOptions);
          console.log('Android share result:', result);
          
          // Clean up the copied file after a delay
          setTimeout(async () => {
            try {
              await FileSystem.deleteAsync(newPath, { idempotent: true });
              console.log('Cached file cleaned up');
            } catch (cleanupError) {
              console.log('Cache cleanup error (non-critical):', cleanupError);
            }
          }, 5000);
          
          if (result && (result.success || result.app)) {
            // Check if shared to WhatsApp specifically
            if (result.app && result.app.toLowerCase().includes('whatsapp')) {
              Alert.alert(
                'Shared to WhatsApp!',
                'QR code image sent to WhatsApp successfully. You can add a message before sending.',
                [{ text: 'OK' }]
              );
            } else {
              Alert.alert(
                'Success!',
                'QR code shared successfully!',
                [{ text: 'OK' }]
              );
            }
          } else if (result && result.dismissedAction) {
            console.log('User dismissed share dialog');
            Alert.alert(
              'Share Cancelled',
              'You can still find the QR code saved in your photos.',
              [{ text: 'OK' }]
            );
          }
          return;
          
        } catch (copyError) {
          console.error('File copy error, trying direct share:', copyError);
          
          // Fallback to direct sharing if copy fails
          const fallbackOptions = {
            title: `${isVIP ? 'VIP' : 'Visitor'} Access Pass`,
            url: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`,
            type: 'image/png',
            failOnCancel: false,
          };
          
          const fallbackResult = await Share.open(fallbackOptions);
          
          if (fallbackResult && (fallbackResult.success || fallbackResult.app)) {
            Alert.alert(
              'Success!',
              'QR code shared successfully!',
              [{ text: 'OK' }]
            );
          }
          return;
        }
      }

      // iOS sharing
      console.log('iOS share options:', shareOptions);
      const result = await Share.open(shareOptions);
      console.log('iOS share result:', result);
      
      if (result && (result.success || result.app)) {
        Alert.alert(
          'Success!',
          'Pass shared successfully with image!',
          [{ text: 'OK' }]
        );
      } else if (result && result.dismissedAction) {
        console.log('User dismissed share dialog');
        Alert.alert(
          'Share Cancelled',
          'You can still find the QR code saved in your photos.',
          [{ text: 'OK' }]
        );
      }

    } catch (error: any) {
      console.error('Advanced share error:', error);
      
      if (error.message && (
        error.message.includes('User did not share') || 
        error.message.includes('cancelled') ||
        error.message.includes('dismissed')
      )) {
        console.log('User cancelled advanced sharing');
        return;
      }
      
      // If sharing fails, offer to save to photos
      Alert.alert(
        'Share Failed',
        'Unable to share the image directly. Would you like to save it to your photos instead?',
        [
          { 
            text: 'Save to Photos', 
            onPress: async () => {
              try {
                await handleSave();
                Alert.alert(
                  'Saved!',
                  'QR code saved to your photos. You can share it manually from your gallery.',
                  [{ text: 'OK' }]
                );
              } catch (saveError) {
                Alert.alert('Save Failed', 'Unable to save the image.');
              }
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    }
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple saves
    
    setIsSaving(true);
    try {
      // Check if MediaLibrary is available
      if (!MediaLibrary) {
        Alert.alert(
          'Feature Not Available',
          'Saving to photo library is not available in this environment. This feature requires a development build or standalone app.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photo library to save the QR code.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Capture the QR code view as PNG (highest quality)
      const uri = await captureRef(qrViewRef, {
        format: 'png',
        quality: 1.0, // Highest quality
        result: 'tmpfile',
      });

      // Create filename with timestamp and visitor name
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const visitorName = params.visitorName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Visitor';
      const filename = `${params.passType?.toUpperCase()}_Pass_${visitorName}_${timestamp}.png`;

      // Save to device's photo library
      const asset = await MediaLibrary.createAssetAsync(uri);
      
      // Create or get the "VisitorPasses" album
      let album = await MediaLibrary.getAlbumAsync('VisitorPasses');
      if (album == null) {
        album = await MediaLibrary.createAlbumAsync('VisitorPasses', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      // Clean up temporary file
      await FileSystem.deleteAsync(uri, { idempotent: true });

      // Show success message
      Alert.alert(
        'Success!',
        `Complete ${params.passType?.toUpperCase() || 'Visitor'} pass with QR code and details has been saved to your photo library in the "VisitorPasses" album.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Error saving QR code:', error);
      Alert.alert(
        'Save Failed',
        'Failed to save the QR code to your photo library. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDone = () => {
    // Navigate back to the main screen or gate screen
    router.push('../(tabs)/gate');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isVIP ? ['#047857', '#10B981'] : ['#D97706', '#F59E0B']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isVIP ? 'VIP' : 'Visitor'} Pass Generated
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.successSection}>
          <View style={[
            styles.successIcon,
            { backgroundColor: isVIP ? '#ECFDF5' : '#FEF3C7' }
          ]}>
            <Check size={40} color={isVIP ? '#10B981' : '#D97706'} />
          </View>
          <Text style={[
            styles.successTitle,
            { color: isVIP ? '#10B981' : '#D97706' }
          ]}>Pass Generated Successfully!</Text>
          <Text style={styles.successSubtitle}>
            Your {isVIP ? 'VIP' : 'visitor'} pass is ready to use
          </Text>
        </View>

        <View style={styles.qrSection}>
          <View ref={qrViewRef} style={styles.fullPassContainer}>
            {/* Pass Header */}
            <View style={[
              styles.passHeader,
              { backgroundColor: isVIP ? '#047857' : '#D97706' }
            ]}>
              <Text style={styles.passHeaderTitle}>
                {residentName} is inviting you
              </Text>
              <Text style={styles.passHeaderSubtitle}>
                {isVIP ? 'VIP ACCESS PASS' : 'VISITOR ACCESS PASS'}
              </Text>
            </View>

            {/* QR Code Section */}
            <View style={styles.qrCodeSection}>
              <QRCode 
                size={200} 
                passType={params.passType} 
                data={params}
              />
            </View>

            {/* Pass Details Section */}
            <View style={styles.passDetailsSection}>
              <Text style={[
                styles.passDetailsTitle,
                { color: isVIP ? '#047857' : '#D97706' }
              ]}>
                {isVIP ? 'VIP GUEST DETAILS' : 'PASS DETAILS'}
              </Text>
              
              <View style={styles.passDetailRow}>
                <Text style={styles.passDetailLabel}>NAME:</Text>
                <Text style={styles.passDetailValue}>{params.visitorName}</Text>
              </View>
              
              <View style={styles.passDetailRow}>
                <Text style={[
                  styles.passDetailLabel,
                  isVIP && { color: '#047857' }
                ]}>{isVIP ? 'PURPOSE OF VISIT:' : 'PURPOSE:'}</Text>
                <Text style={styles.passDetailValue}>{params.purpose}</Text>
              </View>
              
              <View style={styles.passDetailRow}>
                <Text style={[
                  styles.passDetailLabel,
                  isVIP && { color: '#047857' }
                ]}>{isVIP ? 'VISIT DURATION:' : 'VALID FROM:'}</Text>
                <Text style={styles.passDetailValue}>{params.fromDate} {params.fromTime}</Text>
              </View>
              
              <View style={styles.passDetailRow}>
                <Text style={styles.passDetailLabel}>VALID UNTIL:</Text>
                <Text style={styles.passDetailValue}>{params.toDate} {params.toTime}</Text>
              </View>



              {params.generatedAt && (
                <View style={styles.passDetailRow}>
                  <Text style={styles.passDetailLabel}>GENERATED:</Text>
                  <Text style={[styles.passDetailValue, { fontSize: 11 }]}>
                    {new Date(params.generatedAt).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>

            {/* Pass Footer */}
            <View style={styles.passFooter}>
              <Text style={styles.passFooterText}>
                Show this pass to security • Valid for specified dates only
              </Text>
              {isVIP && (
                <Text style={[styles.passFooterText, { color: '#047857', fontWeight: 'bold' }]}>
                  ★ VIP PRIORITY ACCESS ★
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Separate details section for screen display (not captured) */}
        <View style={styles.detailsSection}>
          <Text style={[
            styles.detailsTitle,
            { color: isVIP ? '#10B981' : '#D97706' }
          ]}>{isVIP ? 'VIP Guest Details' : 'Pass Details'}</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{params.visitorName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[
              styles.detailLabel,
              isVIP && { color: '#10B981' }
            ]}>{isVIP ? 'Purpose of Visit:' : 'Purpose:'}</Text>
            <Text style={styles.detailValue}>{params.purpose}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[
              styles.detailLabel,
              isVIP && { color: '#10B981' }
            ]}>{isVIP ? 'Visit Duration:' : 'Valid From:'}</Text>
            <Text style={styles.detailValue}>{params.fromDate} {params.fromTime}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Valid Until:</Text>
            <Text style={styles.detailValue}>{params.toDate} {params.toTime}</Text>
          </View>

          {params.dbRecordId && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pass ID:</Text>
              <Text style={[styles.detailValue, { fontSize: 12, color: '#666' }]}>
                #{params.dbRecordId}
              </Text>
            </View>
          )}

          {params.generatedAt && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Generated:</Text>
              <Text style={[styles.detailValue, { fontSize: 12, color: '#666' }]}>
                {new Date(params.generatedAt).toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={[styles.actionButton, isSharing && styles.disabledButton]} 
            onPress={handleShare}
            disabled={isSharing}
          >
            <LinearGradient
              colors={isVIP ? ['#047857', '#10B981'] : ['#D97706', '#F59E0B']}
              style={styles.actionButtonGradient}
            >
              <Share2 size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                {isSharing ? 'Preparing Share...' : 'Share Pass'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.secondaryButton, isSaving && styles.disabledButton]} 
            onPress={handleSave}
            disabled={isSaving}
          >
            <Download size={20} color={isSaving ? '#999' : (isVIP ? '#047857' : '#D97706')} />
            <Text style={[
              styles.secondaryButtonText,
              { color: isSaving ? '#999' : (isVIP ? '#047857' : '#D97706') }
            ]}>
              {isSaving ? 'Saving...' : 'Save Complete Pass'}
            </Text>
          </TouchableOpacity>


        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>

        <View style={[
          styles.instructionsSection,
          { 
            backgroundColor: isVIP ? '#FEF3C7' : '#FEF3C7',
            borderLeftColor: isVIP ? '#10B981' : '#D97706'
          }
        ]}>
          <Text style={[
            styles.instructionsTitle,
            { color: isVIP ? '#10B981' : '#D97706' }
          ]}>Instructions</Text>
          <Text style={[
            styles.instructionsText,
            { color: isVIP ? '#10B981' : '#D97706' }
          ]}>
            • Show this QR code to the security guard at the gate
          </Text>
          <Text style={[
            styles.instructionsText,
            { color: isVIP ? '#10B981' : '#D97706' }
          ]}>
            • Keep the pass accessible during your visit
          </Text>
          <Text style={[
            styles.instructionsText,
            { color: isVIP ? '#10B981' : '#D97706' }
          ]}>
            • The pass is valid only for the specified date and time range
          </Text>
          {isVIP && (
            <Text style={[styles.instructionsText, { color: '#047857', fontWeight: '600' }]}>
              • VIP pass provides priority access and special privileges
            </Text>
          )}
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrCaptureContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullPassContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    width: 320,
    minHeight: 500,
  },
  passHeader: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  passHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
  passHeaderSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 6,
    opacity: 0.95,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  qrCodeSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FAFAFA',
  },
  passDetailsSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  passDetailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  passDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingVertical: 2,
  },
  passDetailLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: 'bold',
    flex: 1,
    letterSpacing: 0.5,
  },
  passDetailValue: {
    fontSize: 11,
    color: '#000',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  passFooter: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  passFooterText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 2,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  qrSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsSection: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 15,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    gap: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  disabledButton: {
    opacity: 0.6,
  },
  doneButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#666',
    textDecorationLine: 'underline',
  },
  instructionsSection: {
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 18,
  },
});

// Ensure proper export
export { VisitorQRScreen };