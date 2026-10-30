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

interface SampleItem {
  id: string;
  room: string;
  type: 'projector' | 'microphone' | 'smart_board' | 'classroom';
  typeLabel: string;
  title: string;
  subtitle: string;
  payload: string;
  statusBadge?: string;
}

const ROOM_FILTERS = ['AB-105', 'AB-204', 'CB-301', 'EB-202', 'LB-110', 'AB-302', 'ALL'];

const SAMPLE_ITEMS: SampleItem[] = [
  // AB-105 (Academic Block A · Room 105)
  {
    id: 'DEV004',
    room: 'AB-105',
    type: 'projector',
    typeLabel: 'PROJECTOR',
    title: 'Epson PowerLite EB-E01 (Demo DEMO-P02)',
    subtitle: 'Academic Block A · Room 105',
    payload: 'QR-DEV-AV-AB105-P01',
    statusBadge: 'FAULTY',
  },
  {
    id: 'DEV005',
    room: 'AB-105',
    type: 'microphone',
    typeLabel: 'MICROPHONE',
    title: 'Shure BLX24 / PG58 Wireless Microphone',
    subtitle: 'Academic Block A · Room 105',
    payload: 'QR-DEV-AV-AB105-M01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'DEV006',
    room: 'AB-105',
    type: 'smart_board',
    typeLabel: 'SMART BOARD',
    title: 'Promethean ActivPanel 9 Touch Display',
    subtitle: 'Academic Block A · Room 105',
    payload: 'QR-DEV-AV-AB105-S01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'AB-105',
    room: 'AB-105',
    type: 'classroom',
    typeLabel: 'CLASSROOM',
    title: 'Academic Block A · Room 105 (Door Tag)',
    subtitle: 'Floor 1 · Capacity 120 Seats',
    payload: 'QR-CLS-AB105',
  },

  // AB-204 (Academic Block A · Room 204)
  {
    id: 'DEV001',
    room: 'AB-204',
    type: 'projector',
    typeLabel: 'PROJECTOR',
    title: 'Epson PowerLite EB-E01 (Demo DEMO-P01)',
    subtitle: 'Academic Block A · Room 204',
    payload: 'QR-DEV-AV-AB204-P01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'DEV002',
    room: 'AB-204',
    type: 'microphone',
    typeLabel: 'MICROPHONE',
    title: 'Shure BLX24 / PG58 Wireless Microphone',
    subtitle: 'Academic Block A · Room 204',
    payload: 'QR-DEV-AV-AB204-M01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'DEV003',
    room: 'AB-204',
    type: 'smart_board',
    typeLabel: 'SMART BOARD',
    title: 'Promethean ActivPanel 9 Touch Display',
    subtitle: 'Academic Block A · Room 204',
    payload: 'QR-DEV-AV-AB204-S01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'AB-204',
    room: 'AB-204',
    type: 'classroom',
    typeLabel: 'CLASSROOM',
    title: 'Academic Block A · Room 204 (Door Tag)',
    subtitle: 'Floor 2 · Capacity 80 Seats',
    payload: 'QR-CLS-AB204',
  },

  // CB-301 (Central Block · Room 301)
  {
    id: 'DEV007',
    room: 'CB-301',
    type: 'projector',
    typeLabel: 'PROJECTOR',
    title: 'Epson PowerLite EB-E01 (Demo DEMO-P03)',
    subtitle: 'Central Block · Room 301',
    payload: 'QR-DEV-AV-CB301-P01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'DEV008',
    room: 'CB-301',
    type: 'microphone',
    typeLabel: 'MICROPHONE',
    title: 'Shure BLX24 / PG58 Wireless Microphone',
    subtitle: 'Central Block · Room 301',
    payload: 'QR-DEV-AV-CB301-M01',
    statusBadge: 'FAULTY',
  },
  {
    id: 'DEV009',
    room: 'CB-301',
    type: 'smart_board',
    typeLabel: 'SMART BOARD',
    title: 'Promethean ActivPanel 9 Touch Display',
    subtitle: 'Central Block · Room 301',
    payload: 'QR-DEV-AV-CB301-S01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'CB-301',
    room: 'CB-301',
    type: 'classroom',
    typeLabel: 'CLASSROOM',
    title: 'Central Block · Room 301 (Door Tag)',
    subtitle: 'Floor 3 · Capacity 60 Seats',
    payload: 'QR-CLS-CB301',
  },

  // EB-202 (Engineering Block · Room 202)
  {
    id: 'DEV010',
    room: 'EB-202',
    type: 'projector',
    typeLabel: 'PROJECTOR',
    title: 'Epson PowerLite EB-E01 (Demo DEMO-P04)',
    subtitle: 'Engineering Block · Room 202',
    payload: 'QR-DEV-AV-EB202-P01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'DEV011',
    room: 'EB-202',
    type: 'microphone',
    typeLabel: 'MICROPHONE',
    title: 'Shure BLX24 / PG58 Wireless Microphone',
    subtitle: 'Engineering Block · Room 202',
    payload: 'QR-DEV-AV-EB202-M01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'DEV012',
    room: 'EB-202',
    type: 'smart_board',
    typeLabel: 'SMART BOARD',
    title: 'Promethean ActivPanel 9 Touch Display',
    subtitle: 'Engineering Block · Room 202',
    payload: 'QR-DEV-AV-EB202-S01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'EB-202',
    room: 'EB-202',
    type: 'classroom',
    typeLabel: 'CLASSROOM',
    title: 'Engineering Block · Room 202 (Door Tag)',
    subtitle: 'Floor 2 · Capacity 90 Seats',
    payload: 'QR-CLS-EB202',
  },

  // LB-110 (Library Block · Room 110)
  {
    id: 'DEV013',
    room: 'LB-110',
    type: 'projector',
    typeLabel: 'PROJECTOR',
    title: 'Epson PowerLite EB-E01 (Demo DEMO-P05)',
    subtitle: 'Library Block · Room 110',
    payload: 'QR-DEV-AV-LB110-P01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'DEV014',
    room: 'LB-110',
    type: 'microphone',
    typeLabel: 'MICROPHONE',
    title: 'Shure BLX24 / PG58 Wireless Microphone',
    subtitle: 'Library Block · Room 110',
    payload: 'QR-DEV-AV-LB110-M01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'DEV015',
    room: 'LB-110',
    type: 'smart_board',
    typeLabel: 'SMART BOARD',
    title: 'Promethean ActivPanel 9 Touch Display',
    subtitle: 'Library Block · Room 110',
    payload: 'QR-DEV-AV-LB110-S01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'LB-110',
    room: 'LB-110',
    type: 'classroom',
    typeLabel: 'CLASSROOM',
    title: 'Library Block · Room 110 (Door Tag)',
    subtitle: 'Floor 1 · Capacity 50 Seats',
    payload: 'QR-CLS-LB110',
  },

  // AB-302 (Academic Block A · Room 302)
  {
    id: 'DEV016',
    room: 'AB-302',
    type: 'projector',
    typeLabel: 'PROJECTOR',
    title: 'Epson PowerLite EB-E01 (Demo DEMO-P06)',
    subtitle: 'Academic Block A · Room 302',
    payload: 'QR-DEV-AV-AB302-P01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'DEV017',
    room: 'AB-302',
    type: 'microphone',
    typeLabel: 'MICROPHONE',
    title: 'Shure BLX24 / PG58 Wireless Microphone',
    subtitle: 'Academic Block A · Room 302',
    payload: 'QR-DEV-AV-AB302-M01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'DEV018',
    room: 'AB-302',
    type: 'smart_board',
    typeLabel: 'SMART BOARD',
    title: 'Promethean ActivPanel 9 Touch Display',
    subtitle: 'Academic Block A · Room 302',
    payload: 'QR-DEV-AV-AB302-S01',
    statusBadge: 'ACTIVE',
  },
  {
    id: 'AB-302',
    room: 'AB-302',
    type: 'classroom',
    typeLabel: 'CLASSROOM',
    title: 'Academic Block A · Room 302 (Door Tag)',
    subtitle: 'Floor 3 · Capacity 70 Seats',
    payload: 'QR-CLS-AB302',
  },
];

export const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ navigation }) => {
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string>('AB-105');
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
      setScanError(result.errorMessage || `Unrecognized QR Format: "${payload}". Expected a classroom or device QR tag.`);
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

          {/* Flashlight Action */}
          <TouchableOpacity
            style={styles.flashButton}
            onPress={() => setTorchEnabled(!torchEnabled)}
            activeOpacity={0.7}
          >
            <Text style={styles.flashButtonText}>
              {torchEnabled ? 'Flashlight: ON' : 'Flashlight: OFF'}
            </Text>
          </TouchableOpacity>

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
          <Text style={[typography.caption, styles.sectionSubtitle]}>
            Select a classroom to test devices available in each room:
          </Text>

          {/* Classroom Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.roomFilterRow}
          >
            {ROOM_FILTERS.map(room => {
              const isSelected = selectedRoom === room;
              return (
                <TouchableOpacity
                  key={room}
                  style={[styles.roomFilterChip, isSelected && styles.roomFilterChipActive]}
                  onPress={() => setSelectedRoom(room)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.roomFilterText,
                      isSelected && styles.roomFilterTextActive,
                    ]}
                  >
                    {room}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.codeList}>
            {SAMPLE_ITEMS.filter(
              item => selectedRoom === 'ALL' || item.room === selectedRoom
            ).map(item => (
              <TouchableOpacity
                key={`${item.room}-${item.payload}`}
                activeOpacity={0.7}
                onPress={() => processPayload(item.payload)}
                style={styles.codeCard}
              >
                <View style={styles.codeRow}>
                  <View style={styles.tagGroup}>
                    <Text style={[typography.badge, styles.codeBadge]}>
                      {item.typeLabel}
                    </Text>
                    <Text style={styles.roomTag}>{item.room}</Text>
                    {item.statusBadge ? (
                      <Text
                        style={[
                          styles.deviceStatusTag,
                          item.statusBadge === 'FAULTY'
                            ? styles.statusFaulty
                            : styles.statusActive,
                        ]}
                      >
                        {item.statusBadge}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={[typography.code, styles.codeId]}>{item.id}</Text>
                </View>
                <Text style={[typography.bodyMedium, styles.codeTitle]}>
                  {item.title}
                </Text>
                <View style={styles.codeFooterRow}>
                  <Text style={[typography.caption, styles.codeSubtitle]}>
                    Raw QR: "{item.payload}"
                  </Text>
                  <Text style={styles.tapToTestHint}>TAP TO SCAN →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Manual Asset Code Input */}
        <View style={styles.manualCard}>
          <Text style={[typography.h4, styles.manualTitle]}>ENTER QR CODE MANUALLY</Text>
          <TextInputField
            placeholder="e.g. QR-CLS-AB105, QR-DEV-AV-AB105-P01, DEV004"
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
  flashButton: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.surfaceSubtle,
  },
  flashButtonText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: typography.caption.fontFamily,
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
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: spacing.sm,
  },
  roomFilterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.md,
    paddingVertical: 2,
  },
  roomFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceSubtle,
  },
  roomFilterChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: colors.primary,
  },
  roomFilterText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  roomFilterTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roomTag: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  deviceStatusTag: {
    fontSize: 8,
    fontWeight: '700',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  statusFaulty: {
    color: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusActive: {
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
  codeFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  tapToTestHint: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
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
