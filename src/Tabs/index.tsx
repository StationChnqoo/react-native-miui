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
  /** 整体样式 */
  style?: StyleProp<ViewStyle>;
  /** Tab 之间的距离 */
  distanceBetweenItems?: number;
  /** 文字和指示器之间的距离 */
  distanceTextDot?: number;

  /** 激活和未激活 Tab 的样式 */
  /** 标题样式 */
  activeTextStyle?: StyleProp<TextStyle>;
  inactiveTextStyle?: StyleProp<TextStyle>;
  /** 指示器样式 */
  activeDotStyle?: StyleProp<ViewStyle>;
  inactiveDotStyle?: StyleProp<ViewStyle>;

  /** 激活 Tab 的 Index */
  activeIndex?: number;
  /** 数据源，暂不支持泛型 <T>，没必要 */
  tabLabels: string[];
  /** Tab 的点击事件 */
  onTabPress: (label: string, index: number) => void;
}

const Tabs: React.FC<TabsProps> = props => {
  const {
    onTabPress,
    style,
    activeTextStyle,
    inactiveTextStyle,
    activeDotStyle,
    inactiveDotStyle,
    distanceBetweenItems,
    distanceTextDot,
  } = props;
  const [index, setIndex] = useState(0);
  const activeIndex = props?.activeIndex ?? 0;
  const tabLabels = props?.tabLabels ?? [];

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
                  i == tabLabels.length - 1 ? 0 : distanceBetweenItems ?? 16,
              }}>
              <Text
                style={
                  active
                    ? [styles.activeTextStyle, activeTextStyle]
                    : [styles.inactiveTextStyle, inactiveTextStyle]
                }>
                {it}
              </Text>
              <View style={{height: distanceTextDot ?? 8}} />
              <View
                style={
                  active
                    ? [styles.activeDotStyle, activeDotStyle]
                    : [styles.inactiveDotStyle, inactiveDotStyle]
                }
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
