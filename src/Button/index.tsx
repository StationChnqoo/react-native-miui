import React from "react";
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
} from "react-native";

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

const Button: React.FC<ButtonProps> = (props) => {
  let fontSize = (props?.fontStyle ?? {}).hasOwnProperty("fontSize")
    ? // @ts-ignore
      props.fontStyle.fontSize
    : 16;
  return (
    <TouchableOpacity
      disabled={props?.disabled}
      style={[
        styles.view,
        props?.style ?? null,
        props?.disabled && { opacity: 0.618 },
      ]}
      onPress={() => {
        props?.onPress && props.onPress();
      }}
      activeOpacity={props?.activeOpacity ?? 0.618}
      onLongPress={() => {
        props?.onLongPress && props.onLongPress();
      }}
    >
      {props?.icon && (
        <Image
          source={props.icon.source}
          style={[
            { height: fontSize, width: fontSize },
            props.icon?.style ?? null,
          ]}
        />
      )}
      {props?.icon?.distance && <View style={{ width: props.icon.distance }} />}
      <Text style={[styles.fontStyle, styles?.fontStyle ?? {}]}>
        {props?.children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#987123",
    borderRadius: 4,
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  fontStyle: {
    color: "white",
    fontSize: 16,
  },
});

export default Button;