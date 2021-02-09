import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      name: "Login",
      path: '/login',
      component: () => import('@/views/dashboard/pages/Login'),
    },
    {
      path: '/',
      component: () => import('@/views/dashboard/Index'),
      meta: {
          requiresAuth: true
      },
      children: [
        // Dashboard
        {
          name: 'Dashboard',
          path: '',
          component: () => import('@/views/dashboard/Dashboard'),
        },
        // Pages
        {
          name: 'Client List',
          path: 'pages/client',
          component: () => import('@/views/dashboard/pages/ClientList'),
        },
        {
          name: 'Country List',
          path: 'pages/country',
          component: () => import('@/views/dashboard/pages/CountryList'),
        },
        {
          name: 'HR- Manpower Associate types',
          path: 'pages/designation',
          component: () => import('@/views/dashboard/pages/Designation'),
        },
        {
          name: 'Organization Wide Roles',
          path: 'pages/role',
          component: () => import('@/views/dashboard/pages/RoleList'),
        },
        {
          name: 'People',
          path: 'pages/people',
          component: () => import('@/views/dashboard/pages/People'),
        },
        {
          name: 'Associate',
          path: 'pages/associate_person',
          component: () => import('@/views/dashboard/pages/Associate'),
        },
        {
          name: 'Task List',
          path: 'pages/task',
          component: () => import('@/views/dashboard/pages/TaskList'),
        },
        {
          name: 'Project Summary',
          path: 'pages/project_summary',
          component: () => import('@/views/dashboard/pages/ProjectSummary'),
        },
        {
          name: 'User Profile',
          path: 'pages/user',
          component: () => import('@/views/dashboard/pages/UserProfile'),
        },
        {
          name: 'Notifications',
          path: 'components/notifications',
          component: () => import('@/views/dashboard/component/Notifications'),
        },
        {
          name: 'Icons',
          path: 'components/icons',
          component: () => import('@/views/dashboard/component/Icons'),
        },
        {
          name: 'Typography',
          path: 'components/typography',
          component: () => import('@/views/dashboard/component/Typography'),
        },
        {
          name: 'Daily Update',
          path: 'pages/daily',
          component: () => import('@/views/dashboard/pages/Daily'),
        },
        {
          name: 'Progress',
          path: 'pages/progress',
          component: () => import('@/views/dashboard/pages/CheckProgress'),
        },
        {
          name: 'ManPower utilization',
          path: 'pages/manpower',
          component: () => import('@/views/dashboard/pages/Manpower'),
        },
        {
          name: 'Leave Individual',
          path: 'pages/leave_i',
          component: () => import('@/views/dashboard/pages/LeaveI'),
        },
        {
          name: 'Leave Manager',
          path: 'pages/leave_m',
          component: () => import('@/views/dashboard/pages/LeaveM'),
        },
        {
          name: 'Leave Balance',
          path: 'pages/leave_b',
          component: () => import('@/views/dashboard/pages/LeaveB'),
        },
        {
          name: 'Holiday Calendar',
          path: 'pages/holiday',
          component: () => import('@/views/dashboard/pages/Holiday'),
        }
      ],
    }
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('pmFE001') == null) {
      next({name: "Login"})
    } else {
      next()
    }
  }
  next()
})

export default router
