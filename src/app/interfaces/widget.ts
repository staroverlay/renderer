import Template from "./template";

export default interface Widget {
  _id: string;
  displayName: string;
  service: "twitch";
  settings: { [key in string]: any };
  template: Template;
  userId: string;
}
