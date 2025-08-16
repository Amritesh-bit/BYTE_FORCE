// index.js

import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

// --- The Template for the Job File ---
// This is the boilerplate code we will generate.
// The placeholders like {{jobId}} will be replaced with user input.
const jobTemplate = `
import { trigger } from "@trigger.dev/sdk";
import { z } from "zod";

export const {{jobId}} = trigger.defineJob({
  id: "{{jobIdKebabCase}}",
  name: "{{jobName}}",
  version: "0.1.0",
  trigger: {{triggerDetails}},
  run: async (payload, io, ctx) => {
    // Your job logic goes here
    await io.logger.info("Hello from the {{jobName}} job!");

    return {
      status: "success",
    };
  },
});
`;

// --- Helper Functions ---
// Converts a string to camelCase (e.g., "send-welcome-email" -> "sendWelcomeEmail")
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Converts a string to Title Case (e.g., "send welcome email" -> "Send Welcome Email")
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}


// --- Main Function to Run the Scaffolder ---
async function run() {
  console.log(chalk.blue.bold("Trigger.dev Job Scaffolder"));
  console.log(chalk.gray("Let's create a new job file...\n"));

  // 1. Ask the user for input using Inquirer
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'jobId',
      message: 'What is the job ID? (e.g., send-welcome-email)',
      validate: (input) => input ? true : 'Job ID cannot be empty.',
    },
    {
      type: 'list',
      name: 'triggerType',
      message: 'What will trigger this job?',
      choices: ['Event', 'Cron'],
    },
    {
      type: 'input',
      name: 'cronSchedule',
      message: 'What is the cron schedule? (e.g., "0 0 * * *")',
      when: (answers) => answers.triggerType === 'Cron', // Only ask this if trigger is Cron
    },
    {
        type: 'input',
        name: 'eventName',
        message: 'What is the event name? (e.g., "user.created")',
        when: (answers) => answers.triggerType === 'Event', // Only ask this if trigger is Event
      },
  ]);

  // 2. Prepare the variables for the template
  const jobIdKebabCase = answers.jobId;
  const jobIdCamelCase = toCamelCase(jobIdKebabCase);
  const jobName = toTitleCase(jobIdKebabCase.replace(/-/g, ' '));
  let triggerDetails = '';

  if (answers.triggerType === 'Cron') {
    triggerDetails = `trigger.schedule({ cron: "${answers.cronSchedule}" })`;
  } else {
    triggerDetails = `trigger.event({ name: "${answers.eventName}", schema: z.object({}) })`;
  }

  // 3. Fill in the template with the user's answers
  let finalCode = jobTemplate
    .replace(/{{jobId}}/g, jobIdCamelCase)
    .replace(/{{jobIdKebabCase}}/g, jobIdKebabCase)
    .replace(/{{jobName}}/g, jobName)
    .replace('{{triggerDetails}}', triggerDetails);

  // 4. Write the new file
  const fileName = `${jobIdKebabCase}.ts`;
  const filePath = path.join(process.cwd(), 'jobs', fileName); // We'll create it in a 'jobs' folder

  await fs.ensureDir(path.dirname(filePath)); // Make sure the 'jobs' directory exists
  await fs.writeFile(filePath, finalCode.trim());

  console.log(chalk.green.bold(`\nSuccess! ✨`));
  console.log(`New job file created at: ${chalk.cyan(filePath)}`);
}

run();

clearInterval