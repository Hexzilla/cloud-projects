<template>
    <v-container id="regular-tables" tag="section">
        <v-card icon="mdi-file-tree" title="Task List" class="px-5 py-2">
            <v-data-table
                :headers="headers"
                :items="associates"
                :search="search"
                :loading="loading"
                loading-text="Loading... Please wait"
                sort-by="id"
            >
                <template v-slot:top>
                    <v-container>
                        <div class="d-flex flex-row-reverse" flat tile>
                            <v-btn
                                color="primary"
                                dark
                                class="mb-2"
                                @click="addItem"
                            >
                                New
                            </v-btn>
                        </div>
                        <div flat tile>
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                single-line
                                hide-details
                            ></v-text-field>
                        </div>

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
                    </v-container>
                </template>

                <template v-slot:item.assocationType="{ item, value }">
                    {{ value == 'e' ? 'Employee' : 'Consultant' }}
                </template>
                <template v-slot:item.assocationStatus="{ item, value }">
                    {{ value.toUpperCase() }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small class="mr-2" @click="roleEdit(item)">
                        mdi-account
                    </v-icon>
                    <v-icon small disabled @click="deleteItem(item)"> mdi-delete </v-icon>
                </template>

                <template v-slot:no-data>
                    <v-btn color="primary" small outlined @click="initialize"> Reset </v-btn>
                </template>
            </v-data-table>
        </v-card>

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
                                <v-select
                                    v-model="editedItem.personid"
                                    :items="people"
                                    :rules="defaultRules"
                                    attach
                                    item-text="firstname"
                                    item-value="id"
                                    label="Person"
                                    required
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="12" md="6">
                                <v-select
                                    v-model="editedItem.assocationType"
                                    :items="associationTypes"
                                    :rules="defaultRules"
                                    attach
                                    item-text="name"
                                    item-value="value"
                                    label="Association Type"
                                    required
                                ></v-select>
                            </v-col>
                            <v-col cols="12" sm="12" md="6">
                                <v-select
                                    v-model="editedItem.assocationStatus"
                                    :items="associationStatus"
                                    :rules="defaultRules"
                                    attach
                                    item-text="name"
                                    item-value="value"
                                    label="Association Status"
                                    required
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-select
                                    v-model="editedItem.designation"
                                    :items="designations"
                                    :rules="defaultRules"
                                    attach
                                    item-text="name"
                                    item-value="value"
                                    label="Designation"
                                    required
                                ></v-select>
                            </v-col>
                            <!--
                            <v-col cols="12" sm="12" md="6">
                                <v-select
                                    v-model="editedItem.role"
                                    :items="roles"
                                    :rules="defaultRules"
                                    attach
                                    multiple
                                    item-text="name"
                                    item-value="value"
                                    label="Roles"
                                    required
                                ></v-select>
                            </v-col>
                            -->
                        </v-row>
                        <v-row>
                            <DatePicker
                                textName="Joined Date"
                                :date="editedItem.joinDate"
                                :submit="(date) => editedItem.joinDate = date"
                            ></DatePicker>
                            <DatePicker
                                textName="Separated Date"
                                :date="editedItem.seperation"
                                :submit="(date) => editedItem.seperation = date"
                            ></DatePicker>
                        </v-row>
                        <v-row>
                            <DatePicker
                                textName="Joining Date"
                                :date="editedItem.JoinDateForResourcePlanning"
                                :submit="(date) => editedItem.JoinDateForResourcePlanning = date"
                            ></DatePicker>
                            <DatePicker
                                textName="Separating Date"
                                :date="editedItem.SeperationDateForResourcePlanning"
                                :submit="(date) => editedItem.SeperationDateForResourcePlanning = date"
                            ></DatePicker>
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

        <!--Add Role Dialog Begin-->
        <v-dialog v-model="roleDialog" max-width="700px" >
            <v-card>
                <v-card-title>
                    <span class="headline">Roles</span>
                </v-card-title>

                <v-card-text>
                    <v-form ref="form1" v-model="valid1" lazy-validation>
                        <v-row>
                            <v-col cols="12" sm="12" md="12">
                                <v-select
                                    :items="roleData"
                                    attach
                                    item-text="name"
                                    item-value="id"
                                    label="Roles"
                                    v-model="selectedRoleId"
                                    multiple
                                    required
                                    @change="roleDataChanged"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <template v-for="(item, i) in selectedRoles">
                            <v-row :key="i">
                                <v-col style="display:flex; align-items:center;">
                                    {{ item.name }}
                                </v-col>
                                <v-col>
                                    <DatePicker
                                        textName="Date From"
                                        :date="item.data.effectivefromdate"
                                        :submit="(date) => item.data.effectivefromdate = date"
                                    ></DatePicker>
                                </v-col>
                                <v-col>
                                    <DatePicker
                                        textName="Date To"
                                        :date="item.data.effectivetodate"
                                        :submit="(date) => item.data.effectivetodate = date"
                                    ></DatePicker>
                                </v-col>
                            </v-row>
                        </template>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeRole"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="saveRole"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!--Add Role Dialog End-->
        <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
            {{ snackText }}
            <template v-slot:action="{ attrs }">
                <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script>
import DatePicker from './DatePicker'
import associate_api from "@/apis/associate.js";
import role_api from "@/apis/role.js";
import designation_api from "@/apis/designation.js";
import people_api from "@/apis/people.js";
import country_api from "@/apis/country.js";

export default {
    components: {
        DatePicker,
    },
    
    data: () => ({
        loading: true,
        snack: false,
        snackColor: "",
	    snackText: "",
        valid: true,
        maxNameLength: 200,
        maxCodeLength: 20,
        maxPasswordLength: 200,
        inlineEditedCode: "",
        inlineEditedName: "",
        search: "",
        dialog: false,
        dialogDelete: false,
        associationTypes: [ 
            { name: 'Employee', value: 'e' }, 
            { name: 'Consultant', value: 'c' } 
        ],
        associationStatus: [ 
            { name: 'To Be Joined', value: 'toBeJoined' }, 
            { name: 'Joined', value: 'joined' }, 
            { name: 'Seperated', value: 'seperated' },
        ],
        headers: [
            { text: "First Name", align: "start", value: "firstname" },
            { text: "Last Name", value: "lastname" },
            { text: "Email", value: "email" },
            { text: "Assocation Type", value: "assocationType" },
            { text: "Assocation Status", value: "assocationStatus" },
            { text: "Joined Date", value: "joinDate" },
            { text: "Actions", align: "right", value: "actions", sortable: false },
        ],
        people: [],
        associates: [],
        countries: [],
        designations: [],
        roles: [],
        editedIndex: -1,
        editedItem: {},
        defaultItem: {
            id: 0,
            assocationType: "",
            assocationStatus: "",
            JoinDateForResourcePlanning: null,
            SeperationDateForResourcePlanning: null,
            joinDate: "",
            seperation: null,
            holidaycalid: 1,
            personid: 0,
            firstname: "Karthik U",
            lastname: "K U",
            DOB: "",
            email: "",
            designation: '',
            role: '',
        },
        roleDialog: false,
        valid1: false,
        roleData: [],
        selectedRoles: [],
        selectedRoleId: [],
        initialRolesId: []
    }),

    created: async function () {
        this.editedItem = Object.assign({}, this.defaultItem)
        await this.initialize()
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Add People" : "Edit People";
        },
        defaultRules() {
            return [(v) => !!v || 'This field is required']
        },
        codeRules() {
            return [
                (v) => !!v || "Code is required",
                (v) => /[a-zA-Z0-9]+$/.test(v) || 'Code must only contain letters',
                (v) =>
                    (v && v.length <= this.maxCodeLength) ||
                    `Code must be less than ${this.maxCodeLength} characters`,
            ];
        },
        nameRules() {
            return [
                (v) => !!v || "This field is required",
                (v) => (v && v.trim().length > 0) || "This field is required",
                (v) =>
                    (v && v.length <= 200) ||
                    `This field must be less than 200 characters`,
            ];
        },
        emptiableNameRules() {
            return [
                (v) =>
                    !v || v.length <= 200 ||
                    `This field must be less than 200 characters`,
            ];
        },
        emailRules() {
            return [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ]
        },
        passwordRules() {
            return [
                v => !!v || 'Password is required',
                (v) => (v && v.trim().length > 0) || "Password is required",
                (v) =>
                    (v && v.length <= this.maxPasswordLength) ||
                    `Password must be less than ${this.maxPasswordLength} characters`,
            ]
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

    methods: {
        async initialize() {
            this.loading = true
            this.people = await people_api.findAll()
            this.countries = await country_api.findAll()
            this.designations = await designation_api.findAll()
            this.roles = await role_api.findAll()
            this.associates = await associate_api.findAll()

            this.roleData = associate_api.getRoleWithData(this.roles)
            console.log("role data", this.roleData)

            this.loading = false
        },

        addItem() {
            this.openAddDialog()
        },

        editItem(item) {
            this.editedIndex = this.associates.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.openAddDialog()
        },

        async roleEdit(item) {
            this.loading = true
            this.selectedRoles = []
            this.selectedRoleId = []
            // this.editedIndex = this.associates.indexOf(item);
            this.editedItem = Object.assign({}, item);
            let one = await associate_api.findOne(item.id)
            let data = one[0].assignedRoles
            if (data && data.length > 0) {
                data.forEach(item=> {
                    // let selected = this.roles.find(element => element.id == item.rolesid)
                    // item.name = selected.name
                    // item.recordType = "update"
                    // this.selectedRoles.push(item.rolesid)
                    this.roleData.forEach(role=> {
                        if (role.id == item.rolesid) {
                            role.data = item
                            this.selectedRoles.push(role)
                            this.selectedRoleId.push(role.id)
                            this.initialRolesId.push(role.id)
                        }
                    })
                })
            }
            
            console.log("selected role", this.selectedRoles)
            this.roleDialog = true
            this.loading = false
        },
        
        openAddDialog() {
            if (this.$refs.form) {
                this.$refs.form.resetValidation();
            }
            this.dialog = true;
        },

        deleteItem(item) {
            this.editedIndex = this.associates.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },

        deleteItemConfirm() {
            this.associates.splice(this.editedIndex, 1);
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

        async save() {
            if (!this.$refs.form.validate()) return
            const selectedIndex = this.editedIndex
            const item = Object.assign({}, this.editedItem)
            this.close();

            this.loading = true
            {
                let success = false
                if (selectedIndex > -1) {
                    success = await associate_api.update(item) 
                    if (success) {
                        Object.assign(this.associates[selectedIndex], item);
                    }
                } 
                else {
                    const addedItem = await associate_api.add(item)
                    if (addedItem) {
                        success = true
                        this.associates.push(addedItem);
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

        closeRole() {
            this.roleDialog = false
        },
        
        async saveRole() {
            if (!this.$refs.form1.validate()) return

            this.loading = true
            this.closeRole()
            this.setRecordType(this.initialRolesId, this.selectedRoleId)
            console.log("role data", this.roleData)
            await associate_api.roleAssign(this.editedItem.id, this.roleData)
            this.loading = false
        },

        roleDataChanged() {
            console.log("selected: ", this.selectedRoleId)
            this.selectedRoles = []
            this.selectedRoleId.length > 0 && this.selectedRoleId.forEach(id=> {
                this.roleData.forEach(role=> {
                    if (role.id == id) {
                        this.selectedRoles.push(role)
                    }
                })
            })
        },

        setRecordType(initalIds, selectedIds) {
            console.log("initial---------", initalIds)
            console.log("selected", selectedIds)
            let addedIds = selectedIds.filter(x => initalIds.indexOf(x) === -1)
            let removedIds = initalIds.filter(x => selectedIds.indexOf(x) === -1)
            let updatedIds = selectedIds.filter(x => addedIds.indexOf(x) === -1)

            console.log("added", addedIds)
            console.log("removed", removedIds)
            console.log("updated", updatedIds)

            addedIds.length > 0 && this.roleData.forEach(role => {
                addedIds.forEach(added => {
                    if (role.id == added)
                        role.data.recordType = "newLine"
                })
            })
            removedIds.length > 0 && this.roleData.forEach(role => {
                removedIds.forEach(added => {
                    if (role.id == added)
                        role.data.recordType = "removeLine"

                })
            })
            updatedIds.length > 0 && this.roleData.forEach(role => {
                updatedIds.forEach(added => {
                    if (role.id == added)
                        role.data.recordType = "update"
                })
            })

        }
    },
};
</script>
