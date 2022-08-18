import axios from "axios";
import "videogata-plugin-typings";
import { UiMessageType } from "./shared";
import { VimeoVideosResponse } from "./types";

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

const searchVideos = async (
  request: SearchRequest
): Promise<SearchVideoResult> => {
  const perPage = 20;
  const url = `${apiUrl}/videos`;
  const urlWithQuery = `${url}?per_page=${perPage}&query=${request.query}`;
  const result = await http.get<VimeoVideosResponse>(urlWithQuery);
  return {
    items: result.data.data.map((d) => ({
      title: d.name,
      duration: d.duration,
      apiId: d.uri.split("/").pop(),
      images: d.pictures.sizes.map((s) => ({
        width: s.width,
        height: s.height,
        url: s.link,
      })),
    })),
  };
};

const searchAll = async (request: SearchRequest): Promise<SearchAllResult> => {
  const videosPromise = searchVideos(request);
  const [videos] = await Promise.all([videosPromise]);
  return { videos };
};

application.onSearchAll = searchAll;
application.onSearchVideos = searchVideos;

const init = () => {};

init();
