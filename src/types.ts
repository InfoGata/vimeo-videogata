export interface VimeoVideosResponse {
  total: number;
  page: number;
  per_page: number;
  paging: VimeoPaging;
  data: VimeoVideoData[];
}

export interface VimeoPaging {
  next: string;
  previous: string;
  first: string;
  last: string;
}

export interface VimeoVideoData {
  uri: string;
  name: string;
  description: string;
  type: string;
  player_embed_uri: string;
  duration: number;
  width: number;
  height: number;
  pictures: VimeoVideoPictures;
  metadata: VimeoVideoMetadata;
  stats: VimeoVideoStats;
}

export interface VimeoVideoStats {
  plays: number;
}

export interface VimeoVideoMetadata {
  connections: VimeoMetadataConnections;
}

export interface VimeoMetadataConnections {
  likes: VimeoConnectionsLikes;
}

export interface VimeoConnectionsLikes {
  total: number;
}

export interface VimeoVideoPictures {
  sizes: VimeoVideoPictureSize[];
}

export interface VimeoVideoPictureSize {
  width: number;
  height: number;
  link: string;
}

export interface VimeoFeedResponse {
  total: number;
  page: number;
  per_page: number;
  paging: VimeoPaging;
  data: VimeoFeedItem[];
}

/**
 * One activity in the user's feed (an upload, like, share, ...). `clip` is the
 * video it is about; it is typed optional because not every activity type is
 * guaranteed to carry one.
 */
export interface VimeoFeedItem {
  type: string;
  clip?: VimeoVideoData;
}
