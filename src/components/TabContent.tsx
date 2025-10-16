import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { TabContentProps } from '../types/TabContent';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const DEFAULT_ACTIVE_COLOR = 'rgba(255, 255, 255, 1)';
const DEFAULT_INACTIVE_COLOR = 'rgba(255, 255, 255, 0.7)';

export const TabContent = React.memo<TabContentProps>((props) => {
  const { activePercentage, activeColor, inactiveColor, label, labelStyle } =
    props;

  const animatedActiveLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: Math.max(0, 1 - activePercentage.value / 100),
    };
  }, [activePercentage]);

  const animatedInactiveLabelStyle = useAnimatedStyle(() => {
    return {
      opacity: activePercentage.value / 100,
    };
  }, [activePercentage]);

  const activeLabel = useMemo(() => {
    const activeColorStyle = activeColor ? { color: activeColor } : {};
    return (
      <Animated.Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          styles.activeLabel,
          animatedActiveLabelStyle,
          activeColorStyle,
          labelStyle,
        ]}
      >
        {label}
      </Animated.Text>
    );
  }, [activeColor, animatedActiveLabelStyle, label, labelStyle]);
  const inactiveLabel = useMemo(() => {
    const inactiveColorStyle = inactiveColor ? { color: inactiveColor } : {};
    return (
      <Animated.Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[
          styles.inactiveLabel,
          animatedInactiveLabelStyle,
          inactiveColorStyle,
          labelStyle,
        ]}
      >
        {label}
      </Animated.Text>
    );
  }, [inactiveColor, animatedInactiveLabelStyle, label, labelStyle]);

  return (
    <Animated.View style={styles.container}>
      {activeLabel}
      {inactiveLabel}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'stretch',
  },
  activeLabel: {
    color: DEFAULT_ACTIVE_COLOR,
    textAlign: 'center',
  },
  inactiveLabel: {
    position: 'absolute',
    color: DEFAULT_INACTIVE_COLOR,
    width: '100%',
    textAlign: 'center',
  },
});
