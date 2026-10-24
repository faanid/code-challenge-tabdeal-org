
<script setup lang="ts">
import type { VideoDetailResponse,Video, VideosResponse} from '~/types/video'

const route = useRoute()
const uid = computed(() => String(route.params.uid || ''))

const { data, status, error, refresh } = await useFetch<VideoDetailResponse>(
  () => `/api/videos/${encodeURIComponent(uid.value)}`,
)

const video = computed(() => data.value?.video)

function formatViews(views: number) {
  return Number(views || 0).toLocaleString('fa-IR')
}

useSeoMeta({
  title: () => video.value?.title || 'مشاهده ویدئو | تبدیل',
  description: () => video.value?.description || 'ویدئوهای آموزشی صرافی تبدیل',
})
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
    <NuxtLink
      to="/"
      class="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-yellow-400"
    >
      <span aria-hidden="true">→</span>
      بازگشت به فهرست ویدئوها
    </NuxtLink>

    <div v-if="status === 'pending'" class="py-20 text-center text-gray-400">
      در حال دریافت اطلاعات ویدئو...
    </div>

    <section
      v-else-if="error || !video"
      class="rounded-xl border border-white/10 px-5 py-16 text-center"
      role="alert"
    >
      <h1 class="text-xl font-bold">دریافت ویدئو امکان‌پذیر نیست.</h1>
      <p class="mt-3 text-sm leading-7 text-gray-400">
        ممکن است سرویس آپارات موقتاً در دسترس نباشد یا این ویدئو پیدا نشود.
      </p>
      <button
        type="button"
        class="mt-5 rounded-lg bg-yellow-400 px-5 py-2.5 font-semibold text-[#181818]"
        @click="refresh()"
      >
        تلاش مجدد
      </button>
    </section>

    <article v-else>
      <div class="overflow-hidden rounded-2xl border border-white/10 bg-black">
        <iframe
          v-if="video.frame"
          :src="video.frame"
          :title="video.title"
          class="aspect-video w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          loading="eager"
          referrerpolicy="strict-origin-when-cross-origin"
        />
        <img
          v-else
          :src="video.big_poster"
          :alt="video.title"
          class="aspect-video w-full object-cover"
        />
      </div>

      <div class="mt-6">
        <p class="mb-3 text-sm font-medium text-yellow-400">
          آکادمی تبدیل
        </p>

        <h1 class="text-2xl font-bold leading-relaxed sm:text-3xl">
          {{ video.title }}
        </h1>

        <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
          <span>{{ formatViews(video.visit_cnt) }} بازدید</span>
          <span v-if="video.sdate">{{ video.sdate }}</span>
        </div>

        <section
          v-if="video.description"
          class="mt-8 rounded-xl border border-white/10 bg-[#202020] p-5 sm:p-6"
        >
          <h2 class="mb-3 text-lg font-bold">درباره این ویدئو</h2>
          <p class="whitespace-pre-line text-sm leading-8 text-gray-300">
            {{ video.description }}
          </p>
        </section>
      </div>
    </article>
  </main>
</template>
