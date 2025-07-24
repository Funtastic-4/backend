import { initConfig } from "../../src/core/config";
import { initializeDatabase } from "../../src/repository/postgres/db";

function main() {
  let config = initConfig();
  let db = initializeDatabase(config);
}

main();
