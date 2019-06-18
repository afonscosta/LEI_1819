<template>
  <b-container>
    <b-row>
      <b-col>
        <FormPhysicalActivity />
      </b-col>
      <b-col>
        <FormSocialLeisure />
      </b-col>
      <b-col>
        <FormIndivLeisure />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import FormPhysicalActivity from './PhysicalActivities/FormPhysicalActivity'
import FormSocialLeisure from './SocialLeisure/FormSocialLeisure'
import FormIndivLeisure from './IndividualLeisure/FormIndivLeisure'

export default {
  name: 'FormActivity',
  components: {
    FormPhysicalActivity,
    FormSocialLeisure,
    FormIndivLeisure
  }
}
</script>
