<template>
	<v-app id="dayspan" v-cloak>
		<ds-calendar-app :calendar="calendar"></ds-calendar-app>
	</v-app>
</template>

<script>
import DaySpanVuetify from 'dayspan-vuetify'
import { Calendar } from 'dayspan';

export default {
	components: {
		DaySpanVuetify
	},
	name: 'Calendario',
	data: () => ({
		calendar: Calendar.months()
	}),
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

body, html, #app, #dayspan {
  font-family: Roboto, sans-serif;
  width: 100%;
  height: 100%;
}
</style>
