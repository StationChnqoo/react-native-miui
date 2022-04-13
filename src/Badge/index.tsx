/** 设计参考的是 react-navigation 里面的 `Badge` */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface BadgeProps {
  /** 尺寸 */
  size?: number;
  /** 外显数字 */
  value: string;
  /** 颜色 */
  color?: {
    text?: string;
    container?: string;
  };
}

const Badge: React.FC<BadgeProps> = props => {
  const {size = 20, value, color = {}} = props;
  const _color = Object.assign({}, {container: '#ff5252', text: '#fff'}, color);
  return (
    <View
      style={[
        styles.view,
        {
          borderRadius: size / 2,
          height: size,
          minWidth: size,
          backgroundColor: _color.container,
        },
      ]}>
      <Text style={{fontSize: Math.floor(size * 0.618), color: _color.text}}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});

export default Badge;