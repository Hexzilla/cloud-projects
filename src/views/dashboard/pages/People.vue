<template>
    <v-container id="regular-tables" tag="section">
        <v-card icon="mdi-file-tree" title="Task List" class="px-5 py-2">
            <v-data-table
                :headers="headers"
                :items="people"
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
                                New2
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
                        
			            <!--Add Dialog Begin-->
                        <v-dialog v-model="dialog" max-width="500px">
                            <v-card>
                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-form ref="form" v-model="valid" lazy-validation>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field
                                                    v-model="editedItem.firstname"
                                                    :rules="nameRules"
                                                    label="First Name"
                                                    required
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field
                                                    v-model="editedItem.lastname"
                                                    :rules="nameRules"
                                                    label="Last Name"
                                                    required
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select
                                                    v-model="editedItem.gender"
                                                    :items="genderList"
                                                    attach
                                                    item-text="name"
                                                    item-value="value"
                                                    label="Gender"
                                                ></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select
                                                    v-model="editedItem.country"
                                                    :items="countries"
                                                    attach
                                                    item-text="name"
                                                    item-value="id"
                                                    label="Country of Region"
                                                ></v-select>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <DatePicker
                                                textName="Date of Birth"
                                                :date="editedItem.DOB"
                                                :submit="(date) => editedItem.DOB = date"
                                            ></DatePicker>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field
                                                    v-model="editedItem.fullNameOfFather"
                                                    :rules="nameRules"
                                                    label="Father's Full Name"
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field
                                                    v-model="editedItem.fullNameOfMother"
                                                    :rules="nameRules"
                                                    label="Mother's Full Name"
                                                ></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field
                                                    v-model="editedItem.email"
                                                    :rules="emailRules"
                                                    label="Email"
                                                    required
                                                ></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field
                                                    v-model="editedItem.pwd"
                                                    :rules="passwordRules"
                                                    label="Password"
                                                    required
                                                ></v-text-field>
                                            </v-col>
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

                <template v-slot:item.gender="{ value }">
                    {{ value == 'm'? 'Male' : 'Female' }}
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon small disabled @click="deleteItem(item)"> mdi-delete </v-icon>
                </template>

                <template v-slot:no-data>
                    <v-btn color="primary" small outlined @click="initialize"> Reset </v-btn>
                </template>
            </v-data-table>
        </v-card>

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
        genderList: [ {name: 'Male', value: 'm'}, { name: 'Female', value: 'w' } ],
        headers: [
            { text: "First Name", align: "start", value: "firstname" },
            { text: "Last Name", value: "lastname" },
            { text: "Gender", value: "gender" },
            { text: "Date of Birth", value: "DOB" },
            { text: "Email", value: "email" },
            { text: "Actions", align: "right", value: "actions", sortable: false },
        ],
        people: [],
        countries: [],
        editedIndex: -1,
        editedItem: {},
        defaultItem: {
            id: 0,
            firstname: "",
            lastname: "",
            gender: "",
            country: 0,
            fullNameOfFather: "",
            fullNameOfMother: "",
            email: "",
            pwd: "",
            DOB: '',
            COO: 1,
        },
    }),

    created: async function () {
        this.editedItem = Object.assign({}, this.defaultItem)
        await this.initialize()
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Add People" : "Edit People";
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
            this.loading = false;
        },

        addItem() {
            this.openAddDialog()
        },

        editItem(item) {
            this.editedIndex = this.people.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.openAddDialog()
        },
        
        openAddDialog() {
            if (this.$refs.form) {
                    this.$refs.form.resetValidation();
            }
            this.dialog = true;
        },

        deleteItem(item) {
            this.editedIndex = this.people.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },

        deleteItemConfirm() {
            this.people.splice(this.editedIndex, 1);
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
            if (!this.$refs.form.validate()) {
                    return;
            }	

            const selectedIndex = this.editedIndex
            const item = Object.assign({}, this.editedItem)
            this.close();

            this.loading = true
            {
                let success = false
                if (selectedIndex > -1) {
                    success = await people_api.update(item) 
                    if (success) {
                        Object.assign(this.people[selectedIndex], item);
                    }
                } 
                else {
                    const addedItem = await people_api.add(item)
                    if (addedItem) {
                        success = true
                        this.people.push(addedItem);
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
    },
};
</script>
