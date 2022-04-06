import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useDip} from 'react-native-x-utils';
import {TabType} from '../../types';

export interface TabsProps {
  /** 整体样式 */
  style?: StyleProp<ViewStyle>;

  /** 文字和指示器之间的距离 */
  distanceTextDot?: number;
  /** 标签之间的距离 */
  distanceBetweenTabs?: number;

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
  onTabPress: (item: TabType) => void;
}

const Tabs: React.FC<TabsProps> = props => {
  const {
    onTabPress,
    style,
    activeTextStyle,
    inactiveTextStyle,
    activeDotStyle,
    inactiveDotStyle,
    distanceBetweenTabs = 12,
    distanceTextDot = 8,
    activeIndex = 0,
    tabLabels = [],
  } = props;

  const [datas, setDatas] = useState<TabType[]>([]);
  let list = useRef<FlatList>();

  useEffect(() => {
    setDatas(
      tabLabels.map((item, index) => ({name: item, index, select: index == 0})),
    );
    return function () {};
  }, [tabLabels]);

  useEffect(() => {
    indexUpdater(activeIndex);
    return () => {};
  }, [activeIndex]);

  const indexUpdater = (index: number) => {
    let _datas = [...datas];
    for (let i = 0; i < _datas.length; i++) {
      _datas[i].select = index == _datas[i].index;
    }
    setDatas(_datas);
    _datas.length > 0 &&
      list.current.scrollToIndex({index, animated: true, viewPosition: 0.5});
  };

  return (
    <View style={[styles.view, style]}>
      <FlatList
        ref={ref => (list.current = ref)}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        bounces={false}
        data={datas}
        renderItem={info => {
          let {item} = info;
          let {index, name, select} = item;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                indexUpdater(index);
                onTabPress(item);
              }}
              style={{
                alignItems: 'center',
                paddingHorizontal: distanceBetweenTabs / 2,
              }}>
              <Text
                style={
                  select
                    ? [styles.activeTextStyle, activeTextStyle]
                    : [styles.inactiveTextStyle, inactiveTextStyle]
                }>
                {name}
              </Text>
              <View style={{height: distanceTextDot}} />
              <View
                style={
                  select
                    ? [styles.activeDotStyle, activeDotStyle]
                    : [styles.inactiveDotStyle, inactiveDotStyle]
                }
              />
            </TouchableOpacity>
          );
        }}
      />
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
    fontSize: useDip(16),
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
