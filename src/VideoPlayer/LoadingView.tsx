import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Chase} from 'react-native-animated-spinkit';
import {LoadingConfig} from '../../types';

export type LoadingViewProps = {
  config: LoadingConfig;
  status: boolean;
};

const LoadingView: React.FC<LoadingViewProps> = props => {
  const {config, status} = props;
  return status ? (
    <View
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {config?.cover ? (
        <Image
          style={{width: '100%', height: '100%'}}
          resizeMode="cover"
          source={config.cover}
        />
      ) : null}
      {config?.view ?? (
        <View style={{alignItems: 'center'}}>
          <Chase size={64} color="white" />
          <View style={{height: 16}} />
          <Text style={{color: 'white', fontSize: 14}}>正在缓冲 ~</Text>
        </View>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({});

export default LoadingView;
