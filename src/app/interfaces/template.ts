export default interface Template {
  _id: string;
  creatorId: string;
  description: string;
  lastVersion: string;
  lastVersionId: string;
  name: string;
  price: number;
  service: "twitch";
  storeDescription: string;
  thumbnail: string;
}
