<template>
    <el-container class="home-container">
        <el-header>一张图综合管理系统</el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="togglr-button" @click="toggleCollapse">|||</div>
                <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" :collapse-transition="false" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-user-solid"></i>
                            <span>用户</span>
                        </template>
                        <el-menu-item index="1-1">
                            <i class="el-icon-menu"></i>
                            <span>选项1</span>
                        </el-menu-item>
                        <el-menu-item index="1-2">
                            <i class="el-icon-menu"></i>
                            <span>选项2</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>导航</span>
                        </template>
                        <el-menu-item index="2-1">
                            <i class="el-icon-menu"></i>
                            <span>选项1</span>
                        </el-menu-item>
                        <el-menu-item index="2-2">
                            <i class="el-icon-menu"></i>
                            <span>选项2</span>
                        </el-menu-item>
                        <el-menu-item index="2-3">
                            <i class="el-icon-menu"></i>
                            <span>选项3</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-s-data"></i>
                            <span>导航</span>
                        </template>
                        <el-menu-item index="3-1">
                            <i class="el-icon-menu"></i>
                            <span>选项1</span>
                        </el-menu-item>
                        <el-menu-item index="3-2">
                            <i class="el-icon-menu"></i>
                            <span>选项2</span>
                        </el-menu-item>
                        <el-menu-item index="3-3">
                            <i class="el-icon-menu"></i>
                            <span>选项3</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <Mapview></Mapview>
                <Maptools></Maptools>
                <MapTree/>
                <Navigation/>
                <result-table/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import Mapview from '@/components/common/Mapview.vue';
import MapTree from '@/components/maptools/MapTree.vue';
import Maptools from '@/components/maptools/Maptools.vue';
import Navigation from '@/components/maptools/Navigation.vue'
import ResultTable from '@/components/maptools/ResultsTable.vue'
import { Result } from 'element-ui';
export default {
    name: 'HomePage',
    components: {
        Mapview,
        Maptools, 
        MapTree,
        Navigation,
        ResultTable
    },
    data() {
        return {
           isCollapse: false, 
        };
    },
    methods:{
      toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }  
    }
};
</script>

<style scoped>
.home-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.el-header {
    height: 70px !important;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 25px;
    color: #fff;
}
.el-aside {
  background-color: #333744;
}
.el-aside .el-menu {
  border-right: none;
}
.el-aside .togglr-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-main {
    position: relative;
    background-color: #eaedf1;
    padding: 0px !important;
}
.el-menu-item {
    margin-left: 30px;
}
</style>
