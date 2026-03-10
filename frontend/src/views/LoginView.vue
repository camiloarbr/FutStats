<!-- @author: Samuel | FutStats -->
<script setup lang="ts">
// @author: Samuel | FutStats
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/AuthService'

const router = useRouter()

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const error: Ref<string | null> = ref(null)
const isSubmitting: Ref<boolean> = ref(false)
const showPassword: Ref<boolean> = ref(false)

async function handleSubmit(): Promise<void> {
  error.value = null
  isSubmitting.value = true

  try {
    const isAuthenticated = AuthService.login(email.value, password.value)

    if (!isAuthenticated) {
      error.value = 'Invalid email or password'
      return
    }

    await router.push({ name: 'home' })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <div class="flex min-h-screen w-full overflow-hidden bg-white md:flex-row dark:bg-slate-900">
      <aside
        class="relative hidden w-[48%] overflow-hidden bg-blue-600 md:flex md:flex-col md:justify-between"
      >
        <div class="absolute inset-0 opacity-10">
          <div
            class="h-full w-full"
            style="
              background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.35) 1px, transparent 0);
              background-size: 28px 28px;
            "
          ></div>
        </div>

        <div class="absolute inset-0">
          <div class="absolute inset-y-0 left-0 w-[110px] bg-blue-700/35"></div>
          <div
            class="absolute -left-36 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full border border-white/20"
          ></div>
          <div class="absolute top-1/2 h-px w-full -translate-y-1/2 bg-white/15"></div>
          <div
            class="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"
          ></div>
        </div>

        <div class="relative z-10 px-10 pt-14 text-white lg:px-12 lg:pt-16">
          <div
            class="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur"
          >
            <span class="text-2xl">⚽</span>
          </div>

          <h1 class="max-w-md text-5xl font-extrabold leading-[1.05] tracking-tight xl:text-6xl">
            Analyze the Game
            <span class="block text-blue-100">Like a Pro.</span>
          </h1>

          <p class="mt-6 max-w-md text-lg leading-8 text-blue-100/95 xl:text-xl">
            Access real-time football analytics, player heatmaps, and advanced team statistics
            in one powerful dashboard.
          </p>
        </div>

        <div class="relative z-10 px-10 pb-12 lg:px-12 lg:pb-14">
          <div class="flex items-center gap-4 text-white">
            <div class="flex -space-x-2">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600 bg-white/90 text-xs font-bold text-slate-800"
              >
                A
              </div>
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600 bg-white/90 text-xs font-bold text-slate-800"
              >
                D
              </div>
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600 bg-white/90 text-xs font-bold text-slate-800"
              >
                C
              </div>
            </div>

            <div>
              <p class="text-base font-semibold">Trusted by analysts</p>
              <p class="text-sm text-blue-100/85">Worldwide data coverage</p>
            </div>
          </div>
        </div>
      </aside>

      <main
        class="flex w-full items-center justify-center bg-white px-10 py-12 md:w-[52%] md:px-16 lg:px-20 xl:px-24 dark:bg-slate-900"
      >
        <div class="w-full max-w-xl">
          <div class="mb-12 flex items-center gap-4">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-md shadow-blue-600/20"
            >
              <span class="text-xl text-white">⚽</span>
            </div>
            <h2 class="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              FutStats
            </h2>
          </div>

          <div class="mb-10">
            <h3 class="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </h3>
            <p class="mt-3 text-lg text-slate-500 dark:text-slate-400">
              Enter your credentials to access the data suite
            </p>
          </div>

          <form class="space-y-7" @submit.prevent="handleSubmit">
            <div>
              <label
                for="email"
                class="mb-3 block text-base font-semibold text-slate-700 dark:text-slate-300"
              >
                Email
              </label>

              <div class="relative">
                <span
                  class="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg text-slate-400"
                >
                  @
                </span>

                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="analyst@futstats.com"
                  class="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-5 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                for="password"
                class="mb-3 block text-base font-semibold text-slate-700 dark:text-slate-300"
              >
                Password
              </label>

              <div class="relative">
                <span
                  class="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-lg text-slate-400"
                >
                  •
                </span>

                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  autocomplete="current-password"
                  placeholder="••••••••"
                  class="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-20 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <button
                  type="button"
                  class="absolute right-5 top-1/2 -translate-y-1/2 text-base font-medium text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            <p
              v-if="error"
              class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-base font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
            >
              {{ error }}
            </p>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{{ isSubmitting ? 'Signing In...' : 'Sign In to Dashboard' }}</span>
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <div class="mt-10 text-center">
            <p class="text-base text-slate-500 dark:text-slate-400">
              Use your registered FutStats credentials to continue
            </p>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>