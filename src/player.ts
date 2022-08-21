import Player, { Options } from "@vimeo/player";
import { UiMessageType } from "./shared";

export const init = () => {
  const params = new URLSearchParams(window.location.search);
  const apiId = params.get("apiId");
  if (apiId) {
    const id = parseInt(apiId);

    const options: Options = {
      id: id,
      autoplay: true,
    };

    const player = new Player("player", options);

    player.on("play", function () {
      console.log("playing the video!");
    });

    player.on("loaded", function () {
      const frame = document.querySelector("iframe");
      if (frame !== null) {
        frame.style.width = "100%";
        frame.style.height = "100%";
      }
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
