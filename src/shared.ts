type SendInfoType = {
  type: "send-info";
  accessToken: string;
};

export type MessageType = SendInfoType;

type UiGetInfoType = {
  type: "get-info";
};

type UiSetKeysType = {
  type: "set-keys";
  accessToken: string;
};

type UiEndVideoType = {
  type: "endvideo";
};

export type UiMessageType = UiEndVideoType | UiSetKeysType | UiGetInfoType;
