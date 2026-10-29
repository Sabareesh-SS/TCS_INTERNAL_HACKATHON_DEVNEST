import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { borderRadius, spacing } from '../../../theme/spacing';
import { HeaderBar } from '../../../components/HeaderBar';
import { TextInputField } from '../../../components/TextInputField';
import { Button } from '../../../components/Button';
import { parseQRCode } from '../../../utils/qrParser';

interface QRScannerScreenProps {
  navigation: any;
}

export const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ navigation }) => {
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanError, setScanError] = useState<string | null>(null);

  const processPayload = (payload: string) => {
    setScanError(null);
    const result = parseQRCode(payload);

    if (result.type === 'classroom' && result.targetId) {
      navigation.navigate('ClassroomInventory', { classroomId: result.targetId });
    } else if (result.type === 'device' && result.targetId) {
      navigation.navigate('DeviceDetails', { deviceId: result.targetId });
    } else {
      setScanError(result.errorMessage || 'Invalid QR code. Could not resolve classroom or device asset.');
    }
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      setScanError('Please enter a valid asset tag or payload.');
      return;
    }
    processPayload(manualCode.trim());
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="OPTICAL QR SCANNER"
        subtitle="Align Campus Asset QR Within Reticle"
        onBack={() => navigation.goBack()}
        rightActionText={torchEnabled ? '[FLASH: ON]' : '[FLASH: OFF]'}
        onRightAction={() => setTorchEnabled(!torchEnabled)}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Optical Scanner Viewport Simulator */}
        <View style={styles.viewportContainer}>
          <View style={styles.viewportFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            <View style={styles.reticleLine} />

            <Text style={[typography.caption, styles.viewportText]}>
              SCANNING CAMPUS QR MATRIX...
            </Text>
          </View>
        </View>

        {scanError ? (
          <View style={styles.errorBox}>
            <Text style={[typography.caption, styles.errorText]}>
              [IDENTIFICATION FAILURE: {scanError}]
            </Text>
          </View>
        ) : null}

        {/* Quick Testing Barcodes */}
        <View style={styles.testSection}>
          <Text style={[typography.caption, styles.testSectionTitle]}>
            DEMO ASSET CODES (TAP TO SIMULATE DIRECT SCAN)
          </Text>

          <View style={styles.quickGrid}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => processPayload('classroom:CR-402')}
              style={styles.quickBtn}
            >
              <Text style={[typography.badge, styles.quickBtnTag]}>CLASSROOM QR</Text>
              <Text style={[typography.code, styles.quickBtnText]}>CR-402 (Ramanujan Block)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => processPayload('device:DEV-PRJ-402')}
              style={styles.quickBtn}
            >
              <Text style={[typography.badge, styles.quickBtnTag]}>DEVICE QR</Text>
              <Text style={[typography.code, styles.quickBtnText]}>DEV-PRJ-402 (Laser Projector)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => processPayload('device:DEV-MIC-402')}
              style={styles.quickBtn}
            >
              <Text style={[typography.badge, styles.quickBtnTag]}>DEVICE QR</Text>
              <Text style={[typography.code, styles.quickBtnText]}>DEV-MIC-402 (Shure Wireless)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => processPayload('classroom:CR-201')}
              style={styles.quickBtn}
            >
              <Text style={[typography.badge, styles.quickBtnTag]}>CLASSROOM QR</Text>
              <Text style={[typography.code, styles.quickBtnText]}>CR-201 (Turing Center)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Manual Asset Code Input */}
        <View style={styles.manualCard}>
          <Text style={[typography.h4, styles.manualTitle]}>MANUAL ASSET CODE ENTRY</Text>
          <TextInputField
            placeholder="e.g. classroom:CR-402 or PRJ-402-A"
            value={manualCode}
            onChangeText={setManualCode}
            autoCapitalize="characters"
          />
          <Button
            label="[RESOLVE ASSET IDENTIFIER]"
            onPress={handleManualSubmit}
            variant="primary"
          />
        </View>
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
  viewportContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  viewportFrame: {
    width: 260,
    height: 260,
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#334155',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  reticleLine: {
    width: 200,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginBottom: spacing.md,
  },
  viewportText: {
    color: '#94A3B8',
    fontSize: 10,
    letterSpacing: 1,
  },
  errorBox: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: spacing.sm,
    borderRadius: borderRadius.xs,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.danger,
  },
  testSection: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  testSectionTitle: {
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  quickGrid: {
    gap: spacing.sm,
  },
  quickBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xs,
    padding: spacing.sm,
    backgroundColor: colors.surfaceSubtle,
  },
  quickBtnTag: {
    color: colors.textSecondary,
    fontSize: 9,
    marginBottom: 2,
  },
  quickBtnText: {
    color: colors.textPrimary,
    fontSize: 12,
  },
  manualCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  manualTitle: {
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});
