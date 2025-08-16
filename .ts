// src/server.ts
import express from "express";
import { TriggerClient, eventTrigger } from "@trigger.dev/sdk";
import { createExpressServer } from "@trigger.dev/express";

const app = express();
const port = process.env.PORT || 3000;

// Initialize Trigger.dev client
const client = new TriggerClient({ id: "example-trigger-job" });

// Define a simple Trigger.dev job that logs a message
client.defineJob({
  id: "log-message-job",
  name: "Log Message Job",
  trigger: eventTrigger({ name: "log.message" }),
  run: async (payload) => {
    console.log(`Trigger.dev Job received message: ${payload.message}`);
    return { success: true };
  },
});

// Use Trigger.dev express middleware to handle job endpoints
createExpressServer(client, app);

// Define a simple web route to trigger the job
app.get("/", (req, res) => {
  res.send(`
    <h1>Trigger.dev Job Scaffolder Example</h1>
    <button onclick="triggerJob()">Run Job</button>
    <script>
      async function triggerJob() {
        await fetch("/api/trigger/log.message", { method: "POST", body: JSON.stringify({ message: "Hello from website!" }), headers: { "Content-Type": "application/json" } });
        alert("Job triggered!");
      }
    </script>
  `);
});

// Start Express server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
