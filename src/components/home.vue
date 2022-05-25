<template>
    <el-container class="home-container">
    <el-header>
     <div>
      <img src="../assets/logo.png" alt="" style="width:30px;">
      <span>电商后台管理系统</span>
     </div>
      <el-button type='info' @click="logout">退出</el-button></el-header>
    <el-container>
      <el-aside :width= "isCollapse ? '64px': '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu :default-active="activePath" router :collapse-transition="false" :collapse = isCollapse unique-opened background-color="#545c64" text-color="#fff" active-text-color="#409eff">
          <el-sub-menu :index="item.path + ''" v-for="item in menulist" :key="item.id">
            <template #title>
              <el-icon><location-filled /></el-icon>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item  :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template #title>
                <el-icon><map-location /></el-icon>
                     <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main><router-view/></el-main>
    </el-container>
  </el-container>
</template>
<script>
import router from '@/router/index.js'
import { ElMessage } from 'element-plus'
export default {
  data () {
    return {
      menulist: [],
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    logout () {
      window.sessionStorage.clear()
      router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$axios.get('http://127.0.0.1:8888/api/private/v1/menus')
      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.el-header {
  background-color:rgb(44, 38, 38) ;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: aliceblue;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color:rgb(58, 54, 54) ;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: rgb(204, 204, 204) ;
}
.home-container {
  height: 100%;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
