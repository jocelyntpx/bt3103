import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/General/Home.vue'
import FindCounsellor from '@/views/Patient/FindCounsellor.vue'
import About from '@/views/General/About.vue'
import HelpResources from '@/views/General/HelpResources.vue'
import HelpResourcesAdmin from '@/views/Counsellor/HelpResourcesAdmin.vue'
import AdminLogin from '@/views/Counsellor/AdminLogin.vue'
import PatientLogin from '@/views/Patient/PatientLogin.vue'
import PatientProfile from '@/views/Patient/PatientProfile.vue'
import CounsellorProfile from '@/views/Counsellor/CounsellorProfile.vue'
import MyPatients from '@/views/Counsellor/MyPatients.vue'
import DailyUserView from '@/views/Patient/DailyUserView.vue'
import DailyCounsellorView from '@/views/Counsellor/DailyCounsellorView.vue'
import CounsellorReviews from '@/views/Counsellor/CounsellorReviews.vue'
import RateCounsellor from '@/views/Patient/RateCounsellor.vue'
import NotFound from '@/views/General/NotFound.vue'
import ContactUs from '@/views/General/ContactUs.vue'
import SessionNotes from '@/views/Counsellor/SessionNotes.vue'
import CounsellorProfilePatient from '@/views/Patient/CounsellorProfilePatient.vue'
import PatientProfileCounsellor from '@/views/Counsellor/PatientProfileCounsellor.vue'

const routes = [
 {
 path: '/',
 name: 'Home',
 component: Home
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
    path: '/helpResourcesAdmin',
    name: 'HelpResourcesAdmin',
    component: HelpResourcesAdmin
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
    // path: '/patientProfile',
    path: '/patientProfile/:id',
    name: 'PatientProfile',
    component: PatientProfile
},
{
    path:'/patientProfileCounsellor/:id',
    name: 'PatientProfileCounsellor',
    component: PatientProfileCounsellor
},
{
    // path: '/counsellorProfile',
    path: '/counsellorProfile/:id',
    name: 'CounsellorProfile',
    component: CounsellorProfile
},
{
    // path: '/counsellorProfilePatient',
    path: '/counsellorProfilePatient/:id',
    name: 'CounsellorProfilePatient',
    component: CounsellorProfilePatient
},
{
    path: '/myPatients',
    name: 'MyPatients',
    component: MyPatients
},
{
    path: '/dailyUserView/:id',
    name: 'DailyUserView',
    component: DailyUserView
},
{
    path: '/dailyCounsellorView/:id',
    name: 'DailyCounsellorView',
    component: DailyCounsellorView
},
{
    path: '/sessionNotes/:id',
    name: 'SessionNotes',
    component: SessionNotes
},
{
    // path: '/counsellorReviews',
    path: '/counsellorReviews/:id',
    name: 'CounsellorReviews',
    component: CounsellorReviews
},
{
    // path: '/rateCounsellor/',
    path: '/rateCounsellor/:id',
    name: 'RateCounsellor',
    component: RateCounsellor
},
{
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
},
{
    path: '/contactUs',
    name: 'ContactUs',
    component: ContactUs
}
]
const router = createRouter({
 history: createWebHistory(),
 routes
})
export default router
