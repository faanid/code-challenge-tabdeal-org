
interface AparatVideoResponse {
  video?: {
    id: string
    uid: string
    title: string
    username: string
    sender_name?: string
    visit_cnt: number
    big_poster: string
    small_poster?: string
    duration?: number
    sdate?: string
    description?: string
    frame?: string
    file_link?: string
  }
}

export default defineEventHandler(async (event) => {
  const uid = getRouterParam(event, 'uid')

  if (!uid || !/^[a-zA-Z0-9_-]+$/.test(uid)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid video ID.',
    })
  }

  try {
    const response = await $fetch<AparatVideoResponse>(
      `https://www.aparat.com/etc/api/video/videohash/${encodeURIComponent(uid)}`
    )

    const video = response.video

    if (!video) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Video not found.',
      })
    }

    return {
      video,
      source: 'aparat',
    }
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 502,
      statusMessage: 'Could not fetch video from Aparat.',
    })
  }
})
