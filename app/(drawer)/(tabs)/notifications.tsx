import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, AlertTriangle, Clock, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLocalization } from '../../../context/LocalizationContext';
import { wp, hp, fontSize, spacing, s, vs, ms, RF, getResponsiveText, getLineHeight } from '../../../utils/responsive';

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useLocalization();

  // Extended resident alerts data - sorted by time (newest first)
  const residentAlertsData = [
    { 
      id: 1,
      title: t('alerts.waterShutdown'), 
      message: t('alerts.waterShutdownMsg'), 
      priority: 'high', 
      time: t('alerts.hoursAgo', { count: 2 }),
      timestamp: Date.now() - (2 * 60 * 60 * 1000), // 2 hours ago
      read: false
    },
    {
      id: 4,
      title: 'Elevator Maintenance',
      message: 'Elevator in Block A will be under maintenance from 10 AM to 2 PM tomorrow.',
      priority: 'medium',
      time: '5 hours ago',
      timestamp: Date.now() - (5 * 60 * 60 * 1000), // 5 hours ago
      read: false
    },
    { 
      id: 2,
      title: t('alerts.newSecurityProtocol'), 
      message: t('alerts.newSecurityProtocolMsg'), 
      priority: 'medium', 
      time: t('alerts.dayAgo', { count: 1 }),
      timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: false
    },
    {
      id: 5,
      title: 'Parking Violation Notice',
      message: 'Vehicle parked in visitor slot without proper authorization. Please move immediately.',
      priority: 'high',
      time: '1 day ago',
      timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: true
    },
    {
      id: 6,
      title: 'Community Event Reminder',
      message: 'Annual sports day is scheduled for this weekend. Registration is still open.',
      priority: 'low',
      time: '2 days ago',
      timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
      read: true
    },
    { 
      id: 3,
      title: t('alerts.communityMeeting'), 
      message: t('alerts.communityMeetingMsg'), 
      priority: 'low', 
      time: t('alerts.daysAgo', { count: 3 }),
      timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true
    },
    {
      id: 7,
      title: 'Power Outage Alert',
      message: 'Scheduled power maintenance on Sunday from 6 AM to 8 AM. Please plan accordingly.',
      priority: 'medium',
      time: '3 days ago',
      timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true
    },
    {
      id: 8,
      title: 'New Resident Welcome',
      message: 'Please welcome the new family moving into Flat 304. Community orientation scheduled.',
      priority: 'low',
      time: '1 week ago',
      timestamp: Date.now() - (7 * 24 * 60 * 60 * 1000), // 1 week ago
      read: true
    }
  ];

  // Sort alerts by timestamp (newest first)
  const residentAlerts = residentAlertsData.sort((a, b) => b.timestamp - a.timestamp);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return styles.highPriorityBadge;
      case 'medium':
        return styles.mediumPriorityBadge;
      case 'low':
        return styles.lowPriorityBadge;
      default:
        return styles.lowPriorityBadge;
    }
  };

  const unreadCount = residentAlerts.filter(alert => !alert.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0077B6', '#90CAF9']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>{t('features.notifications')}</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            <Bell size={24} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.notificationsContainer}>
          <Text style={styles.sectionTitle}>
            {t('features.residentAlerts')}
          </Text>
          
          {residentAlerts.map((alert, index) => (
            <TouchableOpacity 
              key={alert.id} 
              style={[
                styles.alertCard,
                !alert.read && styles.unreadAlertCard
              ]}
              onPress={() => {
                // Handle alert press - could navigate to detail or mark as read
                console.log('Alert pressed:', alert.title);
              }}
            >
              <View style={styles.alertHeader}>
                <View style={styles.alertTitleRow}>
                  <Text style={[
                    styles.alertTitle,
                    !alert.read && styles.unreadAlertTitle
                  ]}>
                    {alert.title}
                  </Text>
                  <View style={[styles.priorityBadge, getPriorityBadgeStyle(alert.priority)]} />
                </View>
                <Text style={styles.alertTime}>
                  <Clock size={12} color="#6B7280" /> {alert.time}
                </Text>
              </View>
              
              <Text style={styles.alertMessage}>{alert.message}</Text>
              
              {!alert.read && (
                <View style={styles.unreadIndicator}>
                  <View style={styles.unreadDot} />
                  <Text style={styles.unreadText}>New</Text>
                </View>
              )}
              
              {index < residentAlerts.length - 1 && (
                <View style={styles.alertDivider} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.markAllReadButton}
            onPress={() => {
              // Handle mark all as read
              console.log('Mark all as read');
            }}
          >
            <Text style={styles.markAllReadText}>Mark All as Read</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.clearAllButton}
            onPress={() => {
              // Handle clear all notifications
              console.log('Clear all notifications');
            }}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
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
    paddingVertical: vs(10),
    paddingHorizontal: s(15),
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
  backButton: {
    padding: s(8),
    borderRadius: s(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
  },
  headerTitle: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: getLineHeight(fontSize.large),
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: s(10),
    paddingHorizontal: s(6),
    paddingVertical: s(2),
    minWidth: s(20),
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: fontSize.tiny,
    fontWeight: 'bold',
  },
  headerRight: {
    width: s(40),
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  notificationsContainer: {
    padding: s(16),
  },
  sectionTitle: {
    fontSize: fontSize.large,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: vs(16),
    lineHeight: getLineHeight(fontSize.large),
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: s(12),
    padding: s(16),
    marginBottom: vs(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  unreadAlertCard: {
    borderLeftWidth: s(4),
    borderLeftColor: '#0077B6',
    backgroundColor: '#F8FAFC',
  },
  alertHeader: {
    marginBottom: vs(8),
  },
  alertTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  alertTitle: {
    fontSize: fontSize.medium,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    lineHeight: getLineHeight(fontSize.medium),
  },
  unreadAlertTitle: {
    color: '#0077B6',
    fontWeight: 'bold',
  },
  alertTime: {
    fontSize: fontSize.small,
    color: '#6B7280',
    flexDirection: 'row',
    alignItems: 'center',
    lineHeight: getLineHeight(fontSize.small),
  },
  alertMessage: {
    fontSize: fontSize.regular,
    color: '#4B5563',
    lineHeight: getLineHeight(fontSize.regular, 1.5),
    marginBottom: vs(8),
  },
  priorityBadge: {
    width: s(12),
    height: s(12),
    borderRadius: s(6),
    marginLeft: s(8),
  },
  highPriorityBadge: {
    backgroundColor: '#EF4444',
  },
  mediumPriorityBadge: {
    backgroundColor: '#F59E0B',
  },
  lowPriorityBadge: {
    backgroundColor: '#10B981',
  },
  unreadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
  },
  unreadDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: '#0077B6',
    marginRight: s(6),
  },
  unreadText: {
    fontSize: fontSize.small,
    color: '#0077B6',
    fontWeight: '600',
    lineHeight: getLineHeight(fontSize.small),
  },
  alertDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: vs(12),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: vs(16),
    gap: s(12),
  },
  markAllReadButton: {
    flex: 1,
    backgroundColor: '#0077B6',
    borderRadius: s(8),
    paddingVertical: vs(12),
    alignItems: 'center',
  },
  markAllReadText: {
    color: '#FFFFFF',
    fontSize: fontSize.medium,
    fontWeight: '600',
    lineHeight: getLineHeight(fontSize.medium),
  },
  clearAllButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: s(8),
    paddingVertical: vs(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  clearAllText: {
    color: '#6B7280',
    fontSize: fontSize.medium,
    fontWeight: '600',
    lineHeight: getLineHeight(fontSize.medium),
  },
});