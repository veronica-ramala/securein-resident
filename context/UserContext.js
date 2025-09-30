// context/UserContext.js (or .tsx if you use TypeScript)
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Default profile data for demo
const initialProfileData = {
  name: 'John Doe',
  phone: '555-123-4567',
  profession: 'Doctor',
  email: 'john.doe@example.com',
  address: 'Unit A-101, SecureIn Community',
  profilePhoto: null,
  familyMembers: [
    { id: '1', name: 'Jane Doe', relation: 'Spouse', phone: '555-765-4321' },
    { id: '2', name: 'Jimmy Doe', relation: 'Son', phone: '555-987-6543' }
  ],
  vehicles: [
    { id: '1', make: 'Toyota', model: 'Camry', year: '2020', color: 'Blue', licensePlate: 'ABC123' }
  ],
  pets: [{ id: '1', name: 'Max', type: 'Dog', breed: 'Golden Retriever' }]
};

const STORAGE_KEY = 'securein-user';

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load saved user state from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setProfileData(parsed.profileData || initialProfileData);
          setIsLoggedIn(parsed.isLoggedIn || false);
        }
      } catch (err) {
        console.warn('Failed to load user from storage', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Save user state whenever it changes
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ profileData, isLoggedIn })
      ).catch(err => console.warn('Failed to save user to storage', err));
    }
  }, [profileData, isLoggedIn, loading]);

  const updateProfileData = (newData) => {
    setProfileData(prev => ({ ...prev, ...newData }));
  };

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setProfileData(initialProfileData); // optional: reset profile
  };

  return (
    <UserContext.Provider
      value={{
        profileData,
        updateProfileData,
        isLoggedIn,
        login,
        logout,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
