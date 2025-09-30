import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, FlatList, Animated, Vibration, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Search, Phone, Home, Briefcase, ChevronLeft, MapPin, Filter, Grid3X3, List, Star, Clock, Zap, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LocalConnectScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // 'grid' or 'list'
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['1', '3', '8'])); // Sample favorites
  const [recentCalls, setRecentCalls] = useState<string[]>(['2', '5', '1']); // Sample recent calls
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'profession', 'recent', 'favorites'
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const router = useRouter();
  
  // Image System Configuration
  const imageConfig = {
    // Profession category images (can be local assets or URLs)
    professionImages: {
      'doctor': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&crop=face',
      'lawyer': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
      'chef': 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=300&fit=crop&crop=face',
      'crafts': 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop&crop=center',
      'teacher': 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=400&h=300&fit=crop&crop=face',
      'designer': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop&crop=face',
      'tailor': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&crop=center'
    },
    // Individual profile pictures (can be expanded with real user photos)
    profileImages: {
      '1': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
      '2': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      '3': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      '4': 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&crop=face',
      '5': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      '6': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      '7': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      '8': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
      '9': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      '10': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      '11': 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop&crop=face',
      '12': 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=200&h=200&fit=crop&crop=face',
      '13': 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=200&h=200&fit=crop&crop=face',
      '14': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop&crop=face'
    },
    // Fallback options
    enableImages: true, // Toggle to enable/disable images
    showFallbackInitials: true, // Show initials if image fails to load
    showFallbackIcons: true // Show emoji icons if profession image fails
  };

  // Helper function to get profession image
  const getProfessionImage = (professionId?: string): string | null => {
    if (!imageConfig.enableImages) return null;
    if (!professionId) return null;
    const key = professionId.toLowerCase();
    return (imageConfig.professionImages as Record<string, string>)[key] || null;
  };

  // Helper function to get profile image
  const getProfileImage = (userId?: string): string | null => {
    if (!imageConfig.enableImages) return null;
    if (!userId) return null;
    return (imageConfig.profileImages as Record<string, string>)[userId] || null;
  };
  
  // Enhanced sample data for neighbors with additional fields
  type Neighbor = {
    id: string;
    name: string;
    profession: string;
    contactNumber: string;
    flatNumber: string;
    availability: string;
    rating: number;
    specialization: string;
    isOnline: boolean;
  };

  const neighbors: Neighbor[] = [
    { id: '1', name: 'Dr. Rajesh Kumar', profession: 'Doctor', contactNumber: '+91 98765 43210', flatNumber: 'A-101', availability: 'Available', rating: 4.8, specialization: 'General Medicine', isOnline: true },
    { id: '2', name: 'Adv. Sunita Verma', profession: 'Lawyer', contactNumber: '+91 43210 98765', flatNumber: 'C-201', availability: 'Busy', rating: 4.9, specialization: 'Family Law', isOnline: false },
    { id: '3', name: 'Chef Rahul Mehta', profession: 'Chef', contactNumber: '+91 09876 54321', flatNumber: 'A-403', availability: 'Available', rating: 4.7, specialization: 'Indian Cuisine', isOnline: true },
    { id: '4', name: 'Kiran Joshi', profession: 'Crafts', contactNumber: '+91 10987 65432', flatNumber: 'C-102', availability: 'Available', rating: 4.5, specialization: 'Handmade Items', isOnline: true },
    { id: '5', name: 'Mrs. Neha Singh', profession: 'Teacher', contactNumber: '+91 65432 10987', flatNumber: 'A-202', availability: 'Available', rating: 4.6, specialization: 'Mathematics', isOnline: false },
    { id: '6', name: 'Priya Sharma', profession: 'Designer', contactNumber: '+91 87654 32109', flatNumber: 'B-205', availability: 'Available', rating: 4.8, specialization: 'Interior Design', isOnline: true },
    { id: '7', name: 'Amit Patel', profession: 'Tailor', contactNumber: '+91 76543 21098', flatNumber: 'C-304', availability: 'Busy', rating: 4.4, specialization: 'Custom Tailoring', isOnline: false },
    { id: '8', name: 'Dr. Ananya Reddy', profession: 'Doctor', contactNumber: '+91 21098 76543', flatNumber: 'B-404', availability: 'Available', rating: 4.9, specialization: 'Pediatrics', isOnline: true },
    { id: '9', name: 'Adv. Deepak Gupta', profession: 'Lawyer', contactNumber: '+91 32109 87654', flatNumber: 'A-305', availability: 'Available', rating: 4.7, specialization: 'Corporate Law', isOnline: true },
    { id: '10', name: 'Maya Crafts', profession: 'Crafts', contactNumber: '+91 54321 09876', flatNumber: 'B-103', availability: 'Available', rating: 4.3, specialization: 'Pottery', isOnline: false },
    { id: '11', name: 'Chef Vikram Singh', profession: 'Chef', contactNumber: '+91 98765 12345', flatNumber: 'A-501', availability: 'Available', rating: 4.6, specialization: 'Continental', isOnline: true },
    { id: '12', name: 'Prof. Kavita Jain', profession: 'Teacher', contactNumber: '+91 87654 23456', flatNumber: 'B-302', availability: 'Busy', rating: 4.8, specialization: 'Physics', isOnline: false },
    { id: '13', name: 'Ravi Designer', profession: 'Designer', contactNumber: '+91 76543 34567', flatNumber: 'C-405', availability: 'Available', rating: 4.5, specialization: 'Graphic Design', isOnline: true },
    { id: '14', name: 'Master Tailor Ram', profession: 'Tailor', contactNumber: '+91 65432 45678', flatNumber: 'A-203', availability: 'Available', rating: 4.7, specialization: 'Traditional Wear', isOnline: true },
  ];

  // Predefined profession categories for filter buttons
  const professions = [
    { id: 'doctor', name: 'Doctor', icon: '🏥', color: '#EF4444', description: 'Medical professionals' },
    { id: 'lawyer', name: 'Lawyer', icon: '⚖️', color: '#3B82F6', description: 'Legal experts' },
    { id: 'chef', name: 'Chef', icon: '👨‍🍳', color: '#F59E0B', description: 'Food services' },
    { id: 'crafts', name: 'Crafts', icon: '🔨', color: '#10B981', description: 'Repair & handmade' },
    { id: 'teacher', name: 'Teacher', icon: '📚', color: '#8B5CF6', description: 'Educational services' },
    { id: 'designer', name: 'Designer', icon: '🎨', color: '#EC4899', description: 'Design services' },
    { id: 'tailor', name: 'Tailor', icon: '✂️', color: '#6366F1', description: 'Clothing services' },
  ];
  
  // Get count for each profession
  const getProfessionCount = (profession: string): number => {
    return neighbors.filter(neighbor => neighbor.profession === profession).length;
  };

  // Sort options
  const sortOptions = [
    { id: 'name', title: 'Name', icon: 'Users' },
    { id: 'rating', title: 'Rating', icon: 'Star' },
    { id: 'recent', title: 'Recent Calls', icon: 'Clock' },
    { id: 'favorites', title: 'Favorites', icon: 'Heart' },
    { id: 'availability', title: 'Available Now', icon: 'Zap' },
  ];

  // Advanced filtering and sorting with useMemo for performance
  const filteredAndSortedNeighbors = useMemo(() => {
    let filtered = neighbors.filter(neighbor => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || (
        neighbor.name.toLowerCase().includes(searchLower) ||
        neighbor.profession.toLowerCase().includes(searchLower) ||
        neighbor.flatNumber.toLowerCase().includes(searchLower) ||
        neighbor.specialization.toLowerCase().includes(searchLower)
      );
      const matchesCategory = selectedCategory === '' || neighbor.profession === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
          const aRecentIndex = recentCalls.indexOf(a.id);
          const bRecentIndex = recentCalls.indexOf(b.id);
          if (aRecentIndex === -1 && bRecentIndex === -1) return 0;
          if (aRecentIndex === -1) return 1;
          if (bRecentIndex === -1) return -1;
          return aRecentIndex - bRecentIndex;
        case 'favorites':
          const aFav = favorites.has(a.id);
          const bFav = favorites.has(b.id);
          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;
          return a.name.localeCompare(b.name);
        case 'availability':
          if (a.availability === 'Available' && b.availability !== 'Available') return -1;
          if (a.availability !== 'Available' && b.availability === 'Available') return 1;
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [neighbors, searchQuery, selectedCategory, sortBy, favorites, recentCalls]);

  // Global search results (when searching from main screen)
  const globalSearchResults = useMemo(() => {
    if (searchQuery === '') return [];
    
    return neighbors.filter(neighbor => {
      const searchLower = searchQuery.toLowerCase();
      return (
        neighbor.name.toLowerCase().includes(searchLower) ||
        neighbor.profession.toLowerCase().includes(searchLower) ||
        neighbor.flatNumber.toLowerCase().includes(searchLower) ||
        neighbor.specialization.toLowerCase().includes(searchLower)
      );
    }).sort((a, b) => b.rating - a.rating);
  }, [neighbors, searchQuery]);

  // Enhanced animation effects
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isSearchFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSearchFocused]);

  const handleCall = (neighbor: Neighbor) => {
    Vibration.vibrate(50); // Haptic feedback
    
    // Add to recent calls
    setRecentCalls(prev => {
      const newRecent = [neighbor.id, ...prev.filter(id => id !== neighbor.id)].slice(0, 5);
      return newRecent;
    });

    // Show confirmation with more details
    Alert.alert(
      `Call ${neighbor.name}?`,
      `${neighbor.profession} • ${neighbor.specialization}\nFlat ${neighbor.flatNumber} • ${neighbor.contactNumber}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          onPress: () => {
            // Here you would integrate with actual calling functionality
            Alert.alert('Calling...', `Connecting to ${neighbor.name}`);
          }
        }
      ]
    );
  };

  const toggleFavorite = (neighborId: string) => {
    Vibration.vibrate(30);
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(neighborId)) {
        newFavorites.delete(neighborId);
      } else {
        newFavorites.add(neighborId);
      }
      return newFavorites;
    });
  };

  const handleCategorySelect = (profession: string) => {
    Vibration.vibrate(20);
    setSelectedCategory(profession);
    setSearchQuery('');
  };

  const toggleViewMode = () => {
    Vibration.vibrate(30);
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const handleSortSelect = (sortOption: string) => {
    Vibration.vibrate(20);
    setSortBy(sortOption);
    setShowSortOptions(false);
  };

  const goBack = () => {
    if (selectedCategory) {
      setSelectedCategory('');
      setSearchQuery('');
    } else {
      // Use back navigation to avoid strict typed route strings
      router.back();
    }
  };

  const renderNeighborCard = ({ item }: { item: Neighbor }) => {
    const neighbor = item;
    const isFavorite = favorites.has(neighbor.id);
    const isRecent = recentCalls.includes(neighbor.id);
    const isOnline = neighbor.isOnline;
    const isAvailable = neighbor.availability === 'Available';

    if (viewMode === 'list') {
      return (
        <View style={[styles.listCard, !isAvailable && styles.unavailableCard]}>
          <View style={styles.listCardLeft}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.smallAvatar, !isAvailable && styles.unavailableAvatar]}>
                {getProfileImage(neighbor.id) ? (
                  (() => {
                    const uri = getProfileImage(neighbor.id);
                    return uri ? (
                      <Image
                        source={{ uri }}
                        style={styles.profileImage}
                        onError={() => {
                          console.log(`Failed to load profile image for ${neighbor.id}`);
                        }}
                      />
                    ) : null;
                  })()
                ) : (
                  <Text style={styles.smallAvatarText}>
                    {neighbor.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                  </Text>
                )}
              </View>
              {isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.listCardInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.listCardName, !isAvailable && styles.unavailableText]}>
                  {neighbor.name}
                </Text>
                {isFavorite && <Star size={14} color="#F59E0B" fill="#F59E0B" />}
                {isRecent && <Clock size={12} color="#06B6D4" />}
              </View>
              <Text style={styles.listCardProfession}>{neighbor.profession}</Text>
              <Text style={styles.listCardSpecialization}>{neighbor.specialization}</Text>
              <View style={styles.detailsRow}>
                <Text style={styles.listCardFlat}>Flat {neighbor.flatNumber}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.ratingText}>{neighbor.rating}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, isAvailable ? styles.availableBadge : styles.busyBadge]}>
                <Text style={[styles.statusText, isAvailable ? styles.availableText : styles.busyText]}>
                  {neighbor.availability}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(neighbor.id)}
            >
              <Heart size={16} color={isFavorite ? "#EF4444" : "#9CA3AF"} fill={isFavorite ? "#EF4444" : "none"} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.quickCallButton, !isAvailable && styles.disabledButton]}
              onPress={() => handleCall(neighbor)}
              disabled={!isAvailable}
            >
              <Phone size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.gridCard, !isAvailable && styles.unavailableCard]}>
        <View style={styles.gridCardHeader}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.gridAvatar, !isAvailable && styles.unavailableAvatar]}>
                {getProfileImage(neighbor.id) ? (
                  (() => {
                    const uri = getProfileImage(neighbor.id);
                    return uri ? (
                      <Image
                        source={{ uri }}
                        style={styles.gridProfileImage}
                        onError={() => {
                          console.log(`Failed to load profile image for ${neighbor.id}`);
                        }}
                      />
                    ) : null;
                  })()
                ) : (
                <Text style={styles.gridAvatarText}>
                  {neighbor.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                </Text>
              )}
            </View>
            {isOnline && <View style={styles.onlineIndicatorSmall} />}
          </View>
          <TouchableOpacity 
            style={styles.favoriteButtonSmall}
            onPress={() => toggleFavorite(neighbor.id)}
          >
            <Heart size={14} color={isFavorite ? "#EF4444" : "#9CA3AF"} fill={isFavorite ? "#EF4444" : "none"} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.gridCardName, !isAvailable && styles.unavailableText]}>
          {neighbor.name}
        </Text>
        
        <View style={styles.professionBadge}>
          <Text style={styles.professionBadgeText}>{neighbor.profession}</Text>
        </View>
        
        <Text style={styles.gridCardSpecialization}>{neighbor.specialization}</Text>
        <Text style={styles.gridCardFlat}>Flat {neighbor.flatNumber}</Text>
        
        <View style={styles.gridRatingRow}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>{neighbor.rating}</Text>
          {isRecent && <Clock size={10} color="#06B6D4" />}
        </View>
        
        <View style={[styles.statusBadgeSmall, isAvailable ? styles.availableBadge : styles.busyBadge]}>
          <Text style={[styles.statusTextSmall, isAvailable ? styles.availableText : styles.busyText]}>
            {neighbor.availability}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.gridCallButton, !isAvailable && styles.disabledButton]}
          onPress={() => handleCall(neighbor)}
          disabled={!isAvailable}
        >
          <Phone size={14} color="#FFFFFF" />
          <Text style={styles.gridCallButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Show profession categories first (main screen)
  if (!selectedCategory) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Local Connect</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Connect with Neighbors</Text>
          <Text style={styles.welcomeSubtitle}>Find professionals and services in your community</Text>
        </View>

        {/* Search Section */}
        <Animated.View style={[styles.searchSection, {
          borderBottomWidth: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2],
          }),
          borderBottomColor: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['#E5E7EB', '#7C3AED'],
          }),
        }]}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#7C3AED" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search neighbors by name, profession, or specialization..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Show search results if searching */}
        {searchQuery.length > 0 ? (
          <View style={styles.searchResultsSection}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>Search Results</Text>
              <Text style={styles.searchResultsCount}>
                {globalSearchResults.length} found
              </Text>
            </View>
            
            {globalSearchResults.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Users size={48} color="#D1D5DB" />
                <Text style={styles.noResultsTitle}>No neighbors found</Text>
                <Text style={styles.noResultsText}>
                  Try adjusting your search terms
                </Text>
              </View>
            ) : (
              <FlatList
                data={globalSearchResults}
                renderItem={renderNeighborCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.searchResultsContainer}
                columnWrapperStyle={styles.gridRow}
              />
            )}
          </View>
        ) : (
          <>

            {/* Categories Section with new layout */}
            <View style={styles.categoriesSection}>
              <Text style={styles.categoriesTitle}>Browse by Profession</Text>
              
              {/* Scrollable Grid Layout for Categories */}
              <ScrollView 
                style={styles.categoriesScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.categoriesGrid}
              >
                {professions.map((profession, index) => (
                  <TouchableOpacity
                    key={profession.id}
                    style={[
                      styles.professionCard,
                      { backgroundColor: profession.color + '10' },
                      index % 2 === 0 ? styles.professionCardLeft : styles.professionCardRight
                    ]}
                    onPress={() => handleCategorySelect(profession.name)}
                  >
                    <View style={[styles.professionIconContainer, { backgroundColor: profession.color + '20' }]}>
                      {getProfessionImage(profession.id) ? (
                        (() => {
                          const uri = getProfessionImage(profession.id);
                          return uri ? (
                            <Image
                              source={{ uri }}
                              style={styles.professionImage}
                              onError={() => {
                                // Fallback to icon if image fails to load
                                console.log(`Failed to load image for ${profession.id}`);
                              }}
                            />
                          ) : null;
                        })()
                      ) : (
                        <Text style={styles.professionIcon}>{profession.icon}</Text>
                      )}
                    </View>
                    <View style={styles.professionCardContent}>
                      <Text style={[styles.professionCardTitle, { color: profession.color }]}>
                        {profession.name}
                      </Text>
                      <Text style={styles.professionCardDescription}>
                        {profession.description}
                      </Text>
                      <Text style={styles.professionCardCount}>
                        {getProfessionCount(profession.name)} available
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}
      </SafeAreaView>
    );
  }

  // Show contacts for selected profession
  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header with Sort */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedCategory}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.sortButton} 
            onPress={() => setShowSortOptions(!showSortOptions)}
          >
            <Filter size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewToggle} onPress={toggleViewMode}>
            {viewMode === 'grid' ? <List size={20} color="#FFFFFF" /> : <Grid3X3 size={20} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Options Dropdown */}
      {showSortOptions && (
        <Animated.View style={[styles.sortDropdown, {
          opacity: animatedValue,
          maxHeight: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
          }),
        }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScrollView}>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[styles.sortOption, sortBy === option.id && styles.selectedSortOption]}
                onPress={() => handleSortSelect(option.id)}
              >
                {option.icon === 'Users' && <Users size={16} color={sortBy === option.id ? "#FFFFFF" : "#7C3AED"} />}
                {option.icon === 'Star' && <Star size={16} color={sortBy === option.id ? "#FFFFFF" : "#7C3AED"} />}
                {option.icon === 'Clock' && <Clock size={16} color={sortBy === option.id ? "#FFFFFF" : "#7C3AED"} />}
                {option.icon === 'Heart' && <Heart size={16} color={sortBy === option.id ? "#FFFFFF" : "#7C3AED"} />}
                {option.icon === 'Zap' && <Zap size={16} color={sortBy === option.id ? "#FFFFFF" : "#7C3AED"} />}
                <Text style={[styles.sortOptionText, sortBy === option.id && styles.selectedSortOptionText]}>
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Enhanced Search with Animation */}
      <Animated.View style={[styles.searchSection, {
        borderBottomWidth: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2],
        }),
        borderBottomColor: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['#E5E7EB', '#7C3AED'],
        }),
      }]}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#7C3AED" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${selectedCategory.toLowerCase()}s by name or specialization...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Enhanced Results Section */}
      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <View>
            <Text style={styles.resultsTitle}>
              {selectedCategory} Professionals
            </Text>
            <Text style={styles.sortIndicator}>
              Sorted by {sortOptions.find(opt => opt.id === sortBy)?.title}
            </Text>
          </View>
          <View style={styles.resultsStats}>
            <Text style={styles.resultsCount}>
              {filteredAndSortedNeighbors.length} found
            </Text>
            <Text style={styles.availableCount}>
              {filteredAndSortedNeighbors.filter(n => n.availability === 'Available').length} available
            </Text>
          </View>
        </View>

        {filteredAndSortedNeighbors.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Users size={48} color="#D1D5DB" />
            <Text style={styles.noResultsTitle}>No {selectedCategory.toLowerCase()}s found</Text>
            <Text style={styles.noResultsText}>
              {searchQuery ? 'Try adjusting your search terms' : `No ${selectedCategory.toLowerCase()}s available in your area`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredAndSortedNeighbors}
            renderItem={renderNeighborCard}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={`${viewMode}-${sortBy}`} // Force re-render when view mode or sort changes
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : null}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            getItemLayout={viewMode === 'list' ? (data, index) => ({
              length: 120,
              offset: 120 * index,
              index,
            }) : undefined}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header
  header: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
  },
  
  // Enhanced Search Section
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  
  // Welcome Section
  welcomeSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  // Search Results Section
  searchResultsSection: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchResultsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  searchResultsContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  
  // Categories Section with New Layout
  categoriesSection: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoriesScrollView: {
    flex: 1,
  },
  categoriesGrid: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  professionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  professionCardLeft: {
    marginRight: 8,
  },
  professionCardRight: {
    marginLeft: 8,
  },
  professionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  professionIcon: {
    fontSize: 28,
  },
  professionImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: 'cover',
  },
  professionCardContent: {
    flex: 1,
  },
  professionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  professionCardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  professionCardCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Sort Dropdown
  sortDropdown: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    overflow: 'hidden',
  },
  sortScrollView: {
    paddingVertical: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedSortOption: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
    marginLeft: 6,
  },
  selectedSortOptionText: {
    color: '#FFFFFF',
  },
  
  // Enhanced Results Section
  resultsSection: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  sortIndicator: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  resultsStats: {
    alignItems: 'flex-end',
  },
  resultsCount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  availableCount: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  
  // List Container
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  
  // Enhanced Grid Cards
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    width: (width - 48) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  unavailableCard: {
    opacity: 0.7,
    backgroundColor: '#F9FAFB',
  },
  gridCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatarWrapper: {
    position: 'relative',
  },
  gridAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableAvatar: {
    backgroundColor: '#9CA3AF',
  },
  gridAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gridProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  onlineIndicatorSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  favoriteButtonSmall: {
    padding: 4,
  },
  gridCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  unavailableText: {
    color: '#9CA3AF',
  },
  gridCardSpecialization: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  gridCardFlat: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 6,
  },
  gridRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 8,
  },
  availableBadge: {
    backgroundColor: '#D1FAE5',
  },
  busyBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusTextSmall: {
    fontSize: 10,
    fontWeight: '600',
  },
  availableText: {
    color: '#065F46',
  },
  busyText: {
    color: '#991B1B',
  },
  gridCallButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  gridCallButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  
  // Enhanced List Cards
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  listCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  smallAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  listCardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  listCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
  },
  listCardProfession: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
    marginBottom: 2,
  },
  listCardSpecialization: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  listCardFlat: {
    fontSize: 12,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginBottom: 8,
  },
  quickCallButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Profession Badge
  professionBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 4,
  },
  professionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7C3AED',
  },
  
  // Enhanced No Results
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});