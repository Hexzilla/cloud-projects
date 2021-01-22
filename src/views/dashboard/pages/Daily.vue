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
                            label="Append"
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
                                <v-row class="mt-4" style="width:300px; float:right">
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
                                <template v-slot:append="{ item }">
                                    <v-row v-if="item.level > 0" style="width: 300px">
                                        <v-col class="py-0 my-0">
                                            <v-text-field
                                                label="Hr"
                                                @change="setHr($event, item)"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col class="py-0 my-0">
                                            <v-text-field
                                                label="Min"
                                                @change="setMin($event, item)"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col class="py-0 my-0">
                                            <v-text-field
                                                label=""
                                                @change="setPct($event, item)"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col class="py-0 my-0">
                                            <v-text-field
                                                label=""
                                                @change="setTotalPct($event, item)"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col class="py-0 my-0">
                                            <v-text-field
                                                label="Hr"
                                                disabled
                                            ></v-text-field>
                                        </v-col>
                                        <v-col class="py-0 my-0">
                                            <v-text-field
                                                label="Min"
                                                disabled
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
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

    export default {
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
            allPerformers: []
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
                await api.updateTaskList(project)

                this.treeItems = []
                project.phases.length > 0 && project.phases.forEach(item => {
                    item.serverItems.length > 0 && this.setIkeyAndName(item.serverItems)
                    item.serverItems.length > 0 && item.serverItems.forEach(item1 => {
                        this.treeItems.push(item1)
                    })
                })
                
                this.wait = false
            },

            searchKeyChange: function(event) {
                this.projects = this.allProjects.filter(item => item.prj_name.toUpperCase().includes(event.toUpperCase()))
            },

            setIkeyAndName: function(items) {
                items.forEach((item, index) => {
                    if (item.level == 0) {
                        item.ikey = index
                    }else if (item.level == 1) {
                        item.name = item.TL1_name
                        item.ikey = 100 + index
                    } else if (item.level == 2) {
                        item.name = item.TL2_name
                        item.ikey = 200 + index
                    } else if (item.level == 3) {
                        item.name = item.TL3_name
                        item.ikey = 300 + index
                    } else {
                        item.name = item.TL4_name
                        item.level = 4
                        item.ikey = 400 + index
                    }
                    item.hr = ''
                    item.min = ''
                    item.pct = ''
                    item.totalPct = ''
                    item.children && item.children.length > 0 && this.setIkeyAndName(item.children)
                })
            },

            saveBtnClicked: async function() {
                this.wait = true
                console.log("supervisor", this.supervisor)
                console.log("performer", this.performer)

                let data1 = [], data2 = [], data3 = [], data4 = []
                console.log("treeItems", this.treeItems)
                this.treeItems.length > 0 && this.treeItems.forEach(item => {
                    this.getItemsByLevel(item, data1, data2, data3, data4)
                })

                if (data1.length > 0)  {
                    data1.forEach(async (item) => {
                        await daily_api.add1(item)
                    })
                    await daily_api.update1()
                }
                if (data2.length > 0)  {
                    data2.forEach(async (item) => {
                        await daily_api.add2(item)
                    })
                    await daily_api.update2()
                }
                if (data3.length > 0)  {
                    data3.forEach(async (item) => {
                        await daily_api.add3(item)
                    })
                    await daily_api.update3()
                }
                if (data4.length > 0)  {
                    data4.forEach(async (item) => {
                        await daily_api.add4(item)
                    })
                    await daily_api.update4()
                }
                //getItemsByLevel(this.treeItems, data1, data2, data3)
                // console.log("data1", data1)
                // console.log("data2", data2)
                // console.log("data3", data3)
                // console.log("data4", data4)
                this.wait = false
            },

            setHr: function(event, item) {
                item.hr = event
            },

            setMin: function(event, item) {
                item.min = event
            },

            setPct: function(event, item) {
                item.pct = event
            },

            setTotalPct: function(event, item) {
                item.totalPct = event
            },

            getItemsByLevel(items, data1, data2, data3, data4) {
                console.log("items", items)
                items.supervisor = this.supervisor
                items.performer = this.performer

                items.level == 1 && data1.push(items)
                items.level == 2 && data2.push(items)
                items.level == 3 && data3.push(items)
                items.level == 4 && data4.push(items)

                items.children && items.children.length > 0 && items.children.forEach(item => {
                    console.log("item", item)
                    this.getItemsByLevel(item, data1, data2, data3, data4)
                })
            }
        }
    }
</script>