import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { FacultyNavigator } from './FacultyNavigator';
import { TechnicianNavigator } from './TechnicianNavigator';
import { LoadingView } from '../../components/LoadingView';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../theme/colors';

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingView message="AUTHENTICATING SESSION WITH SUPABASE..." />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : role === 'technician' ? (
        <TechnicianNavigator />
      ) : (
        <FacultyNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
