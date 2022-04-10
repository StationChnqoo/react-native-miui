import React, {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
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

export interface CounterProps {
  style?: StyleProp<ViewStyle>;
  renderMinusButton?: ReactElement<any, string | JSXElementConstructor<any>>;
  renderAddButton?: ReactElement<any, string | JSXElementConstructor<any>>;
  value: number;
  valueContentStyle?: StyleProp<ViewStyle>;
  valueFontStyle?: StyleProp<TextStyle>;
  onMinusPress?: () => void;
  onAddPress?: () => void;
}

const Counter: React.FC<CounterProps> = props => {
  const counter = useRef<FlatList>();
  const [index, setIndex] = useState(0);

  /** 默认自定义按钮 */
  const renderButton = (t: string, opacity: number) => {
    return (
      <View style={[styles.viewButton, {opacity}]}>
        <Text style={{color: '#987123', fontSize: 20, fontWeight: 'bold'}}>
          {t}
        </Text>
      </View>
    );
  };

  const {
    style,
    renderAddButton = renderButton('+', index >= 999 ? 0.28 : 1),
    renderMinusButton = renderButton('-', index <= 1 ? 0.28 : 1),
    value = 1,
    valueContentStyle,
    valueFontStyle = {},
    onAddPress,
    onMinusPress,
  } = props;

  useEffect(() => {
    setIndex(value);
    setTimeout(() => {
      counter.current?.scrollToIndex({animated: true, index: value});
    }, 100);
    return function () {};
  }, [value]);

  const zoomOutPress = {
    top: 16,
    bottom: 16,
    left: 16,
    right: 16,
  };

  return (
    <View style={[styles.view, style]}>
      <TouchableOpacity
        hitSlop={zoomOutPress}
        activeOpacity={0.618}
        disabled={index <= 1}
        onPress={onMinusPress}>
        {renderMinusButton}
      </TouchableOpacity>
      <View style={[styles.viewValueContent, valueContentStyle]}>
        <FlatList
          horizontal={true}
          ref={ref => (counter.current = ref)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
          data={Array.from({length: 99}, (_, i) => i)}
          renderItem={info => (
            <View style={[styles.viewValueContent, valueContentStyle]}>
              <Text style={[styles.textValue, valueFontStyle]}>
                {info.item}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => `Counter --> ${index}`}
        />
      </View>
      <TouchableOpacity
        activeOpacity={0.618}
        onPress={onAddPress}
        hitSlop={zoomOutPress}>
        {renderAddButton}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 128,
    justifyContent: 'space-between',
  },
  viewButton: {},
  textValue: {
    fontSize: 20,
    color: '#333',
  },
  viewValueContent: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Counter;
