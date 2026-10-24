export interface Video {
  id?: string
  uid: string
  title: string
  username?: string
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

export interface VideosResponse {
  videobyuser: Video[]
  source?: string
  searchLimited?: boolean
}

export interface VideoDetailResponse {
  video: Video
  source: string
}