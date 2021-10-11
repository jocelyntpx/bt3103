import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import FindCounsellor from '@/views/FindCounsellor.vue'
import About from '@/views/About.vue'
import UserProfile from '@/views/UserProfile.vue'
import HelpResources from '@/views/HelpResources.vue'
import AdminLogin from '@/views/AdminLogin.vue'
import PatientLogin from '@/components/PatientLogin.vue'
import PatientProfile from '@/views/PatientProfile.vue'
import CounsellorProfile from '@/views/CounsellorProfile.vue'
import MyPatients from '@/views/MyPatients.vue'
import MyPastPatients from '@/views/MyPastPatients.vue'
import AllAppointments from '@/views/AllAppointments.vue'
import PatientRecords from '@/views/PatientRecords.vue'
import DailyUserView from '@/views/DailyUserView.vue'
import DailyCounsellorView from '@/views/DailyCounsellorView.vue'
import CounsellorReviews from '@/views/CounsellorReviews.vue'
import RateCounsellor from '@/views/RateCounsellor.vue'
import NotFound from '@/views/NotFound.vue'
const routes = [
 {
 path: '/',
 name: 'Home',
 component: Home
 },
 {
    path: '/userProfile',
    name: 'UserProfile',
    component: UserProfile
    },
 {
 path: '/about',
 name: 'About',
 component: About
 },
 {
    path: '/findCounsellor',
    name: 'FindCounsellor',
    component: FindCounsellor
},
{
    path: '/helpResources',
    name: 'HelpResources',
    component: HelpResources
},
{
    path: '/adminLogin',
    name: 'AdminLogin',
    component: AdminLogin
},
{
    path: '/patientLogin',
    name: 'PatientLogin',
    component: PatientLogin
},
{
    path: '/patientProfile',
    name: 'PatientProfile',
    component: PatientProfile
},
{
    path: '/counsellorProfile',
    name: 'CounsellorProfile',
    component: CounsellorProfile
},
{
    path: '/myPatients',
    name: 'MyPatients',
    component: MyPatients
},
{
    path: '/myPastPatients',
    name: 'MyPastPatients',
    component: MyPastPatients
},
{
    path: '/allAppointments',
    name: 'AllAppointments',
    component: AllAppointments
},
{
    path: '/patientRecords',
    name: 'PatientRecords',
    component: PatientRecords
},
{
    path: '/dailyUserView',
    name: 'DailyUserView',
    component: DailyUserView
},
{
    path: '/dailyCounsellorView',
    name: 'DailyCounsellorView',
    component: DailyCounsellorView
},
{
    path: '/counsellorReviews',
    name: 'CounsellorReviews',
    component: CounsellorReviews
},
{
    path: '/rateCounsellor',
    name: 'RateCounsellor',
    component: RateCounsellor
},
{
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
}
]
const router = createRouter({
 history: createWebHistory(),
 routes
})
export default router