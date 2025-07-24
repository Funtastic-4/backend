export type AppConfig = {
  database_url: string;
};

export function initConfig(): AppConfig {
  let config: AppConfig = {
    database_url: Bun.env.DATABASE_URL ?? "",
  };

  try {
    validate(config);
  } catch (e) {
    throw e;
  }

  return config;
}

export function validate(config: AppConfig) {
  for (let [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(
        `Invalid ${key} value, please check your environment variables;`,
      );
    }
  }
}
