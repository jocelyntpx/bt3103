import { createRouter, createWebHistory } from 'vue-router'
import FindACounsellor from '@/views/FindACounsellor.vue'
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
    name: 'Find A Counsellor',
    component: FindACounsellor
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