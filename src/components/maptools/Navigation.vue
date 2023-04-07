<template>
    <div class="maptree-pannel" v-show="this.$store.getters._getDefaultXZQHVisible">
        <div class="maptree-header">
            <span>行政区划导航</span>
            <i class="el-icon-close" @click="closePanel"></i>
        </div>
        <span>省份：</span>
        <el-select v-model="provinceValue" slot="prepend" clearable placeholder="请选择省份" @change="handleProvinceValueChange">
            <el-option v-for="item in provinceOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <div class="city_panel">
            <tbody>
                <tr v-for="item in cityAndCountyOptions" :key="item.label">
                    <td style="min-width: 50px">
                        <span class="city-item" :value="item.value" @click="handleItemClick(item.value, 'city')">
                            <el-tag type="success" class="city">{{ item.label }}</el-tag>
                        </span>
                    </td>
                    <td>
                        <span class="county-item" v-for="item2 in item.children" :key="item2.attributes.name" :value="item2.attributes.code" @click="handleItemClick(item2.attributes.code, 'county')">
                            <el-tag type="info" class="county">{{ item2.attributes.name }}</el-tag>
                        </span>
                    </td>
                </tr>
            </tbody>
        </div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import config from '@/components/config/config';
export default {
    data() {
        return {
            provinceOptions: [],
            provinceValue: '',
            cityAndCountyOptions: [],
            graphic:''
        };
    },
    mounted() {
        this.getProvinceData();
    },
    methods: {
        closePanel() {
            // let currentVisible1 = this.$store.getters._getDefaultXZQHVisible;
            this.$store.commit('_setDefaultXZQHVisible', false);
        },
        async getProvinceData() {
            const _self = this;
            const [QueryTask, Query] = await loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query'], config.options);
            const queryTask = new QueryTask({
                url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/basemap_province_mercator/FeatureServer/0',
            });
            let query = new Query();
            query.returnGeometry = false;
            query.outFields = ['*'];
            query.where = '1=1';

            //Promise then 链式调用   // 不要用链式调用
            let results = await queryTask.execute(query);
            let currentData = [];
            if (results.features.length > 0) {
                results.features.map((item) => {
                    currentData.push({
                        value: item.attributes.FIRST_GID, // 地理编码
                        label: item.attributes.name, // 名字
                    });
                });
                _self.provinceOptions = currentData;
            } else {
                _self.$message({
                    message: '暂时没有省份数据',
                    type: 'warning',
                });
            }
        },
        handleProvinceValueChange(value) {
            this.getCityAndCountyData(value);
        },
        async getCityAndCountyData(value) {
            const provinceCode = value.toString().substring(0, 2);
            const [QueryTask, Query] = await loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query'], config.options);
            const queryTask = new QueryTask({
                url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/MapService_city_mercator/FeatureServer/0',
            });
            let query = new Query();
            query.returnGeometry = false;
            query.outFields = ['*'];
            query.where = "Code like '" + provinceCode + "%'";

            const results = await queryTask.execute(query);
            const currentCityArry = [];
            if (results.features.length > 0) {
                results.features.map((item) => {
                    currentCityArry.push({
                        value: item.attributes.code,
                        label: item.attributes.name,
                    });
                });
                Promise.all(
                    currentCityArry.map(async (item2) => {
                        const cityCode = item2.value.toString().substring(0, 4);
                        const queryTask2 = new QueryTask({
                            url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/Service/FeatureServer/0',
                        });
                        let query2 = new Query();
                        query2.returnGeometry = false;
                        query2.outFields = ['*'];
                        query2.where = "Code like '" + cityCode + "%'";

                        const result2 = await queryTask2.execute(query2);
                        item2.children = result2.features;
                        // console.log(result2.features);
                        return item2;
                    }),
                ).then((res) => {
                    this.cityAndCountyOptions = res;
                });
            } else {
                this.$message({
                    message: '获取县市局数据失败',
                    type: 'warning',
                });
            }
        },
        async handleItemClick(val, type) {
            let serverUrl = '';
            let code = '';
            const view = this.$store.getters._getDefaultMapView;
            if (type === 'city') {
                code = val.toString().substring(0, 4);
                serverUrl = 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/MapService_city_mercator/FeatureServer/0';
            } else if (type === 'county') {
                code = val.toString().substring(0, 6);
                serverUrl = 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/Service/FeatureServer/0';
            }
            const [QueryTask, Query, Graphic] = await loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query', 'esri/Graphic'], config.options);
            const queryTask = new QueryTask({
                url: serverUrl,
            });
            const query = new Query();
            query.returnGeometry = true;
            query.outFields = ['*'];
            query.where = "Code like '" + code + "%'";
            let results = await queryTask.execute(query);
            console.log(query);


            // 渲染和定位
            let featuresResult = results.features[0];
            console.log(featuresResult.geometry.extent.center.longitude,featuresResult.geometry.extent.center.latitude);
            if (this.graphic) {
                view.graphics.remove(this.graphic);
            }
            const fillSymbol = {
                type: 'simple-fill',
                color: [188, 240, 234, 0.1],
                outline: {
                    color: '#00FFFF',
                    width: 2,
                },
            };
            const graphic = new Graphic({
                geometry: featuresResult.geometry,
                symbol: fillSymbol,
            });
            this.graphic = graphic
            view.graphics.add(graphic);
            view.goTo({
                center: [featuresResult.geometry.extent.center.longitude, featuresResult.geometry.extent.center.latitude],
                zomm: 10,
            });
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
    font-size: 18px;
    font-weight: 600;
}
.maptree-header > i {
    line-height: 35px;
    cursor: pointer;
}
.maptree-pannel > span {
    font-size: 16px;
    font-weight: 500;
    margin-left: 5px;
}
.city_panel {
    width: 100%;
    height: 300px;
    overflow: auto;
    padding: 0 5px;
    box-sizing: border-box;
}
.county {
    margin: 5px 5px 0 0;
}
</style>
