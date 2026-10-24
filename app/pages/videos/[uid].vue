
<script setup lang="ts">
import type { VideoDetailResponse } from '~/types/video'

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
  <main class="mx-auto max-w-5xl px-4 pb-16 pt-7 sm:px-6 sm:pt-10">
    <NuxtLink
      to="/"
      class="mb-7 inline-flex items-center gap-3 rounded-lg py-2 text-sm text-gray-400 transition-colors hover:text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 sm:mb-8"
    >
      <span
        class="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-colors group-hover:border-yellow-400/40"
        aria-hidden="true"
      >
        →
      </span>
      بازگشت به فهرست ویدئوها
    </NuxtLink>

    <div
      v-if="status === 'pending'"
      class="rounded-2xl border border-white/[0.08] py-24 text-center text-sm text-gray-400"
      role="status"
    >
      در حال دریافت اطلاعات ویدئو...
    </div>

    <section
      v-else-if="error || !video"
      class="rounded-2xl border border-white/[0.08] px-5 py-16 text-center"
      role="alert"
    >
      <h1 class="text-xl font-bold">
        دریافت ویدئو امکان‌پذیر نیست.
      </h1>

      <p class="mx-auto mt-3 max-w-lg text-sm leading-8 text-gray-400">
        ممکن است سرویس آپارات موقتاً در دسترس نباشد یا این ویدئو پیدا نشود.
      </p>

      <button
        type="button"
        class="mt-6 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-[#181818] transition-colors hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200"
        @click="refresh()"
      >
        تلاش مجدد
      </button>
    </section>

    <article v-else>
      <div class="overflow-hidden rounded-2xl border border-white/[0.09] bg-black shadow-2xl shadow-black/20">
        <iframe
          v-if="video.frame"
          :src="video.frame"
          :title="video.title"
          class="block aspect-video w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          loading="eager"
          referrerpolicy="strict-origin-when-cross-origin"
        />

        <img
          v-else
          :src="video.big_poster"
          :alt="video.title"
          class="block aspect-video w-full object-cover"
        />
      </div>

      <div class="mt-7 sm:mt-9">
        <p class="mb-3 text-sm font-semibold text-yellow-400">
          آکادمی تبدیل
        </p>

        <h1 class="text-2xl font-bold leading-[1.8] tracking-tight text-white sm:text-3xl">
          {{ video.title }}
        </h1>

        <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-white/[0.08] pb-6 text-sm text-gray-400">
          <span class="inline-flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-yellow-400" aria-hidden="true" />
            {{ formatViews(video.visit_cnt) }} بازدید
          </span>

          <span
            v-if="video.sdate"
            class="inline-flex items-center gap-2"
          >
            <span class="text-gray-500" aria-hidden="true">·</span>
            {{ video.sdate }}
          </span>
        </div>

        <section
          v-if="video.description"
          class="mt-7 rounded-2xl border border-white/[0.08] bg-[#202020] p-5 sm:mt-8 sm:p-7"
        >
          <h2 class="text-lg font-bold">
            درباره این ویدئو
          </h2>

          <div class="mt-4 h-px w-10 bg-yellow-400" />

          <p class="mt-4 whitespace-pre-line break-words text-sm leading-8 text-gray-300 sm:text-base">
            {{ video.description }}
          </p>
        </section>
      </div>
    </article>
  </main>
</template>
