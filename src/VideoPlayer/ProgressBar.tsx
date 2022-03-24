import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ControllerConfig, ProgressProps} from '../../types';

type ProgressBarProps = {
  progress: ProgressProps;
  config: ControllerConfig;
};

const dotSize = 8;
const ProgressBar: React.FC<ProgressBarProps> = props => {
  const [width, setWidth] = useState(dotSize);
  const [cacheX, setCacheX] = useState(0);
  const [doneX, setDoneX] = useState(0);

  const {progress, config} = props;
  useEffect(() => {
    if (progress.total) {
      setCacheX((progress.cached / progress.total) * width);
      setDoneX((progress.current / progress.total) * width);
    }
    return () => {};
  }, [progress, width]);
  
  return (
    <View
      style={[styles.view, {backgroundColor: config.colorTotal}]}
      onLayout={e => {
        setWidth(e.nativeEvent.layout.width);
      }}>
      <View
        style={[
          styles.viewCache,
          {width: cacheX, backgroundColor: config.colorCached},
        ]}
      />
      <View
        style={[
          styles.viewCurrect,
          {width: doneX, backgroundColor: config.colorDone},
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    height: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCache: {
    height: 3,
    position: 'absolute',
  },
  viewCurrect: {
    height: 3,
    borderRadius: 2,
    position: 'absolute',
  },
});

export default ProgressBar;
