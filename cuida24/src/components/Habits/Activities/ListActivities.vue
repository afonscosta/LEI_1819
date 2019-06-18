<template>
  <b-container>
    <b-row>
      <b-col>
        <ListPhysicalActivities />
      </b-col>
      <b-col>
        <ListSocialLeisures />
      </b-col>
      <b-col>
        <ListIndivLeisures />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ListPhysicalActivities from './PhysicalActivities/ListPhysicalActivities'
import ListSocialLeisures from './SocialLeisure/ListSocialLeisures'
import ListIndivLeisures from './IndividualLeisure/ListIndivLeisures'

export default {
  name: 'ListActivities',
  components: {
    ListPhysicalActivities,
    ListSocialLeisures,
    ListIndivLeisures
  }
}
</script>
