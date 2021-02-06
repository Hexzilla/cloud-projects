<template>
  <v-container tag="section">
    <base-material-card
    color="green"
    >
    <template v-slot:heading>
        <div class="display-1 font-weight-light">
            Leave Balance
        </div>
    </template>
      <v-card class="d-flex flex-row-reverse" flat tile>
        <div>
          <v-btn
            class="mx-4"
            color="pink"
            text
            @click="addCategory"
          >
            New Category
          </v-btn>
          <v-btn
            class="px-2"
            color="primary"
            elevation="10"
            @click="saveAll"
            :disabled="saveBtnStatus"
          >
            Save
          </v-btn>
        </div>
      </v-card>

      <v-card flat tile>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          class="mb-2"
          single-line
          flat
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
      </v-card>

      <v-progress-linear
        v-if="loading"
        indeterminate
        color="green"
      ></v-progress-linear>

      <!--Add, Edit dialog-->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  :counter="maxNameLength"
                  :rules="nameRules"
                  v-model="editName"
                  label="Name"
                  required
                ></v-text-field>
                <v-select
                  v-if="isLevel1"
                  :items="roles"
                  :rules="roleRules"
                  v-model="selectedRole"
                  item-text="name"
                  item-value="id"
                  label="Role"
                ></v-select>
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
            <v-btn :disabled="!valid" color="blue darken-1" text @click="save">
              Save as draft
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Treeview -->
      <v-treeview
        v-model="tree"
        :search="search"
        :open="initiallyOpen"
        :items="items"
        item-key="ikey"
        activatable
      >
        <template v-slot:prepend="{ item }">
          <v-icon v-if="item.level < 4" color="green" @click="addTask(item)">
            mdi-playlist-plus
          </v-icon>
        </template>
        <template v-slot:append="{ item }">
          <v-icon v-if="item.ikey != 0" color="green" @click="editTask(item)">
            mdi-playlist-edit
          </v-icon>
        </template>
      </v-treeview>
    </base-material-card>

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
import api from "@/apis/task.js";
import roleApi from "@/apis/role.js";

export default {
  data: () => ({
    loading: true,
    uniqueTreeId: 0,
    initiallyOpen: ["public"],
    items: [],
    dialog: false,
    tree: [],
    search: null,
    maxNameLength: 60,
    actionMode: "",
    selectedItem: null,
    editName: "",
    valid: false,
    roles: [],
    selectedRole: null,
    snack: false,
    snackColor: "success",
    snackText: "",
    saveBtnStatus: true,
  }),

  computed: {
    filter() {
      return undefined;
    },
    formTitle() {
      let parent
      this.items && this.items.length > 0 && this.selectedItem && (parent = this.findParent(this.items))
      if (this.actionMode === "add_category") return "New Category";
      return this.actionMode === "add_task" ? this.selectedItem && "New Task (Level " + (this.selectedItem.level + 1) + " )" : (this.selectedItem && this.selectedItem.level == 0 ? "Edit Category" : parent && parent.name);
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
      return [(v) => !!v || "Role is required"]
    },
    isLevel1() {
      if (this.selectedItem && this.actionMode === "add_task" && this.selectedItem.level == 0 || this.selectedItem && this.actionMode === "edit_task" && this.selectedItem.level == 1)
        return true
      return false
    }
  },

  created: async function () {
    this.items = await api.findAll();
    this.uniqueTreeId = this.setUniqueId(this.items)
    console.log("uniqueTreeId:", this.uniqueTreeId, this.items)

    this.roles = await roleApi.findAll();
    console.log("roles:", this.roles)

    this.loading = false;
  },

  methods: {
    addCategory() {
      this.actionMode = "add_category";
      this.editName = "";
      this.openDialog();
    },

    addTask(item) {
      console.log("addTask", item);
      this.actionMode = "add_task";
      this.editName = "";
      this.selectedItem = item;
      this.selectedRole = null
      this.openDialog();
    },

    editTask(item) {
      console.log("editTask", item);
      this.actionMode = "edit_task";
      this.editName = item.name;
      this.selectedItem = item;
      console.log("editTask", this.editName);

      if(item.level == 1)
        this.selectedRole = item.roleid
      this.openDialog();
    },

    openDialog() {
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
      this.valid = true;
      this.dialog = true;
    },

    setUniqueId(_items) {
      let iMaxKey = 0
      for (const i in _items) {
        const data = _items[i]
        iMaxKey = Math.max(data.ikey, iMaxKey)
        if (data.hasOwnProperty("children")) {
          const iChildKey = this.setUniqueId(data.children)
          iMaxKey = Math.max(iMaxKey, iChildKey)
        }
      }
      return iMaxKey
    },

    nextId(_items) {
      return 1 + _items.reduce((accumulator, item) => Math.max(accumulator, item.id), 0)
    },

    uniqueId() {
      this.uniqueTreeId++;
      return this.uniqueTreeId;
    },

    setItemUserActionState(_items, _userAction) {
      for (const i in _items) {
        const data = _items[i]
        data.userAction = _userAction
        if (data.hasOwnProperty("children")) {
          this.setItemUserActionState(data.children, _userAction)
        }
      }
    },

    getChangeState(_items) {
      for (const i in _items) {
        const data = _items[i]
        if (data.userAction != "nochange") {
          return true
        }
        if (data.hasOwnProperty("children")) {
          if (this.getChangeState(data.children)) {
            return true;
          }
        }
      }
      return false
    },

    createCategory() {
      return {
        id: this.nextId(this.items),
        ikey: this.uniqueId(),
        name: this.editName,
        level: 0,
        dataClass: 'Category',
        userAction: 'newData',
        children: [],
      };
    },

    createTask() {
      //this.selectedItem.userAction = "modified"
      const level = this.selectedItem.level + 1
      let tazk = {
        id: this.nextId(this.selectedItem.children),
        ikey: this.uniqueId(),
        name: this.editName,
        level: level,
        activeFlag: 1,
        dataClass: 'Task-Level-' + level,
        userAction: 'newData',
        children: [],
      };
      if (level == 1) {
        tazk["roleid"] = this.selectedRole
      }
      return tazk
    },

    async saveAll() {
      if (this.getChangeState(this.items) == false) {
        return
      }
      this.loading = true     
      const saved = await api.update(this.items);
      this.show_snack(saved)
      if (saved) {
        this.setItemUserActionState(this.items, "nochange")
        this.saveBtnStatus = true
      }
      console.log("saveAll", saved);
      this.loading = false
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }

      if (this.actionMode === "add_category") {
        const category = this.createCategory()
        console.log("save.category", category)
        this.items.push(category);
      } 
      else if (this.actionMode === "add_task") {
        const tazk = this.createTask()
        console.log("save.tazk", tazk)
        this.selectedItem.children = [...this.selectedItem.children, tazk];
      } 
      else {
        this.selectedItem.userAction = "modified"
        this.selectedItem.name = this.editName;
        if (this.selectedItem.level && this.selectedItem.level == 1)
          this.selectedItem.roleid = this.selectedRole
        console.log("save.edit.tazk", this.selectedItem)
      }
      this.saveBtnStatus = false
      this.close();
    },

    close() {
      this.dialog = false
      this.selectedItem = null
      this.selectedRole = null
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

    findParent(items) {
      if (this.selectedItem && items && items.length > 0) {
        for (const i in items) {
          const result = this.searchChildren(items[i])
          if (result) {
            return result
          } else {
            const ret = this.findParent(items[i].children)
            if (ret) {
              return ret
            }
          }
        }
      }
      return null
    },

    searchChildren(item) {
      let result = null
      item.children && item.children.length > 0 && (result = item.children.find( e => e.ikey == this.selectedItem.ikey))
      if (result)
        return item
      return result
    }
  },
};
</script>
