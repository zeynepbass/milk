import dotenv from "dotenv";

dotenv.config({ quiet: true });

export default {
  mongodb: {
    url: process.env.MONGO_URI,
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "esm",
};
