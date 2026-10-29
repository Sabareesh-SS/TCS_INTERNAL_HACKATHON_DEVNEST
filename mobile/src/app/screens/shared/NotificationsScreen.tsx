import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { useNotifications } from '../../../hooks/useNotifications';
import { formatDate } from '../../../utils/validators';

interface NotificationsScreenProps {
  navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <View style={styles.container}>
      <HeaderBar
        title="NOTIFICATIONS"
        subtitle={`${unreadCount} UNREAD SYSTEM NOTIFICATIONS`}
        rightActionText={unreadCount > 0 ? '[MARK ALL READ]' : undefined}
        onRightAction={unreadCount > 0 ? markAllAsRead : undefined}
      />

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[typography.caption, styles.emptyText]}>
              NO SYSTEM NOTIFICATIONS LOGGED
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => markAsRead(item.id)}
            style={[
              styles.itemCard,
              item.isRead ? styles.itemRead : styles.itemUnread,
            ]}
          >
            <View style={styles.topRow}>
              <View style={styles.typeTag}>
                <Text style={[typography.badge, styles.typeText]}>
                  [{item.type.toUpperCase()}]
                </Text>
              </View>
              <Text style={[typography.caption, styles.dateText]}>
                {formatDate(item.createdAt)}
              </Text>
            </View>

            <Text style={[typography.h4, styles.title]}>{item.title}</Text>
            <Text style={[typography.bodyMedium, styles.message]}>{item.message}</Text>

            {!item.isRead && (
              <View style={styles.unreadPill}>
                <Text style={[typography.caption, styles.unreadPillText]}>UNREAD</Text>
              </View>
            )}
          </TouchableOpacity>
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
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
  },
  itemCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  itemRead: {
    opacity: 0.8,
  },
  itemUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.textPrimary,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  typeTag: {
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  typeText: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  dateText: {
    color: colors.textMuted,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  message: {
    color: colors.textSecondary,
    lineHeight: 18,
  },
  unreadPill: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.textPrimary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: 2,
  },
  unreadPillText: {
    color: colors.textInverse,
    fontSize: 9,
    fontWeight: '700',
  },
});
