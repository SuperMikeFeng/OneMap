<template>
    <div id="mapView"></div>
</template>

<script>
import { loadModules } from 'esri-loader'
const option = {
  url: 'https://js.arcgis.com/4.26/init.js',
  css: 'https://js.arcgis.com/4.26/esri/themes/light/main.css'
}
export default {
  //   name: 'Mapview',
  components: {},
  mounted: function () {
    this.initMapView()
  },
  methods: {
    async initMapView () {
      const [Map, MapView] = await loadModules(['esri/Map', 'esri/views/MapView'], option)
      const map = new Map({
        basemap: 'osm'
      })
      const view = new MapView({
        container: 'mapView',
        map: map,
        zoom: 10,
        center: [114.426435, 23.122741]
      })
      view.ui.components = [] // 取消默认组件
      console.log(view)
    }
  }
}
</script>

<style scope>
#mapView {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
