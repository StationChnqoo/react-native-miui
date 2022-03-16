import React, { JSXElementConstructor, ReactElement } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  VirtualizedList,
  RefreshControl,
} from "react-native";

import * as Animatable from "react-native-animatable";

interface WaterfallProps<ItemT> {
  data: ItemT[];
  pageSize?: number;
  numColumns?: number | undefined;
  animationDuration?: number;
  animationDelay?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
  onEndReached?:
    | ((info: { distanceFromEnd: number }) => void)
    | null
    | undefined;
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
    i: number
  ) => ReactElement<any, string | JSXElementConstructor<any>>;
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
  const animationDelay = props?.animationDelay ?? 200;
  const animationDuration = props?.animationDuration ?? 618;

  const defaultProps = {
    showsVerticalScrollIndicator,
    removeClippedSubviews,
    onEndReachedThreshold,
    scrollEventThrottle,
  };
  return (
    <VirtualizedList
      {...defaultProps}
      data={[""]}
      getItemCount={(data) => 1}
      getItem={(data, index) => data[index]}
      style={[{ flex: 1 }, props?.style ?? {}]}
      onScroll={props?.onScroll ?? props.onScroll}
      keyExtractor={(item, index) => `react-native-miui`}
      ListHeaderComponent={props?.ListHeaderComponent ?? null}
      ListEmptyComponent={props?.ListEmptyComponent ?? null}
      ListFooterComponent={props?.ListFooterComponent ?? null}
      onEndReached={props?.onEndReached && props.onEndReached}
      refreshControl={
        <RefreshControl
          refreshing={props.refreshing ?? false}
          onRefresh={props?.onRefresh && props.onRefresh}
        />
      }
      renderItem={(info) => (
        <View style={[{ flexDirection: "row" }]}>
          {Array.from({ length: numColumns }, (_, i) => (
            <View
              style={[
                { width: `${100 / numColumns}%` },
                props?.contentContainerStyle ?? null,
              ]}
              key={`Column ${i + 1}`}
            >
              {props.data.map((__, _i) => {
                if (_i % numColumns == i) {
                  return (
                    <Animatable.View
                      useNativeDriver={true}
                      delay={(_i % pageSize) * animationDelay}
                      animation={"fadeInDown"}
                      duration={animationDuration}
                      key={`Column ${i + 1} --> Datas[${_i}]`}
                    >
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

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
  },
  viewColumns: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Waterfall;
