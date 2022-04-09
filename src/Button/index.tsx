import React from 'react';
import {
  Image,
  ImageRequireSource,
  ImageStyle,
  ImageURISource,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type IconProps = {
  /** 按钮图标 */
  source: ImageRequireSource | ImageURISource;
  /** 按钮的样式 */
  style?: StyleProp<ImageStyle>;
  /** 按钮和文字之间的距离 */
  distance?: number;
};

interface ButtonProps {
  /** 按钮的样式 */
  style?: StyleProp<ViewStyle>;
  /** 文字样式 */
  fontStyle?: StyleProp<TextStyle>;
  /** 按钮是否禁止点击 */
  disabled?: boolean;
  /** 点击事件 */
  onPress: () => void;
  /** 长按点击事件 */
  onLongPress?: () => void;
  /** 按钮的图标 */
  icon?: IconProps;
  /** 按钮被点击的透明度 */
  activeOpacity?: number;
}

const Button: React.FC<ButtonProps> = props => {
  const {
    style,
    fontStyle = {},
    disabled = false,
    onPress,
    icon,
    onLongPress,
  } = props;
  let fontSize = fontStyle.hasOwnProperty('fontSize')
    ? // @ts-ignore
      fontStyle.fontSize
    : 16;

  const loadIcon = () => {
    if (icon) {
      const {source, style = {tintColor: 'white'}, distance = 8} = icon;
      return (
        <View style={{alignItems: 'center', flexDirection: 'row'}}>
          <Image
            source={source}
            style={[{height: fontSize, width: fontSize}, style]}
          />
          <View style={{width: distance}} />
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.view, style, disabled && {opacity: 0.618}]}
      onPress={() => {
        onPress?.();
      }}
      activeOpacity={props?.activeOpacity ?? 0.618}
      onLongPress={() => {
        onLongPress?.();
      }}>
      {loadIcon()}
      <Text style={[styles.fontStyle, fontStyle]}>{props?.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#987123',
    borderRadius: 4,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  fontStyle: {
    color: 'white',
    fontSize: 16,
  },
});

export default Button;