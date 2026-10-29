import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { Button } from '../../../components/Button';
import { LoadingView } from '../../../components/LoadingView';
import { Ticket, TicketStatus } from '../../../types/ticket';
import { ticketService } from '../../../services/ticketService';

interface UpdateTicketStatusScreenProps {
  route: any;
  navigation: any;
}

const STATUS_OPTIONS: { status: TicketStatus; label: string; desc: string }[] = [
  {
    status: 'resolved',
    label: 'RESOLVED',
    desc: 'Fault repaired and hardware operational verification confirmed.',
  },
  {
    status: 'in_progress',
    label: 'IN PROGRESS',
    desc: 'Active diagnostic teardown or bench testing currently underway.',
  },
  {
    status: 'awaiting_parts',
    label: 'AWAITING PARTS',
    desc: 'Replacement components or vendor service dispatch required.',
  },
  {
    status: 'unable_to_resolve',
    label: 'UNABLE TO RESOLVE',
    desc: 'Catastrophic failure; replacement of unit required by campus AV admin.',
  },
];

export const UpdateTicketStatusScreen: React.FC<UpdateTicketStatusScreenProps> = ({
  route,
  navigation,
}) => {
  const ticketId: string = route.params?.ticketId || 'TCK-2026-042';
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>('resolved');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await ticketService.getTicketById(ticketId);
        if (data) {
          setTicket(data);
          setSelectedStatus(data.status);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [ticketId]);

  if (isLoading || !ticket) {
    return <LoadingView message="SYNCHRONIZING TICKET STATUS..." />;
  }

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await ticketService.updateTicketStatus(ticket.id, selectedStatus);
      navigation.navigate('AssignedTickets');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="UPDATE STATUS"
        subtitle={`TICKET: ${ticket.id}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Current State Info */}
        <View style={styles.currentCard}>
          <Text style={[typography.caption, styles.currentLabel]}>CURRENT STATUS</Text>
          <View style={styles.badgeRow}>
            <StatusBadge status={ticket.status} size="md" />
          </View>
          <Text style={[typography.bodyMedium, styles.currentDevice]}>
            {ticket.incident.deviceName} - {ticket.incident.classroomName}
          </Text>
        </View>

        <Text style={[typography.h3, styles.sectionTitle]}>SELECT NEW TICKET STATUS</Text>

        <View style={styles.optionsList}>
          {STATUS_OPTIONS.map(opt => {
            const isSelected = selectedStatus === opt.status;
            return (
              <TouchableOpacity
                key={opt.status}
                activeOpacity={0.7}
                onPress={() => setSelectedStatus(opt.status)}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
              >
                <View style={styles.optionHeader}>
                  <View style={styles.radio}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <StatusBadge status={opt.status} size="sm" />
                </View>

                <Text style={[typography.bodySmall, styles.optionDesc]}>{opt.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          label="[CONFIRM AND COMMIT STATUS TRANSITION]"
          onPress={handleUpdate}
          variant="primary"
          loading={isUpdating}
          style={styles.commitBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  currentCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  currentLabel: {
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  badgeRow: {
    marginBottom: spacing.xs,
  },
  currentDevice: {
    color: colors.textPrimary,
  },
  sectionTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  optionsList: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  optionCardSelected: {
    borderColor: colors.borderDark,
    backgroundColor: colors.surfaceSubtle,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  optionDesc: {
    color: colors.textSecondary,
    marginLeft: 24,
  },
  commitBtn: {
    marginBottom: spacing.xxl,
  },
});
