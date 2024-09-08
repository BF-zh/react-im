import { capitalize, getPackageJson } from "helper-fns";

export const VERSION_VALIDATION_MESSAGE =
  'Version must start with "v" followed by a number.';

// swagger constants
const packageJson = getPackageJson();

export const APP_NAME = packageJson.name;
export const SWAGGER_API_CURRENT_VERSION = packageJson.version;
export const SWAGGER_DESCRIPTION = packageJson.description!;
export const SWAGGER_TITLE = `${capitalize(APP_NAME)} API Documentation`;

export const SWAGGER_API_ENDPOINT = "doc";

export const APP_ENVIRONMENTS = [
  "dev",
  "development",
  "stage",
  "staging",
  "test",
  "testing",
  "prod",
  "production",
];
