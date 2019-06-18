<template>
  <div>
    <FormGoal />
    <ListGoals />
  </div>
</template>

<script>
import FormGoal from './FormGoal'
import ListGoals from './ListGoals'

export default {
  name: 'Goals',
  components: {
    FormGoal,
    ListGoals
  },
  created () {
    this.$store.dispatch('habits/getGoalTypes')
    this.$store.dispatch('habits/getGoals')
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
