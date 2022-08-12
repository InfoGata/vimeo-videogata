import Player from "@vimeo/player";

export const init = () => {
  const params = new URLSearchParams(window.location.search);
  const apiId = params.get("apiId");
  if (apiId) {
    const id = parseInt(apiId);

    const options = {
      id: id,
      width: 640,
    };

    const player = new Player("player", options);

    player.on("play", function () {
      console.log("played the video!");
    });
  }
};
