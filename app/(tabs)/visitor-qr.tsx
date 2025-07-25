

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
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
import { useUserContext } from '../../context/UserContext';
import Svg, { Rect, Circle } from 'react-native-svg';
import QRCodeSVG from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import Share from 'react-native-share';

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
            onPress: () => router.replace('/(tabs)/visitor-registration'),
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
            onPress: () => router.replace('/(tabs)/visitor-registration'),
            style: 'default'
          }
        ],
        { cancelable: false }
      );
      return;
    }
  }, [params, router]);

  const isVIP = params.passType === 'vip';

  const handleShare = async () => {
    if (isSharing) return; // Prevent multiple shares
    
    setIsSharing(true);
    try {
      // Capture the entire pass card view as an image
      const uri = await captureRef(qrViewRef, {
        format: 'png',
        quality: 1.0, // Highest quality
        result: 'tmpfile',
      });

      // Create sharing options
      const shareOptions = {
        title: `${isVIP ? 'VIP' : 'Visitor'} Access Pass`,
        message: `${isVIP ? 'VIP' : 'Visitor'} Pass for ${params.visitorName}\n\nPurpose: ${params.purpose}\nValid: ${params.fromDate} ${params.fromTime} - ${params.toDate} ${params.toTime}\n\nPlease show this QR code at the gate for entry.`,
        url: Platform.OS === 'android' ? `file://${uri}` : uri,
        type: 'image/png',
        filename: `${params.passType?.toUpperCase()}_Pass_${params.visitorName?.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.png`,
        failOnCancel: false,
      };

      // Open native share sheet
      const result = await Share.open(shareOptions);
      
      // Clean up temporary file after sharing
      if (result.success || result.dismissedAction) {
        try {
          await FileSystem.deleteAsync(uri, { idempotent: true });
        } catch (cleanupError) {
          console.log('Cleanup error (non-critical):', cleanupError);
        }
      }

    } catch (error: any) {
      console.error('Error sharing pass:', error);
      
      // Handle specific error cases
      if (error.message && error.message.includes('User did not share')) {
        // User cancelled sharing - this is normal, no need to show error
        return;
      }
      
      Alert.alert(
        'Share Failed',
        'Failed to share the pass. Please try again or use the save option instead.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple saves
    
    setIsSaving(true);
    try {
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
    router.push('/(tabs)/gate');
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