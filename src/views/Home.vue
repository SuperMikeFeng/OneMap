<template>
    <el-container class="home-container">
        <el-header>一张图系统</el-header>
        <el-container>
            <el-aside width="200px">侧边栏区域</el-aside>
            <el-main>
                <MapviewVue></MapviewVue>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import MapviewVue from '@/components/common/Mapview.vue'
export default {
  name: 'HomePage',
  components: {
    MapviewVue
  }
}
</script>

<style>
.home-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.el-header {
    height: 70px !important;
    background-color: pink;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    padding-bottom: 7px;
}
.el-aside {
    background-color:green;
}

.el-main {
    background-color: #eaedf1;
    padding: 0px !important;
}
</style>
