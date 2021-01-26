<template>
    <v-menu
      ref="thiz"
      v-model="pickerOpened"
      :close-on-content-click="false"
      :return-value.sync="selectedDate"
      transition="scale-transition"
      offset-y
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          :value="date"
          :label="textName"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
          required
          :rules="dateRules"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="selectedDate"
        :value="date"
        :allowed-dates="allowedDates"
        no-title
        scrollable
      >
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          @click="pickerOpened = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="save"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-menu>
</template>

<script>
export default {
  name: 'DatePicker',
  props: [ 'date', 'textName', 'submit', 'startDate', 'endDate' ,'type'],

  data: () => ({
    pickerOpened: false,
    selectedDate: '',
  }),

  created() {
  },

  computed: {
    dateRules() {
      if (this.type == "birth") {
        return [
          (v) => !!v || `${this.textName} is required`,
          (v) => v < '2005-01-01' || 'age > 15'
        ]

      } else if (this.type == "optional") {
        return []        
      } else {
        return [(v) => !!v || `${this.textName} is required`]
      }
    },
  },

  methods: {
    save: function() {
      console.log('this.submit', this.selectedDate)
      this.submit(this.selectedDate)
      this.pickerOpened = false
    },
    allowedDates: function(val) {
      if (this.startDate) {
        return Date.parse(val) >= Date.parse(this.startDate)
      }
      if (this.endDate) {
        return Date.parse(val) <= Date.parse(this.endDate)
      }
      return true
    },
  }
};
</script>
