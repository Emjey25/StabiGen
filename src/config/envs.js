import { configDotenv } from "dotenv";

configDotenv();

const ERROR_MESSAGE = `Error Missing Environment Variables:`;

const Envs = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

export const ShowErrorMessage = () => {
  const missingVars = Object.entries(Envs).filter(([key, value]) => 
    key === 'MONGODB_URI' || key === 'JWT_SECRET' ? !value : false
  );

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

export default Envs;
