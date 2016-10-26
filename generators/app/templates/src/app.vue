<template>
  <div id="container">
    <transition name="fade" mode="out-in" appear>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
}
</script>

<style src="styles/app"></style>
