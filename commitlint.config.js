export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "trailer-exists": [2, "never", "Co-Authored-By:"],
  },
};
