import axios from "axios";
import "videogata-plugin-typings";
import { UiMessageType } from "./shared";
import { VimeoVideoData, VimeoVideosResponse } from "./types";

const http = axios.create();

const apiUrl = "https://api.vimeo.com";

http.interceptors.request.use(
  (config) => {
    const token = "c2276962367652679c309e1bb60167b7";
    config.headers["Authorization"] = "bearer " + token;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

application.onUiMessage = async (message: UiMessageType) => {
  switch (message.type) {
    case "endvideo":
      application.endVideo();
      break;
  }
};

const vimeoVideoToVideo = (data: VimeoVideoData): Video => {
  const apiId = data.uri.split("/").pop();
  return {
    title: data.name,
    duration: data.duration,
    apiId: apiId,
    likes: data.metadata.connections.likes.total,
    description: data.description,
    views: data.stats.plays,
    images: data.pictures.sizes.map(
      (s): ImageInfo => ({
        width: s.width,
        height: s.height,
        url: s.link,
      })
    ),
    originalUrl: `https://vimeo.com/${apiId}`,
  };
};

const getVideo = async (request: GetVideoRequest): Promise<Video> => {
  const url = `${apiUrl}/videos/${request.apiId}`;
  const result = await http.get<VimeoVideoData>(url);
  return vimeoVideoToVideo(result.data);
};

const searchVideos = async (
  request: SearchRequest
): Promise<SearchVideoResult> => {
  const perPage = 20;
  const url = `${apiUrl}/videos`;
  const urlWithQuery = `${url}?per_page=${perPage}&query=${request.query}`;
  const result = await http.get<VimeoVideosResponse>(urlWithQuery);
  return {
    items: result.data.data.map(vimeoVideoToVideo),
  };
};

const searchAll = async (request: SearchRequest): Promise<SearchAllResult> => {
  const videosPromise = searchVideos(request);
  const [videos] = await Promise.all([videosPromise]);
  return { videos };
};

application.onSearchAll = searchAll;
application.onSearchVideos = searchVideos;
application.onGetVideo = getVideo;
