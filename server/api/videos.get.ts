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
const SEARCH_TIMEOUT_MS = 10_000

async function searchAparatVideos(searchText: string): Promise<AparatVideo[]> {
  const url =
    `https://www.aparat.com/etc/api/videoBySearch/text/` +
    `${encodeURIComponent(searchText)}/perpage/10`

  const response = await $fetch<AparatSearchResponse>(url, {
    timeout: SEARCH_TIMEOUT_MS,
  })

  return (response.videobysearch ?? []).filter(
    video => video.username?.toLowerCase() === CHANNEL_USERNAME,
  )
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchText = String(query.search ?? '').trim()

  if (searchText.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search text must not exceed 100 characters.',
    })
  }

  if (searchText && searchText.length < 4) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Search text must contain at least 4 characters.',
    })
  }

  // The channel-list endpoint currently returns 503.
  // Public search is a best-effort fallback and cannot guarantee full coverage.
  const searchTerms = searchText
    ? [searchText]
    : ['تبدیل', 'صرافی تبدیل', 'tabdeal']

  const results = await Promise.allSettled(
    searchTerms.map(searchAparatVideos),
  )

  const successfulResults = results.filter(
    (result): result is PromiseFulfilledResult<AparatVideo[]> =>
      result.status === 'fulfilled',
  )

  // Distinguish an empty search result from an upstream outage.
  if (successfulResults.length === 0) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Aparat is temporarily unavailable.',
    })
  }

  const uniqueVideos = [
    ...new Map(
      successfulResults
        .flatMap(result => result.value)
        .filter(video => video.uid && video.title)
        .map(video => [video.uid, video]),
    ).values(),
  ]

  return {
    videobyuser: uniqueVideos,
    source: 'aparat-search',
    searchLimited: true,
  }
})
