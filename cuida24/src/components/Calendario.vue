<template>
  <v-app id="dayspan" v-cloak>

    <ds-calendar-app ref="cal"
      :calendar="calendar"
      :read-only="readOnly"
      @event-create="addEvent"
      @event-update="updateEvent"
      @event-remove="deleteEvent"
    >

      <template slot="title">
        Cuida24
      </template>

      <template slot="menuRight">
        <v-btn icon large href="/">
          <v-avatar size="32px" tile>
            <img src="@/assets/logo-IADem.png" alt="Cuida24">
          </v-avatar>
        </v-btn>
      </template>

      <template slot="eventPopover" slot-scope="slotData">
        <ds-calendar-event-popover
         v-bind="slotData"
         :read-only="readOnly"
        >
          <template slot="eventPopoverToolbarActions" slot-scope="{calendarEvent, calendar, slotData, labels, styleButton}">
            <ds-schedule-actions
             slot="activator"
             v-bind="slotData"
             :schedule="calendarEvent.schedule"
             :calendar-event="calendarEvent"
             :calendar="calendar"
             :labels="labels"
             @event-update="updateEvent"
             @event-remove="deleteEvent"
            >
              <v-btn icon dark :style="styleButton">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </ds-schedule-actions>
          </template>
        </ds-calendar-event-popover>
      </template>

      <template slot="eventCreatePopover" slot-scope="{placeholder, calendar, close}">
        <ds-calendar-event-create-popover
          :calendar-event="placeholder"
          :calendar="calendar"
          :close="$refs.cal.$refs.calendar.clearPlaceholder"
          @create-edit="$refs.cal.editPlaceholder"
          @event-create="addEvent"
        ></ds-calendar-event-create-popover>
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

      <template slot="drawerBottom">
        <v-container fluid>
          <v-layout wrap align-center>
            <v-flex xs12>
              <v-checkbox box
                label="Read Only?"
                v-model="readOnly"
              ></v-checkbox>
            </v-flex>
            <v-flex xs12>
              <v-select
                label="Language"
                :items="locales"
                v-model="currentLocale"
                @input="setLocale"
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </template>

    </ds-calendar-app>

  </v-app>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import { Weekday, Month } from 'dayspan'
import * as moment from 'moment'

export default {

  name: 'cal',

  computed: mapState({
    calendar: state => state.calendar.calendar
  }),

  created () {
    this.$store.dispatch('calendar/getEvents')
  },

  mounted () {
    window.cal = this.$refs.cal

    this.loadState()
  },

  methods:
  {
    ...mapActions('calendar', ['addEvent', 'updateEvent', 'deleteEvent']),
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

    saveState () {
      let state = this.calendar.toInput(true)
      let json = JSON.stringify(state)
      this.addEvent(state)
      localStorage.setItem(this.storeKey, json)
    },

    loadState () {
      let state = {}

      try {
        let savedState = this.calendar

        if (savedState) {
          state = savedState
          state.preferToday = false
        }
      } catch (e) {
        // eslint-disable-next-line
        console.log( e )
      }

      if (!state.events || !state.events.length) {
        state.events = this.defaultEvents
      }

      state.events.forEach(ev => {
        let defaults = this.$dayspan.getDefaultEventDetails()

        ev.data = Vue.util.extend(defaults, ev.data)
      })

      this.$refs.cal.setState(state)
    }
  },

  data: vm => ({
    storeKey: 'dayspanState',
    // calendar: Calendar.months(),
    // calendar: Calendar.months(undefined,undefined,undefined,{
    //   fill: true,
    //   updateRows: true
    // }),
    readOnly: false,
    currentLocale: vm.$dayspan.setLocale('pt'),
    locales: [
      { value: 'en', text: 'English' },
      { value: 'fr', text: 'French' },
      { value: 'nl', text: 'Dutch' },
      { value: 'ca', text: 'Catalan' },
      { value: 'pt', text: 'Português' }
    ],
    defaultEvents: [
      {
        data: {
          title: 'Weekly Meeting',
          color: '#3F51B5'
        },
        schedule: {
          dayOfWeek: [Weekday.MONDAY],
          times: [9],
          duration: 30,
          durationUnit: 'minutes'
        }
      },
      {
        data: {
          title: 'First Weekend',
          color: '#4CAF50'
        },
        schedule: {
          weekspanOfMonth: [0],
          dayOfWeek: [Weekday.FRIDAY],
          duration: 3,
          durationUnit: 'days'
        }
      },
      {
        data: {
          title: 'End of Month',
          color: '#000000'
        },
        schedule: {
          lastDayOfMonth: [1],
          duration: 1,
          durationUnit: 'hours'
        }
      },
      {
        data: {
          title: 'Mother\'s Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.MAY],
          dayOfWeek: [Weekday.SUNDAY],
          weekspanOfMonth: [1]
        }
      },
      {
        data: {
          title: 'New Year\'s Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.JANUARY],
          dayOfMonth: [1]
        }
      },
      {
        data: {
          title: 'Inauguration Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.JANUARY],
          dayOfMonth: [20]
        }
      },
      {
        data: {
          title: 'Martin Luther King, Jr. Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.JANUARY],
          dayOfWeek: [Weekday.MONDAY],
          weekspanOfMonth: [2]
        }
      },
      {
        data: {
          title: 'George Washington\'s Birthday',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.FEBRUARY],
          dayOfWeek: [Weekday.MONDAY],
          weekspanOfMonth: [2]
        }
      },
      {
        data: {
          title: 'Memorial Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.MAY],
          dayOfWeek: [Weekday.MONDAY],
          lastWeekspanOfMonth: [0]
        }
      },
      {
        data: {
          title: 'Independence Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.JULY],
          dayOfMonth: [4]
        }
      },
      {
        data: {
          title: 'Labor Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.SEPTEMBER],
          dayOfWeek: [Weekday.MONDAY],
          lastWeekspanOfMonth: [0]
        }
      },
      {
        data: {
          title: 'Columbus Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.OCTOBER],
          dayOfWeek: [Weekday.MONDAY],
          weekspanOfMonth: [1]
        }
      },
      {
        data: {
          title: 'Veterans Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.NOVEMBER],
          dayOfMonth: [11]
        }
      },
      {
        data: {
          title: 'Thanksgiving Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.NOVEMBER],
          dayOfWeek: [Weekday.THURSDAY],
          weekspanOfMonth: [3]
        }
      },
      {
        data: {
          title: 'Christmas Day',
          color: '#2196F3',
          calendar: 'US Holidays'
        },
        schedule: {
          month: [Month.DECEMBER],
          dayOfMonth: [25]
        }
      }
    ]
  })
}
</script>

<style>

body, html, #cal, #dayspan {
  font-family: Roboto, sans-serif !important;
  width: 100%;
  height: 100%;
}

.v-menu__activator { position: relative; }
.v-btn--flat,
.v-text-field--solo .v-input__slot {
  background-color: #f5f5f5 !important;
  margin-bottom: 8px !important;
}

</style>
