<template>
  <div id="wrapper">
    <navbar></navbar>
    <div id="page-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Navbar from './components/navbar';

  export default {
    components: {
      Navbar,
    },
  };
</script>

<style>
</style>
