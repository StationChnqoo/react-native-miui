import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Video from 'react-native-video';
import {
  ControllerConfig,
  LoadedConfig,
  LoadingConfig,
  ProgressProps,
} from '../../types';
import LoadingView from './LoadingView';
import ProgressBar from './ProgressBar';
import LoadedView from './LoadedView';

const screenWidth = Dimensions.get('screen').width;

interface VideoPlayerProps {
  source:
    | {
        uri?: string | undefined;
        headers?: {[key: string]: string} | undefined;
        type?: string | undefined;
      }
    | number;
  resizeMode?: 'stretch' | 'contain' | 'cover' | 'none' | undefined;
  repeat?: boolean | undefined;
  paused?: boolean | undefined;
  muted?: boolean | undefined;
  volume?: number | undefined;
  rate?: number | undefined;
  pictureInPicture?: boolean | undefined;
  playInBackground?: boolean | undefined;
  currentTime?: number | undefined;
  progressUpdateInterval?: number;
  audioOnly?: boolean | undefined;
  onProgress?: (time: ProgressProps) => void;
  /** 自定义属性 */
  style: StyleProp<ViewStyle>;
  loadingConfig?: LoadingConfig;
  loadedConfig?: LoadedConfig;
  controllerConfig?: ControllerConfig;
}

const VideoPlayer: React.FC<VideoPlayerProps> = props => {
  const [progress, setProgress] = useState<ProgressProps>(Object.create(null));
  const [pause, setPause] = useState(false);
  const [showController, setShowController] = useState(true);
  const [showLoading, setShowLoading] = useState(true);
  const [touched, setTouched] = useState(true);
  const [progressStr, setProgressStr] = useState(['--:--', '--:--']);
  const [finished, setFinished] = useState(false);

  let timer: NodeJS.Timeout;

  const player = useRef<Video>(null);

  const {source} = props;
  const resizeMode = props?.resizeMode ?? 'stretch';
  const style = props?.style ?? {};
  const pictureInPicture = props?.pictureInPicture ?? false;
  const progressUpdateInterval = props?.progressUpdateInterval ?? 100;

  const loadingConfig = props?.loadingConfig ?? Object.create(null);
  const loadedConfig = props?.loadedConfig ?? Object.create(null);

  const controllerConfig = Object.assign(
    {
      autoHideController: false,
      autoHideTimeout: 3000,
      colorDone: '#987123',
      colorCached: 'white',
      colorTotal: '#666',
    },
    props?.controllerConfig ?? {},
  );

  /** 默认属性 */
  const defaultProps = {
    source,
    resizeMode,
    pictureInPicture,
    progressUpdateInterval,
  };

  /**
   * 时间格式化
   * @param seconds
   * @returns `秒` 转 `HH:mm:ss` 或者 `mm:ss`，如果 `HH` = 0，则只返回 `mm:ss`。
   */
  const timeFormat = (seconds: number) => {
    const fixZero = (n: number) => {
      return n < 10 ? `0${n}` : n;
    };
    const h = parseInt(`${seconds / 60 / 60}`);
    const m = parseInt(`${(seconds / 60) % 60}`);
    const s = seconds % 60;
    return `${h > 0 ? fixZero(h) + ':' : ''}${fixZero(m)}:${fixZero(s)}`;
  };

  useEffect(() => {
    if (progress?.total && progress?.current) {
      setShowLoading(false);
      setProgressStr([
        timeFormat(progress.current),
        timeFormat(progress.total),
      ]);
      setFinished(progress.total == progress.current);
    } else {
      setShowLoading(true);
    }
    return () => {};
  }, [progress]);

  useEffect(() => {
    if (touched) {
      !showController && setShowController(true);
      timer = setTimeout(() => {
        setTouched(false);
        controllerConfig.autoHideController && setShowController(false);
        clearTimeout(timer);
      }, controllerConfig.autoHideTimeout);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [touched]);

  useEffect(() => {
    if (props.paused != pause) {
      setPause(!pause);
    }
    return () => {};
  }, [props.paused]);

  return (
    <TouchableOpacity
      style={[styles.view, style]}
      activeOpacity={0.9}
      onPress={() => {
        !touched && setTouched(true);
      }}>
      {finished ? (
        <LoadedView
          config={loadedConfig}
          onPlayPress={() => {
            setShowController(true);
            setShowLoading(true);
            setFinished(false);
            setPause(false);
            player.current?.seek(0);
          }}
        />
      ) : (
        <Video
          {...defaultProps}
          ref={ref => (player.current = ref)}
          style={{height: '100%', width: '100%', position: 'absolute'}}
          paused={pause}
          onProgress={data => {
            console.log(data.currentTime);
            setProgress({
              current: Math.round(data.currentTime),
              cached: Math.round(data.playableDuration),
              total: Math.round(data.seekableDuration),
            });
          }}
        />
      )}
      <LoadingView config={loadingConfig} status={showLoading} />
      {showController ? (
        <View style={styles.viewBottom}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (finished) {
                // setPause(false);
                // player.current?.seek(0);
                /**
                 * 这个地方暂时有个 `🐞 BUG` 未能解决。
                 * https://github.com/react-native-video/react-native-video/issues/1979
                 * When video starts in 'paused' state the onProgress event does not fire on Android #1979
                 * dylanjha opened this issue on 22 Apr 2020 · 9 comments
                 * 当你通过 `paused` 进行视频重播的时候，`onProgress()` 在 `Android` 平台上面不能回调。
                 * 所以只能曲线救国，播放结束的时候，加载另一个 `View`，主动点击这个 `View` 的 `播放 ▶️` 按钮，这个时候重新加载 `Video` 并且重置所有状态。
                 */
              } else {
                setPause(t => !t);
              }
            }}>
            <Image
              source={
                progress?.total &&
                progress?.current &&
                progress.total == progress.current
                  ? require('../../images/video_success.png')
                  : pause
                  ? require('../../images/video_pause.png')
                  : require('../../images/video_play.png')
              }
              style={{height: 24, width: 24, tintColor: 'white'}}
            />
          </TouchableOpacity>
          <View style={{width: 12}} />
          <Text style={styles.textProgress}>{progressStr[0]}</Text>
          <View style={{width: 16}} />
          <ProgressBar progress={progress} config={controllerConfig} />
          <View style={{width: 16}} />
          <Text style={styles.textProgress}>{progressStr[1]}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    width: screenWidth,
    height: screenWidth,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  viewBottom: {
    paddingVertical: 8,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.618)',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textProgress: {
    fontSize: 16,
    color: 'white',
  },
});

export default VideoPlayer;
