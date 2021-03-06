<template>
  <v-app id="dayspan" v-cloak>

    <calendarApp ref="cal"
      :calendar="calendar"
      :read-only="readOnly"
    >

      <template slot="eventPopover" slot-scope="slotData">
        <ds-calendar-event-popover
         v-bind="slotData"
         :read-only="readOnly"
        >
          <template slot="eventPopoverToolbarActions" slot-scope="{calendarEvent, calendar, slotData, labels, styleButton}">
          </template>

          <template slot="eventPopoverNotifications" slot-scope="{slotData, details}">
            <div v-for="n in parseNotify(details.notify)">
              <v-list-tile-title>
                {{ n }}
              </v-list-tile-title>
            </div>
          </template>

        </ds-calendar-event-popover>
      </template>

      <template slot="eventCreatePopover" slot-scope="{placeholder, calendar, close}">
        <ds-calendar-event-create-popover
          :calendar-event="placeholder"
          :calendar="calendar"
          :close="$refs.cal.$refs.calendar.clearPlaceholder"
          @create-edit="$refs.cal.editPlaceholder"
        >
        </ds-calendar-event-create-popover>
      </template>

      <template slot="schedule" slot-scope="{calendarEvent, details, isReadOnly, labels, day, readOnly, schedule}">
        <ds-schedule
          :schedule="schedule"
          :day="day"
          :read-only="readOnly"
        ></ds-schedule>
        <notification
          :notify="details.notify"
        ></notification>
      </template>

      <template slot="eventTimeTitle" slot-scope="{calendarEvent, details}">
        <div>
          <v-icon class="ds-ev-icon"
            v-if="details.icon"
            size="14"
            :style="{color: details.forecolor}">
            {{ details.icon }}
          </v-icon>
          <strong class="ds-ev-title">{{ details.title }}</strong>
        </div>
        <div class="ds-ev-description">{{ getCalendarTime( calendarEvent ) }}</div>
      </template>

      <template slot="drawerPicker">
      </template>

    </calendarApp>

  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import * as moment from 'moment'
import notification from '@/components/Notification'
import calendarApp from '@/components/Calendar/CalendarApp'
import { DateTime as LuxonDateTime } from 'luxon'

export default {

  name: 'calReadOnly',
  components: {
    notification,
    calendarApp
  },
  data: vm => ({
    storeKey: 'dayspanState',
    readOnly: true,
    currentLocale: vm.$dayspan.setLocale('pt')
  }),
  computed: mapState({
    calendar: state => state.events.calendar,
    usersActive: state => state.users.usersActive
  }),
  methods: {
    getCalendarTime (calendarEvent) {
      let sa = calendarEvent.start.format('a')
      let ea = calendarEvent.end.format('a')
      let sh = calendarEvent.start.format('h')
      let eh = calendarEvent.end.format('h')

      if (calendarEvent.start.minute !== 0) {
        sh += calendarEvent.start.format(':mm')
      }

      if (calendarEvent.end.minute !== 0) {
        eh += calendarEvent.end.format(':mm')
      }

      return (sa === ea) ? (sh + ' - ' + eh + ea) : (sh + sa + ' - ' + eh + ea)
    },

    setLocale (code) {
      moment.lang(code)

      this.$dayspan.setLocale(code)
      this.$dayspan.refreshTimes()

      this.$refs.cal.$forceUpdate()
    },

    // Always 2 digit
    formatNumber (number) {
      return ('0' + number).slice(-2)
    },

    parseNotify (notifs) {
      var notifsParsed = notifs.map(n => {
        let dt = LuxonDateTime.fromISO(n)
        return this.formatNumber(dt.day) + '/' +
               this.formatNumber(dt.month) + '/' +
               dt.year + ' - ' +
               this.formatNumber(dt.hour) + ':' +
               this.formatNumber(dt.minute) + 'h'
      })
      return notifsParsed
    }
  }
}
</script>

<style scoped>
body, html, #cal, #dayspan {
  font-family: Roboto, sans-serif !important;
  width: 100%;
  height: 100%;
}
</style>

<style>
.v-toolbar--clipped {
  position: relative;
}

.v-toolbar__content, .v-toolbar__extension {
  top: 0;
  position: sticky;
  width:100%;
  left: 0;
}

.v-content {
  position:absolute;
  top: 0;
  left: 0;
}

.v-content__wrap {
  z-index: 3;
}

.v-menu__content {
  position:fixed;
}

.application--wrap {
  height: 100%;
  min-height: 400px;
}

.v-toolbar {
  position: relative;
}

.v-content {
  position:absolute;
  top: 0;
  left: 0;
}

.v-menu__activator { 
  position: relative;
}

.v-btn--flat .v-text-field--solo .v-input__slot {
  background-color: #f5f5f5 !important;
  margin-bottom: 8px !important;
  margin-top: 0px !important;
}
</style>
