const { spawn } = require("node:child_process");

process.env.EXPO_NO_DEPENDENCY_VALIDATION = "1";
process.env.EXPO_NO_TELEMETRY = "1";

const userArgs = process.argv.slice(2);
const hasConnectionArg = userArgs.some((arg) => ["--localhost", "--lan", "--tunnel"].includes(arg));
const connectionArgs = hasConnectionArg ? [] : userArgs.includes("--web") ? ["--localhost"] : ["--tunnel"];

const args = [
  "node_modules/expo/bin/cli",
  "start",
  "--port",
  process.env.PORT || "8081",
  ...connectionArgs,
  ...userArgs,
];

const child = spawn(process.execPath, args, {
  stdio: "inherit",
  shell: false,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
