import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { DeviceCard } from '../../../components/DeviceCard';
import { LoadingView } from '../../../components/LoadingView';
import { ErrorView } from '../../../components/ErrorView';
import { useClassroom } from '../../../hooks/useClassroom';

interface ClassroomInventoryScreenProps {
  route: any;
  navigation: any;
}

export const ClassroomInventoryScreen: React.FC<ClassroomInventoryScreenProps> = ({
  route,
  navigation,
}) => {
  const classroomId = route.params?.classroomId || 'CR-402';
  const { currentClassroom, devices, isLoading, error, refresh } = useClassroom(classroomId);

  if (isLoading) return <LoadingView message="LOADING CLASSROOM INVENTORY..." />;
  if (error) return <ErrorView message={error} onRetry={refresh} />;

  return (
    <View style={styles.container}>
      <HeaderBar
        title={currentClassroom?.roomNumber || 'CLASSROOM'}
        subtitle={currentClassroom ? `${currentClassroom.building} (${currentClassroom.floor})` : 'CAMPUS FACILITY'}
        onBack={() => navigation.goBack()}
        badgeText={currentClassroom?.status || 'ACTIVE'}
      />

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
              <Text style={[typography.caption, styles.summaryLabel]}>REGISTERED ASSETS</Text>
              <Text style={[typography.h3, styles.summaryValue]}>{devices.length} UNITS</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.summaryItem}>
              <Text style={[typography.caption, styles.summaryLabel]}>SEATING CAPACITY</Text>
              <Text style={[typography.h3, styles.summaryValue]}>
                {currentClassroom?.capacity || 60} SEATS
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            onPress={() => navigation.navigate('DeviceDetails', { deviceId: item.id })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
  },
  summaryBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  summaryValue: {
    color: colors.textPrimary,
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.divider,
  },
});
