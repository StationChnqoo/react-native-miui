import React, {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ScrollView,
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
  range?: {max: number; min: number};
}

const Counter: React.FC<CounterProps> = props => {
  const counter = useRef<ScrollView>();
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
    valueContentStyle = {},
    valueFontStyle = {},
    onAddPress,
    onMinusPress,
    range = {max: 99, min: 1},
  } = props;

  // @ts-ignore
  const {height = 32, width = 32} = valueContentStyle;

  useEffect(() => {
    setIndex(value);
    counter.current?.scrollTo({y: (value - 1) * height, animated: true});
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
        <ScrollView
          ref={ref => (counter.current = ref)}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}>
          {Array.from({length: range.max - range.min + 1}, (_, i) => (
            <View
              key={i}
              style={{
                height,
                width,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.textValue, valueFontStyle]}>
                {range.min + i}
              </Text>
            </View>
          ))}
        </ScrollView>
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
    justifyContent: 'space-between',
  },
  viewButton: {},
  textValue: {
    fontSize: 20,
    color: '#333',
  },
  viewValueContent: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Counter;