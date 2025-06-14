import React, { createContext, useState, useContext } from 'react';

// Create the initial profile data
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
  pets: [
    { id: '1', name: 'Max', type: 'Dog', breed: 'Golden Retriever' }
  ]
};

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(initialProfileData);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateProfileData = (newData) => {
    setProfileData(prevData => ({
      ...prevData,
      ...newData
    }));
  };
  
  const login = () => {
    setIsLoggedIn(true);
  };
  
  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ 
      profileData, 
      updateProfileData, 
      isLoggedIn, 
      login, 
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUserContext = () => useContext(UserContext);