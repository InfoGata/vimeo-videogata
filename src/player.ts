import Player, { Options } from "@vimeo/player";
import { UiMessageType } from "./shared";

export const init = () => {
  const params = new URLSearchParams(window.location.search);
  const apiId = params.get("apiId");
  if (apiId) {
    const id = parseInt(apiId);

    const options: Options = {
      id: id,
      width: 640,
      autoplay: true,
    };

    const player = new Player("player", options);

    player.on("play", function () {
      console.log("playing the video!");
    });

    player.on("ended", () => {
      console.log("Video ended");
      sendMessage({ type: "endvideo" });
    });

    function sendMessage(message: UiMessageType) {
      parent.postMessage(message, "*");
    }
  }
};
