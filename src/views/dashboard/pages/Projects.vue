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
                    <v-card-title class="flex flex-row-reverse px-0 mx-0">
                        <v-btn small :disabled="wait" v-on:click="project_addButtonClicked" color="primary">New Project</v-btn>
                    </v-card-title>
                    <v-list :disabled="wait">
                        <v-list-item-group>
                            <v-list-item v-for="(item, i) in projects" :key="i">
                                <v-list-item-content v-on:click="project_listItemClicked(item)">
                                    <v-list-item-title v-text="item.prj_name"></v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon @click="project_editButtonClicked(item)">
                                    <v-progress-circular
                                        v-if="waitProject == item"
                                        indeterminate
                                        color="green"
                                        :width="2"
                                        :size="24"
                                    ></v-progress-circular>
                                    <v-icon 
                                        v-if="waitProject != item"
                                        color="primary"
                                    >mdi-square-edit-outline</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="12" sm="12" md="9">
                <ProjectDetails 
                    v-on:addPhase="phase_addButtonClicked"
                    v-bind:project="this.selectedProject"
                ></ProjectDetails>
                <div v-if="this.selectedProject != null">
                    <ProjectPhase
                        v-for="phase in this.selectedProject.phases"
                        :key="phase.phase_id"
                        v-bind:phase="phase"
                        v-bind:treeItems="treeItems"
                    ></ProjectPhase>
                </div>
            </v-col>
        </v-row>
        
        <!--Add project dialog-->
        <v-dialog v-model="addDialog" max-width="500px">
            <AddProjectDialog 
                v-on:save="project_dialogSaveButtonClicked" 
                v-on:close="addDialog=false"
                v-bind:clients="clients"
                v-bind:project="sampleProject"
                v-bind:edit="editProject"
            ></AddProjectDialog>
        </v-dialog>

        <!--Add phase dialog-->
        <v-dialog v-model="phaseDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Add Phase</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <DatePicker
                                textName="Date From"
                                :date="phaseFromDate"
                                :submit="(date) => phaseFromDate = date"
                                :endDate="phaseToDate"
                            ></DatePicker>
                        </v-row>
                        <v-row>
                            <DatePicker
                                textName="Date From"
                                :date="phaseToDate"
                                :submit="(date) => phaseToDate = date"
                                :startDate="phaseFromDate"
                            ></DatePicker>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closePhaseDialog"> Cancel </v-btn>
                    <v-btn :disabled="phaseValid" color="blue darken-1" text @click="phase_dialogAddButtonClicked">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
</v-container>
</template>

<script>
import moment from 'moment'
import api from "@/apis/project.js";
import client_api from "@/apis/client.js";
import ProjectDetails from './ProjectDetails'
import AddProjectDialog from './AddProjectDialog'
import ProjectPhase from './ProjectPhase'
import DatePicker from './DatePicker'

export default {
    components: {
        ProjectDetails,
        AddProjectDialog,
        ProjectPhase,
        DatePicker,
    },

    data: () => ({
        projects: [],
        clients: [],
        wait: false,
        waitProject: null,
        selectedProject: null,
        sampleProject: {},
        editProject: false,
        addDialog: false,
        initiallyOpen: ["public"],
        treeItems: [],
        phaseDialog: false,
        phaseFromDate: '',
        phaseFromMenu: false,
        phaseToDate: '',
        phaseToMenu: false,
    }),

    created: async function() {
        this.wait = true
        this.projects = await api.getProjects()
        this.treeItems = await api.getTree()
        this.clients = await client_api.findAll()
        this.wait = false
    },

    computed: {
        phaseValid() {
            if (this.phaseFromDate && this.phaseToDate)
                return false
            return true
        },
    },

    methods: {
        submit: function () {},
        
        project_listItemClicked: async function(project) {
            console.log('listItemClicked', project.updated)
            if (!project.updated) {
                this.wait = true
                this.waitProject = project
                
                await api.updateTaskList(project)
                this.wait = false
                this.waitProject = null
            }
            this.selectedProject = project
        },

        project_addButtonClicked: function() {
            console.log('project_addButtonClicked')
            this.editProject = false
            this.sampleProject = this.project_sample()
            this.addDialog = true
        },

        project_editButtonClicked: function(project) {
            console.log('project_editButtonClicked')
            this.selectedProject = project
            this.sampleProject = project
            this.editProject = true
            this.addDialog = true
        },

        project_dialogSaveButtonClicked: function(params) {
            this.addDialog = false
            if (params.edit) { //edit project
                this.project_edit(this.selectedProject, params.project)
            }
            else {
                this.project_add(params.project)
            }
        },

        project_add: async function(project) {
            this.wait = true

            const result = await api.addProject(project)
            if (result) {
                const updated = await api.getProjectWithPhase(project.prj_code)
                    if (updated && updated.length > 0) {
                        this.projects.push(updated[0])
                    }
            }
            this.project_reset()
            this.wait = false
        },

        project_edit: async function(selected, updated) {
            this.wait = true
            this.waitProject = selected

            const project = Object.assign(selected, updated)
            const result = await api.updateProject(project)
            if (result) {
                const index = this.projects.indexOf(selected)
                if (index >= 0) {
                    this.projects[index] = Object.assign({}, selected, updated)
                }
            }
            this.project_reset()
            
            this.waitProject = null
            this.wait = false
        },

        project_reset: function() {
            
        },

        project_sample: function() {
            return {
                prj_name: '',
                prj_code: '',
                cl_id: 0,
                prj_presalesopendate:     '', //moment().format("YYYY-MM-DD"),
                prj_presalesclosedate:    '',
                prj_executionopendate:    '',
                prj_executionclosedate:   '',
                prj_warrantyopendate:     '',
                prj_warrantyclosedate:    '',
            }
        },

        phase_addButtonClicked: function() {
            this.phaseFromDate = ''
            this.phaseToDate = ''
            this.phaseDialog = true
        },

        phase_dialogAddButtonClicked: async function() {
            console.log('phase_dialogAddButtonClicked', this.selectedProject)
            const number = this.getPhaseNumber(this.selectedProject.phases) + 1
            if (number <= 5) {
                this.phaseDialog = false
                this.wait = true

                var newPhase =    {
                    "phase_opendate": this.phaseFromDate,
                    "phase_closedate": this.phaseToDate,
                    "phase_id": 0,
                    "phaseNumber": number,
                    "serverItems": []
                }
                const tempPhases = [...this.selectedProject.phases, newPhase]
                const result = await api.phaseSet(this.selectedProject.prj_id, tempPhases)
                if (result) {
                    const updated = await api.getProjectWithPhase(this.selectedProject.prj_code)
                    if (updated && updated.length > 0) {
                        const addedPhase = updated[0].phases.find(it => it.phaseNumber == number)
                        if (!addedPhase) {
                            console.log('Someting wrong [AddPhase]');
                        }
                        else {
                            this.selectedProject.phases.push(addedPhase)
                        }
                    }
                }
                this.wait = false
            }
        },

        closePhaseDialog: function() {
            this.phaseDialog = false; 
        },

        getPhaseNumber: function(phases) {
            if (phases && phases.length > 0) {
                const numbers = phases.map((it) => it.phaseNumber)
                return Math.max.apply(Math, numbers)
            }
            return 0
        },
    },
};
</script>
