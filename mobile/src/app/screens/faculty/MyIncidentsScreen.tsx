import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { IncidentCard } from '../../../components/IncidentCard';
import { LoadingView } from '../../../components/LoadingView';
import { useIncident } from '../../../hooks/useIncident';
import { useAuth } from '../../../hooks/useAuth';

interface MyIncidentsScreenProps {
  navigation: any;
}

export const MyIncidentsScreen: React.FC<MyIncidentsScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { incidents, isLoading, refresh } = useIncident(user?.id);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const filtered = incidents.filter(i => {
    if (filter === 'active') {
      return i.status === 'in_troubleshooting' || i.status === 'escalated_to_technician';
    }
    if (filter === 'resolved') {
      return i.status === 'resolved_by_faculty' || i.status === 'closed';
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <HeaderBar
        title="MY AV INCIDENTS"
        subtitle={`TOTAL LOGS: ${incidents.length}`}
      />

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setFilter('all')}
          style={[styles.tabItem, filter === 'all' && styles.tabItemActive]}
        >
          <Text style={[typography.button, filter === 'all' ? styles.tabTextActive : styles.tabText]}>
            [ALL ({incidents.length})]
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setFilter('active')}
          style={[styles.tabItem, filter === 'active' && styles.tabItemActive]}
        >
          <Text style={[typography.button, filter === 'active' ? styles.tabTextActive : styles.tabText]}>
            [ACTIVE ({incidents.filter(i => i.status !== 'resolved_by_faculty' && i.status !== 'closed').length})]
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setFilter('resolved')}
          style={[styles.tabItem, filter === 'resolved' && styles.tabItemActive]}
        >
          <Text style={[typography.button, filter === 'resolved' ? styles.tabTextActive : styles.tabText]}>
            [RESOLVED ({incidents.filter(i => i.status === 'resolved_by_faculty' || i.status === 'closed').length})]
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingView message="REFRESHING INCIDENT AUDIT..." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={refresh}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Text style={[typography.caption, styles.emptyText]}>
                NO INCIDENTS FOUND MATCHING CRITERIA
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <IncidentCard
              incident={item}
              onPress={() => navigation.navigate('IncidentDetails', { incidentId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  tabItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  listContent: {
    padding: spacing.lg,
  },
  emptyCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
  },
});
