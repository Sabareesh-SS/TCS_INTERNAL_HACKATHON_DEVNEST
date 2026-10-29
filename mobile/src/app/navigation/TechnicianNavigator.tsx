import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { TechnicianHomeScreen } from '../screens/technician/TechnicianHomeScreen';
import { AssignedTicketsScreen } from '../screens/technician/AssignedTicketsScreen';
import { TicketDetailsScreen } from '../screens/technician/TicketDetailsScreen';
import { RepairChecklistScreen } from '../screens/technician/RepairChecklistScreen';
import { RepairNotesScreen } from '../screens/technician/RepairNotesScreen';
import { UpdateTicketStatusScreen } from '../screens/technician/UpdateTicketStatusScreen';
import { NotificationsScreen } from '../screens/shared/NotificationsScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TechnicianRepairsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="TechnicianHome" component={TechnicianHomeScreen} />
      <Stack.Screen name="AssignedTickets" component={AssignedTicketsScreen} />
      <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
      <Stack.Screen name="RepairChecklist" component={RepairChecklistScreen} />
      <Stack.Screen name="RepairNotes" component={RepairNotesScreen} />
      <Stack.Screen name="UpdateTicketStatus" component={UpdateTicketStatusScreen} />
    </Stack.Navigator>
  );
}

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavIcon } from '../../components/NavIcon';

export const TechnicianNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 56 + Math.max(insets.bottom, 6),
            paddingBottom: Math.max(insets.bottom, 6),
          },
        ],
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="RepairsTab"
        component={TechnicianRepairsStack}
        options={{
          tabBarIcon: ({ color, focused }) => <NavIcon name="console" color={color} focused={focused} />,
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
              CONSOLE
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="QueueTab"
        component={AssignedTicketsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <NavIcon name="tickets" color={color} focused={focused} />,
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
              TICKETS
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="TechNotificationsTab"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <NavIcon name="alerts" color={color} focused={focused} />,
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
              ALERTS
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="TechProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <NavIcon name="profile" color={color} focused={focused} />,
          tabBarLabel: ({ focused }) => (
            <Text style={[styles.tabLabel, focused ? styles.tabLabelActive : styles.tabLabelInactive]}>
              PROFILE
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
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    ...typography.badge,
    fontSize: 9,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  tabLabelInactive: {
    color: colors.textMuted,
    fontWeight: '500',
  },
});
