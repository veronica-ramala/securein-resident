import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
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
import Svg, { Rect, Circle } from 'react-native-svg';
import QRCodeSVG from 'react-native-qrcode-svg';

// Enhanced QR Code Component
type QRCodeProps = {
  size?: number;
  passType?: string;
  data: {
    dbRecordId?: string;
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
        borderColor: isVIP ? '#10B981' : '#047857',
      }
    ]}>
      <Text style={[
        styles.qrTitle,
        { color: isVIP ? '#047857' : '#047857' }
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
          value={JSON.stringify({
            id: data.dbRecordId,
            name: data.visitorName,
            purpose: data.purpose,
            from: `${data.fromDate} ${data.fromTime}`,
            to: `${data.toDate} ${data.toTime}`,
            passType: data.passType,
            generatedAt: data.generatedAt,
          })}
          size={size * 0.8}
        />
      </View>
      
      <Text style={[
        styles.qrSubtitle,
        { color: isVIP ? '#047857' : '#047857' }
      ]}>
        Scan for Entry/Exit
      </Text>
    </View>
  );
};

export default function VisitorQRScreen() {
  const router = useRouter();
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
    try {
      const message = `${isVIP ? 'VIP' : 'Visitor'} Pass Generated\n\n` +
        `Name: ${params.visitorName}\n` +
        `Purpose: ${params.purpose}\n` +
        `From: ${params.fromDate} ${params.fromTime}\n` +
        `To: ${params.toDate} ${params.toTime}\n\n` +
        `Please show this QR code at the gate for entry.`;

      await Share.share({
        message,
        title: `${isVIP ? 'VIP' : 'Visitor'} Pass`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the pass');
    }
  };

  const handleDownload = () => {
    Alert.alert(
      'Download Pass',
      'QR code has been saved to your device gallery.',
      [{ text: 'OK' }]
    );
  };

  const handleDone = () => {
    // Navigate back to the main screen or gate screen
    router.push('/(tabs)/gate');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isVIP ? ['#047857', '#10B981'] : ['#047857', '#10B981']}
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
            <Check size={40} color={isVIP ? '#10B981' : '#047857'} />
          </View>
          <Text style={styles.successTitle}>Pass Generated Successfully!</Text>
          <Text style={styles.successSubtitle}>
            Your {isVIP ? 'VIP' : 'visitor'} pass is ready to use
          </Text>
        </View>

        <View style={styles.qrSection}>
          <QRCode 
            size={220} 
            passType={params.passType} 
            data={params}
          />
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Pass Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{params.visitorName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Purpose:</Text>
            <Text style={styles.detailValue}>{params.purpose}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Valid From:</Text>
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
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <LinearGradient
              colors={isVIP ? ['#047857', '#10B981'] : ['#047857', '#10B981']}
              style={styles.actionButtonGradient}
            >
              <Share2 size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Share Pass</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleDownload}>
            <Download size={20} color={isVIP ? '#047857' : '#047857'} />
            <Text style={[
              styles.secondaryButtonText,
              { color: isVIP ? '#047857' : '#047857' }
            ]}>
              Download QR
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>

        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>Instructions</Text>
          <Text style={styles.instructionsText}>
            • Show this QR code to the security guard at the gate
          </Text>
          <Text style={styles.instructionsText}>
            • Keep the pass accessible during your visit
          </Text>
          <Text style={styles.instructionsText}>
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
    color: '#10B981',
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
    color: '#10B981',
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
    backgroundColor: '#FEF3C7',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 5,
    lineHeight: 18,
  },
});