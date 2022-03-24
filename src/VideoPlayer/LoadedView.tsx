import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {LoadedConfig} from '../../types';

export type LoadedViewProps = {
  config: LoadedConfig;
  onPlayPress: () => void;
};

const LoadedView: React.FC<LoadedViewProps> = props => {
  const {config} = props;
  return (
    <View
      style={[
        styles.view,
        {
          position: 'absolute',
        },
      ]}>
      {config?.cover ? (
        <Image
          style={{width: '100%', height: '100%', position: 'absolute'}}
          resizeMode="cover"
          source={config.cover}
        />
      ) : null}
      <View
        style={[
          styles.view,
          {
            position: 'relative',
            backgroundColor: 'rgba(0, 0, 0, 0.618)',
          },
        ]}>
        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() => {
            props.onPlayPress();
          }}
          activeOpacity={0.8}>
          <Image
            source={require('../../images/video_replay.png')}
            style={{height: 64, width: 64, tintColor: 'white'}}
          />
          <View style={{height: 16}} />
          <Text style={{color: 'white', fontSize: 14}}>重新播放 ~</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadedView;
