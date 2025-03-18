import ky from "ky";
import { MessageType, UiMessageType } from "./shared";
import { VimeoVideoData, VimeoVideosResponse } from "./types";

const http = ky.create({
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getAccessToken();
        request.headers.set("Authorization", "bearer " + token);
      },
    ],
  },
});

const apiUrl = "https://api.vimeo.com";

const getAccessToken = (): string => {
  // Unauthenticated token with public scope
  const defaultToken = "c2276962367652679c309e1bb60167b7";
  const token = localStorage.getItem("accessToken");
  return token ?? defaultToken;
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
  const result = await http.get<VimeoVideoData>(url).json();
  return vimeoVideoToVideo(result);
};

const searchVideos = async (
  request: SearchRequest
): Promise<SearchVideoResult> => {
  const perPage = 20;
  const offset = request.pageInfo?.offset || 0;
  const page = offset / perPage + 1;
  const url = `${apiUrl}/videos`;
  const urlWithQuery = `${url}?per_page=${perPage}&query=${request.query}&page=${page}`;
  const result = await http.get<VimeoVideosResponse>(urlWithQuery).json();
  const pageInfo: PageInfo = {
    offset,
    resultsPerPage: perPage,
    totalResults: result.total,
  };
  return {
    items: result.data.map(vimeoVideoToVideo),
    pageInfo,
  };
};

const sendMessage = (message: MessageType) => {
  application.postUiMessage(message);
};

const sendInfo = async () => {
  const accessToken = localStorage.getItem("accessToken") ?? "";
  sendMessage({
    type: "send-info",
    accessToken,
  });
};

application.onUiMessage = async (message: UiMessageType) => {
  switch (message.type) {
    case "get-info":
      await sendInfo();
      break;
    case "set-keys":
      localStorage.setItem("accessToken", message.accessToken);
      application.createNotification({ message: "Api keys Saved!" });
      break;
    case "endvideo":
      application.endVideo();
      break;
    default:
      const _exhaustive: never = message;
      break;
  }
};

const searchAll = async (request: SearchRequest): Promise<SearchAllResult> => {
  const videosPromise = searchVideos(request);
  const [videos] = await Promise.all([videosPromise]);
  return { videos };
};

application.onSearchAll = searchAll;
application.onSearchVideos = searchVideos;
application.onGetVideo = getVideo;
