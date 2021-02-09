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
                <v-card class="my-0" min-height="500px" v-show="!showUpdate">
                
                    <v-toolbar flat color="teal" dark>
                        <v-toolbar-title>Project</v-toolbar-title><br>
                    </v-toolbar>
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
                                        open-on-click
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

                                                <!--
                                                <v-col>
                                                    <InputGroup 
                                                        v-bind:item="item"
                                                        v-bind:supervisors="supervisors"
                                                        v-bind:performers="performers"
                                                        v-bind:task="getTaskByLevel(item)"
                                                        style="width:200px">
                                                    </InputGroup>
                                                </v-col>
                                                -->
                                            </v-row>
                                        </template>
                                    </v-treeview>
                                </v-col>
                            </v-row>
                        </v-container>
                    </template>

                </v-card>
                <template v-if="selectedProject && selectedItem">
                    <v-container class="px-0 py-0" v-show="showUpdate" >
                        <v-form ref="form" lazy-validation>
                            <v-card :loading="updateLoading" class="my-0">
                                <v-card-title>
                                    <v-row>
                                        <v-col>
                                            <v-btn small text color="red accent-2" @click="backBtnClicked">
                                                <v-icon>
                                                    mdi-arrow-left-bold-outline
                                                </v-icon>
                                                back
                                            </v-btn><br>
                                            <span class="headline" style="font-weight: bold; color: rgb(24, 103, 192); font-size: 20px;">Efforts and progress </span><br>
                                            <span class="text--disabled" style="font-size: 15px">{{this.selectedItem.name}}</span>
                                        </v-col>
                                    </v-row>
                                </v-card-title>
                                <v-row>
                                    <v-col></v-col>
                                    <v-col>
                                        <DatePicker
                                            textName="Date"
                                            :date="selectedDay"
                                            :submit="(date) => selectedDay = date"
                                        ></DatePicker>
                                    </v-col>
                                    <v-col></v-col>
                                </v-row>
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
                                                    @click="performerClicked"

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
                                                <v-list-item-group multiple v-model="selectedAmount">
                                                    <template v-for="(item, i) in performers">
                                                        <v-list-item
                                                            :key="`item-${i}`"
                                                            :value="item.id"
                                                            color="pink"
                                                        >
                                                            <template v-slot:default="{ active }">
                                                                <v-list-item-content>
                                                                    <v-list-item-title v-text="``"></v-list-item-title>
                                                                </v-list-item-content>

                                                                <v-list-item-action>
                                                                    <v-row>
                                                                        <v-col class="py-0 my-0 px-1">
                                                                            <v-text-field
                                                                                label="Hr"
                                                                                :rules="hrRules"
                                                                                v-model="item.hr"
                                                                                v-if="checkPerformer(item)"
                                                                            ></v-text-field>
                                                                        </v-col>
                                                                        <v-col class="py-0 my-0 px-1">
                                                                            <v-text-field
                                                                                label="Min"
                                                                                :rules="minRules"
                                                                                v-model="item.min"
                                                                                v-if="checkPerformer(item)"
                                                                            ></v-text-field>
                                                                        </v-col>
                                                                        <v-col class="py-0 my-0 px-1">
                                                                            <v-text-field
                                                                                label="Today"
                                                                                :rules="pctRules"
                                                                                v-model="item.pct"
                                                                                v-if="checkPerformer(item)"
                                                                            ></v-text-field>
                                                                        </v-col>
                                                                        <v-col class="py-0 my-0 px-1">
                                                                            <v-text-field
                                                                                label="Total"
                                                                                :rules="totalRules"
                                                                                v-model="item.totalPct"
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
                                    <v-btn color="error" text @click="deleteBtnClicked" :disabled="deleteBtnStatus"> Delete </v-btn>
                                    <v-btn color="primary darken-1" :disabled="saveBtnStatus" @click="save"> Save </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                        <DailyData
                            ref="dailyData"
                            v-bind:item = "selectedItem"
                            v-bind:hrId = "hrId"
                            v-bind:supervisors = "supervisors"
                            v-bind:performers = "performers"
                        >
                        </DailyData>
                    </v-container>
                </template>
            </v-col>
        </v-row>

        <v-dialog v-model="confirmDialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">
                    Are you sure?<br>
                    <p style="font-size:14px">Update Data is already exist.</p>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" @click="closeConfirm">
                        No
                    </v-btn>
                    <v-btn color="green darken-1" text @click="saveConfirm">Yes</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

        
        <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">
                    Are you sure?<br>
                    <p style="font-size:14px">Today data will be deleted</p>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="pink darken-1" @click="closeDelete">
                        No
                    </v-btn>
                    <v-btn color="pink darken-1" text @click="confirmDelete">Yes</v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
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
    import auth_api from "@/apis/auth.js";
    import InputGroup from './InputGroup'
    import DatePicker from './DatePicker'
    import DailyData from './DailyData'

    export default {
        components: {
            InputGroup,
            DatePicker,
            DailyData
        },

        data: () => ({
            wait: false,
            projects: [],
            allProjects: [],
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
            updateLoading: false,

            hrId: null,
            task1Update: [],
            task2Update: [],
            task3Update: [],
            task4Update: [],
            confirmDialog: false,
            showUpdate: false,

            deleteDialog: false,
            today: null,
            selectedDay: null,
            selectedAmount: [],
            saveBtnStatus: false
        }),
        
        created: async function() {
            this.wait = true
            this.allProjects = await api.getProjects()
            this.performers = await client_api.findL1Members()
            this.supervisors = await client_api.findSupervisors()
            this.hrId = await auth_api.getOwnId()

            this.task1Update = await daily_api.getUpdate1(this.hrId)
            this.task2Update = await daily_api.getUpdate2(this.hrId)
            this.task3Update = await daily_api.getUpdate3(this.hrId)
            this.task4Update = await daily_api.getUpdate4(this.hrId)

            this.projects = this.allProjects
            this.clearPerformer()

            if (!this.task1Update) {
                this.task1Update = []
            }
            if (!this.task2Update) {
                this.task2Update = []
            }
            if (!this.task3Update) {
                this.task3Update = []
            }
            if (!this.task4Update) {
                this.task4Update = []
            }

            this.today = daily_api.getToday()
            this.selectedDay = daily_api.getToday()
            this.wait = false


            console.log("hrId", this.hrId)
            console.log("task1", this.task1Update)
            console.log("task2", this.task2Update)
            console.log("task3", this.task3Update)
            console.log("task4", this.task4Update)
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
                    v => {
                        if (!v) {
                            return true
                        } else if (!(!isNaN(parseFloat(v)) && isFinite(v))) {
                            return 'number'
                        } else if (v < 0) {
                            return ' >= 0'
                        } else if (v > 24) {
                            return ' <= 24'
                        }
                        return true
                    }
                ]
            },
            minRules() {
                return [
                    v => {
                        if (!v) {
                            return true
                        } else if (!(!isNaN(parseFloat(v)) && isFinite(v))) {
                            return 'number'
                        } else if (v < 0) {
                            return ' >= 0'
                        } else if (v > 60) {
                            return ' <= 60'
                        }
                        return true
                    }
                ]
            },
            pctRules() {
                return [
                    v => {
                        if (!v) {
                            return true
                        } else if (!(!isNaN(parseFloat(v)) && isFinite(v))) {
                            return 'number'
                        } else if (v < 0) {
                            return ' >= 0'
                        } else if (v > 100) {
                            return ' <= 100'
                        }
                        return true
                    }
                ]
            },
            totalRules() {
                return [
                    v => {
                        if (!v) {
                            return true
                        } else if (!(!isNaN(parseFloat(v)) && isFinite(v))) {
                            return 'number'
                        } else if (v < 0) {
                            return ' >= 0'
                        } else if (v > 100) {
                            return ' <= 100'
                        }
                        return true
                    }
                ]
            },
            deleteBtnStatus() {
                if (this.selectedItem && this.selectedItem.userAction == "saved")
                    return false
                return true
            }
        },

        methods: {
            clearPerformer() {
                this.performers.forEach( e => {
                    e.hr = ""
                    e.min = ""
                    e.pct = ""
                    e.totalPct = ""
                })
            },

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
                this.selectedItem = null
                this.showUpdate = false
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
                    let found = null
                    if (item.level == 0) {
                        item.ikey = ikey
                    }else if (item.level == 1) {
                        item.name = item.TL1_name
                        item.ikey = ikey
                        this.task1Update && (found = this.task1Update.find( e => e.estimate_MP_taskL1id == item.est_MP_TL1_id))
                    } else if (item.level == 2) {
                        item.name = item.TL2_name
                        item.ikey = ikey
                        this.task2Update && (found = this.task2Update.find( e => e.estimate_MP_taskL2id == item.est_MP_TL2_id))
                    } else if (item.level == 3) {
                        item.name = item.TL3_name
                        item.ikey = ikey
                        this.task3Update && (found = this.task3Update.find( e => e.estimate_MP_taskL3id == item.est_MP_TL3_id))
                    } else {
                        item.name = item.TL4_name
                        item.level = 4
                        item.ikey = ikey
                        this.task4Update && (found = this.task4Update.find( e => e.estimate_MP_taskL4id == item.est_MP_TL4_id))
                    }
                    if (found)
                        item.userAction = "saved"
                    else 
                        item.userAction = "none"
                    ikey++
                    if (item.children && item.children.length > 0) {
                        ikey = this.setIkeyAndName(item.children, ikey)
                    } 
                })
                return ikey
            },

            btnClicked(item) {
                this.selectedItem = item
                this.clearPerformer()
                this.performer = []
                this.supervisor = []
                this.showUpdate = true
                this.selectedAmount = []
                this.$refs.dailyData && this.$refs.dailyData.itemChanged()

                if (this.$refs.form) {
                    this.$refs.form.resetValidation()
                }
            },
            
            save() {
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
                this.selectedAmount = []
                for (let i in this.performer) {
                    let item = this.performer[i]
                    if (item.hr == 0 && item.min == 0 && item.pct == 0 && (item.totalPct == 0 || !item.totalPct)) {
                        this.selectedAmount.push(item.id)
                    }
                }
                if (this.selectedAmount.length > 0) {
                    this.show_error("Can not be all values are 0")
                    return
                }

                this.selectedItem.userAction != "saved" && this.saveDaily()
                this.selectedItem.userAction == "saved" && (this.confirmDialog = true)
            },

            checkSendData(){
                this.performer && this.performer.length > 0 && this.performer.forEach( e => {
                    e.hr == "" && (e.hr = 0)
                    e.min == "" && (e.min = 0)
                    e.pct == "" && (e.pct = 0)
                    e.totalPct == "" && (e.totalPct = null)
                })
            },

            async saveDaily() {
                this.updateLoading = true
                this.saveBtnStatus = true
                this.checkSendData()
                console.log("supervisor", this.supervisor)
                console.log("selectedItem", this.selectedItem)
                console.log("performer", this.performer)
                await this.sendData()
                this.saveBtnStatus = false
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
                    for (let i in this.performer) {
                        status = await daily_api.add1(this.selectedDay, this.getId(), this.supervisor.id, this.performer[i])
                        if (status && this.selectedDay == this.today)
                            this.task1Update.push(status)
                    }
                }
                if (this.selectedItem.level == 2) {
                    for (let i in this.performer) {
                        status = await daily_api.add2(this.selectedDay, this.getId(), this.supervisor.id, this.performer[i])
                        if (status && this.selectedDay == this.today)
                            this.task2Update.push(status)
                    }
                }
                if (this.selectedItem.level == 3) {
                    for (let i in this.performer) {
                        status = await daily_api.add3(this.selectedDay, this.getId(), this.supervisor.id, this.performer[i])
                        if (status && this.selectedDay == this.today)
                            this.task3Update.push(status)
                    }
                }
                if (this.selectedItem.level == 4) {
                    for (let i in this.performer) {
                        status = await daily_api.add4(this.selectedDay, this.getId(), this.supervisor.id, this.performer[i])
                        if (status && this.selectedDay == this.today)
                            this.task4Update.push(status)
                    }
                }
                if (status && this.selectedDay == this.today)
                    this.selectedItem.userAction = "saved"
                this.$refs.dailyData && this.$refs.dailyData.itemChanged()
                this.clearPerformer()
                this.show_snack(status)
            },

            // setSaveData() {
            //     if (!this.selectedPerformer) {
            //         this.saveData = []
            //         return
            //     }

            //     if (this.selectedPerformer.length < this.saveData.length) {
            //         let filter = this.saveData.filter(e => this.selectedPerformer.includes(e.performer))
            //         this.saveData = []
            //         this.saveData = filter
            //         return
            //     }

            //     this.selectedPerformer.length > 0 && this.selectedPerformer.forEach(item => {
            //         if (this.saveData.find(e => e.performer == item)) return

            //         let temp = {
            //             id: this.itemId,
            //             supervisor: this.selectedSupervisor,
            //             performer: item,
            //             hr: '',
            //             min: '',
            //             pct: '',
            //             totalPct: ''
            //         }
            //         this.saveData.push(temp)
            //     })

            //     console.log("saveData", this.saveData)
            // },

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
                // this.snackColor = "blue-grey"
                this.snackColor = "blue darken-1"
                this.snackText = msg
            },

            checkPerformer(item) {
                const found = this.performer.find( e => e.id == item.id)
                if (!found) 
                    return false
                return true
            },

            getTaskByLevel(item) {
                let result = []
                if (item.level == 1) {
                    this.task1Update && (result = this.task1Update.find( e => e.estimate_MP_taskL1id == item.est_MP_TL1_id))
                } else if (item.level == 2) {
                    this.task2Update && (result = this.task2Update.find( e => e.estimate_MP_taskL2id == item.est_MP_TL2_id))
                } else if (item.level == 3) {
                    this.task3Update && (result = this.task3Update.find( e => e.estimate_MP_taskL3id == item.est_MP_TL3_id))
                } else if (item.level == 4) {
                    this.task4Update && (result = this.task4Update.find( e => e.estimate_MP_taskL4id == item.est_MP_TL4_id))
                }
                return result
            },

            closeConfirm() {
                this.confirmDialog = false
            },

            saveConfirm() {
                this.closeConfirm()
                this.saveDaily()
            },

            backBtnClicked() {
                this.showUpdate = false 
            },

            deleteBtnClicked() {
                this.deleteDialog = true
            },

            closeDelete() {
                this.deleteDialog = false
            },

            getDailyData(level) {
                let itemId = this.getId()
                let result
                if (level == 1) {
                    result = this.task1Update.filter(e => e.estimate_MP_taskL1id == itemId)
                } else if (level == 2) {
                    result = this.task2Update.filter(e => e.estimate_MP_taskL2id == itemId)
                } else if (level == 3) {
                    result = this.task3Update.filter(e => e.estimate_MP_taskL3id == itemId)
                } else if (level == 4) {
                    result = this.task4Update.filter(e => e.estimate_MP_taskL4id == itemId)
                }
                return result
            },

            async confirmDelete() {
                this.updateLoading = true
                this.closeDelete()
                let level = this.selectedItem.level
                let dailyData = this.getDailyData(level)
                console.log("dailyData", dailyData)
                let ret
                for (let i in dailyData) {
                    if (level == 1) {
                        ret = await daily_api.remove1(dailyData[i].id)
                    } else if (level == 2) {
                        ret = await daily_api.remove2(dailyData[i].id)
                    } else if (level == 3) {
                        ret = await daily_api.remove3(dailyData[i].id)
                    } else if (level == 4) {
                        ret = await daily_api.remove4(dailyData[i].id)
                    }
                }
                if (ret) {
                    this.selectedItem.userAction = "none"
                    this.clearPerformer()
                    this.$refs.dailyData && this.$refs.dailyData.itemChanged()
                }
                this.show_snack(ret)
                this.updateLoading = false
            },

            performerClicked() {
                this.selectedAmount = []
            }
        }
    }
</script>