import React, {useEffect, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useDip} from 'react-native-x-utils';

export interface TabsProps {
  style?: StyleProp<ViewStyle>;
  distanceBetweenItems?: number;
  distanceTextDot?: number;
  activeTextStyle?: StyleProp<TextStyle>;
  inactiveTextStyle?: StyleProp<TextStyle>;
  activeDotStyle?: StyleProp<ViewStyle>;
  inactiveDotStyle?: StyleProp<ViewStyle>;
  activeIndex?: number;
  tabLabels: string[];
  onTabPress: (label: string, index: number) => void;
}

const Tabs: React.FC<TabsProps> = props => {
  const {onTabPress} = props;
  const [index, setIndex] = useState(0);
  const activeIndex = props?.activeIndex ?? 0;
  const tabLabels = props?.tabLabels ?? [];
  const activeTextStyle = props?.activeTextStyle ?? {};
  const inactiveTextStyle = props?.inactiveTextStyle ?? {};
  const activeDotStyle = props?.activeDotStyle ?? {};
  const inactiveDotStyle = props?.inactiveDotStyle ?? {};
  const distanceBetweenItems = props?.distanceBetweenItems ?? 12;
  const distanceTextDot = props?.distanceTextDot ?? 8;
  const style = props?.style ?? {};

  useEffect(() => {
    if (activeIndex != index) {
      setIndex(activeIndex);
    }
    return () => {};
  }, [activeIndex]);

  return (
    <View style={[styles.view, style]}>
      {tabLabels.map((it, i) => {
        let active = index == i;
        return (
          <TouchableOpacity
            key={i}
            activeOpacity={0.8}
            onPress={() => {
              setIndex(i);
              onTabPress(it, i);
            }}>
            <View
              style={{
                alignItems: 'center',
                marginRight:
                  i == tabLabels.length - 1 ? 0 : distanceBetweenItems,
              }}>
              <Text
                style={[
                  active ? styles.activeTextStyle : styles.inactiveTextStyle,
                  ,
                  active ? activeTextStyle : inactiveTextStyle,
                ]}>
                {it}
              </Text>
              <View style={{height: distanceTextDot}} />
              <View
                style={[
                  active ? styles.activeDotStyle : styles.inactiveDotStyle,
                  ,
                  active ? activeDotStyle : inactiveDotStyle,
                ]}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    flexDirection: 'row',
    height: useDip(56),
    alignItems: 'flex-end',
    paddingBottom: 4,
  },
  activeTextStyle: {
    fontSize: useDip(20),
    fontWeight: 'bold',
    color: '#987123',
  },
  inactiveTextStyle: {
    fontSize: useDip(16),
    color: '#666',
  },
  activeDotStyle: {
    height: 4,
    width: 4,
    borderRadius: 2,
    backgroundColor: '#987123',
  },
  inactiveDotStyle: {
    height: 4,
    width: 4,
  },
});

export default Tabs;
