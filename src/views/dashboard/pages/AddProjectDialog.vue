<template>
    <!--Add project dialog-->
    <v-card>
      <v-card-title>
        <span class="headline">{{formTitle}}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="projectForm" lazy-validation>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  :counter="maxNameLength"
                  v-model="project.prj_name"
                  :rules="projectNameRules"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  :counter="maxCodeLength"
                  v-model="project.prj_code"
                  :rules="projectCodeRules"
                  label="Code"
                  class="input-uppercase"
                  required
                  @keydown.space.prevent
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-select
                  v-model="project.cl_id"
                  :items="clientList"
                  :rules="clientSelectRules"
                  label="Client"
                  required
                  dense
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <DatePicker
                  textName="Pre sale date from"
                  :date="this.project.prj_presalesopendate"
                  :submit="(date) => this.project.prj_presalesopendate = date"
                  :endDate="this.project.prj_presalesclosedate"
                ></DatePicker>
              </v-col>
              <v-col>
                <DatePicker
                  textName="Pre sale date to"
                  :date="this.project.prj_presalesclosedate"
                  :submit="(date) => this.project.prj_presalesclosedate = date"
                  :startDate="this.project.prj_presalesopendate"
                ></DatePicker>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <DatePicker
                  textName="Billing date from"
                  :date="this.project.prj_executionopendate"
                  :submit="(date) => this.project.prj_executionopendate = date"
                  :endDate="this.project.prj_executionclosedate"
                ></DatePicker>
              </v-col>
              <v-col>
                <DatePicker
                  textName="Billing date to"
                  :date="this.project.prj_executionclosedate"
                  :submit="(date) => this.project.prj_executionclosedate = date"
                  :startDate="this.project.prj_executionopendate"
                ></DatePicker>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <DatePicker
                  textName="Warranty date from"
                  :date="this.project.prj_warrantyopendate"
                  :submit="(date) => this.project.prj_warrantyopendate = date"
                  :endDate="this.project.prj_warrantyclosedate"
                ></DatePicker>
              </v-col>
              <v-col>
                <DatePicker
                  textName="Warranty date to"
                  :date="this.project.prj_warrantyclosedate"
                  :submit="(date) => this.project.prj_warrantyclosedate = date"
                  :startDate="this.project.prj_warrantyopendate"
                ></DatePicker>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
        <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
import DatePicker from './DatePicker'

export default {
  name: 'AddProjectDialog',
  props: {
    clients: Array,
    project: Object,
    edit: Boolean,
  },
  components: {
    DatePicker,
  },

  data: () => ({
    clientList: [],
    maxNameLength: 200,
    maxCodeLength: 20,
    preSaleFromMenu: false,
    preSaleToMenu: false,
    billingFromMenu: false,
    billingToMenu: false,
    warrantyFromMenu: false,
    warrantyToMenu: false,
  }),

  mounted: function() {
    this.clientList = this.clients.map((it) => {
      return {
        text: it.code,
        value: it.id,
        disabled: false,
      }
    })
  },

  computed: {
    formTitle() {
      return (this.edit) ? 'Edit Project' : 'Add Project'
    },
    projectNameRules() {
      return [
        (v) => !!v || "Name is required",
        (v) => v.trim().length > 0 || "Name is required",
        (v) =>
          (v && v.length <= this.maxNameLength) ||
          `Name must be less than ${this.Length} characters`,
      ]
    },
    projectCodeRules() {
      return [
        (v) => !!v || "Code is required",
        (v) => /[a-zA-Z0-9]+$/.test(v) || 'Code must only contain letters',
        (v) =>
          (v && v.length <= this.maxCodeLength) ||
          `Code must be less than ${this.Length} characters`,
      ];
    },
    clientSelectRules() {
      return [
        (v) => !!v || "Client is required"
      ];
    }
  },

  methods: {
    reset: function() {
      this.$refs.projectForm.resetValidation();
    },

    save: function() {
      if (this.$refs.projectForm.validate()) {
        this.project.prj_code = this.project.prj_code.trim().toUpperCase();

        this.$emit('save', {
          project: Object.assign({}, this.project),
          edit: this.edit,
        })

        this.reset()
      }
    },

    close: function() {
      this.$emit('close')
      this.reset()
    },
  }
};
</script>
