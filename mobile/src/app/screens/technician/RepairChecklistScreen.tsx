import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { Button } from '../../../components/Button';
import { LoadingView } from '../../../components/LoadingView';
import { Ticket, RepairChecklistItem } from '../../../types/ticket';
import { ticketService } from '../../../services/ticketService';

interface RepairChecklistScreenProps {
  route: any;
  navigation: any;
}

export const RepairChecklistScreen: React.FC<RepairChecklistScreenProps> = ({
  route,
  navigation,
}) => {
  const ticketId: string = route.params?.ticketId || 'TCK-2026-042';
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadTicket = async () => {
    setIsLoading(true);
    try {
      const data = await ticketService.getTicketById(ticketId);
      setTicket(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  if (isLoading || !ticket) {
    return <LoadingView message="LOADING INSPECTION CHECKLIST..." />;
  }

  const handleToggle = async (itemId: string) => {
    const updated = await ticketService.toggleChecklistItem(ticket.id, itemId);
    if (updated) {
      setTicket(updated);
    }
  };

  const completedCount = ticket.checklist.filter(c => c.isCompleted).length;
  const totalCount = ticket.checklist.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <View style={styles.container}>
      <HeaderBar
        title="REPAIR CHECKLIST"
        subtitle={`TICKET: ${ticket.id}`}
        onBack={() => navigation.goBack()}
        badgeText={`${completedCount}/${totalCount} COMPLETE`}
      />

      {/* Progress Metric Box */}
      <View style={styles.progressBox}>
        <View style={styles.progressRow}>
          <Text style={[typography.caption, styles.progressLabel]}>
            TECHNICAL INSPECTION PROGRESS
          </Text>
          <Text style={[typography.code, styles.percentText]}>{percent}%</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </View>
      </View>

      <FlatList
        data={ticket.checklist}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleToggle(item.id)}
            style={[
              styles.checkItemCard,
              item.isCompleted && styles.checkItemCompleted,
            ]}
          >
            <View
              style={[
                styles.checkboxBox,
                item.isCompleted && styles.checkboxCompleted,
              ]}
            >
              {item.isCompleted && <Text style={styles.checkmarkText}>[X]</Text>}
              {!item.isCompleted && <Text style={styles.checkmarkEmpty}>[ ]</Text>}
            </View>

            <View style={styles.itemTextContainer}>
              <Text style={[typography.caption, styles.itemIndex]}>TASK 0{index + 1}</Text>
              <Text
                style={[
                  typography.bodyMedium,
                  item.isCompleted ? styles.itemTextDone : styles.itemTextActive,
                ]}
              >
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <Button
              label="[PROCEED TO RECORD REPAIR FINDINGS]"
              onPress={() => navigation.navigate('RepairNotes', { ticketId: ticket.id })}
              variant="primary"
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressBox: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    color: colors.textMuted,
    fontWeight: '700',
  },
  percentText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  listContent: {
    padding: spacing.lg,
  },
  checkItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  checkItemCompleted: {
    borderColor: colors.status.resolvedBorder,
    backgroundColor: colors.surfaceSubtle,
  },
  checkboxBox: {
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    opacity: 0.8,
  },
  checkmarkText: {
    fontFamily: 'monospace',
    color: colors.status.resolvedText,
    fontWeight: '700',
    fontSize: 14,
  },
  checkmarkEmpty: {
    fontFamily: 'monospace',
    color: colors.textMuted,
    fontSize: 14,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemIndex: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemTextActive: {
    color: colors.textPrimary,
  },
  itemTextDone: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  footerContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
