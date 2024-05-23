import { Socket } from "socket.io-client";
import { Process, getWorkerURL, process } from "../app/env";
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
  public process: Process;

  constructor(socket: Socket) {
    super();
    this.socket = socket;
    this.connected = false;
    this.widget = null;
    this.template = null;
    this.version = null;
    this.settings = {};
    this.topics = new Set();
    this.process = process;
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

  getMedia(mediaID: string) {
    const cdn = getWorkerURL();
    return `${cdn}/${mediaID}`;
  }
}
