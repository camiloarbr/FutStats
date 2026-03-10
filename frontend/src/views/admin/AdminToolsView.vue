// @author: Victor Chavez | FutStats
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import MatchFormCard from '@/components/matches/MatchFormCard.vue'
import PlayerFormCard from '@/components/players/PlayerFormCard.vue'
import TeamFormCard from '@/components/teams/TeamFormCard.vue'

import { MatchService } from '@/services/MatchService'
import { PlayerService } from '@/services/PlayerService'
import { TeamService } from '@/services/TeamService'

import type { CreateMatchDTO, MatchInterface } from '@/interfaces/MatchInterface'
import type { CreatePlayerDTO, PlayerInterface } from '@/interfaces/PlayerInterface'
import type { CreateTeamDTO, TeamInterface } from '@/interfaces/TeamInterface'

type AccordionSection =
  | 'matchesCreate'
  | 'matchesEdit'
  | 'playersCreate'
  | 'playersEdit'
  | 'teamsCreate'
  | 'teamsEdit'

const router = useRouter()

const teams = computed<TeamInterface[]>(() => TeamService.getAll())
const matches = computed<MatchInterface[]>(() => MatchService.getAll())
const players = computed<PlayerInterface[]>(() => PlayerService.getAll())

const accordionState = ref<Record<AccordionSection, boolean>>({
  matchesCreate: true,
  matchesEdit: false,
  playersCreate: false,
  playersEdit: false,
  teamsCreate: false,
  teamsEdit: false,
})

const matchCreateFeedback = ref<'idle' | 'success' | 'error'>('idle')
const matchEditFeedback = ref<'idle' | 'success' | 'error'>('idle')
const playerCreateFeedback = ref<'idle' | 'success' | 'error'>('idle')
const playerEditFeedback = ref<'idle' | 'success' | 'error'>('idle')
const teamCreateFeedback = ref<'idle' | 'success' | 'error'>('idle')
const teamEditFeedback = ref<'idle' | 'success' | 'error'>('idle')

const matchFormSeed = ref(0)
const playerFormSeed = ref(0)
const teamFormSeed = ref(0)

const selectedMatchId = ref<string>('')
const selectedPlayerId = ref<string>('')
const selectedTeamId = ref<string>('')

const matchDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function toggleSection(section: AccordionSection): void {
  accordionState.value[section] = !accordionState.value[section]
}

function isSectionOpen(section: AccordionSection): boolean {
  return accordionState.value[section]
}

function buildDefaultMatch(): CreateMatchDTO {
  const defaultTeamId = teams.value[0]?.id ?? 0
  const secondaryTeamId = teams.value[1]?.id ?? 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return {
    date: today,
    stadium: '',
    homeTeamId: defaultTeamId,
    awayTeamId: secondaryTeamId,
    homeScore: 0,
    awayScore: 0,
    possessionHome: 50,
    possessionAway: 50,
    shotsHome: 0,
    shotsAway: 0,
    foulsHome: 0,
    foulsAway: 0,
  }
}

function buildDefaultPlayer(): CreatePlayerDTO {
  const defaultTeamId = teams.value[0]?.id ?? 0

  return {
    imageUrl: '',
    fullName: '',
    position: '',
    nationality: '',
    shirtNumber: 0,
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    shots: 0,
    passes: 0,
    yellowCards: 0,
    redCards: 0,
    minutesPlayed: 0,
    teamId: defaultTeamId,
  }
}

function buildDefaultTeam(): CreateTeamDTO {
  return {
    imageUrl: '',
    name: '',
    country: '',
    league: '',
    foundedYear: new Date().getFullYear(),
    matchesPlayed: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  }
}

const matchInitialValues = computed<CreateMatchDTO>(() => {
  void matchFormSeed.value
  return buildDefaultMatch()
})

const playerInitialValues = computed<CreatePlayerDTO>(() => {
  void playerFormSeed.value
  return buildDefaultPlayer()
})

const teamInitialValues = computed<CreateTeamDTO>(() => {
  void teamFormSeed.value
  return buildDefaultTeam()
})

function mapMatchToDto(match: MatchInterface): CreateMatchDTO {
  return {
    date: match.date instanceof Date ? match.date : new Date(match.date),
    stadium: match.stadium,
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    possessionHome: match.possessionHome,
    possessionAway: match.possessionAway,
    shotsHome: match.shotsHome,
    shotsAway: match.shotsAway,
    foulsHome: match.foulsHome,
    foulsAway: match.foulsAway,
  }
}

function mapPlayerToDto(player: PlayerInterface): CreatePlayerDTO {
  const { id, ...rest } = player
  void id
  return { ...rest }
}

function mapTeamToDto(team: TeamInterface): CreateTeamDTO {
  const { id, ...rest } = team
  void id
  return { ...rest }
}

const editableMatch = computed<MatchInterface | undefined>(() => {
  const id = Number(selectedMatchId.value)
  if (!Number.isFinite(id)) {
    return undefined
  }
  return matches.value.find((match) => match.id === id)
})

const editableMatchValues = computed<CreateMatchDTO | null>(() => {
  if (!editableMatch.value) {
    return null
  }
  return mapMatchToDto(editableMatch.value)
})

const editablePlayer = computed<PlayerInterface | undefined>(() => {
  const id = Number(selectedPlayerId.value)
  if (!Number.isFinite(id)) {
    return undefined
  }
  return players.value.find((player) => player.id === id)
})

const editablePlayerValues = computed<CreatePlayerDTO | null>(() => {
  if (!editablePlayer.value) {
    return null
  }
  return mapPlayerToDto(editablePlayer.value)
})

const editableTeam = computed<TeamInterface | undefined>(() => {
  const id = Number(selectedTeamId.value)
  if (!Number.isFinite(id)) {
    return undefined
  }
  return teams.value.find((team) => team.id === id)
})

const editableTeamValues = computed<CreateTeamDTO | null>(() => {
  if (!editableTeam.value) {
    return null
  }
  return mapTeamToDto(editableTeam.value)
})

const matchOptions = computed(() =>
  matches.value.map((match) => ({
    value: match.id.toString(),
    label: `${matchDateFormatter.format(match.date instanceof Date ? match.date : new Date(match.date))} · ${resolveTeamName(match.homeTeamId)} vs ${resolveTeamName(match.awayTeamId)}`,
  })),
)

const playerOptions = computed(() =>
  players.value.map((player) => ({
    value: player.id.toString(),
    label: player.fullName,
  })),
)

const teamOptions = computed(() =>
  teams.value.map((team) => ({
    value: team.id.toString(),
    label: team.name,
  })),
)

function resolveTeamName(teamId: number): string {
  const name = teams.value.find((team) => team.id === teamId)?.name
  return name ?? 'Unknown team'
}

watch(
  matches,
  (nextMatches) => {
    if (nextMatches.length === 0) {
      selectedMatchId.value = ''
      return
    }

    const exists = nextMatches.some((match) => match.id.toString() === selectedMatchId.value)
    if (!exists) {
      const firstMatch = nextMatches[0]
      selectedMatchId.value = firstMatch ? firstMatch.id.toString() : ''
    }
  },
  { immediate: true },
)

watch(
  players,
  (nextPlayers) => {
    if (nextPlayers.length === 0) {
      selectedPlayerId.value = ''
      return
    }

    const exists = nextPlayers.some((player) => player.id.toString() === selectedPlayerId.value)
    if (!exists) {
      const firstPlayer = nextPlayers[0]
      selectedPlayerId.value = firstPlayer ? firstPlayer.id.toString() : ''
    }
  },
  { immediate: true },
)

watch(
  teams,
  (nextTeams) => {
    if (nextTeams.length === 0) {
      selectedTeamId.value = ''
      return
    }

    const exists = nextTeams.some((team) => team.id.toString() === selectedTeamId.value)
    if (!exists) {
      const firstTeam = nextTeams[0]
      selectedTeamId.value = firstTeam ? firstTeam.id.toString() : ''
    }
  },
  { immediate: true },
)

function handleMatchCreate(payload: CreateMatchDTO): void {
  try {
    MatchService.create(payload)
    matchCreateFeedback.value = 'success'
    matchFormSeed.value += 1
  } catch (error) {
    console.error(error)
    matchCreateFeedback.value = 'error'
  }
}

function handleMatchUpdate(payload: CreateMatchDTO): void {
  if (!editableMatch.value) {
    matchEditFeedback.value = 'error'
    return
  }

  try {
    MatchService.update(editableMatch.value.id, payload)
    matchEditFeedback.value = 'success'
  } catch (error) {
    console.error(error)
    matchEditFeedback.value = 'error'
  }
}

function handleMatchDelete(): void {
  if (!editableMatch.value) {
    matchEditFeedback.value = 'error'
    return
  }

  const deleted = MatchService.delete(editableMatch.value.id)
  matchEditFeedback.value = deleted ? 'success' : 'error'

  if (deleted) {
    const nextId = matches.value[0]?.id
    selectedMatchId.value = nextId ? nextId.toString() : ''
  }
}

function handlePlayerCreate(payload: CreatePlayerDTO): void {
  try {
    PlayerService.create(payload)
    playerCreateFeedback.value = 'success'
    playerFormSeed.value += 1
  } catch (error) {
    console.error(error)
    playerCreateFeedback.value = 'error'
  }
}

function handlePlayerUpdate(payload: CreatePlayerDTO): void {
  if (!editablePlayer.value) {
    playerEditFeedback.value = 'error'
    return
  }

  try {
    PlayerService.update(editablePlayer.value.id, payload)
    playerEditFeedback.value = 'success'
  } catch (error) {
    console.error(error)
    playerEditFeedback.value = 'error'
  }
}

function handlePlayerDelete(): void {
  if (!editablePlayer.value) {
    playerEditFeedback.value = 'error'
    return
  }

  const deleted = PlayerService.delete(editablePlayer.value.id)
  playerEditFeedback.value = deleted ? 'success' : 'error'

  if (deleted) {
    const nextId = players.value[0]?.id
    selectedPlayerId.value = nextId ? nextId.toString() : ''
  }
}

function handleTeamCreate(payload: CreateTeamDTO): void {
  try {
    TeamService.create(payload)
    teamCreateFeedback.value = 'success'
    teamFormSeed.value += 1
  } catch (error) {
    console.error(error)
    teamCreateFeedback.value = 'error'
  }
}

function handleTeamUpdate(payload: CreateTeamDTO): void {
  if (!editableTeam.value) {
    teamEditFeedback.value = 'error'
    return
  }

  try {
    const updated = TeamService.update(editableTeam.value.id, payload)
    teamEditFeedback.value = updated ? 'success' : 'error'
  } catch (error) {
    console.error(error)
    teamEditFeedback.value = 'error'
  }
}

function handleTeamDelete(): void {
  if (!editableTeam.value) {
    teamEditFeedback.value = 'error'
    return
  }

  const deleted = TeamService.delete(editableTeam.value.id)
  teamEditFeedback.value = deleted ? 'success' : 'error'

  if (deleted) {
    const nextId = teams.value[0]?.id
    selectedTeamId.value = nextId ? nextId.toString() : ''
  }
}

function goToMatches(): void {
  router.push({ name: 'matches.index' })
}
</script>

<template>
  <section class="space-y-8">
    <header class="admin-hero">
      <div>
        <p class="hero-chip">Admin Center</p>
        <h1>Control Panel</h1>
        <p>
          Keep creation and maintenance flows organized inside collapsible sections. Register, edit,
          or delete matches, players, and teams without leaving this screen.
        </p>
      </div>
      <button type="button" class="hero-action" @click="goToMatches">View matches</button>
    </header>

    <div class="accordion-group">
      <!-- Matches - Create -->
      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('matchesCreate')"
          @click="toggleSection('matchesCreate')"
        >
          <div>
            <p>Matches</p>
            <h3>Register new match</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('matchesCreate') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>
        <div v-show="isSectionOpen('matchesCreate')" class="accordion__panel">
          <div v-if="teams.length < 2" class="warning">
            Register at least two teams before creating a match. Head over to Teams to add the
            missing clubs.
          </div>
          <MatchFormCard
            v-else
            mode="create"
            :initial-values="matchInitialValues"
            :teams="teams"
            @submit="handleMatchCreate"
          />
          <p v-if="matchCreateFeedback === 'success'" class="success-banner">
            Match stored successfully. Review it later inside Matches view.
          </p>
          <p v-else-if="matchCreateFeedback === 'error'" class="error-banner">
            Something went wrong while saving. Please try again.
          </p>
        </div>
      </article>

      <!-- Matches - Edit -->
      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('matchesEdit')"
          @click="toggleSection('matchesEdit')"
        >
          <div>
            <p>Matches</p>
            <h3>Edit or delete match</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('matchesEdit') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>
        <div v-show="isSectionOpen('matchesEdit')" class="accordion__panel">
          <div v-if="matches.length === 0" class="warning">
            No matches exist yet. Create one to unlock editing tools.
          </div>
          <div v-else class="selector">
            <label for="match-select">Select a match</label>
            <select id="match-select" v-model="selectedMatchId">
              <option
                v-for="option in matchOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div v-if="teams.length < 2" class="warning">
            You need at least two active teams before editing match data.
          </div>
          <MatchFormCard
            v-else-if="editableMatchValues"
            key="match-edit"
            mode="edit"
            :initial-values="editableMatchValues"
            :teams="teams"
            @submit="handleMatchUpdate"
            @delete="handleMatchDelete"
          />
          <p v-if="matchEditFeedback === 'success'" class="success-banner">
            Changes applied to the selected match.
          </p>
          <p v-else-if="matchEditFeedback === 'error'" class="error-banner">
            Unable to process that action. Double-check the current selection.
          </p>
        </div>
      </article>

      <!-- Players - Create -->
      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('playersCreate')"
          @click="toggleSection('playersCreate')"
        >
          <div>
            <p>Players</p>
            <h3>Register new player</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('playersCreate') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>
        <div v-show="isSectionOpen('playersCreate')" class="accordion__panel">
          <div v-if="teams.length === 0" class="warning">
            Add at least one team before registering players.
          </div>
          <PlayerFormCard
            v-else
            mode="create"
            :initial-values="playerInitialValues"
            :teams="teams"
            @submit="handlePlayerCreate"
          />
          <p v-if="playerCreateFeedback === 'success'" class="success-banner">
            Player added successfully to the roster.
          </p>
          <p v-else-if="playerCreateFeedback === 'error'" class="error-banner">
            Player could not be saved. Please try again.
          </p>
        </div>
      </article>

      <!-- Players - Edit -->
      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('playersEdit')"
          @click="toggleSection('playersEdit')"
        >
          <div>
            <p>Players</p>
            <h3>Edit or delete player</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('playersEdit') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>
        <div v-show="isSectionOpen('playersEdit')" class="accordion__panel">
          <div v-if="players.length === 0" class="warning">
            There are no players stored yet.
          </div>
          <div v-else class="selector">
            <label for="player-select">Select a player</label>
            <select id="player-select" v-model="selectedPlayerId">
              <option
                v-for="option in playerOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div v-if="teams.length === 0" class="warning">
            At least one team must exist to link the player.
          </div>
          <PlayerFormCard
            v-else-if="editablePlayerValues"
            key="player-edit"
            mode="edit"
            :initial-values="editablePlayerValues"
            :teams="teams"
            @submit="handlePlayerUpdate"
            @delete="handlePlayerDelete"
          />
          <p v-if="playerEditFeedback === 'success'" class="success-banner">
            Player updated successfully.
          </p>
          <p v-else-if="playerEditFeedback === 'error'" class="error-banner">
            Could not update or delete the selected player.
          </p>
        </div>
      </article>

      <!-- Teams - Create placeholder -->
      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('teamsCreate')"
          @click="toggleSection('teamsCreate')"
        >
          <div>
            <p>Teams</p>
            <h3>Register new team</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('teamsCreate') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>
        <div v-show="isSectionOpen('teamsCreate')" class="accordion__panel">
          <TeamFormCard
            mode="create"
            :initial-values="teamInitialValues"
            @submit="handleTeamCreate"
          />
          <p v-if="teamCreateFeedback === 'success'" class="success-banner">
            Team registered successfully.
          </p>
          <p v-else-if="teamCreateFeedback === 'error'" class="error-banner">
            Unable to store the new team. Please try again.
          </p>
        </div>
      </article>

      <!-- Teams - Edit placeholder -->
      <article class="accordion">
        <button
          type="button"
          class="accordion__trigger"
          :aria-expanded="isSectionOpen('teamsEdit')"
          @click="toggleSection('teamsEdit')"
        >
          <div>
            <p>Teams</p>
            <h3>Edit or delete team</h3>
          </div>
          <span :class="['chevron', { 'chevron--open': isSectionOpen('teamsEdit') }]">
            <i class="fa-solid fa-chevron-down"></i>
          </span>
        </button>
        <div v-show="isSectionOpen('teamsEdit')" class="accordion__panel">
          <div v-if="teams.length === 0" class="warning">
            No teams exist yet. Create one first to unlock editing.
          </div>
          <div v-else class="selector">
            <label for="team-select">Select a team</label>
            <select id="team-select" v-model="selectedTeamId">
              <option v-for="option in teamOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <TeamFormCard
            v-if="editableTeamValues"
            key="team-edit"
            mode="edit"
            :initial-values="editableTeamValues"
            @submit="handleTeamUpdate"
            @delete="handleTeamDelete"
          />
          <p v-if="teamEditFeedback === 'success'" class="success-banner">
            Team updated successfully.
          </p>
          <p v-else-if="teamEditFeedback === 'error'" class="error-banner">
            Could not update or delete the selected team.
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.admin-hero {
  border-radius: 1.75rem;
  background: linear-gradient(120deg, #0f172a, #1d4ed8, #22d3ee);
  padding: 2rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.35);
}

@media (min-width: 768px) {
  .admin-hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.hero-chip {
  text-transform: uppercase;
  letter-spacing: 0.35em;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
}

.admin-hero h1 {
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 800;
}

.admin-hero p {
  color: rgba(255, 255, 255, 0.9);
  max-width: 32rem;
}

.hero-action {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.2s ease;
}

.hero-action:hover {
  background: rgba(255, 255, 255, 0.2);
}

.accordion-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accordion {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #fff;
  box-shadow: 0 25px 70px rgba(15, 23, 42, 0.08);
}

.accordion__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.accordion__trigger p {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: #64748b;
}

.accordion__trigger h3 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
}

.chevron {
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  padding: 0.4rem 0.65rem;
  transition: transform 0.2s ease;
}

.chevron--open {
  transform: rotate(180deg);
}

.accordion__panel {
  border-top: 1px solid rgba(226, 232, 240, 0.7);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selector label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
}

.selector select {
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.6);
  padding: 0.6rem 0.9rem;
  font-weight: 500;
  color: #0f172a;
}

.warning {
  border-radius: 1.25rem;
  border: 1px dashed rgba(245, 158, 11, 0.6);
  background: rgba(251, 191, 36, 0.2);
  color: #92400e;
  padding: 1rem 1.25rem;
}

.success-banner,
.error-banner {
  border-radius: 999px;
  padding: 0.65rem 1.25rem;
  font-weight: 600;
  text-align: center;
}

.success-banner {
  background: rgba(16, 185, 129, 0.15);
  color: #047857;
}

.error-banner {
  background: rgba(248, 113, 113, 0.1);
  color: #b91c1c;
}

.placeholder {
  background: linear-gradient(135deg, #eff6ff, #eef2ff);
  border-radius: 1.25rem;
}

.placeholder h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1d4ed8;
}

.placeholder p {
  color: #475569;
}
</style>
