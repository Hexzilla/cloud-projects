<template>
  <v-container tag="section">
    <v-card icon="mdi-file-tree" title="Task List" class="px-5 py-2">
      <v-card class="d-flex flex-row-reverse" flat tile>
        <div>
          <v-btn
            class="mx-4"
            color="primary"
            dark
            @click="addCategory"
          >
            New Category
          </v-btn>
          <v-btn
            class="px-2"
            color="primary"
            dark
            @click="saveAll"
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
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
            <v-btn :disabled="!valid" color="blue darken-1" text @click="save">
              Save
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
    </v-card>
  </v-container>
</template>

<script>
import api from "@/apis/task.js";

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
  }),

  computed: {
    filter() {
      return undefined;
    },
    formTitle() {
      if (this.actionMode === "add_category") return "New Category";
      return this.actionMode === "add_task" ? "New Task" : "Edit Task";
    },
    nameRules() {
      return [
        (v) => !!v || "Name is required",
        (v) => v.trim().length > 0 || "Name is required",
        (v) =>
          (v && v.length <= this.maxNameLength) ||
          `Name must be less than ${this.maxNameLength} characters`,
      ];
    },
  },

  created: async function () {
    this.items = await api.findAll();
    this.uniqueTreeId = this.setUniqueId(this.items)
    console.log("uniqueTreeId:", this.uniqueTreeId, this.items)
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
      this.openDialog();
    },

    editTask(item) {
      console.log("editTask", item);
      this.actionMode = "edit_task";
      this.editName = item.name;
      this.selectedItem = item;
      console.log("editTask", this.editName);
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
        tazk["roleid"] = 10
      }
      return tazk
    },

    async saveAll() {
      if (this.getChangeState(this.items) == false) {
        return
      }
      this.loading = true     
      const saved = await api.update(this.items);
      if (saved) {
        this.setItemUserActionState(this.items, "nochange")
      }
      console.log("saveAll", saved);
      this.loading = false
    },

    save() {
      if (!this.$refs.form.validate()) {
        return;
      }
      this.close();

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
        console.log("save.edit.tazk", this.selectedItem)
      }
    },

    close() {
      this.dialog = false;
    },
  },
};
</script>
