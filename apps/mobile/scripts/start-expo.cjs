const { spawn } = require("node:child_process");
const os = require("node:os");

process.env.EXPO_NO_DEPENDENCY_VALIDATION = "1";
process.env.EXPO_NO_TELEMETRY = "1";

function getLanIp() {
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (entry.family === "IPv4" && !entry.internal) {
        return entry.address;
      }
    }
  }
  return null;
}

const userArgs = process.argv.slice(2);
const hasConnectionArg = userArgs.some((arg) => ["--localhost", "--lan", "--tunnel"].includes(arg));
const connectionArgs = hasConnectionArg ? [] : userArgs.includes("--web") ? ["--localhost"] : ["--lan"];

if (!process.env.EXPO_PUBLIC_API_URL && !userArgs.includes("--web")) {
  const lanIp = getLanIp();
  if (lanIp) {
    process.env.EXPO_PUBLIC_API_URL = `http://${lanIp}:4000/api`;
    console.log(`Using API at ${process.env.EXPO_PUBLIC_API_URL}`);
  }
}

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
