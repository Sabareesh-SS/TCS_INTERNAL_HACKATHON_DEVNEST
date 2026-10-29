import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { FacultyHomeScreen } from '../screens/faculty/FacultyHomeScreen';
import { QRScannerScreen } from '../screens/faculty/QRScannerScreen';
import { ClassroomInventoryScreen } from '../screens/faculty/ClassroomInventoryScreen';
import { DeviceDetailsScreen } from '../screens/faculty/DeviceDetailsScreen';
import { ReportFaultScreen } from '../screens/faculty/ReportFaultScreen';
import { AIDiagnosticScreen } from '../screens/faculty/AIDiagnosticScreen';
import { MyIncidentsScreen } from '../screens/faculty/MyIncidentsScreen';
import { IncidentDetailsScreen } from '../screens/faculty/IncidentDetailsScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FacultyHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="FacultyHome" component={FacultyHomeScreen} />
      <Stack.Screen name="QRScanner" component={QRScannerScreen} />
      <Stack.Screen name="ClassroomInventory" component={ClassroomInventoryScreen} />
      <Stack.Screen name="DeviceDetails" component={DeviceDetailsScreen} />
      <Stack.Screen name="ReportFault" component={ReportFaultScreen} />
      <Stack.Screen name="AIDiagnostic" component={AIDiagnosticScreen} />
      <Stack.Screen name="IncidentDetails" component={IncidentDetailsScreen} />
    </Stack.Navigator>
  );
}

function FacultyIncidentsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MyIncidentsList" component={MyIncidentsScreen} />
      <Stack.Screen name="IncidentDetails" component={IncidentDetailsScreen} />
      <Stack.Screen name="AIDiagnostic" component={AIDiagnosticScreen} />
    </Stack.Navigator>
  );
}

export const FacultyNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={FacultyHomeStack}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
              [HOME]
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={QRScannerScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
              [SCAN QR]
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="IncidentsTab"
        component={FacultyIncidentsStack}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
              [INCIDENTS]
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
              [ALERTS]
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
              [PROFILE]
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 56,
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabLabel: {
    ...typography.badge,
    fontSize: 9,
    marginTop: 4,
  },
  tabLabelActive: {
    color: colors.primary,
  },
  tabLabelInactive: {
    color: colors.textMuted,
  },
});
