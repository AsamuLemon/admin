<template>
  <side-bar></side-bar>
  <router-view />
</template>

<script setup>
import SideBar from './components/sideBar/index.vue'
</script>

<style lang="scss">
body {
  margin: 0;
  height: 100vh;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f5f5f3;
  display: flex;
  height: 100%;
}
</style>
