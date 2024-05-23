import { Process } from "./app/env";
import SDK from "./sdk/sdk";

export declare global {
  interface Window {
    StarOverlay: SDK;
    process: Process;
  }
}
