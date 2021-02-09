<template>
    <v-container fluid>
        <v-progress-linear
            class="mb-1"
            indeterminate
            color="green"
            v-if="wait">
        </v-progress-linear>
        <v-row>
            <v-col cols="12" md="5">
                <base-material-card
                color="green"
                >
                    <template v-slot:heading>
                        <div class="display-1 font-weight-light">
                            Project List
                        </div>
                    </template>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field
                                label="Project Code"
                                dense
                                v-model="search_code"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field
                                label="Project Name"
                                dense
                                v-model="search_name"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field
                                label="Enqiry Number"
                                dense
                                v-model="search_number"
                                >
                                </v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" sm="6">
                                <v-text-field
                                label="Client Name"
                                dense
                                v-model="search_client"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="px-0 py-0 text-center">
                                <v-btn color="primary" small elevation="10" @click="searchProjects">
                                    <v-icon>mdi-magnify</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="text-right">
                                <v-btn color="pink" text small v-on:click="project_addButtonClicked" :disabled="wait">
                                    New Project
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
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
                            </v-col>
                        </v-row>
                    </v-card-text>
                </base-material-card>
            </v-col>
            <v-col cols="12" md="7">
                <base-material-card
                icon="mdi-notebook-edit"
                title="Phase List"
                color="purple"
                class="px-5 py-3"
                >
                    <v-row>
                        <v-col>
                            <v-text-field
                            label="Project Code"
                            v-model="projectCode"
                            readonly
                            >
                            </v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field
                            label="Client"
                             v-model="projectClient"
                             readonly
                            >
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field
                            label="Project Name"
                            v-model="projectName"
                            readonly
                            >
                            </v-text-field>
                        </v-col>
                        <v-col>
                            <v-text-field
                            label="ref.Enquiry Number"
                            v-model="projectEnqNumber"
                            readonly
                            >
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field
                            label="Approval stsatus"
                            v-model="projectApproval"
                            readonly
                            >
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="text-center">
                            <v-btn
                                color="purple"
                                elevation="10"
                                @click="projectApprove"
                            >
                                Approve
                            </v-btn>
                        </v-col>
                    </v-row>

                    <hr>
                    <v-row>
                        <v-col>
                            <p class="text--disabled">PHASES</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="text-right">
                            <v-btn x-small color="purple" fab @click="phase_addButtonClicked">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-simple-table>
                                <tbody>
                                    <template v-if="project">
                                        <tr v-for="(item, i) in project.phases" :key="i">
                                            <td>{{item.phaseNumber}}</td>
                                            <td>{{item.phase_opendate}}</td>
                                            <td>{{item.phase_closedate}}</td>
                                            <td>    
                                                <v-icon color="purple" @click="changePhase(item)">
                                                    mdi-square-edit-outline
                                                </v-icon>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </v-simple-table>
                        </v-col>
                    </v-row>

                    <hr>
                    <v-row>
                        <v-col>
                            <p class="text--disabled">DOCUMENTS</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="text-right">
                            <v-btn x-small color="purple" fab>
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-simple-table>
                                <tbody>
                                    <template v-if="project">
                                        <tr v-for="(item, i) in project.documents" :key="i">
                                            <td>{{i + 1}}</td>
                                            <td>{{item.documentStorefileDescription}}</td>
                                        </tr>
                                    </template>
                                </tbody>
                            </v-simple-table>
                        </v-col>
                    </v-row>
                </base-material-card>
            </v-col>
        </v-row>
        
        <!--Add project dialog-->
        <v-dialog v-model="addDialog" max-width="500px">
            <AddProjectDialog 
                v-on:save="project_dialogSaveButtonClicked" 
                v-on:close="addDialog=false"
                v-bind:clients="clients"
                v-bind:project="project"
                v-bind:edit="editProject"
                v-bind:associates="associates"
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
                                :startDate="maxPhaseDate && maxPhaseDate"
                                :endDate="phaseToDate"
                            ></DatePicker>
                        </v-row>
                        <v-row>
                            <DatePicker
                                textName="Date To"
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
                    <v-btn color="blue darken-1" text @click="phase_dialogAddButtonClicked">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
import project_api from "@/apis/project.js"
import client_api from "@/apis/client.js"
import associate_api from "@/apis/associate.js"
import AddProjectDialog from './AddProjectDialog'
import DatePicker from './DatePicker'

export default {
    components: {
        AddProjectDialog,
        DatePicker,
    },

    data: () => ({
        wait: false,
        
        snack: false,
        snackColor: "success",
	    snackText: "",

        search_code: null,
        search_name: null,
        search_number: null,
        search_client: null,

        clients: [],
        projects: [],
        project: null,
        waitProject: null,

        addDialog: false,
        editProject: false,

        phaseDialog: false,
        phaseFromDate: '',
        phaseFromMenu: false,
        phaseToDate: '',
        phaseToMenu: false,
        maxPhaseDate: null,

        phase: null,
        phaseEdit: false,

        associates: []
    }),

    computed: {
      projectName: function() {
        return (this.project) ? this.project.prj_name : ''
      },
      projectCode: function() {
        return (this.project) ? this.project.prj_code : ''
      },
      projectClient: function() {
        let name = ''
        this.project && this.clients.forEach(client => {
          if (client.id == this.project.cl_id) {
            name = client.name
            return
          }
        })
        return name
      },
      preSalesDateRange() {
        if (this.project == null) return ''
        return (this.project.prj_presalesopendate || '') + ' ~ ' + (this.project.prj_presalesclosedate || '')
      },
      billingDateRange() {
        if (this.project == null) return ''
        return (this.project.prj_executionopendate || '') + ' ~ ' + (this.project.prj_executionclosedate || '')
      },
      warrantyDateRange() {
        if (this.project == null) return ''
        return (this.project.prj_warrantyopendate || '') + ' ~ ' + (this.project.prj_warrantyclosedate || '')
      },
      projectApproval() {
          return (this.project) ? this.project.prj_approval : ''
      },
      projectEnqNumber() {
          return (this.project) ? this.project.prj_refEnqNumber : ''
      }
    },

    created: async function() {
        this.wait = true
        this.clients = await client_api.findAll()
        const temp= await associate_api.findAll('', '')
        this.associates = temp.filter(e => e.assocationStatus == "joined")
        console.log("associates", this.associates)
        this.wait = false
    },
    methods: {
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
        
        async searchProjects() {
            this.wait = true
            this.projects = await project_api.findAll(this.search_code, this.search_name, this.search_number, this.search_client)
            console.log("projects", this.projects)
            this.wait = false
        },

        async project_listItemClicked(project) {
            this.wait = true
            await this.getProject(project)
            this.wait = false
        },

        async getProject(project) {
            this.waitProject = project
            const temp = await project_api.getProjectWithPhase(project.prj_code)
            this.project = temp[0]
            this.waitProject = null
            this.setMaxPhaseDate()
        },

        project_editButtonClicked: async function(project) {
            // this.selectedProject = project
            // this.sampleProject = project
            await this.getProject(project)
            this.editProject = true
            this.addDialog = true
        },
        
        project_edit: async function(selected, updated) {
            this.wait = true
            this.waitProject = selected

            const project = Object.assign(selected, updated)
            const result = await project_api.updateProject(project)
            if (result) {
                const index = this.projects.indexOf(selected)
                if (index >= 0) {
                    this.projects[index] = Object.assign({}, selected, updated)
                }
            }
            
            this.waitProject = null
            this.wait = false
        },

        project_dialogSaveButtonClicked: function(params) {
            this.addDialog = false
            if (params.edit) { //edit project
                this.project_edit(this.project, params.project)
            }
            else {
                this.project_add(params.project)
            }
        },

        project_add: async function(project) {
            this.wait = true

            const result = await project_api.addProject(project)
            if (result) {
                const updated = await project_api.getProjectWithPhase(project.prj_code)
                    if (updated && updated.length > 0) {
                        this.projects.push(updated[0])
                    }
            }
            // this.project_reset()
            this.wait = false
        },

        project_addButtonClicked: function() {
            this.editProject = false
            this.project = this.project_sample()
            this.addDialog = true
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
                prj_refEnqNumber: '',   
                prj_projectmanagerhrid: 0
            }
        },

        phase_addButtonClicked: function() {
            this.phaseFromDate = ''
            this.phaseToDate = ''
            this.phaseDialog = true
            this.phaseEdit = false
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

        phase_dialogAddButtonClicked: async function() {
            this.wait = true
            this.phaseDialog = false

            if (this.phaseEdit) {
                let newPhase = {
                    "phase_opendate": this.phase.phase_opendate,
                    "phase_closedate": this.phase.phase_closedate,
                    "phase_id": this.phase.phase_id,
                    "phaseNumber": this.phase.phaseNumber,
                    "phase_allowdEdit": 1
                }
                const tempPhases = [newPhase]
                const result = await project_api.phaseSet(this.project.prj_id, tempPhases)
            } else {
                const number = this.getPhaseNumber(this.project.phases) + 1
                if (number <= 5) {
                    let newPhase = {
                        "phase_opendate": this.phaseFromDate,
                        "phase_closedate": this.phaseToDate,
                        "phase_id": 0,
                        "phaseNumber": number,
                        "phase_allowdEdit": 1
                    }
                    const tempPhases = [newPhase]
                    // [...this.selectedProject.phases, newPhase]
                    const result = await project_api.phaseSet(this.project.prj_id, tempPhases)
                    if (result) {
                        const updated = await project_api.getProjectWithPhase(this.project.prj_code)
                        if (updated && updated.length > 0) {
                            const addedPhase = updated[0].phases.find(it => it.phaseNumber == number)
                            if (!addedPhase) {
                                console.log('Something wrong [AddPhase]');
                            }
                            else {
                                this.project.phases.push(addedPhase)
                            }
                        }
                    }
                    this.show_snack(result)
                }
            }
            this.setMaxPhaseDate()
            this.wait = false   
        },

        setMaxPhaseDate () {
            if (this.project.phases.length > 0 && this.project.phases[this.project.phases.length - 1].phase_closedate)            
                this.maxPhaseDate = this.project.phases[this.project.phases.length - 1].phase_closedate
        },

        changePhase(item) {
            console.log("item", item)
            this.phase = item
            this.phaseDialog = true
            this.phaseEdit = true

            this.project.phases.forEach( (e, i) => {
                if (e == item) {
                    if (i == 0) {
                        this.maxPhaseDate = null
                        return
                    }
                    this.maxPhaseDate = this.project.phases[i - 1].phase_closedate
                }
            })
        },

        async projectApprove() {
            this.wait = true
            const result = await project_api.approveProject(this.project.prj_id)
            if (result) {
                this.project.prj_approval = "approved"
                this.show_snack(result)
            }
            this.wait = false
        }
    }
}
</script>