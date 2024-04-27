import { Socket } from "socket.io-client";
import { getBackendURL } from "../app/env";
import Template from "../app/interfaces/template";
import Version from "../app/interfaces/version";
import Widget from "../app/interfaces/widget";
import EventEmitter from "./event-emitter";

export default class SDK extends EventEmitter {
  private readonly socket: Socket;

  public connected: boolean;
  public widget: Widget | null;
  public template: Template | null;
  public version: Version | null;
  public settings: { [key in string]: any };
  public topics: Set<string>;

  constructor(socket: Socket) {
    super();
    this.socket = socket;
    this.connected = false;
    this.widget = null;
    this.template = null;
    this.version = null;
    this.settings = {};
    this.topics = new Set();
  }

  subscribeTopic(topic: string, listener: () => unknown) {
    if (!this.topics.has(topic)) {
      this.topics.add(topic);

      if (this.connected) {
        this.socket.emit("subscribe", [topic]);
      }
    }

    this.on("event:" + topic, listener);
  }

  async getMedia(mediaID: string) {
    const media = await fetch(getBackendURL() + "/media/" + mediaID);
    const data = await media.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  }
}
