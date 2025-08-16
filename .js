#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";

async function main() {
  console.log(chalk.green("🚀 Welcome to Trigger.dev Job Scaffolder"));

  const { projectName } = await inquirer.prompt({
    type: "input",
    name: "projectName",
    message: "Enter your project name:",
    validate: (input) =>
      input && /^[a-zA-Z0-9-_]+$/.test(input)
        ? true
        : "Project name must be alphanumeric and can include - or _ only",
  });

  const baseDir = path.join(process.cwd(), projectName);

  if (await fs.pathExists(baseDir)) {
    console.log(chalk.red(`❌ Directory "${projectName}" already exists!`));
    process.exit(1);
  }

  console.log(chalk.yellow("⏳ Creating project structure..."));
  await fs.mkdirp(path.join(baseDir, "src"));
  await fs.mkdirp(path.join(baseDir, "tasks"));

  // Create sample app entry
  const indexTs = `console.log("Welcome to ${projectName}");\n`;
  await fs.writeFile(path.join(baseDir, "src", "index.ts"), indexTs);

  // Create Trigger.dev task example
  const taskTs = `import { task } from "@trigger.dev/sdk";

export const exampleJob = task({
  id: "example-job",
  run: async (payload: { message: string }) => {
    console.log("Example job running with message:", payload.message);
    return { success: true, timestamp: new Date().toISOString() };
  },
});
`;
  await fs.writeFile(path.join(baseDir, "tasks", "exampleJob.ts"), taskTs);

  // Write package.json
  const pkgJson = {
    name: projectName,
    version: "0.1.0",
    main: "src/index.ts",
    scripts: {
      start: "ts-node src/index.ts",
      dev: "trigger dev",
      deploy: "trigger deploy",
    },
    dependencies: {
      "@trigger.dev/sdk": "^4.0.0",
    },
    devDependencies: {
      typescript: "^4.9.4",
      "ts-node": "^10.9.1",
    },
  };
  await fs.writeJSON(path.join(baseDir, "package.json"), pkgJson, { spaces: 2 });

  // Write minimal tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      moduleResolution: "node",
      strict: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      skipLibCheck: true,
    },
    include: ["src", "tasks"],
  };
  await fs.writeJSON(path.join(baseDir, "tsconfig.json"), tsconfig, { spaces: 2 });

  console.log(chalk.green(`✅ Project ${projectName} scaffolded successfully!`));
  console.log(chalk.blue(`\nNext steps:
  1. cd ${projectName}
  2. npm install
  3. npx trigger.dev@latest dev (to start local development)
  4. Customize your Trigger.dev tasks in the tasks/ folder
  5. Run or deploy your jobs using Trigger.dev CLI
`));
}

main().catch((error) => {
  console.error(chalk.red(error));
  process.exit(1);
});
