class SO__EventEmitter {
  constructor() {
    this.listeners = new Map();
    this.emit = this.emit.bind(this);
    this.on = this.on.bind(this);
  }

  emit(eventName, ...args) {
    const listeners = this.listeners.get(eventName);
    if (listeners) {
      listeners.forEach((listener) => listener(...args));
    }
  }

  on(eventName, listener) {
    const listeners = this.listeners.get(eventName);
    if (listeners) {
      listeners.add(listener);
    } else {
      this.listeners.set(eventName, new Set([listener]));
    }
  }
}

class EventSub extends SO__EventEmitter {
  constructor(server) {
    super();

    this.io = io(server);

    this.io.on("connect", () => {
      this.emit("connect");
      StarOverlay.log("Connected to EventSub server");

      this.io.emit("auth", StarOverlay.WIDGET_TOKEN);
    });

    this.io.on("disconnect", () => {
      this.emit("disconnect");
      StarOverlay.log("Disconnected from EventSub server");
    });

    this.io.on("error", ({ type, message }) => {
      this.emit("error", { type, message });
      StarOverlay.error("Error from EventSub server: " + type + ": " + message);
    });

    for (const topic of StarOverlay.EVENTSUB_TOPICS) {
      this.io.on("event:" + topic, (data) => {
        StarOverlay.log("Triggered event for subscribed topic: " + topic);
        this.emit(topic, data);
      });
    }
  }
}

class __StarOverlay extends SO__EventEmitter {
  constructor() {
    super();

    this.console = console;
    this.connectEventSub = this.connectEventSub.bind(this);
    this.error = this.error.bind(this);
    this.log = this.log.bind(this);
    this.__init__ = this.__init__.bind(this);
  }

  connectEventSub() {
    this.eventsub = new EventSub(StarOverlay.EVENTSUB_SERVER);
  }

  error(message) {
    this.console.error("[StarOverlay]", message);
  }

  log(message) {
    this.console.log("[StarOverlay]", message);
  }

  __init__() {
    this.emit("ready");
    this.log("Ready");
  }
}

const StarOverlay = new __StarOverlay();
StarOverlay.EVENTSUB_TOPICS = [
  "twitch:ban",
  "twitch:unban",
  "twitch:charity",
  "twitch:cheer",
  "twitch:follow",
  "twitch:goal",
  "twitch:hype_train",
  "twitch:moderator",
  "twitch:poll",
  "twitch:prediction",
  "twitch:raid",
  "twitch:raid_to",
  "twitch:redemption",
  "twitch:reward",
  "twitch:shield_mode",
  "twitch:shoutout",
  "twitch:shoutout_receive",
  "twitch:subscription",
  "twitch:update",
  "twitch:stream-up",
  "twitch:stream-off",
];
window.StarOverlay = StarOverlay;
