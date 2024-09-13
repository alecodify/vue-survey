import FourOhFour from '@/screens/FourOhFour.vue';
import Login from '@/screens/Login.vue';
import Register from '@/screens/Register.vue';
import AuthLayout from '@/layout/AuthLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from '@/layout/DefaultLayout.vue';
import Dashboard from '@/screens/Dashboard.vue';
import Surveys from '@/screens/Surveys.vue';
import SurveyView from '@/screens/SurveyView.vue';
import SurveyViewPublic from '@/screens/SurveyViewPublic.vue';

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
        component: DefaultLayout,
        meta: { requiresAuth: true },
        children: [
            {path: '/dashboard', name: 'Dashboard', component: Dashboard},
            {path: '/surveys', name: 'Surveys', component: Surveys},
            {path: '/surveys/create', name: 'SurveyCreate', component: SurveyView},
            {path: '/surveys/:id', name: 'SurveyView', component: SurveyView},
        ]
    },
    {
        path: "/view/survey/:slug",
        name: 'SurveyViewPublic',
        component: SurveyViewPublic
    },
    {
        path: '/auth',
        redirect: '/login',
        name: 'Auth',
        component: AuthLayout,
        meta: {isGuest:  true},
        children: [
            {
                path: '/login',
                name: 'Login',
                component: Login,
            },
            {
                path: '/register',
                name: 'Register',
                component: Register,
            },
        ]
    },
    {
        path: '/404',
        name: 'FourOhFour',
        component: FourOhFour,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;