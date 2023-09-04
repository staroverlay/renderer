type Widget = {
  id: string;
  enabled: boolean;
  html: string;
  settings: { [key: string]: any };
  scopes: string[];
  userId: string;
};

export default Widget;
