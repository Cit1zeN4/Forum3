import rc from "rc";

type MainConfig = {
  JWT_KEY: string;
};

const config = <MainConfig>rc("config");

export default config;
