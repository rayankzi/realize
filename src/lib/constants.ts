import path from "node:path";

export const PROJECT_ROOT = process.cwd();
export const BACKEND_ENV_PATH = path.join(PROJECT_ROOT, "backend", ".env");
export const NOTION_PAGES_PATH = path.join(PROJECT_ROOT, "notion_pages.json");
export const LOGS_PATH = path.join(PROJECT_ROOT, "logs.txt");
export const DATA_DIR = path.join(PROJECT_ROOT, "data");
export const OUTPUT_DIR = path.join(PROJECT_ROOT, "output");
export const WHISPER_MODEL = "mlx-community/whisper-large-v3-turbo";
