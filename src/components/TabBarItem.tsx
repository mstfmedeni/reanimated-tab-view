import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ViewStyle, TextStyle, StyleProp } from 'react-native';
import { TabContent } from './TabContent';
import type { TabBarItemProps } from '../types/TabBar';

type TabBarItemComponentProps = TabBarItemProps & {
  activeColor?: string;
  inactiveColor?: string;
  labelStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  style?: StyleProp<ViewStyle>;
  label?: string;
};

export const TabBarItem = React.memo((props: TabBarItemComponentProps) => {
  const {
    route,
    activePercentage,
    activeColor,
    inactiveColor,
    labelStyle,
    numberOfLines,
    ellipsizeMode,
    style,
    label,
  } = props;

  return (
    <View style={[styles.container, style]}>
      <TabContent
        activePercentage={activePercentage}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        label={label ?? route.title ?? route.key}
        labelStyle={labelStyle}
        numberOfLines={numberOfLines}
        ellipsizeMode={ellipsizeMode}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
