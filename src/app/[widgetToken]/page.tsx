import WidgetNotFound from "@/components/widget-not-found";
import WidgetRenderer from "@/components/widget-renderer";
import Widget from "@/lib/interfaces/widget";

async function getWidget(token: string): Promise<Widget | null> {
  const req = await fetch(`${process.env["BACKEND_SERVER"]}widgets/${token}`);
  return req.status == 200 ? await req.json() : null;
}

export default async function WidgetPage({
  params,
}: {
  params: { widgetToken: string };
}) {
  const widget = await getWidget(params.widgetToken);

  if (!widget) {
    return <WidgetNotFound />;
  }

  return <WidgetRenderer token={params.widgetToken} widget={widget} />;
}
