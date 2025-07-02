import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Search, Phone, Home, Briefcase, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function LocalConnectScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();
  
  // Sample data for neighbors
  const neighbors = [
    { id: '1', name: 'Rajesh Kumar', profession: 'Doctor', contactNumber: '+91 98765 43210', flatNumber: 'A-101' },
    { id: '2', name: 'Priya Sharma', profession: 'Software Engineer', contactNumber: '+91 87654 32109', flatNumber: 'B-205' },
    { id: '3', name: 'Amit Patel', profession: 'Electrician', contactNumber: '+91 76543 21098', flatNumber: 'C-304' },
    { id: '4', name: 'Neha Singh', profession: 'Teacher', contactNumber: '+91 65432 10987', flatNumber: 'A-202' },
    { id: '5', name: 'Vikram Malhotra', profession: 'Plumber', contactNumber: '+91 54321 09876', flatNumber: 'B-103' },
    { id: '6', name: 'Sunita Verma', profession: 'Lawyer', contactNumber: '+91 43210 98765', flatNumber: 'C-201' },
    { id: '7', name: 'Deepak Gupta', profession: 'Accountant', contactNumber: '+91 32109 87654', flatNumber: 'A-305' },
    { id: '8', name: 'Ananya Reddy', profession: 'Nurse', contactNumber: '+91 21098 76543', flatNumber: 'B-404' },
    { id: '9', name: 'Kiran Joshi', profession: 'Carpenter', contactNumber: '+91 10987 65432', flatNumber: 'C-102' },
    { id: '10', name: 'Rahul Mehta', profession: 'Chef', contactNumber: '+91 09876 54321', flatNumber: 'A-403' },
  ];

  // Get unique professions for category buttons
  const professions = ['All', ...new Set(neighbors.map(neighbor => neighbor.profession))];

  // Filter neighbors based on search query and selected category
  const filteredNeighbors = neighbors.filter(neighbor => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      neighbor.name.toLowerCase().includes(searchLower) ||
      neighbor.profession.toLowerCase().includes(searchLower) ||
      neighbor.flatNumber.toLowerCase().includes(searchLower)
    );
    const matchesCategory = selectedCategory === 'All' || neighbor.profession === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCall = (name, number) => {
    alert(`Calling ${name} at ${number}`);
  };

  const goBack = () => {
    router.push('/(tabs)/services');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Users size={22} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Local Connect</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, profession or flat number..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoryScrollView}
            contentContainerStyle={styles.categoryContainer}
          >
        {professions.map(profession => (
          <TouchableOpacity
            key={profession}
            style={[
              styles.categoryButton,
              selectedCategory === profession && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(profession)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === profession && styles.selectedCategoryButtonText
            ]}>
              {profession}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Neighbors Directory</Text>
          
          {filteredNeighbors.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No neighbors found matching your search.</Text>
            </View>
          ) : (
            filteredNeighbors.map(neighbor => (
              <View key={neighbor.id} style={styles.neighborCard}>
                <View style={styles.neighborInfo}>
                  <Text style={styles.neighborName}>{neighbor.name}</Text>
                  
                  <View style={styles.detailRow}>
                    <Briefcase size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{neighbor.profession}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Home size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{neighbor.flatNumber}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Phone size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{neighbor.contactNumber}</Text>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => handleCall(neighbor.name, neighbor.contactNumber)}
                >
                  <Phone size={20} color="#FFFFFF" />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            ))
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
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    width: 32, // Same width as back button for balance
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  categoryScrollView: {
    maxHeight: 60,
    marginBottom: 8,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedCategoryButton: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    marginLeft: 4,
  },
  neighborCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  neighborInfo: {
    flex: 1,
  },
  neighborName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  callButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 15,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});