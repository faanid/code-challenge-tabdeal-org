
<template>
  <div
    dir="rtl"
    class="min-h-screen bg-[#181818] text-white antialiased"
  >
    <header
      class="sticky top-0 z-50 border-b border-white/[0.08] bg-[#181818]/85 backdrop-blur-xl"
    >
      <div
        class="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6"
      >
        <NuxtLink
          to="/"
          aria-label="صفحه اصلی تبدیل"
          class="flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <img
            src="/tabdeal-logo-dark.svg"
            alt="تبدیل"
            class="h-8 w-auto object-contain sm:h-9"
          />
        </NuxtLink>

        <span class="text-sm font-medium text-gray-300 sm:text-base">
          ویدئوهای آموزشی
        </span>
      </div>
    </header>

    <NuxtPage />
  </div>
</template>
