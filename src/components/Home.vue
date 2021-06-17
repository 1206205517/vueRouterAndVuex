<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p @click="$store.commit('add')">counter: {{$store.state.counter}}</p>
    <p @click="$store.dispatch('add')">counter: {{$store.state.counter}}</p>
    <p>{{$store.getters.doubleCounter}}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>

</style>
