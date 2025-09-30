import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode, Share, Eye, Trash2, Clock, MapPin, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MyVisitorsScreen() {
  const [visitors] = useState([
    {
      id: '1',
      name: 'John Doe',
      houseNumber: '3B',
      purpose: 'Delivery',
      date: '2024-01-15',
      time: '10:30 AM',
      status: 'active',
      photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      qrGenerated: true,
    },
    {
      id: '2',
      name: 'Maria Santos',
      houseNumber: '3B',
      purpose: 'Guest',
      date: '2024-01-15',
      time: '2:15 PM',
      status: 'pending',
      photo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      qrGenerated: true,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      houseNumber: '3B',
      purpose: 'Maintenance',
      date: '2024-01-14',
      time: '4:45 PM',
      status: 'completed',
      photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      qrGenerated: true,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'completed':
        return '#6B7280';
      default:
        return '#89AAE6';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'active':
        return '#D1FAE5';
      case 'pending':
        return '#FEF3C7';
      case 'completed':
        return '#F3F4F6';
      default:
        return '#F4D8CD';
    }
  };

  const shareQRCode = (visitorName: string) => {
    console.log(`Sharing QR code for ${visitorName}`);
  };

  const viewQRCode = (visitorName: string) => {
    console.log(`Viewing QR code for ${visitorName}`);
  };

  const deleteVisitor = (visitorId: string) => {
    console.log(`Deleting visitor ${visitorId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#125E8A', '#89AAE6']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Visitors</Text>
        <Text style={styles.headerSubtitle}>Manage your visitor list and QR codes</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Total Visitors</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.visitorsContainer}>
          {visitors.map((visitor) => (
            <View key={visitor.id} style={styles.visitorCard}>
              <View style={styles.visitorHeader}>
                <View style={styles.visitorInfo}>
                  <Image source={{ uri: visitor.photo }} style={styles.visitorPhoto} />
                  <View style={styles.visitorDetails}>
                    <Text style={styles.visitorName}>{visitor.name}</Text>
                    <View style={styles.visitorMeta}>
                      <MapPin size={14} color="#666" />
                      <Text style={styles.visitorMetaText}>House {visitor.houseNumber}</Text>
                    </View>
                    <View style={styles.visitorMeta}>
                      <Clock size={14} color="#666" />
                      <Text style={styles.visitorMetaText}>{visitor.date} • {visitor.time}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBackground(visitor.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(visitor.status) }]}>
                    {visitor.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.purposeContainer}>
                <Text style={styles.purposeLabel}>Purpose:</Text>
                <Text style={styles.purposeText}>{visitor.purpose}</Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => viewQRCode(visitor.name)}
                >
                  <Eye size={16} color="#125E8A" />
                  <Text style={styles.actionButtonText}>View Pass</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => shareQRCode(visitor.name)}
                >
                  <Share size={16} color="#125E8A" />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deleteVisitor(visitor.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.qrInfoContainer}>
          <View style={styles.qrInfoCard}>
            <QrCode size={40} color="#125E8A" />
            <Text style={styles.qrInfoTitle}>How Visitor Passes Work</Text>
            <Text style={styles.qrInfoText}>
              Each visitor gets a unique visitor pass with QR code. Guards scan this code to verify and 
              grant entry or exit. Share the pass via WhatsApp or other messaging apps.
            </Text>
          </View>
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
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#F4D8CD',
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
    color: '#125E8A',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  visitorsContainer: {
    marginBottom: 20,
  },
  visitorCard: {
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
  visitorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  visitorInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  visitorPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  visitorDetails: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  visitorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  visitorMetaText: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4D8CD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionButtonText: {
    color: '#125E8A',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
  },
  qrInfoContainer: {
    marginBottom: 20,
  },
  qrInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#125E8A',
    marginTop: 10,
    marginBottom: 10,
  },
  qrInfoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});