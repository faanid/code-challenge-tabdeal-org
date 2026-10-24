
interface AparatVideo {
  id: string
  uid: string
  title: string
  username: string
  visit_cnt: number
  big_poster: string
  small_poster?: string
  duration?: number
  sdate?: string
}

interface AparatSearchResponse {
  videobysearch?: AparatVideo[]
}

const CHANNEL_USERNAME = 'tabdealplatform'

async function searchAparatVideos(searchText: string): Promise<AparatVideo[]> {
  const url =
    `https://www.aparat.com/etc/api/videoBySearch/text/` +
    `${encodeURIComponent(searchText)}/perpage/10`

  const response = await $fetch<AparatSearchResponse>(url)

  return (response.videobysearch ?? []).filter(
    video => video.username === CHANNEL_USERNAME,
  )
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchText = String(query.search ?? '').trim()

  if (searchText && searchText.length < 4) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search text must contain at least 4 characters.',
    })
  }

  // The channel-list endpoint currently returns 503.
  // Use real public-search results as a temporary fallback.
  const searchTerms = searchText
    ? [searchText]
    : ['تبدیل', 'صرافی تبدیل', 'tabdeal']

  const results = await Promise.allSettled(
    searchTerms.map(searchAparatVideos),
  )

  const videos = results
    .filter(
      (result): result is PromiseFulfilledResult<AparatVideo[]> =>
        result.status === 'fulfilled',
    )
    .flatMap(result => result.value)

  if (videos.length === 0) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Could not retrieve videos from Aparat.',
    })
  }

  const uniqueVideos = [
    ...new Map(videos.map(video => [video.uid, video])).values(),
  ]

  return {
    videobyuser: uniqueVideos,
    source: 'aparat-search',
    searchLimited: true,
  }
})
