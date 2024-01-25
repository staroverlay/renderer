import io from "socket.io-client";

import SDK from "../sdk/sdk";
import { injectContent, spawnPopup } from "./dom-utils";
import { getBackendURL } from "./env";
import { getError } from "./errors";
import Widget from "./interfaces/widget";

// Initialize socket connection.
const socket = io(getBackendURL(), {
  transports: ["websocket"],
});

// Initialize SDK.
window.StarOverlay = new SDK(socket);

// Authenticate.
const token = location.pathname.replace("/", "");

socket.on("connect", () => {
  socket.emit("auth", token);
});

// Handle socket errors.
socket.on("error", (err) => {
  const error = getError(err);
  spawnPopup(error.title, error.message, "crit");
});

// Handle success connection.
socket.on("success", (widget: Widget) => {
  const sdk = window.StarOverlay;
  sdk.widget = widget;
  sdk.template = widget.template;
  sdk.settings = widget.settings;
  injectContent("#app", widget.template.html);

  if (sdk.topics.size != 0) {
    const topics: string[] = [];
    sdk.topics.forEach((topic) => {
      topics.push(topic);
    });
    socket.emit("subscribe", topics);
  }

  sdk.connected = true;
});

// Handle events.
type Event = { data: any; topic: string };

socket.on("event", ({ data, topic }: Event) => {
  const sdk = window.StarOverlay;

  sdk.emit("event:" + topic, data);
  sdk.emit("event", { data, topic });
});

console.log("XD");
