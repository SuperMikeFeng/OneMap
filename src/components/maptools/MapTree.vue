<template>
    <div class="maptree-pannel" v-show="this.$store.getters._getDefaultMapTreeVisible">
        <div class="maptree-header">
            <span>图层管理</span>
            <i class="el-icon-close" @click="closeMapTreePannel"></i>
        </div>
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from '@/components/config/config.js';
const option = {
    url: 'https://js.arcgis.com/4.26/init.js',
    css: 'https://js.arcgis.com/4.26/esri/themes/light/main.css',
};
export default {
    data() {
        return {
            data: [
                {
                    label: '底图数据',
                    children: [
                        {
                            label: '暖色系图层',
                            layerid: 'layerid',
                            layerurl: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetWarm/MapServer',
                        },
                        {
                            label: '灰色系图层',
                            layerid: 'layerid',
                            layerurl: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer',
                        },
                    ],
                },

                {
                    label: '行政区划数据',
                    children: [
                        {
                            label: '省数据',
                            layerid: 'layerid',
                            layerurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/basemap_province_mercator/FeatureServer',
                        },
                        {
                            label: '市数据',
                            layerid: 'layerid',
                            layerurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/MapService_city_mercator/FeatureServer',
                        },
                        {
                            label: '县数据',
                            layerid: 'layerid',
                            layerurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/Service/FeatureServer',
                        },
                    ],
                },
                {
                    label: '业务数据',
                    children: [
                        {
                            label: '高等教育学院',
                            layerid: 'layerid',
                            layerurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/service2/FeatureServer',
                        },
                        {
                            label: '火车站数据(2000)',
                            layerid: 'layerid',
                            layerurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/trainStation_2000/FeatureServer',
                        },
                        {
                            label: '火车站数据(墨卡托)',
                            layerid: 'layerid',
                            layerurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/trainSations_2000_mkt/FeatureServer',
                        },
                        {
                            label: '卷帘分析 top',
                            layerid: 'swipeLayerTop',
                            layerurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHProvince_WebMokatuo/FeatureServer',
                        },
                        {
                            label: '卷帘分析 bottom',
                            layerid: 'swipeLayerBottom',
                            layerurl: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/XZQHCity_WebMokatuo/FeatureServer',
                        },
                    ],
                },
            ],
            defaultProps: {
                children: 'children',
                label: 'label',
            },
        };
    },
    methods: {
        async handleNodeClick(data) {
            console.log(data);
            if (data.layerurl) {
                // 删除已添加到的数据
                const view = this.$store.getters._getDefaultMapView; // 通过vuex获取view
                const resultLayer = view.map.findLayerById(data.layerid);
                if (resultLayer) view.map.remove(resultLayer);
                console.log(view);
                const [TileLayer, FeatureLayer] = await loadModules(['esri/layers/TileLayer', 'esri/layers/FeatureLayer'], config.options);
                const c = data.layerurl.split('/');
                const serverType = c[c.length - 1];
                console.log(serverType);
                let layer = '';
                switch (serverType) {
                    case 'MapServer':
                        layer = new TileLayer({ url: data.layerurl, id: data.layerid });
                        break;
                    case 'FeatureServer':
                        layer = new FeatureLayer({ url: data.layerurl, id: data.layerid });
                        console.log(layer);
                        break;
                    default:
                        break;
                }
                view.map.add(layer);
            }
        },
        closeMapTreePannel() {
            // const currentVisible = this.$store.getters._getDefaultMapTreeVisible;
            this.$store.commit('_setDefaultMapTreeVisible', false);
        },
    },
};
</script>

<style scoped>
.maptree-pannel {
    position: absolute;
    top: 60px;
    right: 20px;
    width: 313px;
    background-color: #fff;
}
.maptree-header {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
    padding: 0 5px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}
.maptree-header > span {
    line-height: 35px;
    font-size: 16px;
    font-weight: 600;
}
.maptree-header > i {
    line-height: 35px;
    cursor: pointer;
}
</style>
