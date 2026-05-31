import { spawn } from "node:child_process";

const checks = [
  { name: "prisma", command: "npm", args: ["run", "checkup:prisma"] },
  { name: "types", command: "npm", args: ["run", "checkup:types"] },
  { name: "lint", command: "npm", args: ["run", "checkup:lint"] },
];

const children = [];
let finished = 0;
let failed = false;

for (const check of checks) {
  const child = spawn(check.command, check.args, {
    shell: true,
    stdio: "inherit",
  });

  child.on("exit", (code) => {
    finished += 1;

    if (code !== 0) {
      failed = true;
      for (const other of children) {
        if (other.pid && other.pid !== child.pid && !other.killed) {
          other.kill();
        }
      }
    }

    if (finished === checks.length) {
      process.exit(failed ? 1 : 0);
    }
  });

  child.on("error", () => {
    failed = true;
  });

  children.push(child);
}
