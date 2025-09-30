import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Check, X, Clock, User, MapPin, CircleAlert as AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RequestsScreen() {
  const [requests, setRequests] = useState([
    {
      id: '1',
      visitorName: 'David Wilson',
      guardName: 'Ravi Kumar',
      houseNumber: '3B',
      purpose: 'Food Delivery',
      timestamp: '2024-01-15 11:45 AM',
      photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'pending',
      urgency: 'normal',
    },
    {
      id: '2',
      visitorName: 'Sarah Johnson',
      guardName: 'Priya Singh',
      houseNumber: '3B',
      purpose: 'Guest Visit',
      timestamp: '2024-01-15 3:20 PM',
      photo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'pending',
      urgency: 'high',
    },
    {
      id: '3',
      visitorName: 'Tom Martinez',
      guardName: 'Amit Sharma',
      houseNumber: '3B',
      purpose: 'Maintenance',
      timestamp: '2024-01-14 9:15 AM',
      photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'approved',
      urgency: 'normal',
    },
  ]);

  const handleApprove = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'approved' } : req
      )
    );
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' } : req
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#10B981';
      case 'rejected':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return '#89AAE6';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'approved':
        return '#D1FAE5';
      case 'rejected':
        return '#FEE2E2';
      case 'pending':
        return '#FEF3C7';
      default:
        return '#F4D8CD';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    return urgency === 'high' ? '#EF4444' : '#89AAE6';
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#125E8A', '#89AAE6']}
        style={styles.header}
      >
        <Bell size={32} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Entry Requests</Text>
        <Text style={styles.headerSubtitle}>Guard-initiated visitor requests</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{pendingRequests.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>
              {requests.filter(r => r.status === 'approved').length}
            </Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>
              {requests.filter(r => r.status === 'rejected').length}
            </Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        {pendingRequests.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={styles.requestInfo}>
                    <Image source={{ uri: request.photo }} style={styles.visitorPhoto} />
                    <View style={styles.requestDetails}>
                      <View style={styles.nameContainer}>
                        <Text style={styles.visitorName}>{request.visitorName}</Text>
                        {request.urgency === 'high' && (
                          <AlertCircle size={16} color="#EF4444" />
                        )}
                      </View>
                      <View style={styles.requestMeta}>
                        <MapPin size={14} color="#666" />
                        <Text style={styles.requestMetaText}>House {request.houseNumber}</Text>
                      </View>
                      <View style={styles.requestMeta}>
                        <Clock size={14} color="#666" />
                        <Text style={styles.requestMetaText}>{request.timestamp}</Text>
                      </View>
                      <View style={styles.requestMeta}>
                        <User size={14} color="#666" />
                        <Text style={styles.requestMetaText}>Requested by {request.guardName}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.purposeContainer}>
                  <Text style={styles.purposeLabel}>Purpose:</Text>
                  <Text style={styles.purposeText}>{request.purpose}</Text>
                </View>

                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleApprove(request.id)}
                  >
                    <Check size={18} color="#FFFFFF" />
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(request.id)}
                  >
                    <X size={18} color="#FFFFFF" />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {processedRequests.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Recent Decisions</Text>
            {processedRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={styles.requestInfo}>
                    <Image source={{ uri: request.photo }} style={styles.visitorPhoto} />
                    <View style={styles.requestDetails}>
                      <Text style={styles.visitorName}>{request.visitorName}</Text>
                      <View style={styles.requestMeta}>
                        <MapPin size={14} color="#666" />
                        <Text style={styles.requestMetaText}>House {request.houseNumber}</Text>
                      </View>
                      <View style={styles.requestMeta}>
                        <Clock size={14} color="#666" />
                        <Text style={styles.requestMetaText}>{request.timestamp}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusBackground(request.status) }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                      {request.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.purposeContainer}>
                  <Text style={styles.purposeLabel}>Purpose:</Text>
                  <Text style={styles.purposeText}>{request.purpose}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {requests.length === 0 && (
          <View style={styles.emptyState}>
            <Bell size={60} color="#89AAE6" />
            <Text style={styles.emptyStateTitle}>No Requests</Text>
            <Text style={styles.emptyStateText}>
              You don't have any entry requests at the moment. 
              Guards will send requests here when visitors arrive without pre-approval.
            </Text>
          </View>
        )}
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#F4D8CD',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginBottom: 15,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  visitorPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  requestDetails: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  requestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  requestMetaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  purposeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  purposeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  purposeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#125E8A',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#125E8A',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});