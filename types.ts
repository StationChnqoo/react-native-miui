import {JSXElementConstructor, ReactElement} from 'react';
import {ImageRequireSource, ImageURISource} from 'react-native';

export type CommonAnimationTypes =
  | 'bounce'
  | 'flash'
  | 'jello'
  | 'pulse'
  | 'rotate'
  | 'rubberBand'
  | 'shake'
  | 'swing'
  | 'tada'
  | 'wobble'
  | 'bounceIn'
  | 'bounceInDown'
  | 'bounceInUp'
  | 'bounceInLeft'
  | 'bounceInRight'
  | 'bounceOut'
  | 'bounceOutDown'
  | 'bounceOutUp'
  | 'bounceOutLeft'
  | 'bounceOutRight'
  | 'fadeIn'
  | 'fadeInDown'
  | 'fadeInDownBig'
  | 'fadeInUp'
  | 'fadeInUpBig'
  | 'fadeInLeft'
  | 'fadeInLeftBig'
  | 'fadeInRight'
  | 'fadeInRightBig'
  | 'fadeOut'
  | 'fadeOutDown'
  | 'fadeOutDownBig'
  | 'fadeOutUp'
  | 'fadeOutUpBig'
  | 'fadeOutLeft'
  | 'fadeOutLeftBig'
  | 'fadeOutRight'
  | 'fadeOutRightBig'
  | 'flipInX'
  | 'flipInY'
  | 'flipOutX'
  | 'flipOutY'
  | 'lightSpeedIn'
  | 'lightSpeedOut'
  | 'slideInDown'
  | 'slideInUp'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideOutDown'
  | 'slideOutUp'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'zoomIn'
  | 'zoomInDown'
  | 'zoomInUp'
  | 'zoomInLeft'
  | 'zoomInRight'
  | 'zoomOut'
  | 'zoomOutDown'
  | 'zoomOutUp'
  | 'zoomOutLeft'
  | 'zoomOutRight';

export type CommonAnimationActions = {
  type: CommonAnimationTypes;
  duration: number;
  delay: number;
};

/** 播放进度，单位: 秒 */
export type ProgressProps = {
  /** 当前进度 */
  current: number;
  /** 已经缓冲的进度 */
  cached: number;
  /** 视频总长度 */
  total: number;
};

/** 进度条配置 */
export type ControllerConfig = {
  /** 自动隐藏进度条 */
  autoHideController?: boolean;
  /** 自动隐藏进度条，单位: 毫秒 */
  autoHideTimeout?: number;
  /** 已经播放完部分的进度条颜色 */
  colorDone?: string;
  /** 加载完成部分的进度条颜色 */
  colorCached?: string;
  /** 整个进度条的颜色 */
  colorTotal?: string;
};

/** 加载过程设置 */
export type LoadingConfig = {
  cover?: ImageRequireSource | ImageURISource;
  view?: ReactElement<any, string | JSXElementConstructor<any>>;
};

/** 加载完成设置 */
export type LoadedConfig = {
  cover?: ImageRequireSource | ImageURISource;
};

/** Boss直聘职位 */
export type JobType = {
  id: string;
  name: string;
  children?: JobType[];
};

/** Tabs 属性 */
export type TabType = {
  index: number;
  name: string;
  select: boolean;
}

/** ViewPager */
export type ScrollEvent = {
  start: number;
  end: number;
  finish: boolean;
};