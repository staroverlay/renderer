export type PROCESS_ENV = "development" | "production" | "stage";
export type SO_ENV = "streaming" | "preview" | "browser";

export type Process = {
  env: {
    NODE_ENV: PROCESS_ENV;
    SO_ENV: SO_ENV;
  };
};

export const process: Process = {
  env: {
    NODE_ENV: "development",
    SO_ENV: "browser",
  },
};

// Process NODE_ENV.
const { hostname } = location;

if (hostname === "localhost" || hostname === "127.0.0.1") {
  process.env.NODE_ENV = "development";
} else if (hostname.includes("dev.")) {
  process.env.NODE_ENV = "stage";
} else {
  process.env.NODE_ENV = "production";
}

// Process SO_ENV.
const ua = navigator.userAgent?.toLowerCase() || "unknown?";
const apps = ["unknown?", "obs"];
const isIframe = window.frameElement !== null;
const isStreaming = apps.find((name) => ua.includes(name)) !== undefined;

if (isStreaming) {
  process.env.SO_ENV = "streaming";
} else if (isIframe) {
  process.env.SO_ENV = "preview";
} else {
  process.env.SO_ENV = "browser";
}

export function getBackendURL() {
  switch (process.env.NODE_ENV) {
    case "development":
      return import.meta.env.VITE_BACKEND_DEV;
    case "production":
      return import.meta.env.VITE_BACKEND_PROD;
    case "stage":
      return import.meta.env.VITE_BACKEND_STAGE;
  }
}

export function getWorkerURL() {
  switch (process.env.NODE_ENV) {
    case "development":
      return import.meta.env.VITE_CDN_DEV;
    case "production":
      return import.meta.env.VITE_CDN_PROD;
    case "stage":
      return import.meta.env.VITE_CDN_STAGE;
  }
}
