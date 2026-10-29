import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export type NavIconName = 'home' | 'scan' | 'incidents' | 'alerts' | 'profile' | 'console' | 'tickets';

interface NavIconProps {
  name: NavIconName;
  color?: string;
  focused?: boolean;
  size?: number;
}

export const NavIcon: React.FC<NavIconProps> = ({
  name,
  color = colors.primary,
  focused = false,
  size = 22,
}) => {
  switch (name) {
    case 'home':
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          {/* Roof Triangle */}
          <View
            style={[
              styles.roofTriangle,
              {
                borderLeftWidth: size * 0.45,
                borderRightWidth: size * 0.45,
                borderBottomWidth: size * 0.36,
                borderBottomColor: color,
              },
            ]}
          />
          {/* House Base */}
          <View
            style={[
              styles.houseBody,
              {
                width: size * 0.64,
                height: size * 0.45,
                borderColor: color,
                borderWidth: focused ? 0 : 1.8,
                backgroundColor: focused ? color : 'transparent',
              },
            ]}
          >
            {/* Cutout Doorway */}
            <View
              style={[
                styles.door,
                {
                  width: size * 0.2,
                  height: size * 0.24,
                  backgroundColor: focused ? colors.card : color,
                },
              ]}
            />
          </View>
        </View>
      );

    case 'scan':
      return (
        <View style={[styles.container, { width: size, height: size, justifyContent: 'space-between', padding: 1 }]}>
          {/* Top corners */}
          <View style={styles.rowBetween}>
            <View style={[styles.corner, { borderLeftWidth: 2, borderTopWidth: 2, borderColor: color }]} />
            <View style={[styles.corner, { borderRightWidth: 2, borderTopWidth: 2, borderColor: color }]} />
          </View>
          {/* Center scan line / reticle dot */}
          <View style={styles.centerAlign}>
            <View
              style={{
                width: focused ? size * 0.7 : size * 0.5,
                height: 2,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />
          </View>
          {/* Bottom corners */}
          <View style={styles.rowBetween}>
            <View style={[styles.corner, { borderLeftWidth: 2, borderBottomWidth: 2, borderColor: color }]} />
            <View style={[styles.corner, { borderRightWidth: 2, borderBottomWidth: 2, borderColor: color }]} />
          </View>
        </View>
      );

    case 'incidents':
    case 'tickets':
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          {/* Clipboard Top Clip */}
          <View
            style={{
              width: size * 0.36,
              height: 3,
              backgroundColor: color,
              borderRadius: 1,
              marginBottom: -1,
              zIndex: 1,
            }}
          />
          {/* Clipboard Sheet */}
          <View
            style={{
              width: size * 0.68,
              height: size * 0.78,
              borderRadius: 2,
              borderWidth: 1.8,
              borderColor: color,
              backgroundColor: focused ? color : 'transparent',
              paddingHorizontal: 2.5,
              paddingVertical: 3.5,
              justifyContent: 'space-around',
            }}
          >
            <View
              style={{
                height: 1.6,
                backgroundColor: focused ? colors.card : color,
                width: '85%',
                borderRadius: 0.8,
              }}
            />
            <View
              style={{
                height: 1.6,
                backgroundColor: focused ? colors.card : color,
                width: '100%',
                borderRadius: 0.8,
              }}
            />
            <View
              style={{
                height: 1.6,
                backgroundColor: focused ? colors.card : color,
                width: '60%',
                borderRadius: 0.8,
              }}
            />
          </View>
        </View>
      );

    case 'alerts':
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          {/* Top Hanging Loop */}
          <View
            style={{
              width: 4,
              height: 3,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              borderWidth: 1.4,
              borderBottomWidth: 0,
              borderColor: color,
              marginBottom: -0.5,
            }}
          />
          {/* Bell Dome */}
          <View
            style={{
              width: size * 0.6,
              height: size * 0.5,
              borderTopLeftRadius: size * 0.3,
              borderTopRightRadius: size * 0.3,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              backgroundColor: focused ? color : 'transparent',
              borderWidth: focused ? 0 : 1.8,
              borderColor: color,
            }}
          />
          {/* Bell Rim Base */}
          <View
            style={{
              width: size * 0.75,
              height: 2,
              backgroundColor: color,
              borderRadius: 1,
              marginTop: -0.5,
            }}
          />
          {/* Clapper */}
          <View
            style={{
              width: 4,
              height: 2.5,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              backgroundColor: color,
              marginTop: 1,
            }}
          />
        </View>
      );

    case 'profile':
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          {/* Head */}
          <View
            style={{
              width: size * 0.36,
              height: size * 0.36,
              borderRadius: (size * 0.36) / 2,
              backgroundColor: focused ? color : 'transparent',
              borderWidth: focused ? 0 : 1.8,
              borderColor: color,
              marginBottom: 2,
            }}
          />
          {/* Shoulders */}
          <View
            style={{
              width: size * 0.72,
              height: size * 0.36,
              borderTopLeftRadius: size * 0.36,
              borderTopRightRadius: size * 0.36,
              backgroundColor: focused ? color : 'transparent',
              borderWidth: focused ? 0 : 1.8,
              borderBottomWidth: 0,
              borderColor: color,
            }}
          />
        </View>
      );

    case 'console':
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          {/* Dashboard 4-box matrix */}
          <View
            style={{
              width: size * 0.72,
              height: size * 0.72,
              borderRadius: 2,
              borderWidth: 1.8,
              borderColor: color,
              padding: 2,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignContent: 'space-between',
            }}
          >
            <View style={{ width: 4, height: 4, backgroundColor: color, borderRadius: 0.8 }} />
            <View
              style={{
                width: 4,
                height: 4,
                backgroundColor: focused ? color : 'transparent',
                borderWidth: focused ? 0 : 1,
                borderColor: color,
                borderRadius: 0.8,
              }}
            />
            <View
              style={{
                width: 4,
                height: 4,
                backgroundColor: focused ? color : 'transparent',
                borderWidth: focused ? 0 : 1,
                borderColor: color,
                borderRadius: 0.8,
              }}
            />
            <View style={{ width: 4, height: 4, backgroundColor: color, borderRadius: 0.8 }} />
          </View>
        </View>
      );

    default:
      return null;
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  roofTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  houseBody: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 0,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  door: {
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  corner: {
    width: 6,
    height: 6,
  },
  centerAlign: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
