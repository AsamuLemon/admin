<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#424f63"
    class="side-bar"
    text-color="#fff"
    router
    :default-active="activeMenu"
  >
    <div class="logo-wrapper">
      <img src="@/assets/imgs/logo.png" />
      超级推广后台管理
    </div>
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
</template>

<script setup>
import { computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { routes } from "@/router/routes"
const route = useRoute()
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
const menuList = computed(
  () => routes.filter(item => item.path !== "")
)
window.routes = routes

onMounted(() => {
  console.log('menuList:',menuList.value)
})

// return { activeMenu, menuList }
</script>


<style lang="scss" scoped>
.logo-wrapper {
  // background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  img {
    width: 35px;
    height: 35px;
  }
}
.side-bar {
  display: inline-block;
  width: 200px;
}
</style>