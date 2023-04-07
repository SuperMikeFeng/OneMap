<template>
    <div class="maptools-view">
        <span class="maptools-item" @click="handleMaptoolsItemClick" id="xzqh">行政区导航</span>
        <span class="maptools-item" @click="handleMaptoolsItemClick" id="maptree">图层管理</span>
        <span class="maptools-item" @click="handleMaptoolsItemClick" id="distanceMeasurement">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">地图测量<i class="el-icon-arrow-down el-icon--right"></i> </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-plus" command="distance">距离测量</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-crop" command="area">面积测量</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-edit" command="diymeasurement_distance">自定义测量(长度)</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-edit" command="diymeasurement_area">自定义测量(面积)</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </span>
        <span class="maptools-item" id="areaMeasurement">
            <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">更多功能<i class="el-icon-arrow-down el-icon--right"></i> </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-search" command="spacequery">空间查询</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-film" command="morescreen">多屏对比</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-reading" command="swipanalyst">卷帘分析</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-picture-outline" command="printmap">地图打印</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-view" command="openPopup">开启图层弹窗</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </span>
        <span class="maptools-item" @click="handleMaptoolsItemClick" id="clearScreen">清屏</span>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from '@/components/config/config';
import images from '@/assets/icon/train.png';
export default {
    data() {
        return {
            isClick: '',
            graphicsLayer: '',
        };
    },
    methods: {
        handleMaptoolsItemClick(e) {
            if (this.isClick === '') {
                this.isSwitch(e.target.id);
                this.isClick = e.target.id;
            } else if (e.target.id !== this.isClick) {
                this.isSwitch(this.isClick);
                this.isClick = e.target.id;
                this.isSwitch(this.isClick);
            } else {
                this.isSwitch(this.isClick);
                this.isClick = '';
            }
        },
        isSwitch(id) {
            switch (id) {
                case 'xzqh':
                    this.openXZQHPannel();
                    break;
                case 'maptree':
                    this.openMapTreePannel();
                    break;
                case 'distanceMeasurement':
                    break;
                case 'areaMeasurement':
                    break;
                case 'clearScreen':
                    break;
                default:
                    break;
            }
        },
        handleCommand(command) {
            switch (command) {
                case 'distance':
                    this.initDistanceMap();
                    break;
                case 'spacequery':
                    this.initSpaceQuery();
                    break;
            }
        },

        openXZQHPannel() {
            let currentVisible1 = this.$store.getters._getDefaultXZQHVisible;
            this.$store.commit('_setDefaultXZQHVisible', !currentVisible1);
        },
        openMapTreePannel() {
            let currentVisible2 = this.$store.getters._getDefaultMapTreeVisible;
            this.$store.commit('_setDefaultMapTreeVisible', !currentVisible2);
        },

        // 初始化空间查询
        async initSpaceQuery() {
            console.log('点击了空间查询');
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;
            // 绘制面状区域  Graphic, GraphicsLayer用来存放绘制的点线面形状(轮廓区域存放于Graphic)
            const [SketchViewModel, Graphic, GraphicsLayer] = await loadModules(['esri/widgets/Sketch/SketchViewModel', 'esri/Graphic', 'esri/layers/GraphicsLayer'], config.options);

            const resultLayer = view.map.findLayerById('polygonGraphicLayer');
            if (resultLayer) view.map.remove(resultLayer);

            console.log('11111111111111');

            const graphicsLayer = new GraphicsLayer({
                // 实例化一个图层
                id: 'polygonGraphicLayer',
                elevationInfo: {
                    mode: 'on-the-ground',
                },
            });
            console.log('实例化图层成功');

            view.map.add(graphicsLayer); // 地图添加实例化图层
            console.log('地图添加实例化图层成功');

            const polygonSymbol = {
                // 实例化渲染样式
                type: 'simple-fill',
                color: 'rgba(216,30,6, 0.4)',
                style: 'solid',
                outline: {
                    color: '#d81e06',
                    width: 1,
                },
            };
            const sketchViewModel = new SketchViewModel({
                // 实例化sketchViewModel
                // 绘制能空间查询的sketchViewModel与skect model(不能空间查询)
                updateOnGraphicClick: false,
                view, // view:view  es6
                layer: graphicsLayer,
                polygonSymbol,
            });
            sketchViewModel.create('polygon'); // 指定方法：绘制面状区域
            sketchViewModel.on('create-complete', function (event) {
                // 监听绘制
                const graphic = new Graphic({
                    geometry: event.geometry,
                    symbol: sketchViewModel.graphic.symbol,
                });
                graphicsLayer.add(graphic);
                console.log('图层添加绘制数据成功');
                console.log(graphic);
            });

            sketchViewModel.on('create', function (event) {
                if (event.state === 'complete') {
                    // event.state === 'complete'代表鼠标双击
                    // console.log(graphicsLayer);
                    // console.log(event);
                    console.log(event.graphic);

                    //2、执行空间查询
                    _self.handleSpaceQuery(event.graphic); // 定义handleSpaceQuery空间查询函数
                }
            });
        },
        // 空间查询
        handleSpaceQuery(graphic) {
            console.log('执行空间查询功能成功');
            const _self = this;
            const view = _self.$store.getters._getDefaultMapView;

            const resultLayer = view.map.findLayerById('layerid'); // 行政区划数据的id
            if (!resultLayer) {
                // 没有业务图层
                _self.$message({
                    message: '尚未添加业务图层，不能进行空间查询',
                    type: 'warning',
                });
                return;
            }
            const queryPoint = resultLayer.createQuery(); // 查询要素
            queryPoint.geometry = graphic.geometry; // 绘制的面状图层与业务图层进行绑定_赋值
            console.log(queryPoint.geometry);
            resultLayer
                .queryFeatures(queryPoint) // 传值
                .then(function (results) {
                    console.log('查询的结果是' + results);
                    // 拿到的结果results
                    let currentData = [];
                    if (results.features.length > 0) {
                        console.log('查询的数量是：' + results.features.length);
                        //符号化渲染图层
                        _self.renderResultLayer(results.features); // 实例化点击弹窗
                        //实例化表格数据
                        results.features.map((item, index) => {
                            // 遍历
                            console.log(item);
                            currentData.push({
                                name: item.attributes.name,
                                privince: item.attributes.privince,
                                address: item.attributes.address,
                                lon: item.attributes.longitude,
                                lat: item.attributes.latitude,
                                key: index,
                            });
                        });
                    } else {
                        currentData.length = 0;
                    }
                    _self.$message({
                        message: `查询成功，共查到 ${results.features.length} 条数据`,
                        type: 'success',
                    });
                    console.log('查询结果是：' + currentData);
                    _self.$store.commit('_setDefaultQueryResult', currentData); // 传值去store然后去表格
                    _self.$store.commit('_setDefaultQueryResultVisible', true); // 面板显示
                })
                .catch(function (error) {
                    console.log(error);
                    _self.$message.error('空间查询失败，请联系管理员');
                });
        },
        async renderResultLayer(resultFeatures) {
            const view = this.$store.getters._getDefaultMapView;
            const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer'], config.options);

            const resultLayer = view.map.findLayerById('initResultLayer'); // 绑定图层
            if (resultLayer) view.map.remove(resultLayer); // 移除第二次查询移除上次的图层

            const resultData = this.translateLonLat(resultFeatures); // 转换数据
            //实例化弹窗
            let template = {
                title: '{name}-{tieluju}',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: [
                            {
                                fieldName: 'name',
                                label: '名称',
                            },
                            {
                                fieldName: 'longitude',
                                label: '经度',
                            },
                            {
                                fieldName: 'latitude',
                                label: '纬度',
                            },
                            {
                                fieldName: 'address',
                                label: '地址',
                            },
                        ],
                    },
                ],
            };
            const queryResultLayer = new FeatureLayer({    
                source: resultData, 
                id: 'initResultLayer',
                objectIdField: 'ObjectID',
                renderer: {
                    type: 'simple', // autocasts as new SimpleRenderer()
                    symbol: {
                        type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
                        url: images,
                        width: '16px',
                        height: '16px',
                    },
                },
                fields: [
                    {
                        name: 'OBJECTID',
                        type: 'oid',
                    },
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'longitude',
                        type: 'string',
                    },
                    {
                        name: 'latitude',
                        type: 'string',
                    },
                    {
                        name: 'address',
                        type: 'string',
                    },
                ],
                popupTemplate: template,   // 弹窗
            });
            view.map.add(queryResultLayer);
        },
        //处理经纬度数据，返回features
        translateLonLat(data) {
            console.log('开始转换数据');
            const _self = this;
            if (data.length > 0) {
                _self.geoData = [];
                data.map((value, key) => {
                    _self.geoData.push({
                        geometry: {
                            type: 'point',
                            x: Number(value.attributes.longitude), // 经度
                            y: Number(value.attributes.latitude), // 纬度
                        },
                        attributes: {
                            ObjectID: key + 1,
                            name: value.attributes.name,
                            province: value.attributes.province,
                            address: value.attributes.address,
                            longitude: value.attributes.longitude,
                            latitude: value.attributes.latitude,
                        },
                    });
                });
            }

            return _self.geoData;
        },
    },
};
</script>

<style scoped>
.maptools-view {
    position: absolute;
    padding: 0 15px;
    height: 30px;
    top: 20px;
    right: 15px;
    background-color: #fff;
}
.maptools-item {
    line-height: 30px;
    margin-left: 15px;
    color: #606266;
    font-size: 14px;
    cursor: pointer;
}

.maptools-item:first-child {
    margin-left: 0;
}
</style>
