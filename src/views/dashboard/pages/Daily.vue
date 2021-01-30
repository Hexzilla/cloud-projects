<template>
    <v-container id="regular-tables" tag="section" fluid>
        <v-progress-linear
            indeterminate
            class="mb-1"
            color="green"
            v-if="wait">
        </v-progress-linear>
        <v-row>
            <v-col cols="12" sm="12" md="3">
                <v-card class="my-0">
                    <v-card-title class="flex flex-row-reverse px-0 mx-0 py-0">
                        <v-text-field
                            filled
                            label="Search"
                            append-icon="mdi-magnify"
                            @change="searchKeyChange($event)"
                        ></v-text-field>
                    </v-card-title>
                    <v-list :disabled="wait">
                        <v-list-item-group>
                            <v-list-item v-for="(item, i) in projects" :key="i">
                                <v-list-item-content v-on:click="project_listItemClicked(item)">
                                    <v-list-item-title v-text="item.prj_name"></v-list-item-title>
                                </v-list-item-content>
                                <v-progress-circular
                                    v-if="waitProject == item"
                                    indeterminate
                                    color="teal"
                                    :width="2"
                                    :size="24"
                                ></v-progress-circular>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="9">
                <v-card class="my-0" min-height="300px">
                    <!-- <v-card-title class="flex flex-row-reverse px-0 mx-0 py-0">
                        <v-row>
                            <v-col class="text-right py-8 px-10">
                                Till Yesterday
                            </v-col>
                        </v-row>
                    </v-card-title> -->
                    <template 
                        v-for="(item, i) in phases">
                        <v-container :key="i">
                            <v-row>
                                <v-col>
                                    <p class="subtitle-1 mb-0" style="color:#1867c0; font-size: 20px !important;"><b>{{ `Phase ${i + 1}` }}</b></p>
                                    <p class="title mb-0 text--disabled">
                                        {{ `${item.phase_opendate} ~ ${item.phase_closedate}` }}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-treeview
                                        :open="initiallyOpen"
                                        :items="item['serverItems']"
                                        item-key="ikey"
                                        activatable
                                    >
                                        <template v-slot:prepend="{ item }">
                                            <v-icon v-if="item.level == 0" color="teal">mdi-cube</v-icon>
                                            <v-icon v-if="item.level == 1" color="teal">mdi-numeric-1-box-outline</v-icon>
                                            <v-icon v-if="item.level == 2" color="teal">mdi-numeric-2-box-outline</v-icon>
                                            <v-icon v-if="item.level == 3" color="teal">mdi-numeric-3-box-outline</v-icon>
                                            <v-icon v-if="item.level == 4" color="teal">mdi-numeric-4-box-outline</v-icon>
                                        </template>
                                        <template  v-slot:append="{ item }">
                                            <v-row v-if="item.level > 0">
                                                <v-col class="py-0 my-0" style="display:flex; align-items: center;">
                                                    <v-btn color='teal' rounded small @click="btnClicked(item)">
                                                        <v-icon dark>
                                                            mdi-calendar-edit
                                                        </v-icon>
                                                    </v-btn>
                                                </v-col>
                                                <v-col>
                                                    <InputGroup 
                                                        v-bind:item="item"
                                                        v-bind:supervisors="supervisors"
                                                        v-bind:performers="performers"
                                                        style="width:200px">
                                                    </InputGroup>
                                                </v-col>
                                            </v-row>
                                        </template>
                                    </v-treeview>
                                </v-col>
                            </v-row>
                        </v-container>
                    </template>
                </v-card>
                <template v-if="selectedProject && selectedItem">
                    <v-container class="px-0 py-0">
                        <v-form ref="form" lazy-validation>
                            <v-card :loading="updateLoading">
                                <v-card-title>
                                    <span class="headline" style="font-weight: bold; color: rgb(24, 103, 192); font-size: 20px;">Update ( <span style="font-size: 18px">{{this.selectedItem.name}}</span> )</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12" md="4">
                                            <p class="text-center my-0 mt-4 font-weight-bold">Supervisor</p>
                                            <v-list>
                                                <v-list-item-group
                                                    v-model="supervisor"
                                                    color="indigo"
                                                >
                                                    <template v-for="(item, i) in supervisors">
                                                    <v-divider
                                                        v-if="!item"
                                                        :key="`divider-${i}`"
                                                    ></v-divider>

                                                    <v-list-item
                                                        v-else
                                                        :key="`item-${i}`"
                                                        :value="item"
                                                    >
                                                        <template v-slot:default="{ active }">
                                                            <v-list-item-icon>
                                                                <v-icon>mdi-account-tie</v-icon>
                                                            </v-list-item-icon>
                                                            <v-list-item-content>
                                                                <v-list-item-title v-text="item.firstname + ' ' + item.lastname"></v-list-item-title>
                                                            </v-list-item-content>

                                                            <v-list-item-action>
                                                                <v-checkbox
                                                                :input-value="active"
                                                                ></v-checkbox>
                                                            </v-list-item-action>
                                                        </template>
                                                    </v-list-item>
                                                    </template>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-col>

                                        <v-col cols="12" md="4">
                                            <p class="text-center my-0 mt-4 font-weight-bold">Performer</p>
                                            <v-list>
                                                <v-list-item-group
                                                    v-model="performer"
                                                    multiple
                                                    color="indigo"
                                                >
                                                    <template v-for="(item, i) in performers">
                                                    <v-divider
                                                        v-if="!item"
                                                        :key="`divider-${i}`"
                                                    ></v-divider>

                                                    <v-list-item
                                                        v-else
                                                        :key="`item-${i}`"
                                                        :value="item"
                                                        active-class="text--accent-4"
                                                    >
                                                        <template v-slot:default="{ active }">
                                                            <v-list-item-icon>
                                                                <v-icon>mdi-account</v-icon>
                                                            </v-list-item-icon>
                                                            <v-list-item-content>
                                                                <v-list-item-title v-text="item.firstname + ' ' + item.lastname"></v-list-item-title>
                                                            </v-list-item-content>

                                                            <v-list-item-action>
                                                                <v-checkbox
                                                                :input-value="active"
                                                                ></v-checkbox>
                                                            </v-list-item-action>
                                                        </template>
                                                    </v-list-item>
                                                    </template>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-col>

                                        <v-col cols="12" md="4">
                                            <p class="text-center my-0 mt-4 font-weight-bold">Amount</p>
                                            <v-list>
                                                <v-list-item-group
                                                    color="indigo"
                                                >
                                                    <template v-for="(item, i) in performers">
                                                    <v-divider
                                                        v-if="!item"
                                                        :key="`divider-${i}`"
                                                    ></v-divider>

                                                    <v-list-item
                                                        v-else
                                                        :key="`item-${i}`"
                                                        :value="item"
                                                        active-class="text--accent-4"
                                                    >
                                                        <template v-slot:default="{ active }">
                                                            <v-list-item-content>
                                                                <v-list-item-title v-text="``"></v-list-item-title>
                                                            </v-list-item-content>

                                                            <v-list-item-action>
                                                                <v-row>
                                                                    <v-col cols="12" md="4" class="py-0 my-0">
                                                                        <v-text-field
                                                                            label="Hr"
                                                                            type="number"
                                                                            :rules="hrRules"
                                                                            v-model="item.hr"
                                                                            v-if="checkPerformer(item)"
                                                                        ></v-text-field>
                                                                    </v-col>
                                                                    <v-col cols="12" md="4" class="py-0 my-0">
                                                                        <v-text-field
                                                                            label="Min"
                                                                            type="number"
                                                                            :rules="minRules"
                                                                            v-model="item.min"
                                                                            v-if="checkPerformer(item)"
                                                                        ></v-text-field>
                                                                    </v-col>
                                                                    <v-col cols="12" md="4" class="py-0 my-0">
                                                                        <v-text-field
                                                                            label="Percent"
                                                                            type="number"
                                                                            :rules="pctRules"
                                                                            v-model="item.pct"
                                                                            v-if="checkPerformer(item)"
                                                                        ></v-text-field>
                                                                    </v-col>
                                                                </v-row>
                                                            </v-list-item-action>
                                                        </template>
                                                    </v-list-item>
                                                    </template>
                                                </v-list-item-group>
                                            </v-list>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary darken-1" @click="save"> Save </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </v-container>
                </template>
            </v-col>
        </v-row>
        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
            {{ snackText }}
            <template v-slot:action="{ attrs }">
                <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
            </template>
        </v-snackbar>
</v-container>
</template>

<script>
    import api from "@/apis/project.js";
    import client_api from "@/apis/client.js";
    import daily_api from "@/apis/daily.js";
    import InputGroup from './InputGroup'
    import DailyUpdate from './DailyUpdate'

    export default {
        components: {
            InputGroup,
            DailyUpdate,
        },

        data: () => ({
            wait: false,
            projects: [],
            selectedProject: null,
            supervisor: null,
            supervisors: [],
            initiallyOpen: ["public"],
            performer: null,
            performers: [],
            selectedPerformer: null,
            waitProject: null,
            phase: null,
            phases: [],
            selectedItem: null,

            saveData: [],
            snack: false,
            snackColor: "",
            snackText: "",
            updateLoading: false
        }),
        
        created: async function() {
            this.wait = true
            this.projects = await api.getProjects()
            this.performers = await client_api.findL1Members()
            this.supervisors = await client_api.findSupervisors()
            
            this.performers.forEach( e => {
                e.hr = ""
                e.min = ""
                e.pct = ""
                e.totalPct = 50
            })
            this.wait = false
        },

        computed: {
            supervisorRule() {
                return [
                    (v) => !!v || "required",
                ]
            },
            performerRule() {
                return [
                    (v) => v && v.length > 0 || "required",
                ]
            },
            hrRules() {
                return [
                    (v) => !!v || "required",
                    (v) => v > 0 || " > 0",
                    (v) => v < 24 || " < 24",
                ]
            },
            minRules() {
                return [
                    (v) => !!v || "required",
                    (v) => v > 0 || " > 0",
                    (v) => v < 60 || " < 60",
                ]
            },
            pctRules() {
                return [
                    (v) => !!v || "required",
                    (v) => v < 100 || " < 100",
                    (v) => v > 0 || " > 0"
                ]
            }
        },

        methods: {
            project_listItemClicked: async function(project) {
                this.wait = true
                this.selectedProject = project
                this.waitProject = project

                this.phases = null
                await api.updateTaskList(project)

                this.phases = project.phases
                this.phases.length > 0 && this.phases.forEach((item) => {
                    item.serverItems.length > 0 && this.setIkeyAndName(item.serverItems, 1)
                })
                this.waitProject = null         
                this.wait = false

                console.log("phases", this.phases)
            },


            cloneTree(items) {
                return items.map((item) => {
                    const node = Object.assign({}, item)
                    if (item.children && item.children.length > 0) {
                        node.children = this.cloneTree(item.children)
                    }
                    return node
                })
            },

            searchKeyChange: function(event) {
                this.projects = this.allProjects.filter(item => item.prj_name.toUpperCase().includes(event.toUpperCase()))
            },

            setIkeyAndName: function(items, ikey) {
                items.forEach((item) => {
                    if (item.level == 0) {
                        item.ikey = ikey
                    }else if (item.level == 1) {
                        item.name = item.TL1_name
                        item.ikey = ikey
                    } else if (item.level == 2) {
                        item.name = item.TL2_name
                        item.ikey = ikey
                    } else if (item.level == 3) {
                        item.name = item.TL3_name
                        item.ikey = ikey
                    } else {
                        item.name = item.TL4_name
                        item.level = 4
                        item.ikey = ikey
                    }
                    item.hr = ''
                    item.min = ''
                    item.pct = ''
                    item.totalPct = ''
                    ikey++

                    item.userAction = "nochange"

                    if (item.children && item.children.length > 0) {
                        ikey = this.setIkeyAndName(item.children, ikey)
                    } 
                })
                return ikey
            },

            btnClicked(item) {
                this.selectedItem = item
                this.performer = []
                this.supervisor = []

                if (this.$refs.form) {
                    this.$refs.form.resetValidation()
                }
            },
            
            async save() {
                if (!this.supervisor || this.supervisor.length == 0) {
                    this.show_error("Please select supervisor")
                    return
                }
                if (!this.performer || this.performer.length == 0) {
                    this.show_error("Please select performer")
                    return
                }
                if (!this.$refs.form.validate()) {
                    return
                }
                this.updateLoading = true
                console.log("supervisor", this.supervisor)
                console.log("selectedItem", this.selectedItem)
                console.log("performer", this.performer)
                await this.sendData()    
                this.updateLoading = false
            },

            getId() {
                let id 
                this.selectedItem.level == 1 && (id = this.selectedItem.est_MP_TL1_id)
                this.selectedItem.level == 2 && (id = this.selectedItem.est_MP_TL2_id)
                this.selectedItem.level == 3 && (id = this.selectedItem.est_MP_TL3_id)
                this.selectedItem.level == 4 && (id = this.selectedItem.est_MP_TL4_id)
                return id
            },

            async sendData() {
                let status = false
                if (this.selectedItem.level == 1) {
                    for (let i in this.performer)
                        status = await daily_api.add1(this.getId(), this.supervisor.id, this.performer[i])
                }
                if (this.selectedItem.level == 2) {
                    for (let i in this.performer)
                        status = await daily_api.add2(this.getId(), this.supervisor.id, this.performer[i])
                }
                if (this.selectedItem.level == 3) {
                    for (let i in this.performer)
                        status = await daily_api.add3(this.getId(), this.supervisor.id, this.performer[i])
                }
                if (this.selectedItem.level == 4) {
                    for (let i in this.performer)
                        status = await daily_api.add4(this.getId(), this.supervisor.id, this.performer[i])
                }

                this.show_snack(status)
            },

            setSaveData() {
                if (!this.selectedPerformer) {
                    this.saveData = []
                    return
                }

                if (this.selectedPerformer.length < this.saveData.length) {
                    let filter = this.saveData.filter(e => this.selectedPerformer.includes(e.performer))
                    this.saveData = []
                    this.saveData = filter
                    return
                }

                this.selectedPerformer.length > 0 && this.selectedPerformer.forEach(item => {
                    if (this.saveData.find(e => e.performer == item)) return

                    let temp = {
                        id: this.itemId,
                        supervisor: this.selectedSupervisor,
                        performer: item,
                        hr: '',
                        min: '',
                        pct: '',
                        totalPct: 60 //todo
                    }
                    this.saveData.push(temp)
                })

                console.log("saveData", this.saveData)
            },

            getPerformerName(item) {
                let id = item.performer
                let found = this.performers.find(e => e.id == id)
                return found.firstname + " " + found.lastname
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

            show_error(msg) {
                this.snack = true
                this.snackColor = "blue-grey"
                this.snackText = msg
            },

            checkPerformer(item) {
                const found = this.performer.find( e => e.id == item.id)
                if (!found) 
                    return false
                return true
            },

        }
    }
</script>