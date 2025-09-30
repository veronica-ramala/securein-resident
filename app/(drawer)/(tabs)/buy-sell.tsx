import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus, Filter, Heart, MapPin, Clock, DollarSign, Tag, User, Phone, MessageCircle } from 'lucide-react-native';
import { useLocalization } from '../../../context/LocalizationContext';

export default function BuySellScreen() {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data for listings
  const sampleListings = [
    {
      id: 1,
      title: 'iPhone 13 Pro Max',
      price: 45000,
      category: 'electronics',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'John Doe',
      location: 'Block A, Apt 101',
      timePosted: '2 hours ago',
      description: 'Excellent condition, barely used. All accessories included.',
      isFavorite: false,
    },
    {
      id: 2,
      title: 'Dining Table Set',
      price: 15000,
      category: 'furniture',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Sarah Wilson',
      location: 'Block B, Apt 205',
      timePosted: '1 day ago',
      description: '6-seater wooden dining table with chairs. Good condition.',
      isFavorite: true,
    },
    {
      id: 3,
      title: 'Mountain Bike',
      price: 8000,
      category: 'sports',
      image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Mike Johnson',
      location: 'Block C, Apt 302',
      timePosted: '3 days ago',
      description: 'Well-maintained mountain bike, perfect for trails.',
      isFavorite: false,
    },
    {
      id: 4,
      title: 'Kids Study Desk',
      price: 3500,
      category: 'furniture',
      image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Lisa Chen',
      location: 'Block A, Apt 405',
      timePosted: '5 days ago',
      description: 'Compact study desk perfect for children. Includes chair.',
      isFavorite: false,
    },
  ];

  const categories = [
    { id: 'all', name: t('common.all'), icon: Tag },
    { id: 'electronics', name: t('buySell.electronics'), icon: DollarSign },
    { id: 'furniture', name: t('buySell.furniture'), icon: Tag },
    { id: 'sports', name: t('buySell.sports'), icon: Tag },
    { id: 'books', name: t('buySell.books'), icon: Tag },
    { id: 'clothing', name: t('buySell.clothing'), icon: Tag },
  ];

  const filteredListings = sampleListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSeller = (seller: string) => {
    Alert.alert(
      t('buySell.contactSeller'),
      `Would you like to contact ${seller}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Calling...', `Calling ${seller}`) },
        { text: 'Message', onPress: () => Alert.alert('Messaging...', `Opening chat with ${seller}`) },
      ]
    );
  };

  const handlePostItem = () => {
    Alert.alert(
      t('buySell.postAd'),
      'This feature will allow you to post items for sale.',
      [{ text: t('common.ok') }]
    );
  };

  const renderListingCard = (listing: any) => (
    <View key={listing.id} style={styles.listingCard}>
      <Image source={{ uri: listing.image }} style={styles.listingImage} />
      <TouchableOpacity style={styles.favoriteButton}>
        <Heart 
          size={20} 
          color={listing.isFavorite ? '#EF4444' : '#9CA3AF'} 
          fill={listing.isFavorite ? '#EF4444' : 'none'}
        />
      </TouchableOpacity>
      
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle}>{listing.title}</Text>
        <Text style={styles.listingPrice}>₹{listing.price.toLocaleString()}</Text>
        
        <View style={styles.listingMeta}>
          <View style={styles.metaItem}>
            <MapPin size={12} color="#6B7280" />
            <Text style={styles.metaText}>{listing.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={12} color="#6B7280" />
            <Text style={styles.metaText}>{listing.timePosted}</Text>
          </View>
        </View>
        
        <Text style={styles.listingDescription} numberOfLines={2}>
          {listing.description}
        </Text>
        
        <View style={styles.listingFooter}>
          <View style={styles.sellerInfo}>
            <User size={14} color="#6B7280" />
            <Text style={styles.sellerName}>{listing.seller}</Text>
          </View>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => handleContactSeller(listing.seller)}
          >
            <MessageCircle size={16} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>{t('buySell.contact')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#2196F3', '#1E88E5']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('buySell.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('buySell.marketplace')}</Text>
        </View>
      </LinearGradient>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'buy' && styles.activeTab]}
          onPress={() => setActiveTab('buy')}
        >
          <Text style={[styles.tabText, activeTab === 'buy' && styles.activeTabText]}>
            {t('buySell.buyItems')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sell' && styles.activeTab]}
          onPress={() => setActiveTab('sell')}
        >
          <Text style={[styles.tabText, activeTab === 'sell' && styles.activeTabText]}>
            {t('buySell.sellItems')}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'buy' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder={t('buySell.searchPlaceholder')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#4DD0E1" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.activeCategoryChip
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <category.icon 
                  size={16} 
                  color={selectedCategory === category.id ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.activeCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Listings */}
          <View style={styles.listingsContainer}>
            <Text style={styles.sectionTitle}>
              Available Items ({filteredListings.length})
            </Text>
            {filteredListings.map(renderListingCard)}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sell Tab Content */}
          <View style={styles.sellContainer}>
            <View style={styles.postItemCard}>
              <View style={styles.postItemHeader}>
                <Plus size={24} color="#0077B6" />
                <Text style={styles.postItemTitle}>{t('buySell.postAd')}</Text>
              </View>
              <Text style={styles.postItemDescription}>
                Sell your items to neighbors in your community
              </Text>
              <TouchableOpacity style={styles.postButton} onPress={handlePostItem}>
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.postButtonText}>Create Listing</Text>
              </TouchableOpacity>
            </View>

            {/* My Listings Section */}
            <View style={styles.myListingsSection}>
              <Text style={styles.sectionTitle}>{t('buySell.myListings')}</Text>
              <View style={styles.emptyState}>
                <Tag size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateTitle}>{t('buySell.noItems')}</Text>
                <Text style={styles.emptyStateDescription}>
                  Start selling by posting your first item
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#1E88E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activeCategoryChip: {
    backgroundColor: '#1E88E5',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  listingsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  listingImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  listingContent: {
    padding: 16,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 0,
    lineHeight: 22,
    textAlign: 'left',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginTop: 0,
    marginBottom: 8,
    lineHeight: 20,
    textAlign: 'left',
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  listingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sellContainer: {
    flex: 1,
  },
  postItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  postItemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  postItemDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  myListingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});