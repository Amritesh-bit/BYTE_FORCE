import { schedules } from "@trigger.dev/sdk/v3";

// Define the scheduled task
export const exampleScheduledJob = schedules.task({
  id: "example-scheduled-job",
  run: async (payload: { timestamp: Date; lastTimestamp?: Date }) => {
    console.log("Scheduled job running at", payload.timestamp);

    if (payload.lastTimestamp) {
      console.log("Last run was at", payload.lastTimestamp);
    } else {
      console.log("This is the first run of this scheduled job.");
    }

    // Place your scheduled job logic here
  },
});

// Example function to create a schedule for the above task
async function createSchedule() {
  const schedule = await schedules.create({
    task: exampleScheduledJob.id,
    cron: "0 14 * * 1", // Runs every Monday at 14:00 (2 PM)
    timezone: "America/New_York",
    deduplicationKey: "weekly-example-schedule",
  });

  console.log("Schedule created:", schedule);
}

// Call the createSchedule function to register the schedule
createSchedule().catch((err) => {
  console.error("Failed to create schedule:", err);
});
