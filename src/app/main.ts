import io from "socket.io-client";

import SDK from "../sdk/sdk";
import { spawnPopup } from "./dom-utils";
import { getBackendURL } from "./env";
import { getError } from "./errors";
import Template from "./interfaces/template";
import Version from "./interfaces/version";
import Widget from "./interfaces/widget";

// Initialize socket connection.
const socket = io(getBackendURL(), {
  transports: ["websocket"],
});

// Initialize SDK.
window.StarOverlay = new SDK(socket);
window.process = window.StarOverlay.process;

// Authenticate.
const token = location.pathname.replace("/", "");

socket.on("connect", () => {
  socket.emit("auth", token);
});

// Handle socket errors.
socket.on("error", (err) => {
  console.error("Error ocurred:", err);
  const error = getError(err);
  spawnPopup(error.title, error.message, "crit");
});

// Handle success connection.
socket.on(
  "success",
  ({
    widget,
    template,
    version,
  }: {
    widget: Widget;
    template: Template;
    version: Version;
  }) => {
    const sdk = window.StarOverlay;
    sdk.widget = widget;
    sdk.template = template;
    sdk.version = version;
    sdk.settings = widget.settings;
    sdk.html = version.html;

    if (widget.enabled || window.process.env.SO_ENV === "preview") {
      sdk.render();
    }

    if (sdk.topics.size != 0) {
      const topics: string[] = [];
      sdk.topics.forEach((topic) => {
        topics.push(topic);
      });
      socket.emit("subscribe", topics);
    }

    sdk.connected = true;
    sdk.logC("Sdk", "Connected to server.");
    sdk.logC("Sdk", "Logged as widget:", widget._id);
  }
);

// Handle events.
type Event = { data: any; topic: string };

socket.on("event", ({ data, topic }: Event) => {
  const sdk = window.StarOverlay;

  if (sdk.enabled) {
    sdk.emit("event:" + topic, data);
    sdk.emit("event", { data, topic });
  }

  if (topic == "settings:update") {
    const old = sdk.settings;
    sdk.settings = data;
    sdk.emit("settings-updated", {
      oldSettings: old,
      newSettings: data,
    });
    sdk.logC("Sdk", "Settings updated:", old, data);
  }

  if (topic == "settings:toggle") {
    const toggle = data as boolean;
    sdk.logC("Sdk", "Widget toggled:", toggle ? "enabled" : "disabled");
    sdk.emit("settings-toggle", toggle);
    sdk.enabled = toggle;

    if (window.process.env.SO_ENV !== "preview") {
      if (toggle) {
        sdk.render();
      } else {
        sdk.clear();
      }
    }
  }
});
