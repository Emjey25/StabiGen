import { configDotenv } from "dotenv";

configDotenv();

const ERROR_MESSAGE = `Error Missing Environment Variables:`;

const Envs = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
};

export const ShowErrorMessage = () => {
  const missingVars = Object.entries(Envs).filter(([_, value]) => !value);

  if (missingVars.length > 0) {
    console.error(ERROR_MESSAGE);
    missingVars.forEach(([key]) => {
      console.error(` - ${key}`);
    });
  }

  if (missingVars.length > 0) {
    throw new Error("Missing required environment variables");
  }
};
