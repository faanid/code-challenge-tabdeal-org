<script setup lang="ts">
import type { VideosResponse } from '~/types/video'

const searchInput = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 6

const { data, status, error, refresh } = await useFetch<VideosResponse>(
  '/api/videos',
  {
    query: { search: searchQuery },
    watch: [searchQuery],
  },
)

const videos = computed(() => data.value?.videobyuser ?? [])
const totalPages = computed(() => Math.ceil(videos.value.length / pageSize))
const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return videos.value.slice(start, start + pageSize)
})

watch(videos, () => {
  currentPage.value = 1
})

watch(totalPages, (pages) => {
  if (currentPage.value > pages) {
    currentPage.value = Math.max(1, pages)
  }
})

const searchValidationMessage = computed(() => {
  const query = searchInput.value.trim()

  if (query.length > 100) return 'حداکثر ۱۰۰ کاراکتر وارد کن.'
  if (query.length > 0 && query.length < 4) return 'برای جست‌وجو حداقل ۴ کاراکتر وارد کن.'
  return ''
})

function searchVideos() {
  if (searchValidationMessage.value) return
  searchQuery.value = searchInput.value.trim()
}

function clearSearch() {
  searchInput.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}

function formatViews(views: number) {
  return Number(views || 0).toLocaleString('fa-IR')
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
    <form
      class="mb-8 flex flex-col gap-3 sm:flex-row"
      role="search"
      @submit.prevent="searchVideos"
    >
      <label for="video-search" class="sr-only">
        جست‌وجو در عنوان ویدئوها
      </label>

      <input
        id="video-search"
        v-model="searchInput"
        type="search"
        maxlength="100"
        placeholder="عنوان ویدئو را جست‌وجو کن..."
        :aria-invalid="Boolean(searchValidationMessage)"
        aria-describedby="search-validation"
        class="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-400"
      />

      <button
        type="submit"
        :disabled="Boolean(searchValidationMessage)"
        class="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-[#181818] transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        جست‌وجو
      </button>

      <button
        v-if="searchInput || searchQuery"
        type="button"
        class="rounded-xl border border-white/10 px-5 py-3 text-gray-300 transition hover:bg-white/5"
        @click="clearSearch"
      >
        پاک کردن
      </button>
    </form>

    <p
      id="search-validation"
      v-if="searchValidationMessage"
      class="mb-6 text-sm text-yellow-400"
      role="status"
    >
      {{ searchValidationMessage }}
    </p>

    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-xl font-bold">
        {{ searchQuery ? 'نتایج جست‌وجو' : 'آخرین ویدئوها' }}
      </h1>
    </div>

    <div
      v-if="status === 'pending'"
      class="py-16 text-center text-gray-400"
      role="status"
    >
      در حال دریافت ویدئوها...
    </div>

    <section
      v-else-if="error"
      class="rounded-xl border border-red-400/20 bg-red-400/5 px-5 py-10 text-center"
      role="alert"
    >
      <p class="font-semibold text-red-400">
        دریافت ویدئوها با خطا مواجه شد.
      </p>
      <p class="mt-3 text-sm leading-7 text-gray-400">
        سرویس آپارات در حال حاضر پاسخ مناسبی نمی‌دهد. لطفاً کمی بعد دوباره تلاش کن.
      </p>
      <button
        type="button"
        class="mt-5 rounded-lg bg-yellow-400 px-5 py-2.5 font-semibold text-[#181818]"
        @click="refresh()"
      >
        تلاش مجدد
      </button>
    </section>

    <section
      v-else-if="videos.length === 0"
      class="rounded-xl border border-white/10 px-5 py-16 text-center"
    >
      <p class="text-lg font-semibold">ویدئویی پیدا نشد.</p>
      <p class="mt-3 text-sm text-gray-400">
        {{ searchQuery ? 'عبارت دیگری را امتحان کن.' : 'در حال حاضر ویدئویی برای نمایش وجود ندارد.' }}
      </p>
      <button
        v-if="searchQuery"
        type="button"
        class="mt-5 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
        @click="clearSearch"
      >
        نمایش همه ویدئوها
      </button>
    </section>

    <template v-else>
      <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="video in paginatedVideos"
          :key="video.uid"
          class="overflow-hidden rounded-xl border border-white/10 bg-[#202020] transition hover:-translate-y-1 hover:border-yellow-400/40"
        >
          <NuxtLink
            :to="`/videos/${encodeURIComponent(video.uid)}`"
            class="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400"
          >
            <img
              :src="video.big_poster || video.small_poster || undefined"
              :alt="video.title"
              class="aspect-video w-full bg-[#252525] object-cover"
              loading="lazy"
            />
            <div class="p-4">
              <h2 class="font-semibold leading-7">{{ video.title }}</h2>
              <p class="mt-3 text-sm text-gray-400">
                {{ formatViews(video.visit_cnt) }} بازدید
              </p>
            </div>
          </NuxtLink>
        </article>
      </section>

      <nav
        v-if="totalPages > 1"
        class="mt-8 flex items-center justify-center gap-4"
        aria-label="صفحه‌بندی ویدئوها"
        dir="rtl"
      >
        <button
          type="button"
          :disabled="currentPage === 1"
          class="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          @click="currentPage--"
        >
          قبلی
        </button>
        <span class="text-sm text-gray-400" aria-live="polite">
          صفحه {{ currentPage }} از {{ totalPages }}
        </span>
        <button
          type="button"
          :disabled="currentPage === totalPages"
          class="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          @click="currentPage++"
        >
          بعدی
        </button>
      </nav>
    </template>
  </main>
</template>
