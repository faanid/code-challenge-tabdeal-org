
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchText = String(query.search || 'تبدیل').trim()

  if (searchText.length < 4) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search text must contain at least 4 characters.',
    })
  }

  const encodedText = encodeURIComponent(searchText)

  const response = await $fetch<{
    videobysearch?: Array<{
      id: string
      uid: string
      title: string
      username: string
      visit_cnt: number
      big_poster: string
      small_poster?: string
      duration?: number
      sdate?: string
    }>
    ui?: {
      pagingForward?: string | null
      pagingBack?: string | null
    }
  }>(
    `https://www.aparat.com/etc/api/videoBySearch/text/${encodedText}/perpage/10`
  )

  return {
    videobyuser: (response.videobysearch ?? []).filter(
      (video) => video.username === 'tabdealplatform'
    ),
    ui: response.ui,
    source: 'aparat-search',
  }
})
