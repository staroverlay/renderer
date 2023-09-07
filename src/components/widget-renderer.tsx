"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

import Widget from "@/lib/interfaces/widget";
import InnerHTML from "./innerhtml";

interface WidgetRendererProps {
  token: string;
  widget: Widget;
}

export default function WidgetRenderer({ token, widget }: WidgetRendererProps) {
  const [ioLoaded, setIoLoaded] = useState(false);
  const [apiLoaded, setApiLoaded] = useState(false);
  const fullLoaded = ioLoaded && apiLoaded;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={process.env.NEXT_PUBLIC_SOCKET_IO_SCRIPT}
        onLoad={() => {
          setIoLoaded(true);
          console.log("IO loaded");
        }}
      ></Script>

      <Script
        strategy="afterInteractive"
        id="so-sdk-import"
        src="/sdk.js"
        onLoad={() => {
          setApiLoaded(true);
          console.log("API loaded");
        }}
      ></Script>

      <Script strategy="lazyOnload" id="so-script-initializer">
        {`
          window.StarOverlay.EVENTSUB_SERVER = "${
            process.env.NEXT_PUBLIC_EVENTSUB_SERVER
          }";
          window.StarOverlay.WIDGET_TOKEN = "${token}";
          window.StarOverlay.WIDGET = ${JSON.stringify(widget)};
          window.StarOverlay.__init__();
        `}
      </Script>

      {fullLoaded && <InnerHTML html={widget.html} />}
    </>
  );
}
