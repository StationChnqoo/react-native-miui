import React, {JSXElementConstructor, ReactElement} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  VirtualizedList,
  RefreshControl,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import {CommonAnimationActions} from '../../types';

interface WaterfallProps<ItemT> {
  /**
   * FlastList 规范的 PropTypes，命名都一模一样，功能也一模一样。
   * 请参考: https://www.react-native.cn/docs/flatlist
   */
  data: ItemT[];
  pageSize?: number;
  numColumns?: number | undefined;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onEndReached?: (info: {distanceFromEnd: number}) => void;
  onEndReachedThreshold?: number | null | undefined;
  onRefresh?: () => void;
  onScroll?:
    | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void)
    | undefined;
  refreshing?: boolean | null | undefined;
  removeClippedSubviews?: boolean | undefined;
  scrollEventThrottle?: number | undefined;
  showsVerticalScrollIndicator?: boolean | undefined;
  style?: StyleProp<ViewStyle>;
  ListEmptyComponent?: ReactElement<any, string | JSXElementConstructor<any>>;
  ListHeaderComponent?: ReactElement<any, string | JSXElementConstructor<any>>;
  ListFooterComponent?: ReactElement<any, string | JSXElementConstructor<any>>;
  renderItem: (
    item: ItemT,
    column: number,
    i: number,
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
  /** 动画相关 */
  animation?: CommonAnimationActions;
}

/**
 * 泛型的支持
 * 参考: https://stackoverflow.com/questions/59947787/generictype-in-react-fcpropst
 * @param props
 * @returns
 */
const Waterfall = <ItemT extends {}>(props: WaterfallProps<ItemT>) => {
  const numColumns = props?.numColumns ?? 2;
  const showsVerticalScrollIndicator =
    props?.showsVerticalScrollIndicator ?? false;
  const removeClippedSubviews = props?.removeClippedSubviews ?? true;
  const onEndReachedThreshold = props?.onEndReachedThreshold ?? 0.2;
  const scrollEventThrottle = props?.scrollEventThrottle ?? 100;
  const pageSize = props?.pageSize ?? 10;

  const animation = props?.animation ?? {
    type: 'fadeInDown',
    duration: 1000,
    delay: 200,
  };

  const defaultProps = {
    showsVerticalScrollIndicator,
    removeClippedSubviews,
    onEndReachedThreshold,
    scrollEventThrottle,
  };
  return (
    <VirtualizedList
      {...defaultProps}
      data={['']}
      getItemCount={data => 1}
      getItem={(data, index) => data[index]}
      style={[{flex: 1}, props?.style ?? {}]}
      onScroll={props?.onScroll ?? props.onScroll}
      keyExtractor={(item, index) => `react-native-miui`}
      ListHeaderComponent={props?.ListHeaderComponent ?? null}
      ListEmptyComponent={props?.ListEmptyComponent ?? null}
      ListFooterComponent={props?.ListFooterComponent ?? null}
      onEndReached={info => {
        /**
         * 🐞 有可能刚进来的时候，`props.data` 还没进来，但是他认为已经到达底部了。
         * console.log(`info.distanceFromEnd: ${info.distanceFromEnd}`);
         * info.distanceFromEnd > 16 && props?.onEndReached && props.onEndReached(info)
         */
        if (props.data.length > 0) {
          props?.onEndReached && props.onEndReached(info);
        }
      }}
      refreshControl={
        <RefreshControl
          refreshing={props.refreshing ?? false}
          onRefresh={props?.onRefresh && props.onRefresh}
        />
      }
      renderItem={info => (
        <View
          style={[
            {flexDirection: 'row'},
            props?.contentContainerStyle ?? null,
          ]}>
          {Array.from({length: numColumns}, (_, i) => (
            <View key={`Column ${i + 1}`}>
              {props.data.map((__, _i) => {
                if (_i % numColumns == i) {
                  return (
                    <Animatable.View
                      useNativeDriver={true}
                      delay={(_i % pageSize) * animation.delay}
                      animation={animation.type}
                      duration={animation.duration}
                      key={`Column ${i + 1} --> Datas[${_i}]`}>
                      {props.renderItem(__, i, _i)}
                    </Animatable.View>
                  );
                } else {
                  return null;
                }
              })}
            </View>
          ))}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({});

export default Waterfall;
