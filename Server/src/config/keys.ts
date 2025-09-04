import "dotenv/config";

const keys: any = {
  api: {
    apiUrl: process.env.BASE_API_URL,
  },
  google: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: process.env.CALLBACK_URL,
  },
  port: process.env.PORT || 3000,
  jwtToken: process.env.JWT_SECRET_KEY,
};

export default keys;
