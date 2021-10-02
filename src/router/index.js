import { createRouter, createWebHistory } from 'vue-router'
import FindCounsellor from '@/views/FindCounsellor.vue'
import About from '@/views/About.vue'
import UserProfile from '@/views/UserProfile.vue'
import HelpResources from '@/views/HelpResources.vue'
const routes = [
 {
 path: '/',
 name: 'UserProfile',
 component: UserProfile
 },
 {
 path: '/about',
 name: 'About',
 component: About
 },
 {
    path: '/findcounsellor',
    name: 'Find Counsellor',
    component: FindCounsellor
},
{
    path: '/helpresources',
    name: 'Help Resources',
    component: HelpResources
}
]
const router = createRouter({
 history: createWebHistory(),
 routes
})
export default router