import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {ScrollEvent} from '../../types';

interface ViewPagerProps {
  /** 当前激活的 `index` */
  index: number;
  /** `ViewPager` 的长度 */
  length: number;
  /** 是否有动画效果 */
  enableScrollAnimation?: boolean;
  /** 渲染什么布局，把决定权交给你自己，我只管给你空间 */
  renderItem: (info: ListRenderItemInfo<React.ReactNode>) => React.ReactNode;

  /** 每个 Item 的样式 */
  /** `ViewPager` 的宽度取其中的 `width` */
  itemStyle?: StyleProp<ViewStyle>;

  /** `currentIndex` 变化的时候 */
  onIndexChange?: (index: number) => void;
}

const ViewPager: React.FC<ViewPagerProps> = props => {
  const [datas, setDatas] = useState<React.ReactNode[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [scrollEvent, setScrollEvent] = useState<ScrollEvent>({
    start: 0,
    end: 0,
    finish: false,
  });

  let viewPager = useRef<FlatList>();

  const {
    index = 0,
    length = 0,
    enableScrollAnimation = true,
    renderItem,
    itemStyle = {width: Dimensions.get('screen').width},
    onIndexChange,
  } = props;

  useEffect(() => {
    setDatas(Array.from({length}, (_, i) => i));
    return function () {};
  }, [length]);

  useEffect(() => {
    if (scrollEvent.finish) {
      let _index = index + Math.sign(scrollEvent.end - scrollEvent.start);
      setCurrentIndex(
        _index <= 0 ? 0 : _index == datas.length - 1 ? _index - 1 : _index,
      );
    }
    return () => {};
  }, [scrollEvent]);

  useEffect(() => {
    if (index != currentIndex) {
      setCurrentIndex(index);
      viewPager.current.scrollToIndex({index, animated: enableScrollAnimation});
    }
    return function () {};
  }, [index]);

  useEffect(() => {
    onIndexChange && onIndexChange(currentIndex);
    return function () {};
  }, [currentIndex]);

  return (
    <FlatList
      decelerationRate={'fast'}
      snapToInterval={itemStyle.width}
      onScrollBeginDrag={e => {
        let x = e.nativeEvent.contentOffset.x;
        setScrollEvent({
          start: x,
          end: scrollEvent.end,
          finish: false,
        });
      }}
      onScrollEndDrag={e => {
        let x = e.nativeEvent.contentOffset.x;
        setScrollEvent({
          start: scrollEvent.start,
          end: x,
          finish: true,
        });
      }}
      disableIntervalMomentum={true}
      bounces={false}
      showsHorizontalScrollIndicator={false}
      data={datas}
      horizontal={true}
      ref={ref => (viewPager.current = ref)}
      renderItem={info => (
        <View style={[styles.viewItem, itemStyle]}>{renderItem(info)}</View>
      )}
      keyExtractor={(item, index) => `${index}`}
    />
  );
};

const styles = StyleSheet.create({
  viewItem: {
    flex: 1,
    height: '100%',
    width: Dimensions.get('screen').width,
  },
});

export default ViewPager;
