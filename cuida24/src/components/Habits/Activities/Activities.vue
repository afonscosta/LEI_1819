<template>
  <div>
    <FormActivity />
    <ListActivities />
  </div>
</template>

<script>
import FormActivity from './FormActivity'
import ListActivities from './ListActivities'

export default {
  name: 'Activities',
  components: {
    FormActivity,
    ListActivities
  },
  created () {
    this.$store.dispatch('habits/getPhysicalActivities')
    this.$store.dispatch('habits/getSocialLeisures')
    this.$store.dispatch('habits/getIndivLeisures')
  }
}
</script>

<style>
.notif-success {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 10px 20px;
  background: #E8F9F0;
  border: 2px solid #D0F2E1;
}

.notif-error {
  margin: 10px;
  margin-bottom: 0;
  border-radius: 3px;
  padding: 10px 20px;
  background: #F9E8E8;
  border: 2px solid #FCF2F2;
}

.notification-title {
  letter-spacing: 1px;
  font-size: 17px;
  text-align: center;
}

.v-fade-top-enter-active,
.v-fade-top-leave-active,
.v-fade-ltopmove {
  transition: all .5s;
}
.v-fade-top-enter,
.v-fade-top-leave-to {
  opacity: 0;
  transform: translateY(-500px) scale(0.2);
}
.vdatetime-input {
  width: 100%;
}
</style>
