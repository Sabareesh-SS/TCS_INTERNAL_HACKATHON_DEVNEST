import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
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
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [lastScannedValue, setLastScannedValue] = useState<string | null>(null);

  const isScanningBlocked = useRef(false);

  // Smooth Laser Sweep Animation
  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sweep = Animated.loop(
      Animated.sequence([
        Animated.timing(laserAnim, {
          toValue: 200,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(laserAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    sweep.start();
    return () => sweep.stop();
  }, [laserAnim]);

  // Request Android Camera Permission
  const requestCameraPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Access Required',
            message: 'Smart AV Assistant requires camera access to scan equipment QR codes.',
            buttonPositive: 'ALLOW',
          }
        );
        setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        setHasCameraPermission(false);
      }
    } else {
      setHasCameraPermission(true);
    }
  }, []);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  const processPayload = (payload: string) => {
    setScanError(null);
    setLastScannedValue(payload);

    const result = parseQRCode(payload);

    if (result.type === 'classroom' && result.targetId) {
      setTimeout(() => {
        try {
          navigation.navigate('ClassroomInventory', { classroomId: result.targetId });
        } catch {
          navigation.navigate('HomeTab', {
            screen: 'ClassroomInventory',
            params: { classroomId: result.targetId },
          });
        }
      }, 500);
    } else if (result.type === 'device' && result.targetId) {
      setTimeout(() => {
        try {
          navigation.navigate('DeviceDetails', { deviceId: result.targetId });
        } catch {
          navigation.navigate('HomeTab', {
            screen: 'DeviceDetails',
            params: { deviceId: result.targetId },
          });
        }
      }, 500);
    } else {
      setScanError(`Unrecognized QR Format: "${payload}". Expected format: classroom:ID or device:ID`);
    }
  };

  const handleReadCode = (event: any) => {
    const code = event?.nativeEvent?.codeStringValue;
    if (!code || isScanningBlocked.current) return;

    isScanningBlocked.current = true;
    processPayload(code);

    // Debounce barcode reads so it does not trigger multiple times
    setTimeout(() => {
      isScanningBlocked.current = false;
    }, 2500);
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
        title="SCAN QR CODE"
        subtitle="Align QR code within the frame"
        onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
        rightActionText={torchEnabled ? '[FLASH: ON]' : '[FLASH: OFF]'}
        onRightAction={() => setTorchEnabled(!torchEnabled)}
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Live Camera Viewfinder */}
        <View style={styles.scannerWrapper}>
          <View style={styles.viewfinder}>
            {hasCameraPermission ? (
              <Camera
                style={StyleSheet.absoluteFill}
                cameraType={CameraType.Back}
                scanBarcode={true}
                showFrame={false}
                laserColor="transparent"
                frameColor="transparent"
                torchMode={torchEnabled ? 'on' : 'off'}
                onReadCode={handleReadCode}
              />
            ) : (
              <View style={styles.permissionBox}>
                <Text style={[typography.caption, styles.permissionText]}>
                  CAMERA ACCESS REQUIRED
                </Text>
                <Button
                  label="[GRANT CAMERA ACCESS]"
                  onPress={requestCameraPermission}
                  variant="outline"
                  style={styles.permissionBtn}
                />
              </View>
            )}

            {/* 4 Clean Corner Brackets */}
            <View style={[styles.corner, styles.cornerTL]} pointerEvents="none" />
            <View style={[styles.corner, styles.cornerTR]} pointerEvents="none" />
            <View style={[styles.corner, styles.cornerBL]} pointerEvents="none" />
            <View style={[styles.corner, styles.cornerBR]} pointerEvents="none" />

            {/* Clean Scanning Laser */}
            <Animated.View
              style={[
                styles.scanLine,
                { transform: [{ translateY: laserAnim }] },
              ]}
              pointerEvents="none"
            />
          </View>

          <Text style={[typography.caption, styles.helperText]}>
            Point phone camera at any equipment or classroom QR code
          </Text>
        </View>

        {/* Live Scanned Value Card */}
        {lastScannedValue ? (
          <View style={styles.valueCard}>
            <Text style={[typography.caption, styles.valueLabel]}>
              LAST SCANNED QR VALUE
            </Text>
            <Text style={[typography.code, styles.valueContent]}>
              {lastScannedValue}
            </Text>
          </View>
        ) : null}

        {scanError ? (
          <View style={styles.errorBox}>
            <Text style={[typography.caption, styles.errorText]}>
              [SCAN ERROR: {scanError}]
            </Text>
          </View>
        ) : null}

        {/* Demo QR Codes to Test Without Physical Printed Labels */}
        <View style={styles.section}>
          <Text style={[typography.caption, styles.sectionTitle]}>
            SAMPLE QR CODES (TAP TO TEST DIRECTLY)
          </Text>

          <View style={styles.codeList}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => processPayload('classroom:CR-402')}
              style={styles.codeCard}
            >
              <View style={styles.codeRow}>
                <Text style={[typography.badge, styles.codeBadge]}>CLASSROOM</Text>
                <Text style={[typography.code, styles.codeId]}>CR-402</Text>
              </View>
              <Text style={[typography.bodyMedium, styles.codeTitle]}>
                Room 402 - Ramanujan Block
              </Text>
              <Text style={[typography.caption, styles.codeSubtitle]}>
                Raw QR Value: "classroom:CR-402"
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => processPayload('device:DEV-PRJ-402')}
              style={styles.codeCard}
            >
              <View style={styles.codeRow}>
                <Text style={[typography.badge, styles.codeBadge]}>DEVICE</Text>
                <Text style={[typography.code, styles.codeId]}>DEV-PRJ-402</Text>
              </View>
              <Text style={[typography.bodyMedium, styles.codeTitle]}>
                Epson EB-L630U Laser Projector
              </Text>
              <Text style={[typography.caption, styles.codeSubtitle]}>
                Raw QR Value: "device:DEV-PRJ-402"
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => processPayload('device:DEV-MIC-402')}
              style={styles.codeCard}
            >
              <View style={styles.codeRow}>
                <Text style={[typography.badge, styles.codeBadge]}>DEVICE</Text>
                <Text style={[typography.code, styles.codeId]}>DEV-MIC-402</Text>
              </View>
              <Text style={[typography.bodyMedium, styles.codeTitle]}>
                Shure BLX24/PG58 Wireless Microphone
              </Text>
              <Text style={[typography.caption, styles.codeSubtitle]}>
                Raw QR Value: "device:DEV-MIC-402"
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => processPayload('classroom:CR-201')}
              style={styles.codeCard}
            >
              <View style={styles.codeRow}>
                <Text style={[typography.badge, styles.codeBadge]}>CLASSROOM</Text>
                <Text style={[typography.code, styles.codeId]}>CR-201</Text>
              </View>
              <Text style={[typography.bodyMedium, styles.codeTitle]}>
                Room 201 - Turing Center
              </Text>
              <Text style={[typography.caption, styles.codeSubtitle]}>
                Raw QR Value: "classroom:CR-201"
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Manual Asset Code Input */}
        <View style={styles.manualCard}>
          <Text style={[typography.h4, styles.manualTitle]}>ENTER QR CODE MANUALLY</Text>
          <TextInputField
            placeholder="e.g. classroom:CR-402 or DEV-PRJ-402"
            value={manualCode}
            onChangeText={setManualCode}
            autoCapitalize="none"
          />
          <Button
            label="[RESOLVE QR CODE]"
            onPress={handleManualSubmit}
            variant="outline"
            style={styles.manualBtn}
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
    paddingBottom: spacing.xxl,
  },
  scannerWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  viewfinder: {
    width: 250,
    height: 250,
    backgroundColor: '#000000',
    borderRadius: borderRadius.sm,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  permissionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: '#0F172A',
  },
  permissionText: {
    color: '#94A3B8',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionBtn: {
    minWidth: 180,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFFFF',
    zIndex: 2,
  },
  cornerTL: {
    top: 10,
    left: 10,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 10,
    right: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanLine: {
    position: 'absolute',
    top: 20,
    left: '10%',
    width: '80%',
    height: 2,
    backgroundColor: '#38BDF8',
    zIndex: 1,
  },
  helperText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontSize: 11,
  },
  valueCard: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.xs,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  valueLabel: {
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  valueContent: {
    color: colors.textPrimary,
    fontSize: 13,
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
  section: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  codeList: {
    gap: spacing.sm,
  },
  codeCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.xs,
    padding: spacing.md,
    backgroundColor: colors.surfaceSubtle,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  codeBadge: {
    color: colors.textSecondary,
    fontSize: 9,
  },
  codeId: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  codeTitle: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  codeSubtitle: {
    color: colors.textSecondary,
    fontSize: 10,
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
  manualBtn: {
    marginTop: spacing.sm,
  },
});
