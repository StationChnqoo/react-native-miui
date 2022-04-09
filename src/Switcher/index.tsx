import React, {useEffect, useState} from 'react';
import {Animated, StyleSheet, TouchableOpacity} from 'react-native';
import {SwitcherAnimationConfig} from '../../types';

export interface ButtonProps {
  /** 选中的状态的颜色 默认白色 */
  activeColor?: string;
  /** 未选中状态的颜色 默认 #f0f0f0 */
  inactiveColor?: string;
  /** 按钮的大小 */
  size?: number;
  /** 选中的状态 */
  status: boolean;
  /** 状态更改时的回调 */
  onStatusChange: (status: boolean) => void;
  animationConfig?: SwitcherAnimationConfig;
}

const Switcher: React.FC<ButtonProps> = props => {
  const {
    activeColor = '#987124',
    inactiveColor = '#d8d8d8',
    size = 24,
    status = false,
    onStatusChange,
    animationConfig = {},
  } = props;
  const {velocity = 0, tension = 1, friction = 2} = animationConfig;
  const [select, setSelect] = useState(false);
  const [slider, setSlider] = useState(
    new Animated.ValueXY({x: status ? size + 1 : 1, y: 0}),
  );

  useEffect(() => {
    if (status !== select) {
      setSelect(!select);
    }
    return () => {};
  }, [status]);

  useEffect(() => {
    Animated.spring(slider, {
      toValue: {x: select ? size + 1 : 1, y: 0},
      velocity,
      tension,
      friction,
      useNativeDriver: true,
    }).start();
    return () => {};
  }, [select]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        defaultStyles.viewSwitcher,
        {
          height: size,
          width: size * 2,
          backgroundColor: select ? activeColor : inactiveColor,
          borderRadius: size / 2,
        },
      ]}
      onPress={() => {
        let _status = !select;
        setSelect(_status);
        onStatusChange?.(_status);
      }}>
      <Animated.View
        style={{
          position: 'absolute',
          height: size - 2,
          width: size - 2,
          backgroundColor: 'white',
          borderRadius: size / 2 - 1,
          transform: [{translateX: slider.x}],
        }}
      />
    </TouchableOpacity>
  );
};

const defaultStyles = StyleSheet.create({
  viewSwitcher: {
    height: 24,
    width: 48,
    borderRadius: 24,
    padding: 1,
    backgroundColor: '#987123',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
});

export default Switcher;
