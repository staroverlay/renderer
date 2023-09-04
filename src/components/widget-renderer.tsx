import Widget from "@/lib/interfaces/widget";

interface WidgetRendererProps {
  widget: Widget;
}

export default function WidgetRenderer({ widget }: WidgetRendererProps) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: widget.html,
      }}
    ></div>
  );
}
