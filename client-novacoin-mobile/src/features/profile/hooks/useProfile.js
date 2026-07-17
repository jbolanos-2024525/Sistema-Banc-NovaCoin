// src/features/profile/hooks/useProfile.js

import { useState, useCallback } from 'react';
import { authService } from '../../../shared/api/authClient';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.getProfile();
      console.log('Profile response:', response);
      console.log('Profile data:', response.data);
      console.log('Profile data keys:', Object.keys(response.data));
      
      const data = response.data.data || response.data;
      console.log('Mapped data:', data);
      
      const mappedProfile = {
        id: data.id,
        displayName: data.displayName,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        username: data.username,
      };
      
      setProfile(mappedProfile);
      return mappedProfile;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al cargar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.updateProfile(profileData);
      const data = response.data.data || response.data;
      
      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};

export default useProfile;
