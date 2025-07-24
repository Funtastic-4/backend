import { initConfig } from "../../src/core/config";
import { Initialize } from "../../src/repository/postgres/db";

function main() {
  let config = initConfig();
  let db = Initialize(config);
}

main();
