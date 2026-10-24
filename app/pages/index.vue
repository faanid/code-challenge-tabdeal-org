
<script setup lang="ts">
interface Video {
  id?: string
  uid: string
  title: string
  username?: string
  visit_cnt: number
  big_poster: string
  small_poster?: string
  duration?: number
  sdate?: string
}

interface VideosResponse {
  videobyuser: Video[]
  source?: string
}

const searchInput = ref('')
const searchQuery = ref('')

const {
  data,
  status,
  error,
  refresh,
} = await useFetch<VideosResponse>('/api/videos', {
  query: {
    search: searchQuery,
  },
  watch: [searchQuery],
})

const videos = computed(() => data.value?.videobyuser ?? [])

function searchVideos() {
  const query = searchInput.value.trim()

  if (query.length > 0 && query.length < 4) {
    return
  }

  searchQuery.value = query
}

function clearSearch() {
  searchInput.value = ''
  searchQuery.value = ''
}

function formatViews(views: number) {
  return Number(views || 0).toLocaleString('fa-IR')
}
</script>

<template>
  <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
    <section class="mb-8">
      <p class="mb-3 text-sm font-medium text-yellow-400">
        آکادمی تبدیل
      </p>

      <h1 class="text-3xl font-bold leading-relaxed md:text-5xl">
        دنیای آموزش با تبدیل
      </h1>

      <p class="mt-4 max-w-2xl leading-8 text-gray-400">
        ویدئوهای آموزشی و تحلیل بازار را اینجا دنبال کن.
      </p>
    </section>

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
        placeholder="عنوان ویدئو را جست‌وجو کن..."
        class="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#202020] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-400"
      />

      <button
        type="submit"
        class="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-[#181818] transition hover:bg-yellow-300"
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
      v-if="searchInput.trim().length > 0 && searchInput.trim().length < 4"
      class="mb-6 text-sm text-yellow-400"
    >
      برای جست‌وجو حداقل ۴ کاراکتر وارد کن.
    </p>

    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-bold">
        {{ searchQuery ? 'نتایج جست‌وجو' : 'آخرین ویدئوها' }}
      </h2>

      <button
        v-if="status === 'error'"
        type="button"
        class="text-sm text-yellow-400 hover:text-yellow-300"
        @click="refresh()"
      >
        تلاش مجدد
      </button>
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
      <p class="text-lg font-semibold">
        ویدئویی پیدا نشد.
      </p>

      <p class="mt-3 text-sm text-gray-400">
        عبارت دیگری را امتحان کن.
      </p>
    </section>

    <section
      v-else
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
     

      <article
        v-for="video in videos"
        :key="video.uid"
        class="overflow-hidden rounded-xl border border-white/10 bg-[#202020] transition hover:-translate-y-1 hover:border-yellow-400/40"
      >
        <NuxtLink
          :to="`/videos/${video.uid}`"
          class="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400"
        >
          <img
            :src="video.big_poster || video.small_poster"
            :alt="video.title"
            class="aspect-video w-full bg-[#252525] object-cover"
            loading="lazy"
          />

          <div class="p-4">
            <h3 class="font-semibold leading-7">
              {{ video.title }}
            </h3>

            <p class="mt-3 text-sm text-gray-400">
              {{ formatViews(video.visit_cnt) }} بازدید
            </p>
          </div>
        </NuxtLink>
      </article>

    </section>
  </main>
</template>
