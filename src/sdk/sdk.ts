import { Socket } from "socket.io-client";
import { injectContent, renderIf } from "../app/dom-utils";
import { Process, getWorkerURL, process } from "../app/env";
import Template from "../app/interfaces/template";
import Version from "../app/interfaces/version";
import Widget from "../app/interfaces/widget";
import EventEmitter from "./event-emitter";

export default class SDK extends EventEmitter {
  private readonly socket: Socket;

  public enabled: boolean;
  public connected: boolean;
  public widget: Widget | null;
  public template: Template | null;
  public version: Version | null;
  public settings: { [key in string]: any };
  public topics: Set<string>;
  public process: Process;
  public html: string;

  constructor(socket: Socket) {
    super();
    this.socket = socket;
    this.enabled = true;
    this.connected = false;
    this.widget = null;
    this.template = null;
    this.version = null;
    this.settings = {};
    this.topics = new Set();
    this.process = process;
    this.html = "";
  }

  log(...message: object[]) {
    this.logC("Wdg", ...message);
  }

  logC(context: string, ...message: any[]) {
    console.log("[StarOverlay] " + context + " >", ...message);
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

  render() {
    injectContent("#app", this.html);
    renderIf("if-so-env", window.process.env.SO_ENV);
    renderIf("if-node-env", window.process.env.NODE_ENV);
  }

  clear() {
    injectContent("#app", "");
  }
}
