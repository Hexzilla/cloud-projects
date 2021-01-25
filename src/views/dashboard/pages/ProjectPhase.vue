<template>
    <v-container class="px-0 py-0">
        <v-card>
            <v-progress-linear
                indeterminate
                color="teal darken-2"
                v-if="wait">
            </v-progress-linear>
            <v-card-title>
                <v-row>
                    <v-col class="pb-0" md="6">
                        <p class="subtitle-1 mb-0"><b>{{ `Phase ${this.phase.phaseNumber}` }}</b></p>
                        <p class="title mb-0 text--disabled" @click="openPhaseEditDialog">
                            {{ `${this.phase.phase_opendate} ~ ${this.phase.phase_closedate}` }}
                        </p>
                    </v-col>
                    <v-col class="pb-0" md="3">
                        <v-btn small @click="openTreeDialog()" color="teal">Add Task</v-btn>
                    </v-col>
                    <v-col class="pb-0 text-right" md="3">
                        <v-btn small @click="saveTask()" color="teal">Save Task</v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-row>
                <v-col>
                    <v-treeview
                        class="mt-5"
                        :open="initiallyOpen"
                        :items="phase.tree"
                        :search="searchName"
                        :filter="filterTreeItems"
                        :open-all="true"
                        item-key="ikey"
                        activatable>
                        <template v-slot:prepend="{ item }">
                            <v-icon v-if="item.level == 0" color="teal">mdi-cube</v-icon>
                            <v-icon v-if="item.level == 1" color="teal">mdi-numeric-1-box-outline</v-icon>
                            <v-icon v-if="item.level == 2" color="teal">mdi-numeric-2-box-outline</v-icon>
                            <v-icon v-if="item.level == 3" color="teal">mdi-numeric-3-box-outline</v-icon>
                            <v-icon v-if="item.level == 4" color="teal">mdi-numeric-4-box-outline</v-icon>
                        </template>
                        <template v-slot:label="{ item }">
                            <v-row>
                                <v-col cols="12" sm="12" md="8">
                                    <p class="subtitle-1 mb-0">{{ item.name }}</p>
                                    <p v-if="item.level > 0" class="title mb-0 text--disabled">
                                        {{ item.description || 'You can input task description.' }}
                                    </p>
                                </v-col>
                                <v-col cols="12" sm="12" md="4">
                                    <p v-if="item.level == 1" class="title mb-0 text--disabled">
                                        {{ `${item.info.est_MP_TL1_datefrom} ~ ${item.info.est_MP_TL1_dateto}` }}
                                    </p>
                                </v-col>
                            </v-row>
                        </template>
                        <template v-slot:append="{ item }">
                            <v-icon v-if="item.level > 0"
                                class="mr-8"
                                color="purple"
                                @click="openTaskEditDialog(item)"
                            >mdi-square-edit-outline</v-icon>
                        </template>
                    </v-treeview>
                </v-col>
            </v-row>
        </v-card>

        <!-- Add tree dialog -->
        <v-dialog v-model="treeDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Tasks</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-form ref="treeForm" lazy-validation>
                            <v-treeview
                                v-model="dialogTreeSelected"
                                :open="initiallyOpen"
                                :items="treeItems"
                                item-key="ikey"
                                selectable
                            >
                            </v-treeview>
                        </v-form>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeTreeDialog">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveTreeDialog">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Task date dialog-->
        <v-dialog v-model="taskDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Task Date</span>
                </v-card-title>
                <v-card-text>
                    <v-container v-if="editTask != null">
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field
                                    v-model="editTask.name"
                                    prepend-icon="mdi-book-lock-outline"
                                    label="Name"
                                    readonly
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field
                                    v-model="editTask.description"
                                    prepend-icon="mdi-alpha-d-circle-outline"
                                    label="Description"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="6">
                                <v-menu
                                    ref="taskFromMenu"
                                    v-model="taskFromMenu"
                                    :close-on-content-click="false"
                                    :return-value.sync="editTask.datefrom"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="editTask.datefrom"
                                            label="Date From"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker v-model="editTask.datefrom" no-title scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="taskFromMenu = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.taskFromMenu.save(editTask.datefrom)">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-menu
                                    ref="taskToMenu"
                                    v-model="taskToMenu"
                                    :close-on-content-click="false"
                                    :return-value.sync="editTask.dateto"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="editTask.dateto"
                                            label="Date To"
                                            prepend-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker 
                                        v-model="editTask.dateto" 
                                        no-title 
                                        scrollable>
                                        <v-spacer></v-spacer>
                                        <v-btn text color="primary" @click="taskToMenu = false">Cancel</v-btn>
                                        <v-btn text color="primary" @click="$refs.taskToMenu.save(editTask.dateto)">OK</v-btn>
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeTaskEditDialog">
                        Cancel
                    </v-btn>
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="saveTaskEditDialog"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!--Edit Phase Date Dialog-->
        <v-dialog v-model="phaseDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Phase</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <DatePicker
                                textName="Date From"
                                :date="phase.phase_opendate"
                                :submit="(date) => phase.phase_opendate = date"
                                :endDate="phase.phase_closedate"
                            ></DatePicker>
                        </v-row>
                        <v-row>
                            <DatePicker
                                textName="Date To"
                                :date="phase.phase_closedate"
                                :submit="(date) => phase.phase_closedate = date"
                                :startDate="phase.phase_opendate"
                            ></DatePicker>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closePhaseEditDialog"> Cancel </v-btn>
                    <v-btn :disabled="phaseValid" color="blue darken-1" text @click="savePhaseEditDialog">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import moment from 'moment'
import api from "@/apis/project.js"
import apiTasks from "@/apis/task.js"
import DatePicker from './DatePicker'

export default {
    name: "ProjectPhase",
    props: ["phase", "treeItems"],
    components: {
        DatePicker,
    },

    data: () => ({
        wait: false,
        treeDialog: false,
        initiallyOpen: ["public"],
        dialogTreeSelected: [],
        taskFromMenu: false,
        taskToMenu: false,
        taskDialog: false,
        editPhaseDateDialog: false,
        editTask: null,
        searchName: "1",
        unitOfMeasureItems: ['Nos', 'Item'],
    }),

    computed: {
        filterTreeItems() {
            return (item, search, textKey) => (item.state && item.state != 'remove')
        },
        taskValid() {
            return true;
        }
    },

    created: function() {
        
        
        this.initialize()
    },

    //TODO
    //category.est_MP_categ_id                  // unique_category_id
    //category.est_MP_categ_phaseid             // unique_phase_id
    //category.est_MP_categ_taskCategoryID      // id in task_category_list

    methods: {
        phaseTitle() {
            // (${this.phase.phase_opendate} ~ ${this.phase.phase_closedate})
            return `Phase ${this.phase.phaseNumber}`
        },

        initialize() {
            if (!this.phase.serverItems) {
                this.phase.serverItems = []
            }

            console.log('initialize_phase:', this.phase)
            console.log('initialize_phase_serverItems:', this.phase.serverItems)
            
            this.phase.tree = this.cloneTaskTree(this.treeItems)
            this.phase.tree = this.setDefaultValues(this.phase.tree)
            console.log('initialize_phase_tree:', this.phase.tree)
        },

        //----------------------mangae task list -------------------------------------
        cloneTaskTree(items) {
            return items.map((item) => {
                const node = { 
                    task: item, 
                    id: item.id,
                    name: item.name, 
                    ikey: item.ikey,
                    level: item.level,
                    datefrom: '',
                    dateto: '',
                    description: '', //'You can input task description.',
                    unitOfMeasure: 'Nos',
                    quantity: 0,
                    children: [],
                }
                const serverItem = this.findServerItem(item)
                if (serverItem) {
                    node.state = "nochange"
                }
                if (item.children && item.children.length > 0) {
                    node.children = this.cloneTaskTree(item.children)
                }
                return node
            })
        },

        getDefaultTask(level) {
            if (level == 0) {
                return {
                    ph_phaseNumber: this.phase.phaseNumber,
                    est_MP_categ_id: 0,
                    est_MP_categ_phaseid: 0,
                    est_MP_categ_taskCategoryID: 0,
                    taskCateg_name: '',
                    children_cnt: 0,
                }
            }
            if (level == 1) {
                 return {
                    est_MP_TL1_id: 0,
                    est_MP_TL1_level1taskid: 0,
                    est_MP_TL1_level1taskDesc: '',
                    est_MP_TL1_datefrom: '',
                    est_MP_TL1_dateto: '',
                    est_MP_TL1_unitOfMeasure: 'Nos',
                    est_MP_TL1_qty: 0
                }
            }
            if (level == 2) {
                 return {
                    est_MP_TL2_id: 0,
                    est_MP_TL2_level2taskid: 0,
                    TL2_name: '',
                    est_MP_TL2_level2taskDesc: '',
                    est_MP_TL2_unitOfMeasure: 'Nos',
                    est_MP_TL2_qty: 0,
                    children_cnt: 0,
                }
            }
            if (level == 3) {
                 return {
                    est_MP_TL3_id: 0,
                    est_MP_TL3_level3taskid: 0,
                    TL3_name: '',
                    est_MP_TL3_level3taskDesc: '',
                    est_MP_TL3_unitOfMeasure: 'Nos',
                    est_MP_TL3_qty: 0,
                    children_cnt: 0,
                }
            }
            if (level == 4) {
                 return {
                    est_MP_TL4_id: 0,
                    est_MP_TL4_level4taskid: 0,
                    TL4_name: '',
                    est_MP_TL4_level4taskDesc: '',
                    est_MP_TL4_unitOfMeasure: 'Nos',
                    est_MP_TL4_qty: 0,
                    children_cnt: 0,
                }
            }
            return {}
        },

        setDefaultValues(tasks) {
            return tasks.map((item) => {
                const node = Object.assign(item, { info: this.getDefaultTask(item.level) })
                if (node.children && node.children.length > 0) {
                    node.children = this.setDefaultValues(node.children)
                }
                return node
            })
        },

        findTaskByKey(tasks, ikey) {
            for (const i in tasks) {
                const item = tasks[i]

                if (item.ikey == ikey) {
                    return item
                }
                if (item.children && item.children.length > 0) {
                    const result = this.findTaskByKey(item.children, ikey)
                    if (result) {
                        return result
                    }
                }
            }
            return null
        },

        existsInKeyList: function(task, keyList) {
            if (keyList.find(it => it == task.ikey)) {
                return true;
            }
            const children = task.children
            if (children && children.length > 0) {
                for (var i in children) {
                    if (this.existsInKeyList(children[i], keyList)) {
                        return true;
                    }
                }
            }
            return false;
        },
        //----------------------mangae task list -------------------------------------

        //----------------------phase.tree state -------------------------------------
        getInterestedItems: function() {
            return this.phase.tree.filter(it => it.state && it.state != 'remove')
        },

        updateInterestedItems: function(tasks, keyList) {
            for (const i in tasks) {
                const item = tasks[i]

                if (this.existsInKeyList(item, keyList)) {
                    //console.log('test~~~~~~~~~~~~~~1:', item.ikey, item.state, item.level, item)
                    if (!item.state) {
                        item.state = "newData"
                    }
                    else if (item.state == "remove") {
                        item.state = "modified"
                    }
                    //console.log('test~~~~~~~~~~~~~~2:', item.ikey, item.state, item.level, item)
                }
                else {
                    if (item.state && item.state == 'newData') {
                        item.state = undefined;
                    }
                    else if (item.state) {
                        item.state = "remove"
                    }
                }
                if (item.children && item.children.length > 0) {
                    this.updateInterestedItems(item.children, keyList)
                }
            }
        },

        resetStates: function(tasks) {
            for (const i in tasks) {
                const item = tasks[i]

                if (item.state) {
                    item.state = 'nochange'
                }
                
                if (item.children && item.children.length > 0) {
                    this.resetStates(item.children)
                }
            }
        },
        //----------------------phase.tree state -------------------------------------

        //----------------------manage sync data -------------------------------------
        getUpdatedItems: function(filter = 'remove') {
            return this.updatedItemsEx(this.phase.tree, filter)
        },

        updatedItemsEx: function(tasks, filter) {
            const temp = tasks.map((it) => Object.assign({}, it))
            const result = temp.filter((it) => it.state && it.state != filter)
            for (const i in result) {
                const children = result[i].children
                if (children && children.length > 0) {
                    result[i].children = this.updatedItemsEx(children, filter)
                }
            }
            return result
        },

        getTreeIdFromLevel: function(item, level) {
            if (level == 0) return item.est_MP_categ_taskCategoryID
            if (level == 1) return item.est_MP_TL1_level1taskid
            if (level == 2) return item.est_MP_TL2_level2taskid
            if (level == 3) return item.est_MP_TL3_level3taskid
            if (level == 4) return item.est_MP_TL4_level4taskid
            return null
        },
        
        findServerItem: function(subject) {
            return this.findServerItemEx(this.phase.serverItems, subject, 0)
        },

        findServerItemEx: function(serverItems, subject, level) {
            for (const i in serverItems) {
                const item = serverItems[i]
                
                if (level == subject.level) {
                    const findId = this.getTreeIdFromLevel(item, level)
                    if (subject.id == findId) {
                        return item
                    }
                }
                else {
                    const children = item.children
                    if (children && children.length > 0) {
                        return this.findServerItemEx(children, subject, level + 1)
                    }
                }
            }
            return null
        },

        addServerCategory: function(serverItem) {
            this.phase.serverItems.push(serverItem)
        },
        //----------------------manage sync data -------------------------------------

        getKeyList: function(tasks) {
            const thiz = this
            let result = []
            tasks.forEach(function(item) {
                let subItemKeys = null
                if (item.children && item.children.length > 0) {
                    subItemKeys = thiz.getKeyList(item.children);                    
                }
                if (subItemKeys && subItemKeys.length > 0) {
                    result = result.concat(subItemKeys)
                }
                else {
                    result.push(item.ikey)
                }
            })
            return result
        },

        openTreeDialog: function() {
            this.treeDialog = true;

            const selectedTasks = this.getInterestedItems()
            this.dialogTreeSelected = this.getKeyList(selectedTasks);
        },

        closeTreeDialog: function() {
            this.treeDialog = false;
        },
        
        saveTreeDialog: function() {
            this.treeDialog = false
            console.log('saveTreeDialog.selected:', this.dialogTreeSelected);
            this.updateInterestedItems(this.phase.tree, this.dialogTreeSelected)
            this.refreshTree()
        },

        refreshTree: function() {
            this.searchName = (parseInt(this.searchName) + 1).toString()
        },

        openTaskEditDialog: function(item) {
            console.log('open_task_date_dialog', item)
            this.taskDialog = true
            this.editTask = item
            console.log('selected.edittask', this.editTask)
        },

        closeTaskEditDialog: function() {
            this.taskDialog = false;
        },

        saveTaskEditDialog: function() {
            this.taskDialog = false;
        },

        onDescriptionChanged: function(event, item) {
            item.description = event
            if (item.state != 'newData') {
                item.state = 'modified'
            }
        },

        onUnitOfMeasureChanged: function(event, item) {
            item.unitOfMeasure = event
            if (item.state != 'newData') {
                item.state = 'modified'
            }
        },

        onQuantityChanged: function(event, item) {
            item.quantity = event
            if (item.state != 'newData') {
                item.state = 'modified'
            }
        },

        saveTask: async function(index) {
            this.wait = true

            const items = this.getUpdatedItems('NoFilter')
            for (const i in items) {
                const item = items[i]
                console.log('saveTask_add_item', item, item.state)

                if (item.state === "newData" || item.state === "modified") {
                    const insertId = await api.addProjectCategory(this.phase.phase_id, item)
                    console.log('Save_Add_Category_Result', item, insertId)

                    if (insertId) {
                        let serverItem = this.findServerItem(item)
                        if (!serverItem) {
                            serverItem = this.getDefaultTask(0)
                            serverItem.est_MP_categ_id = insertId
                            serverItem.est_MP_categ_taskCategoryID = item.id
                            this.addServerCategory(serverItem)
                            console.log('Save_New_Server_Category', serverItem)
                        }
                        else {
                            serverItem.est_MP_categ_id = insertId
                            serverItem.est_MP_categ_taskCategoryID = item.id
                            console.log('Save_Update_Server_Category', serverItem)
                        }
                    }
                }

                const children = item.children
                if (children && children.length > 0) {
                    await this.saveTaskByLevel(item, 'newData|modified', 1)
                }
            }

            // Update removed items.
            /*for (const i in items) {
                const item = items[i]
                console.log('saveTask_remove_item', item, item.state)

                const children = item.children
                console.log('saveTask_remove_item_children', children)
                if (children && children.length > 0) {
                    await this.saveTaskByLevel(item, 'remove', 1)
                }

                if (item.state == "removed") {
                    const result = await api.removeProjectCategory(this.phase.phase_id, item)
                    if (result) {
                        const updateItem = this.findTaskByKey(this.phase.tree, item.ikey)
                        updateItem.state = null
                    }
                }
            }*/

            this.resetStates(this.phase.tree)
            this.wait = false;
        },

        saveTaskByLevel: async function(tazk, state, level) {
            const pInfo = this.findServerItem(tazk)
            console.log('saveTaskByLevel________info', this.phase.serverItems, tazk, pInfo)
            if (pInfo) {
                tazk.info = pInfo
            }
            else {
                tazk.info = this.getDefaultTask(level)
            }

            const insertId = await api.saveTaskByLevel(tazk, state, tazk.level)
            if (insertId) {
                console.log('saveTaskByLevel________inserted', insertId, tazk)
                const children = await api.getTaskByKeyInfo(tazk, tazk.level)
                if (children) {
                    const projItem = this.findServerItem(tazk)
                    projItem.children = children
                    console.log('saveTaskByLevel________serverItems', this.phase.serverItems)
                }
            }

            for (const i in tazk.children) {
                const child = tazk.children[i]
                if (child.children && child.children.length > 0) {
                    await this.saveTaskByLevel(child, state, level+1)
                }
            }

            // if (state === 'remove') {
            //     console.log('saveTaskByLevel________call_root', tazk.ikey, state, tazk.level)
            //     await api.saveTaskByLevel(tazk, state, tazk.level)
            // }
        },

        openPhaseEditDialog: function() {
            this.editPhaseDateDialog = true
        },

        closePhaseEditDialog: function() {
            this.editPhaseDateDialog = false
        },

        savePhaseEditDialog: function() {
            this.editPhaseDateDialog = false
        }
    }
};
</script>
