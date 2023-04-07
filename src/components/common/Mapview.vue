<template>
    <div class="container">
        <div id="mapView"></div>
        <div id="basemapToggle"></div>
        <div id="scaleBar"></div>
        <div id="zoom"></div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader'
const option = {
  url: 'https://js.arcgis.com/4.18/init.js',
  css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css'
}
export default {
  //   name: 'Mapview',
  components: {},
  mounted: function () {
    this.initMapView()
  },
  methods: {
    async initMapView () {
      const [Map, MapView, Basemap, TileLayer, BasemapToggle, ScaleBar, Zoom] = await loadModules(
        ['esri/Map', 'esri/views/MapView', 'esri/Basemap', 'esri/layers/TileLayer', 'esri/widgets/BasemapToggle', 'esri/widgets/ScaleBar', 'esri/widgets/Zoom'],
        option
      )
      const basemap = new Basemap({
        baseLayers: [
          new TileLayer({
            url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer', // 发布的瓦片地图
            title: 'Basemap'
          })
        ],
        title: 'basemap',
        id: 'basemap'
      })
      const map = new Map({
        basemap // ES6写法：basemap:basemap
      })
      const mapView = new MapView({
        container: 'mapView',
        map: map,
        zoom: 15,
        center: [114.426435, 23.122741]
      })
      // 实例化地图切换控件
      const basemapToggle = new BasemapToggle({
        view: mapView,
        nextBasemap: 'hybrid',
        container: 'basemapToggle'
      })
      mapView.ui.add(basemapToggle)
      // 实例化比例尺
      const scaleBar = new ScaleBar({
        view: mapView,
        unit: 'metric', // 比例尺单位
        container: 'scaleBar'
      })
      mapView.ui.add(scaleBar)

      // 实例化缩放控件
      const zoom = new Zoom({
        view: mapView,
        container: 'zoom'
      })
      mapView.ui.add(zoom)
      mapView.ui.components = [] // 取消默认组件
      this.$store.commit('_setDefaultMapView', mapView)
    }
  }
}
</script>

<style scoped>
.container {
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}
#mapView {
    position: absolute;
    width: 100%;
    height: 100%;
}
#basemapToggle {
    position: absolute;
    right: 15px;
    bottom: 15px;
}
#scaleBar{
  position: absolute;
  left: 15px;
  bottom: 15px;
}
#zoom {
  position: absolute;
  top: 15px;
  left: 15px;
}
</style>
