import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

interface BadgeProps {
  /** 整体的样式 */
  style?: StyleProp<ViewStyle>;
  /** 文字样式 */
  fontStyle?: StyleProp<TextStyle>;
  /** 排名 */
  rank?: number;
}

enum rankColors {
  '#ff5252',
  '#ffb50e',
  '#abc',
  '#f58a0e',
  '#aaa',
}

const Badge: React.FC<BadgeProps> = props => {
  const {rank = 0, style, fontStyle} = props;
  return (
    <View
      style={[
        styles.view,
        style,
        {backgroundColor: rankColors[Math.min(rank, 4)]},
      ]}>
      <Text style={[styles.fontStyle, fontStyle]}>{props.children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 'auto',
    width: 'auto',
    padding: 2,
    backgroundColor: '#F72033',
    borderRadius: 12,
  },
  fontStyle: {
    color: 'white',
    fontSize: 16,
  },
});

export default Badge;
