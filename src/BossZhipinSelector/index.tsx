import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Text} from 'react-native-animatable';
import Tabs from '../Tabs';
import Modal from 'react-native-modal';
import Carousel from 'react-native-snap-carousel';
import {useDip, useScreenSize, x} from 'react-native-x-utils';
import {useBossZhipinJobs} from './useBossZhipinJobs';
import {JobType} from '../../types';

interface BossZhipinSelectorProps {
  /** 显示与否 */
  show: boolean;

  /** 整体样式 */
  style?: StyleProp<ViewStyle>;

  /** 弹窗标题栏部分 */
  /** 标题 */
  title?: string;
  /** 标题样式 */
  titleStyle?: StyleProp<TextStyle>;

  /** Tab 指示器部分 */
  /** 上方 Tab 的选中和未选中的样式 */
  // activeTabStyle?: StyleProp<ViewStyle>;
  // inactiveTabStyle?: StyleProp<ViewStyle>;
  /**
   * Tab 底部的指示器样式
   * distanceTextDot: Tab文字和下面指示器之间的距离
   */
  tabsStyle?: StyleProp<ViewStyle>;
  inactiveDotStyle?: StyleProp<ViewStyle>;
  activeDotStyle?: StyleProp<ViewStyle>;
  /** Tab文字和底部指示器的高度 */
  distanceTextDot?: number;
  /** Tab 当前激活和未激活的文字的样式 */
  activeTabTextStyle?: StyleProp<TextStyle>;
  inactiveTabTextStyle?: StyleProp<TextStyle>;

  /** 职位列表部分 */
  /** 最下方职位 ItemContainer 包裹样式 */
  itemStyle?: StyleProp<ViewStyle>;
  /** 选中和未选中文字的样式 */
  activeItemTextStyle?: StyleProp<TextStyle>;
  inactiveItemTextStyle?: StyleProp<TextStyle>;

  /** 事件响应部分 */
  /** Modal 关闭后的事件 */
  onHide?: () => void;
  /** Modal 显示完的事件 */
  onShow?: () => void;
  /** Modal 将要关闭的事件 */
  onClose: () => void;
  /** 选择到了三级以后，进行的回调 */
  onConfirm: (labels: JobType[]) => void;
}

const BossZhipinSelector: React.FC<BossZhipinSelectorProps> = props => {
  const [index, setIndex] = useState(0);
  const carousel = useRef<Carousel<any>>();
  const [labels, setLabels] = useState<JobType[]>([]);
  const [data, setData] = useState<JobType[][]>([[], [], []]);
  const {
    show,
    title,
    titleStyle,
    style,
    tabsStyle,
    activeDotStyle,
    inactiveDotStyle,
    activeTabTextStyle,
    inactiveTabTextStyle,
    distanceTextDot,
    itemStyle,
    activeItemTextStyle,
    inactiveItemTextStyle,
    onShow,
    onHide,
    onClose,
    onConfirm,
  } = props;

  useEffect(() => {
    setData([useBossZhipinJobs, [], []]);
    setLabels([useBossZhipinJobs[0]]);
    return () => {};
  }, []);

  useEffect(() => {
    carousel?.current && carousel?.current.snapToItem(index, true);
    return () => {};
  }, [index]);

  return (
    <Modal
      style={styles.viewModal}
      onShow={onShow}
      onModalHide={onHide}
      isVisible={show}
      animationInTiming={618}
      animationOutTiming={618}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      hideModalContentWhileAnimating={true}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      useNativeDriver={true}>
      <View style={[styles.views, style]}>
        <Text style={[styles.textTitle, titleStyle]}>
          {title || '请选择你感兴趣的职业'}
        </Text>
        <Tabs
          activeIndex={index}
          tabLabels={labels.map(it => it.name)}
          onTabPress={(label, index) => {
            setIndex(index);
          }}
          activeDotStyle={[{height: 0, width: 0}, activeDotStyle]}
          inactiveDotStyle={[{height: 0, width: 0}, inactiveDotStyle]}
          distanceTextDot={distanceTextDot ?? 0}
          activeTextStyle={[styles.textTabActive, activeTabTextStyle]}
          inactiveTextStyle={[styles.textTabInactive, inactiveTabTextStyle]}
          style={[styles.viewTabs, tabsStyle]}
        />
        <View style={{height: 12}} />
        <Carousel
          ref={ref => (carousel.current = ref)}
          data={data}
          inactiveSlideScale={1}
          scrollEnabled={!(data[1].length == 0 && data[2].length == 0)}
          renderItem={(item: {item: JobType[]}) => {
            return (
              <ScrollView showsVerticalScrollIndicator={true} style={{flex: 1}}>
                {item.item.map((it, i) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    style={[styles.viewItem, itemStyle]}
                    onPress={() => {
                      let _data = [...data];
                      let _labels = [...labels];
                      _labels[index] = it;
                      if (it?.children) {
                        _data[index + 1] = it.children;
                        //  记住上次 TabLabels 的选择的状态
                        _labels[index + 1] =
                          _labels[index + 1] || it.children[0];
                        setData(_data);
                        setIndex(t => t + 1);
                      } else {
                        onConfirm(labels);
                      }
                      /**
                       * 模仿京东，一级分类的处理
                       * 如果点的分类是已选分类，后面数组不变化
                       * 如果选别的分类，二级联动刚处理过，则重置三级分类
                       */
                      if (index == 0 && it.id != labels[0].id) {
                        _labels = _labels.slice(0, 2);
                      }
                      setLabels(_labels);
                    }}>
                    <Text
                      style={
                        it.name == labels[index].name
                          ? [styles.textActiveItem, activeItemTextStyle]
                          : [styles.textInactiveItem, inactiveItemTextStyle]
                      }>
                      {it.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            );
          }}
          onSnapToItem={setIndex}
          itemWidth={useScreenSize()}
          sliderWidth={useScreenSize()}
        />
        <View style={{height: x.ui.useHomeIndicatorHeight()}} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  viewModal: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  views: {
    height: useScreenSize(),
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  viewItem: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  textActiveItem: {
    fontSize: useDip(16),
    color: x.ui.useMaterialDesignColor.blue.dark,
  },
  textInactiveItem: {
    fontSize: useDip(16),
    color: 'grey',
  },
  textTabActive: {
    fontSize: useDip(18),
    fontWeight: 'bold',
    color: x.ui.useMaterialDesignColor.blue.dark,
  },
  textTabInactive: {
    fontSize: useDip(16),
    color: '#333',
  },
  textTitle: {
    fontSize: useDip(18),
    color: '#333',
    fontWeight: 'bold',
    marginVertical: 6,
    alignSelf: 'center',
  },
  viewTabs: {
    alignItems: 'flex-end',
    height: useDip(44),
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
});

export default BossZhipinSelector;