<template>
  <v-container> 

    <v-row>
      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="info"
          icon="mdi-excavator"
          title="Projects"
          :value="projectCount"
          :items="getProjectItems"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="primary"
          icon="mdi-shield-check"
          title="Roles"
          :value="roleCount"
          :items="getRoleItems"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="success"
          icon="mdi-rowing"
          title="Planned Leaves"
          :value="myLeaveCount"
          :items="getMyLeaveItems"
        />
      </v-col>

      <v-col
        cols="12"
        sm="6"
        lg="3"
      >
        <base-material-stats-card
          color="orange"
          icon="mdi-sail-boat "
          title="Collegue Leaves"
          :value="collegueLeaveCount"
          :items="getCollegueLeaveItems"
        />
      </v-col>
    </v-row>
    
    <v-row>
      <v-col class="py-0">
        <v-menu
          bottom
          right
          offset-y
          origin="top left"
          transition="scale-transition"
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              class="ml-2"
              min-width="0"
              text
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>
                mdi-account-star
              </v-icon>
            </v-btn>
          </template>

          <v-list>
            <div>
              <span class="px-3">
                Grade Points: {{gradePoints}}
              </span>
            </div>
          </v-list>
        </v-menu>
      </v-col>
      <v-col class="text-right py-0">
        <v-menu
          bottom
          left
          offset-y
          origin="top left"
          transition="scale-transition"
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              class="ml-2"
              min-width="0"
              text
              v-bind="attrs"
              v-on="on"
            >
              <v-badge color="pink" :content="messageCount" overlap>
                <v-icon>
                  mdi-bell
                </v-icon>
              </v-badge>
            </v-btn>
          </template>

          <v-list
            nav
          >
            <template v-for="(e, i) in messages">
              <div  :key="i">
                <v-list-item class="py-0">
                  <v-list-item-content>
                    <v-list-item-title>
                      <span class="body-1" :style="getStyle(e.markAsRead)">{{e.shortDesc}}</span>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{`Published Date: ` + e.publishedDate.substring(0, 10)}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
              </div>
            </template>
            <!--
            <div>
              <app-bar-item v-for="(e, i) in messages" :key="i">
                <v-list-item-title>
                  {{e.description}}
                </v-list-item-title>
              </app-bar-item>
            </div>
            -->
          </v-list>
        </v-menu>
      </v-col>
    </v-row>

    
    <v-row>
      <v-spacer></v-spacer>
      <v-col
        cols="12"
        sm="6"
        lg="4"
      >
        <base-material-stats-card
          color="purple"
          icon="mdi-text-account"
          title="Task"
          :value="taskCount"
          :detailDisable="true"
        />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    
    <v-row>      
      <v-col
        cols="12"
        md="6"
      >
        <base-material-card
          color="warning"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Active Tasks and Allocated Tasks
            </div>
          </template>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="activeTask"
            />
          </v-card-text>
        </base-material-card>
      </v-col>

      <v-col
        cols="12"
        md="6"
      >
        <base-material-card
          color="pink"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              Overdue Tasks
            </div>
          </template>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="dueTask"
            />
          </v-card-text>
        </base-material-card>

        <base-material-card
          color="primary"
          class="px-5 py-3"
        >
          <template v-slot:heading>
            <div class="display-2 font-weight-light">
              New Tasks for next Week
            </div>
          </template>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="futureTask"
            />
          </v-card-text>
        </base-material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import auth_api from "@/apis/auth.js";

export default {
  data: () => ({
    hrId: 0,
    data: {},
    activeTask: [],
    dueTask: [],
    futureTask: [],

    headers: [
      {
        sortable: false,
        text: 'No',
        value: 'no',
      },
      {
        sortable: false,
        text: 'Project',
        value: 'projectname',
      },
      {
        sortable: false,
        text: 'Task',
        value: 'TaskName',
      },
      {
        sortable: false,
        text: 'Date',
        value: 'date',
        align: 'center',
      }
    ]
  }),

  async created() {
    this.data = await auth_api.getDashBoardData('2021-02-01', '2021-03-31')

    if (this.data.my_tasks.length > 0) {
      this.activeTask = this.data.my_tasks.reduce((acc, cur)=> {
        if (cur.showThisLine_Category == "Active-and-allocated-task") {
          cur.date = cur.estimatedStartDate + ' ~ ' + cur.estimatedEndDate
          cur.no = acc.length + 1
          acc.push(cur)
        }
        return acc
      }, [])
    
      this.dueTask = this.data.my_tasks.reduce((acc, cur)=> {
        if (cur.showThisLine_Category == "Task.Due") {
          cur.date = cur.estimatedStartDate + ' ~ ' + cur.estimatedEndDate
          cur.no = acc.length + 1
          acc.push(cur)
        }
        return acc
      }, [])
    
      this.futureTask = this.data.my_tasks.reduce((acc, cur)=> {
        if (cur.showThisLine_Category == "My.futureTasks") {
          cur.date = cur.estimatedStartDate + ' ~ ' + cur.estimatedEndDate
          cur.no = acc.length + 1
          acc.push(cur)
        }
        return acc
      }, [])
    }
    console.log('data: ', this.data)
  },

  computed: {
    projectCount() {
      console.log('projects', this.data.my_projects)
      if (this.data && this.data.my_projects)
        return this.data.my_projects.length.toString()
      return '0'
    },

    myLeaveCount() {
      if (this.data && this.data.leaves_of_me)
        return this.data.leaves_of_me.length.toString()
      return '0'
    },

    collegueLeaveCount() {
      if (this.data && this.data.leaves_of_mycolleagues)
        return this.data.leaves_of_mycolleagues.length.toString()
      return '0'
    },

    roleCount() {
      if (this.data && this.data._my_roles)
        return this.data._my_roles.length.toString()
      return '0'
    },
    
    taskCount() {
      if (this.data && this.data.my_tasks)
        return this.data.my_tasks.length.toString()
      return '0'
    },

    messages() {
      let result = []
      if (this.data && this.data.notifications) {
        // return this.data.notifications
        this.data.notifications.forEach(e => {
          result.push(e)
          result.push(e)
        })
        return result
      }
      return []
    },

    messageCount() {
      if (this.data && this.data.notifications)
        return this.data.notifications.length.toString()
      return '0'
    },

    gradePoints() {
      if (this.data && this.data.PersonDetails)
        return this.data.PersonDetails[0].gradePoints
      return null
    },

    getProjectItems() {
      if (this.data && this.data.my_projects && this.data.my_projects.length > 0) {
        return this.data.my_projects.reduce((acc, cur) => {
          acc.push({ title: cur.projectname })
          return acc
        }, [])
      }
      return [{title: "no data"}]
    },

    getRoleItems() {
      if (this.data && this.data._my_roles && this.data._my_roles.length > 0) {
        return this.data._my_roles.reduce((acc, cur) => {
          acc.push({ title: cur.rolename })
          return acc
        }, [])
      }
      return [{title: "no data"}]
    },

    getMyLeaveItems() {
      if (this.data && this.data.leaves_of_me && this.data.leaves_of_me.length > 0) {
        return this.data.leaves_of_me.reduce((acc, cur) => {
          acc.push({ title: cur.leaveReason, date: cur.dtFrom + ' ~ ' + cur.dtTo })
          return acc
        }, [])
      }
      return [{title: "no data"}]
    },

    getCollegueLeaveItems() {
      if (this.data && this.data.leaves_of_mycolleagues && this.data.leaves_of_mycolleagues.length > 0) {
        return this.data.leaves_of_mycolleagues.reduce((acc, cur) => {
          acc.push({ title: cur.leaveReason, date: cur.dtFrom + ' ~ ' + cur.dtTo, name: cur.firstname + ' ' + cur.lastname })
          return acc
        }, [])
      }
      return [{title: "no data"}]
    }
  },

  methods: {
    getStyle(red) {
      if (red == 1) {
        return 'color: #E91E63'
      }
      return ''
    }
  }
}
</script>