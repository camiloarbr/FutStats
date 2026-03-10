// @author: Camilo | FutStats
// Vue Router core
import { createRouter, createWebHistory } from 'vue-router'
// Vue Router typings
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// Stores
import { useAuthStore } from '@/stores/useAuthStore'

// Views
import HomeView from '@/views/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    requiresAuth: boolean
    adminOnly: boolean
  }
}

// Router instance with FutStats routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Home', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Login', requiresAuth: false, adminOnly: false },
    },
    {
      path: '/teams',
      name: 'teams.index',
      component: () => import('@/views/teams/TeamsView.vue'),
      meta: { title: 'Teams', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/teams/create',
      name: 'teams.create',
      component: () => import('@/views/teams/TeamFormView.vue'),
      meta: { title: 'Create Team', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/teams/:id',
      name: 'teams.show',
      component: () => import('@/views/teams/TeamDetailView.vue'),
      meta: { title: 'Team Details', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/teams/:id/edit',
      name: 'teams.edit',
      component: () => import('@/views/teams/TeamFormView.vue'),
      meta: { title: 'Edit Team', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/players',
      name: 'players.index',
      component: () => import('@/views/players/PlayersView.vue'),
      meta: { title: 'Players', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/players/create',
      name: 'players.create',
      component: () => import('@/views/players/PlayerFormView.vue'),
      meta: { title: 'Create Player', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/players/:id',
      name: 'players.show',
      component: () => import('@/views/players/PlayerDetailView.vue'),
      meta: { title: 'Player Details', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/players/:id/edit',
      name: 'players.edit',
      component: () => import('@/views/players/PlayerFormView.vue'),
      meta: { title: 'Edit Player', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/matches',
      name: 'matches.index',
      component: () => import('@/views/matches/MatchesView.vue'),
      meta: { title: 'Matches', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/matches/create',
      name: 'matches.create',
      component: () => import('@/views/matches/MatchFormView.vue'),
      meta: { title: 'Create Match', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/matches/:id',
      name: 'matches.show',
      component: () => import('@/views/matches/MatchDetailView.vue'),
      meta: { title: 'Match Details', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/matches/:id/edit',
      name: 'matches.edit',
      component: () => import('@/views/matches/MatchFormView.vue'),
      meta: { title: 'Edit Match', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/tools',
      name: 'admin.tools',
      component: () => import('@/views/admin/AdminToolsView.vue'),
      meta: { title: 'Admin Tools', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Authentication + authorization guard
router.beforeEach(
  (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ): void => {
    const authStore = useAuthStore()
    const currentUser = authStore.currentUser
    const isAuthenticated = currentUser !== null
    const isAdmin = currentUser?.role === 'admin'

    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'login' })
      return
    }

    if (to.name === 'login' && isAuthenticated) {
      next({ name: 'home' })
      return
    }

    if (to.meta.adminOnly && !isAdmin) {
      next({ name: 'home' })
      return
    }

    next()
  },
)

// Keep document title in sync with route metadata
router.afterEach((to: RouteLocationNormalized) => {
  document.title = `FutStats | ${to.meta.title}`
})

export default router