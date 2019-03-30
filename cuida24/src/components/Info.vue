<template>
  <h3>Página de páginas informativas</h3>
</template>

<script>
import { Slide } from 'vue-burger-menu'

export default {
  name: 'Info',
  components: {
    Slide
  },
  props: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

img {
  width: 250px;
}

</style>
