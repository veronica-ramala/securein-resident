import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Search, MapPin, Clock, ChevronLeft, Plus, X, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLocalization } from '../../context/LocalizationContext';
// Removed DateTimePicker import to avoid TurboModule issues

// Custom Date Picker Component
const DatePickerComponent = ({ onDateSelect }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };
  
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && selectedMonth === currentMonth && selectedYear === currentYear;
      const isPast = new Date(selectedYear, selectedMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            styles.calendarDayButton,
            isToday && styles.calendarDayToday,
            isPast && styles.calendarDayPast
          ]}
          onPress={() => !isPast && onDateSelect(day, selectedMonth + 1, selectedYear)}
          disabled={isPast}
        >
          <Text style={[
            styles.calendarDayText,
            isToday && styles.calendarDayTodayText,
            isPast && styles.calendarDayPastText
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return days;
  };
  
  return (
    <View style={styles.datePickerContainer}>
      <View style={styles.monthYearSelector}>
        <TouchableOpacity
          style={styles.monthYearButton}
          onPress={() => setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1)}
        >
          <Text style={styles.monthYearButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>
          {months[selectedMonth]} {selectedYear}
        </Text>
        <TouchableOpacity
          style={styles.monthYearButton}
          onPress={() => setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1)}
        >
          <Text style={styles.monthYearButtonText}>›</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.calendarHeader}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} style={styles.calendarHeaderText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.calendarGrid}>
        {renderCalendar()}
      </View>
    </View>
  );
};

// Custom Time Picker Component
const TimePickerComponent = ({ onTimeSelect }) => {
  const [selectedHour, setSelectedHour] = useState(19);
  const [selectedMinute, setSelectedMinute] = useState(0);
  
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  
  const formatHour = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };
  
  return (
    <View style={styles.timePickerContainer}>
      <View style={styles.timePickerRow}>
        <View style={styles.timePickerColumn}>
          <Text style={styles.timePickerLabel}>Hour</Text>
          <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
            {hours.map(hour => (
              <TouchableOpacity
                key={hour}
                style={[
                  styles.timePickerOption,
                  selectedHour === hour && styles.timePickerOptionSelected
                ]}
                onPress={() => {
                  setSelectedHour(hour);
                  onTimeSelect(hour, selectedMinute);
                }}
              >
                <Text style={[
                  styles.timePickerOptionText,
                  selectedHour === hour && styles.timePickerOptionTextSelected
                ]}>
                  {formatHour(hour)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.timePickerColumn}>
          <Text style={styles.timePickerLabel}>Minute</Text>
          <ScrollView style={styles.timePickerScroll} showsVerticalScrollIndicator={false}>
            {minutes.filter(m => m % 15 === 0).map(minute => (
              <TouchableOpacity
                key={minute}
                style={[
                  styles.timePickerOption,
                  selectedMinute === minute && styles.timePickerOptionSelected
                ]}
                onPress={() => {
                  setSelectedMinute(minute);
                  onTimeSelect(selectedHour, minute);
                }}
              >
                <Text style={[
                  styles.timePickerOptionText,
                  selectedMinute === minute && styles.timePickerOptionTextSelected
                ]}>
                  {minute.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default function EventsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'regular', 'special'
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    organizer: '',
    category: 'regular'
  });
  
  // Date and Time picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState('start'); // 'start' or 'end'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState({ hour: 19, minute: 0 }); // 7:00 PM
  const [endTime, setEndTime] = useState({ hour: 21, minute: 0 }); // 9:00 PM
  const router = useRouter();
  const { t } = useLocalization();
  
  // Sample data for community events
  const [events, setEvents] = useState([
    // Special Events (Festivals and Spiritual Events)
    { 
      id: '1', 
      title: 'Community Diwali Celebration', 
      date: '2025-11-12', 
      time: '6:00 PM - 10:00 PM', 
      location: 'Community Hall', 
      description: 'Join us for a grand Diwali celebration with cultural programs, food stalls, and fireworks.',
      organizer: 'Residents Association',
      category: 'special'
    },
    { 
      id: '6', 
      title: 'Christmas Carol Night', 
      date: '2025-12-24', 
      time: '7:00 PM - 10:00 PM', 
      location: 'Community Garden', 
      description: 'Celebrate Christmas with carol singing, hot chocolate, and festive decorations.',
      organizer: 'Cultural Committee',
      category: 'special'
    },
    { 
      id: '7', 
      title: 'New Year Party', 
      date: '2025-12-31', 
      time: '9:00 PM - 1:00 AM', 
      location: 'Rooftop Terrace', 
      description: 'Ring in the New Year with music, dancing, and a spectacular fireworks display.',
      organizer: 'Residents Association',
      category: 'special'
    },
    { 
      id: '8', 
      title: 'Holi Festival Celebration', 
      date: '2025-03-14', 
      time: '10:00 AM - 2:00 PM', 
      location: 'Community Garden', 
      description: 'Celebrate the festival of colors with organic colors, traditional sweets, and music.',
      organizer: 'Cultural Committee',
      category: 'special'
    },
    { 
      id: '9', 
      title: 'Eid Celebration', 
      date: '2025-04-10', 
      time: '7:00 PM - 10:00 PM', 
      location: 'Community Hall', 
      description: 'Join us for Eid festivities with traditional food, cultural performances, and community bonding.',
      organizer: 'Cultural Committee',
      category: 'special'
    },
    { 
      id: '10', 
      title: 'Ganesh Chaturthi Festival', 
      date: '2025-08-29', 
      time: '6:00 PM - 9:00 PM', 
      location: 'Community Hall', 
      description: 'Celebrate Lord Ganesha with prayers, cultural programs, and traditional sweets.',
      organizer: 'Spiritual Committee',
      category: 'special'
    },
    
    // Regular Events
    { 
      id: '2', 
      title: 'Yoga & Wellness Session', 
      date: '2025-11-15', 
      time: '7:00 AM - 8:00 AM', 
      location: 'Garden Area', 
      description: 'Start your day with rejuvenating yoga and meditation session led by certified instructor.',
      organizer: 'Health Committee',
      category: 'regular'
    },
    { 
      id: '3', 
      title: 'Kids Fun Day', 
      date: '2025-11-18', 
      time: '4:00 PM - 7:00 PM', 
      location: 'Playground', 
      description: 'Fun activities, games, and competitions for children of all ages. Prizes to be won!',
      organizer: 'Parents Committee',
      category: 'regular'
    },
    { 
      id: '4', 
      title: 'Monthly Society Meeting', 
      date: '2025-11-20', 
      time: '7:30 PM - 9:00 PM', 
      location: 'Conference Room', 
      description: 'Monthly meeting to discuss society matters, maintenance updates, and upcoming projects.',
      organizer: 'Management Committee',
      category: 'regular'
    },
    { 
      id: '5', 
      title: 'Community Clean-up Drive', 
      date: '2025-11-25', 
      time: '8:00 AM - 11:00 AM', 
      location: 'Community Premises', 
      description: 'Join hands to keep our community clean and green. Refreshments will be provided.',
      organizer: 'Environment Committee',
      category: 'regular'
    },
    { 
      id: '11', 
      title: 'Senior Citizens Health Camp', 
      date: '2025-12-05', 
      time: '9:00 AM - 1:00 PM', 
      location: 'Community Hall', 
      description: 'Free health checkup for senior citizens with qualified doctors and health professionals.',
      organizer: 'Health Committee',
      category: 'regular'
    },
    { 
      id: '12', 
      title: 'Swimming Pool Maintenance', 
      date: '2025-12-10', 
      time: '6:00 AM - 12:00 PM', 
      location: 'Swimming Pool Area', 
      description: 'Monthly pool cleaning and maintenance. Pool will be closed during this time.',
      organizer: 'Maintenance Team',
      category: 'regular'
    },
  ]);

  // Filter events based on search query and category
  const filteredEvents = events.filter(event => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (
      event.title.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower) ||
      event.organizer.toLowerCase().includes(searchLower)
    );
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Separate events by category for display
  const regularEvents = filteredEvents.filter(event => event.category === 'regular');
  const specialEvents = filteredEvents.filter(event => event.category === 'special');

  const handleInterested = (eventTitle) => {
    alert(`You've expressed interest in: ${eventTitle}`);
  };

  const goBack = () => {
    router.back();
  };

  const handleAddEvent = () => {
    // Initialize with current date and reasonable default times
    const now = new Date();
    const defaultStartTime = { hour: 19, minute: 0 }; // 7:00 PM
    const defaultEndTime = { hour: 21, minute: 0 }; // 9:00 PM
    
    setSelectedDate(now);
    setStartTime(defaultStartTime);
    setEndTime(defaultEndTime);
    
    // Set initial date and time values
    updateEventField('date', now.toISOString().split('T')[0]);
    const formattedTime = `${formatTime(defaultStartTime)} - ${formatTime(defaultEndTime)}`;
    updateEventField('time', formattedTime);
    
    setShowAddEventModal(true);
  };

  const handleCloseModal = () => {
    setShowAddEventModal(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      organizer: '',
      category: 'regular'
    });
    // Reset date/time pickers
    setShowDatePicker(false);
    setShowTimePicker(false);
    setSelectedDate(new Date());
    setStartTime({ hour: 19, minute: 0 });
    setEndTime({ hour: 21, minute: 0 });
  };

  const handleSaveEvent = () => {
    // Validate form
    if (!newEvent.title.trim() || !newEvent.date.trim() || !newEvent.time.trim() || 
        !newEvent.location.trim() || !newEvent.description.trim() || !newEvent.organizer.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Generate new ID
    const newId = (Math.max(...events.map(e => parseInt(e.id))) + 1).toString();
    
    // Create new event object
    const eventToAdd = {
      ...newEvent,
      id: newId
    };

    // Add to events list
    setEvents(prevEvents => [...prevEvents, eventToAdd]);
    
    // Show success message
    Alert.alert('Success', 'Event created successfully!');
    
    // Close modal and reset form
    handleCloseModal();
  };

  const updateEventField = (field, value) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper functions
  const formatTime = (timeObj) => {
    const hour12 = timeObj.hour === 0 ? 12 : timeObj.hour > 12 ? timeObj.hour - 12 : timeObj.hour;
    const ampm = timeObj.hour >= 12 ? 'PM' : 'AM';
    const minute = timeObj.minute.toString().padStart(2, '0');
    return `${hour12}:${minute} ${ampm}`;
  };

  const updateTimeField = () => {
    const formattedTime = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    updateEventField('time', formattedTime);
  };

  // Date picker handlers
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateSelect = (day, month, year) => {
    const selectedDate = new Date(year, month - 1, day);
    setSelectedDate(selectedDate);
    
    // Format date as YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split('T')[0];
    updateEventField('date', formattedDate);
    setShowDatePicker(false);
  };

  // Time picker handlers
  const showStartTimePickerModal = () => {
    setTimePickerType('start');
    setShowTimePicker(true);
  };

  const showEndTimePickerModal = () => {
    setTimePickerType('end');
    setShowTimePicker(true);
  };

  const handleTimeSelect = (hour, minute) => {
    if (timePickerType === 'start') {
      setStartTime({ hour, minute });
    } else {
      setEndTime({ hour, minute });
    }
    setShowTimePicker(false);
    
    // Update time field after state update
    setTimeout(() => {
      updateTimeField();
    }, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Calendar size={22} color="#FFFFFF" />
          <Text style={styles.headerTitle}>{t('events.communityEvents')}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('events.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'all' && styles.activeCategoryTab]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={[styles.categoryTabText, selectedCategory === 'all' && styles.activeCategoryTabText]}>
            {t('common.all')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'regular' && styles.activeCategoryTab]}
          onPress={() => setSelectedCategory('regular')}
        >
          <Text style={[styles.categoryTabText, selectedCategory === 'regular' && styles.activeCategoryTabText]}>
            {t('events.regularEvents')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryTab, selectedCategory === 'special' && styles.activeCategoryTab]}
          onPress={() => setSelectedCategory('special')}
        >
          <Text style={[styles.categoryTabText, selectedCategory === 'special' && styles.activeCategoryTabText]}>
            {t('events.specialEvents')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {selectedCategory === 'all' ? (
            <>
              {/* Special Events Section */}
              {specialEvents.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>{t('events.specialEvents')}</Text>
                  {specialEvents.map(event => (
                    <View key={event.id} style={[styles.eventCard, styles.specialEventCard]}>
                      <View style={styles.eventHeader}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventOrganizer}>{t('events.organizedBy')} {event.organizer}</Text>
                      </View>
                      
                      <Text style={styles.eventDescription}>{event.description}</Text>
                      
                      <View style={styles.eventDetails}>
                        <View style={styles.eventDetailRow}>
                          <Calendar size={16} color="#0077B6" />
                          <Text style={styles.eventDetailText}>{event.date}</Text>
                        </View>
                        
                        <View style={styles.eventDetailRow}>
                          <Clock size={16} color="#0077B6" />
                          <Text style={styles.eventDetailText}>{event.time}</Text>
                        </View>
                        
                        <View style={styles.eventDetailRow}>
                          <MapPin size={16} color="#0077B6" />
                          <Text style={styles.eventDetailText}>{event.location}</Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity 
                        style={[styles.interestedButton, styles.specialEventButton]}
                        onPress={() => handleInterested(event.title)}
                      >
                        <Text style={styles.interestedButtonText}>{t('events.interestedButton')}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}

              {/* Regular Events Section */}
              {regularEvents.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>{t('events.regularEvents')}</Text>
                  {regularEvents.map(event => (
                    <View key={event.id} style={styles.eventCard}>
                      <View style={styles.eventHeader}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventOrganizer}>{t('events.organizedBy')} {event.organizer}</Text>
                      </View>
                      
                      <Text style={styles.eventDescription}>{event.description}</Text>
                      
                      <View style={styles.eventDetails}>
                        <View style={styles.eventDetailRow}>
                          <Calendar size={16} color="#0077B6" />
                          <Text style={styles.eventDetailText}>{event.date}</Text>
                        </View>
                        
                        <View style={styles.eventDetailRow}>
                          <Clock size={16} color="#0077B6" />
                          <Text style={styles.eventDetailText}>{event.time}</Text>
                        </View>
                        
                        <View style={styles.eventDetailRow}>
                          <MapPin size={16} color="#0077B6" />
                          <Text style={styles.eventDetailText}>{event.location}</Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.interestedButton}
                        onPress={() => handleInterested(event.title)}
                      >
                        <Text style={styles.interestedButtonText}>{t('events.interestedButton')}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}

              {filteredEvents.length === 0 && (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>{t('events.noEventsFound')}</Text>
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>
                {selectedCategory === 'regular' ? t('events.regularEvents') : t('events.specialEvents')}
              </Text>
              
              {filteredEvents.length === 0 ? (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>{t('events.noEventsFound')}</Text>
                </View>
              ) : (
                filteredEvents.map(event => (
                  <View key={event.id} style={[styles.eventCard, event.category === 'special' && styles.specialEventCard]}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventOrganizer}>{t('events.organizedBy')} {event.organizer}</Text>
                    </View>
                    
                    <Text style={styles.eventDescription}>{event.description}</Text>
                    
                    <View style={styles.eventDetails}>
                      <View style={styles.eventDetailRow}>
                        <Calendar size={16} color="#0077B6" />
                        <Text style={styles.eventDetailText}>{event.date}</Text>
                      </View>
                      
                      <View style={styles.eventDetailRow}>
                        <Clock size={16} color="#0077B6" />
                        <Text style={styles.eventDetailText}>{event.time}</Text>
                      </View>
                      
                      <View style={styles.eventDetailRow}>
                        <MapPin size={16} color="#0077B6" />
                        <Text style={styles.eventDetailText}>{event.location}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={[styles.interestedButton, event.category === 'special' && styles.specialEventButton]}
                      onPress={() => handleInterested(event.title)}
                    >
                      <Text style={styles.interestedButtonText}>{t('events.interestedButton')}</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddEvent}>
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Event Modal */}
      <Modal
        visible={showAddEventModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t('events.createEvent')}</Text>
            <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveEvent}>
              <Text style={styles.modalSaveButtonText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Event Title *</Text>
              <TextInput
                style={styles.formInput}
                value={newEvent.title}
                onChangeText={(text) => updateEventField('title', text)}
                placeholder="Enter event title"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date *</Text>
              <TouchableOpacity style={styles.dateTimeButton} onPress={showDatePickerModal}>
                <View style={styles.dateTimeButtonContent}>
                  <Calendar size={20} color="#6B7280" />
                  <Text style={[styles.dateTimeButtonText, newEvent.date && styles.dateTimeButtonTextSelected]}>
                    {newEvent.date || 'Select Date'}
                  </Text>
                  <ChevronDown size={20} color="#6B7280" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Time *</Text>
              <View style={styles.timePickerContainer}>
                <TouchableOpacity style={[styles.dateTimeButton, styles.timeButton]} onPress={showStartTimePickerModal}>
                  <View style={styles.dateTimeButtonContent}>
                    <Clock size={20} color="#6B7280" />
                    <Text style={[styles.dateTimeButtonText, startTime && styles.dateTimeButtonTextSelected]}>
                      {formatTime(startTime)}
                    </Text>
                    <ChevronDown size={20} color="#6B7280" />
                  </View>
                </TouchableOpacity>
                
                <Text style={styles.timeSeparator}>to</Text>
                
                <TouchableOpacity style={[styles.dateTimeButton, styles.timeButton]} onPress={showEndTimePickerModal}>
                  <View style={styles.dateTimeButtonContent}>
                    <Clock size={20} color="#6B7280" />
                    <Text style={[styles.dateTimeButtonText, endTime && styles.dateTimeButtonTextSelected]}>
                      {formatTime(endTime)}
                    </Text>
                    <ChevronDown size={20} color="#6B7280" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Location *</Text>
              <TextInput
                style={styles.formInput}
                value={newEvent.location}
                onChangeText={(text) => updateEventField('location', text)}
                placeholder="Enter event location"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Organizer *</Text>
              <TextInput
                style={styles.formInput}
                value={newEvent.organizer}
                onChangeText={(text) => updateEventField('organizer', text)}
                placeholder="Enter organizer name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.categorySelector}>
                <TouchableOpacity
                  style={[
                    styles.categorySelectorButton,
                    newEvent.category === 'regular' && styles.categorySelectorButtonActive
                  ]}
                  onPress={() => updateEventField('category', 'regular')}
                >
                  <Text style={[
                    styles.categorySelectorButtonText,
                    newEvent.category === 'regular' && styles.categorySelectorButtonTextActive
                  ]}>
                    {t('events.regularEvents')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categorySelectorButton,
                    newEvent.category === 'special' && styles.categorySelectorButtonActive
                  ]}
                  onPress={() => updateEventField('category', 'special')}
                >
                  <Text style={[
                    styles.categorySelectorButtonText,
                    newEvent.category === 'special' && styles.categorySelectorButtonTextActive
                  ]}>
                    {t('events.specialEvents')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description *</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                value={newEvent.description}
                onChangeText={(text) => updateEventField('description', text)}
                placeholder="Enter event description"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
          
          {/* Custom Date Picker Modal */}
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.pickerModalOverlay}>
              <SafeAreaView style={styles.pickerModalSafeArea}>
                <View style={styles.pickerModalContent}>
                  <View style={styles.pickerModalHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.pickerModalCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.pickerModalTitle}>Select Date</Text>
                    <TouchableOpacity onPress={() => {
                      const today = new Date();
                      handleDateSelect(today.getDate(), today.getMonth() + 1, today.getFullYear());
                    }}>
                      <Text style={styles.pickerModalDone}>Today</Text>
                    </TouchableOpacity>
                  </View>
                  <DatePickerComponent onDateSelect={handleDateSelect} />
                </View>
              </SafeAreaView>
            </View>
          </Modal>

          {/* Custom Time Picker Modal */}
          <Modal
            visible={showTimePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <View style={styles.pickerModalOverlay}>
              <SafeAreaView style={styles.pickerModalSafeArea}>
                <View style={styles.pickerModalContent}>
                  <View style={styles.pickerModalHeader}>
                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                      <Text style={styles.pickerModalCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.pickerModalTitle}>
                      Select {timePickerType === 'start' ? 'Start' : 'End'} Time
                    </Text>
                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                      <Text style={styles.pickerModalDone}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <TimePickerComponent onTimeSelect={handleTimeSelect} />
                </View>
              </SafeAreaView>
            </View>
          </Modal>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#0077B6',
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
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    borderLeftColor: '#0077B6',
  },
  eventHeader: {
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventOrganizer: {
    fontSize: 12,
    color: '#0077B6',
    fontWeight: '500',
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },
  interestedButton: {
    backgroundColor: '#0077B6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestedButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  activeCategoryTab: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  specialEventCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  specialEventButton: {
    backgroundColor: '#F59E0B',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0077B6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0077B6',
    borderRadius: 6,
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 12,
  },
  categorySelectorButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  categorySelectorButtonActive: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  categorySelectorButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categorySelectorButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dateTimeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: '#9CA3AF',
    flex: 1,
    marginLeft: 8,
  },
  dateTimeButtonTextSelected: {
    color: '#1F2937',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeButton: {
    flex: 1,
  },
  timeSeparator: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Picker Modal Styles
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModalSafeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '70%',
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  pickerModalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  pickerModalDone: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: '600',
  },
  // Date Picker Styles
  datePickerContainer: {
    padding: 20,
  },
  monthYearSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthYearButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  monthYearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  calendarHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    width: 40,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayButton: {
    borderRadius: 20,
  },
  calendarDayToday: {
    backgroundColor: '#0077B6',
  },
  calendarDayPast: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#1F2937',
  },
  calendarDayTodayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarDayPastText: {
    color: '#9CA3AF',
  },
  // Time Picker Styles
  timePickerContainer: {
    padding: 20,
  },
  timePickerRow: {
    flexDirection: 'row',
    gap: 20,
  },
  timePickerColumn: {
    flex: 1,
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  timePickerScroll: {
    maxHeight: 200,
  },
  timePickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  timePickerOptionSelected: {
    backgroundColor: '#0077B6',
  },
  timePickerOptionText: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  timePickerOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});