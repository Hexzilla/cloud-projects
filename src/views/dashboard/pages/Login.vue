<template>
    <v-app style="background-color: rgba(24, 103, 192, .8)">
        <v-card
            class="mx-auto"
            style="width: 500px; margin-top: 100px"
            elevation="15"
            max-width="500">
            <v-card-title class="py-5 px-5">
                <h2>Log In</h2>
            </v-card-title>
            <v-container>
                <v-form ref="form" lazy-validation>
                    <v-row>
                        <v-col>
                            <v-text-field
                                label="Email"
                                prepend-icon="mdi-email"
                                :rules="emailRules"
                                v-model="email"
                                :error-messages="errorMessageEmail"
                                @keydown="errorMessageEmail = ''"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-text-field
                                label="Password"
                                prepend-icon="mdi-account-lock"
                                type="password"
                                :rules="passwordRules"
                                v-model="password"
                                :error-messages="errorMessagePassword"
                                @keydown="errorMessagePassword = ''"
                                counter
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
            </v-container>
            <v-card-actions>
                <div class="text-center" style="width:100%">
                    <v-btn color="teal" @click="onLogin">
                        Log In
                    </v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-app>
</template>

<script>

import auth_api from "@/apis/auth.js";

export default {
    data: () => ({
        email: "",
        password: "",
        errorMessageEmail: "",
        errorMessagePassword: "",
    }),

    created: function() {
    },

    computed: {
        emailRules() {
            return [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ]
        },
        passwordRules() {
            return [
                (v) => !!v || "Password is required",
                (v) => (v && v.trim().length > 0) || "Password is required",
                (v) =>
                    (v && v.length >= 6) ||
                    `This field must be greater than 6 characters`,
            ];
        },

    },

    methods: {
        async onLogin() {
            if (!this.$refs.form.validate()) return
            let status = await auth_api.login(this.email, this.password)
            if (status) {
                localStorage.setItem('email', this.email)
                localStorage.setItem('jwt', status)

                if (localStorage.getItem('jwt') != null){
                    this.$router.push('/')
                }
            } else {
                this.errorMessageEmail = "No registered eamil"
                this.errorMessagePassword = "No registered password"
            }
        }
    }
}
</script>