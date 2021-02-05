<template>
  <v-container id="regular-tables" tag="section">
    
    <base-material-card
      color="green"
    >
      <template v-slot:heading>
        <div class="display-1 font-weight-light">
          Role List
        </div>
      </template>
      <v-row>
        <v-col class="px-0 ">
          <v-container>
            <v-progress-linear
                indeterminate
                color="primary"
                v-if="loading">
            </v-progress-linear>
          </v-container>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="d-flex flex-row-reverse" flat tile>
            <v-btn
              color="pink"
              class="mb-2"
              text
              @click="addItem"
            >
              New
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-for="(item, i) in roleTypes" :key="i">
          <p class="text-center mb-0 py-2 body-1 font-weight-bold" style="background-color: #EC407A; color:white">{{ item }}</p>
          <v-data-table
            :headers="headers"
            :items="filteredItems(clients, item)"
            :search="search"
            :hide-default-header="true"
            sort-by="id"
          >
                <!--
            <template v-slot:top>
              <v-container>
                <div flat tile>
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </div>
              </v-container>
            </template>
                -->

            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small disabled @click="deleteItem(item)"> mdi-delete </v-icon>
            </template>
            <template v-slot:item.name="props">
              <v-edit-dialog large @save="updateItemName(props.item)" @open="inlineEditedName = props.item.name">
                <div>{{ props.item.name }}</div>
                <template v-slot:input>
                  <div class="mt-4 title">Update Name</div>
                  <v-text-field
                    v-model="inlineEditedName"
                    :rules="nameRules"
                    :counter="maxNameLength"
                    label="Edit"
                    single-line
                    autofocus
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </base-material-card>

    <!--Add Dialog Begin-->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="editedItem.name"
                  :counter="maxNameLength"
                  :rules="nameRules"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-select
                  v-model="editedItem.roleType"
                  :items="roleTypes"
                  :rules="roleRules"
                  label="Role Type"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
          <v-btn :disabled="!valid" color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Add Dialog End-->

    <!--Delete Dialog Begin-->
    <v-dialog v-model="dialogDelete" max-width="600px">
      <v-card>
        <v-card-title class="headline"
          >Are you sure you want to delete this item?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--Delete Dialog End-->
    <!--
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
      </template>
    </v-snackbar>
    -->
    
    <base-material-snackbar
      v-model="snack"
      :type="snackColor"
      v-bind="{
        bottom: true,
        center: true,
        color: snackColor
      }"
    >
      {{ snackText }}
    </base-material-snackbar>

  </v-container>
</template>

<script>
import api from "@/apis/role.js";

export default {
  data: () => ({
    loading: true,
    snack: false,
    snackColor: "success",
	  snackText: "",
	  valid: true,
    maxNameLength: 100,
    inlineEditedName: "",
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Name",
        align: "start",
        value: "name",
        class: "body-1"
      },
      { text: "Actions", align: "right", value: "actions", sortable: false, class: "body-1" },
    ],
    clients: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      roleType: ""
    },
    defaultItem: {
      name: "",
      roleType: ""
    },
    roleTypes: [],

    snackbar: true
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add Role" : "Edit Role";
    },
    nameRules() {
      return [
        (v) => !!v || "Name is required",
        (v) => (v && v.trim().length > 0) || "Name is required",
        (v) =>
        (v && v.length <= this.maxNameLength) ||
        `Name must be less than ${this.maxNameLength} characters`,
      ];
    },
    roleRules() {
      return [
        (v) => !!v || "Role is required",
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created: async function () {
    await this.initialize()
  },

  methods: {
    async initialize() {
      this.loading = true
      this.clients = await api.findAll()
      this.roleTypes = await api.findAllRoles()
      this.loading = false;
    },

    addItem() {
      this.openAddDialog()
    },

    editItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.openAddDialog()
    },
    
    openAddDialog() {
      if (this.$refs.form) {
          this.$refs.form.resetValidation();
      }
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.clients.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.clients.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async updateItemName(item) {
      this.inlineEditedName = this.inlineEditedName.trim()
      console.log("updateItemName", this.inlineEditedName)
      if (this.inlineEditedName.length > 0 && this.inlineEditedName.length <= this.maxNameLength) {
        this.loading = true
        {
          const updatedItem = Object.assign({}, item, {name: this.inlineEditedName})
          console.log(updatedItem)
          const success = await api.update(updatedItem) 
          if (success) {
            Object.assign(item, updatedItem);
          }
          this.show_snack(success)
        }
        this.loading = false
      }
    },

    async save() {
      if (!this.$refs.form.validate()) {
          return;
      }	

      this.editedItem.name = this.editedItem.name.trim()
      
      const selectedIndex = this.editedIndex
      const item = Object.assign({}, this.editedItem)
      this.close();

      this.loading = true
      {
        let success = false
        if (selectedIndex > -1) {
          success = await api.update(item) 
          if (success) {
            Object.assign(this.clients[selectedIndex], item);
          }
        } 
        else {
          const addedItem = await api.add(item)
          if (addedItem) {
            success = true
            this.clients.push(addedItem);
          }
        }
        this.show_snack(success)
      }
      this.loading = false
    },

    show_snack(success) {
      this.snack = true;
      if (success) {
        this.snackColor = "success"
        this.snackText = "Data saved"
      }
      else {
        this.snackColor = "error";
        this.snackText = "Error";
      }
    },

    filteredItems(clients, item) {
      const filtered = clients.filter(e=> e.roleType == item)
      return filtered
    }
  },
};
</script>
