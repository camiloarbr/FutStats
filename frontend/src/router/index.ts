// @author: Camilo | FutStats
// 1. External imports
import { createRouter, createWebHistory } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// 2. Internal imports
import { useAuthStore } from '@/stores/useAuthStore'
import AdminToolsView from '@/views/admin/AdminToolsView.vue'
import MatchesAdminView from '@/views/admin/MatchesAdminView.vue'
import PlayersAdminView from '@/views/admin/PlayersAdminView.vue'
import TeamsAdminView from '@/views/admin/TeamsAdminView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import MatchDetailView from '@/views/matches/MatchDetailView.vue'
import MatchesView from '@/views/matches/MatchesView.vue'
import MatchFormView from '@/views/matches/MatchFormView.vue'
import PlayerDetailView from '@/views/players/PlayerDetailView.vue'
import PlayerFormView from '@/views/players/PlayerFormView.vue'
import PlayersView from '@/views/players/PlayersView.vue'
import TeamDetailView from '@/views/teams/TeamDetailView.vue'
import TeamFormView from '@/views/teams/TeamFormView.vue'
import TeamsView from '@/views/teams/TeamsView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    requiresAuth: boolean
    adminOnly: boolean
  }
}

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
      component: LoginView,
      meta: { title: 'Login', requiresAuth: false, adminOnly: false },
    },
    {
      path: '/teams',
      name: 'teams.index',
      component: TeamsView,
      meta: { title: 'Teams', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/teams/create',
      name: 'teams.create',
      component: TeamFormView,
      meta: { title: 'Create Team', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/teams/:id',
      name: 'teams.show',
      component: TeamDetailView,
      meta: { title: 'Team Details', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/teams/:id/edit',
      name: 'teams.edit',
      component: TeamFormView,
      meta: { title: 'Edit Team', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/players',
      name: 'players.index',
      component: PlayersView,
      meta: { title: 'Players', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/players/create',
      name: 'players.create',
      component: PlayerFormView,
      meta: { title: 'Create Player', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/players/:id',
      name: 'players.show',
      component: PlayerDetailView,
      meta: { title: 'Player Details', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/players/:id/edit',
      name: 'players.edit',
      component: PlayerFormView,
      meta: { title: 'Edit Player', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/matches',
      name: 'matches.index',
      component: MatchesView,
      meta: { title: 'Matches', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/matches/create',
      name: 'matches.create',
      component: MatchFormView,
      meta: { title: 'Create Match', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/matches/:id',
      name: 'matches.show',
      component: MatchDetailView,
      meta: { title: 'Match Details', requiresAuth: true, adminOnly: false },
    },
    {
      path: '/matches/:id/edit',
      name: 'matches.edit',
      component: MatchFormView,
      meta: { title: 'Edit Match', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/tools',
      name: 'admin.tools',
      component: AdminToolsView,
      meta: { title: 'Admin Tools', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/teams',
      name: 'admin.teams',
      component: TeamsAdminView,
      meta: { title: 'Admin - Teams', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/players',
      name: 'admin.players',
      component: PlayersAdminView,
      meta: { title: 'Admin - Players', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/admin/matches',
      name: 'admin.matches',
      component: MatchesAdminView,
      meta: { title: 'Admin - Matches', requiresAuth: true, adminOnly: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(
  (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
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
  }
)

router.afterEach((to: RouteLocationNormalized) => {
  document.title = `FutStats | ${to.meta.title}`
})

export default router
