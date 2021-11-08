import F6 from '@antv/f6';
import { wrapContext } from '../../../common/utils/context';
import data from './data';
import CircularLayout from '@antv/f6/dist/extends/layout/circularLayout';
import { Bundling } from '@antv/f6-plugin';

F6.registerLayout('circular', CircularLayout);

/**
 * basicArcDiagram
 */
Page({
  canvas: null,
  ctx: null,
  renderer: '', // mini、mini-native等，F6需要，标记环境
  isCanvasInit: false, // canvas是否准备好了
  graph: null,

  data: {
    width: 375,
    height: 600,
    pixelRatio: 2,
    forceMini: false,
  },

  onLoad() {
    // 同步获取window的宽高
    const { windowWidth, windowHeight, pixelRatio } = my.getSystemInfoSync();

    this.setData({
      width: windowWidth,
      height: windowHeight,
      pixelRatio,
    });
  },

  /**
   * 初始化cnavas回调，缓存获得的context
   * @param {*} ctx 绘图context
   * @param {*} rect 宽高信息
   * @param {*} canvas canvas对象，在render为mini时为null
   * @param {*} renderer 使用canvas 1.0还是canvas 2.0，mini | mini-native
   */
  handleInit(ctx, rect, canvas, renderer) {
    this.isCanvasInit = true;
    this.ctx = wrapContext(ctx);
    this.renderer = renderer;
    this.canvas = canvas;
    this.updateChart();
  },

  /**
   * canvas派发的事件，转派给graph实例
   */
  handleTouch(e) {
    this.graph && this.graph.emitEvent(e);
  },

  updateChart() {
    const { width, height, pixelRatio } = this.data;

    const edgeBundling = new Bundling({
      bundleThreshold: 0.1,
    });

    // 创建F6实例
    this.graph = new F6.Graph({
      context: this.ctx,
      renderer: this.renderer,
      container: this.canvas,
      pixelRatio,
      width,
      height,
      linkCenter: true,
      fitView: true,
      modes: {
        default: ['zoom-canvas', 'drag-canvas'],
      },
      layout: {
        type: 'circular',
        center: [width / 2, height / 2],
        radius: height / 2.5,
        ordering: null,
      },
      plugins: [edgeBundling],
      defaultNode: {
        size: [20, 20],
        color: 'steelblue',
      },
      defaultEdge: {
        size: 1,
        color: '#999',
      },
    });

    this.graph.data(data);
    this.graph.render();
    // this.graph.fitView();
    setTimeout(() => {
      edgeBundling.bundling(data);
    }, 1000);
  },
});
