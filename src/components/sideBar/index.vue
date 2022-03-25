<template>
  <div class="layout">
    <el-menu
      active-text-color="#ffd04b"
      background-color="#424f63"
      class="side-bar"
      text-color="#fff"
      router
      :default-active="activeMenu"
    >
      <router-link to="/" custom v-slot="{ navigate }">
        <div class="logo-wrapper" @click="navigate">
          <img src="@/assets/imgs/logo.png" />
          超级推广后台管理
        </div>
      </router-link>

      <template v-for="route in menuList" :key="route.path">
        <el-menu-item v-if="!route.children" :index="route.path">
          <el-icon>
            <component :is="route.meta.icon" />
          </el-icon>
          <span>{{ route.meta.title }}</span>
        </el-menu-item>
        <el-sub-menu v-else :index="route.path">
          <template #title>
            <el-icon>
              <component :is="route.meta.icon" />
            </el-icon>
            <span>{{ route.meta.title }}</span>
          </template>
          <el-menu-item
            v-for="subRoute in route.children"
            :key="route.path + subRoute.path"
            :index="route.path + '/' + subRoute.path"
          >
            <el-icon>
              <component :is="subRoute.meta.icon" />
            </el-icon>
            <span>{{ subRoute.meta.title }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { mainRouter } from "@/router/routes"
const route = useRoute()
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
const menuList = computed(
  () => mainRouter.children
)

onMounted(() => {
  // console.log('menuList:', menuList.value)
})
</script>


<style lang="scss" scoped>
.layout {
  width: 100vw;
  height: 100vh;
  .side-bar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 200px;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 6px;
      background-color: #eee;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #c1c1c1;

      &:hover {
        background-color: #a8a8a8;
      }

      &:active {
        background-color: #787878;
      }
    }
    & {
      scrollbar-width: thin;
      scrollbar-color: #c1c1c1 #eee;
    }

    // height: 100vh;
    .logo-wrapper {
      // background-color: #fff;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      margin: 20px 0 10px;
      img {
        width: 35px;
        height: 35px;
      }
    }
  }
  .main {
    margin-left: 200px;
    bottom: 0;
    overflow: auto;
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>