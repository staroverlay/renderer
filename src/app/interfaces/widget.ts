export default interface Widget {
  _id: string;
  autoUpdate: boolean;
  displayName: string;
  enabled: boolean;
  service: "twitch";
  scopes: string[];
  settings: any;
  templateId: string;
  templateVersion: string;
}
