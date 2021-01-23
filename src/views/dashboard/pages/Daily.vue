<template>
    <v-container id="regular-tables" tag="section" fluid>
        <v-progress-linear
            indeterminate
            color="teal darken-2"
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
                <v-card class="my-0">
                    <v-card-title class="flex flex-row-reverse px-0 mx-0 py-0">
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-select
                                    v-model="supervisor"
                                    :items="supervisors"
                                    attach
                                    chips
                                    item-text="firstname"
                                    item-value="id"
                                    label="Supervisor"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-select
                                    v-model="performer"
                                    :items="performers"
                                    attach
                                    chips
                                    item-text="firstname"
                                    item-value="id"
                                    label="Performer"
                                ></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-row class="mt-4" style="width:350px; float:right">
                                    <v-col class="text-center">
                                        Today
                                    </v-col>
                                    <v-col class="text-center">
                                        Till Yesterday
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-title>
                    <v-row>
                        <v-col>
                            <v-treeview
                                :open="initiallyOpen"
                                :items="treeItems"
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
                            <template v-slot:append="{ item }">
                                <InputGroup 
                                v-bind:item="item"
                                style="width:350px">
                                </InputGroup>
                            </template>
                            </v-treeview>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="text-right">
                            <v-btn
                                elevation="2"
                                color="teal"
                                :disabled=saveValid
                                @click="saveBtnClicked"
                            >Save</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
</v-container>
</template>

<script>
    import api from "@/apis/project.js";
    import client_api from "@/apis/client.js";
    import daily_api from "@/apis/daily.js";
    import InputGroup from './InputGroup'

    export default {
        components: {
            InputGroup
        },

        data: () => ({
            wait: false,
            projects: [],
            allProjects: [],
            selectedProject: null,
            supervisor: null,
            supervisors: [],
            allSupervisors: [],
            initiallyOpen: ["public"],
            treeItems: [],
            performer: null,
            performers: [],
            allPerformers: [],
            waitProject: null
        }),
        
        created: async function() {
            this.wait = true
            this.allProjects = await api.getProjects()
            this.allPerformers = await client_api.findL1Members()
            this.allSupervisors = await client_api.findSupervisors()

            this.supervisors = this.allSupervisors
            this.performers = this.allPerformers
            this.projects = this.allProjects
            this.wait = false
        },

        computed: {
            saveValid() {
                if (this.wait)
                    return this.wait
                if (this.selectedProject && this.supervisor && this.performer && this.treeItems)
                    return false
                return true
            }
        },

        methods: {
            project_listItemClicked: async function(project) {
                this.wait = true
                this.selectedProject = project
                this.waitProject = project
                await api.updateTaskList(project)

                this.treeItems = []
                project.phases.length > 0 && project.phases.forEach(item => {
                    item.serverItems.length > 0 && this.setIkeyAndName(item.serverItems, 1)
                    item.serverItems.length > 0 && item.serverItems.forEach(item1 => {
                        this.treeItems.push(item1)
                    })
                })
                
                console.log("treeItems", this.treeItems)       
                this.waitProject = null         
                this.wait = false
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

            saveBtnClicked: async function() {
                this.wait = true
                console.log("supervisor", this.supervisor)
                console.log("performer", this.performer)

                let status = [false, false, false, false]
                console.log("treeItems", this.treeItems)
                this.treeItems.length > 0 && this.treeItems.forEach(item => {
                    this.addToServer(item, status)
                })

                if (status[0])  {
                    // await daily_api.update1()
                }
                if (status[1])  {
                    // await daily_api.update2()
                }
                if (status[2])  {
                    // await daily_api.update3()
                }
                if (status[3])  {
                    // await daily_api.update4()
                }
                this.wait = false
            },

            addToServer: async function(items, status) {
                console.log("item", items)
                items.supervisor = this.supervisor
                items.performer = this.performer

                let addStatus = true
                if (items.level == 1 && items.userAction == "nochange" && this.isFill(items)) {
                    // addStatus = await daily_api.add1(item)
                    addStatus && (items.userAction = "modified")
                    status[0] = true
                } else if (items.level == 2 && items.userAction == "nochange" && this.isFill(items)) {
                    // addStatus = await daily_api.add2(item)
                    addStatus && (items.userAction = "modified")
                    status[1] = true
                } else if (items.level == 3 && items.userAction == "nochange" && this.isFill(items)) {
                    // addStatus = await daily_api.add3(item)
                    addStatus && (items.userAction = "modified")
                    status[2] = true
                } else if (items.level == 4 && items.userAction == "nochange" && this.isFill(items)) {
                    // addStatus =  await daily_api.add4(item)
                    addStatus && (items.userAction = "modified")
                    status[3] = true
                }

                items.children && items.children.length > 0 && items.children.forEach(item => {
                    this.addToServer(item, status)
                })
            },

            isFill: function(item) {
                return item.hr && item.min && item.pct && item.totalPct
            }
        }
    }
</script>