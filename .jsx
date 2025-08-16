import React, { useState } from "react";

function ScheduleForm({ taskId, createSchedule }) {
  const [cron, setCron] = useState("0 8 * * *"); // default cron (8 AM daily)

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createSchedule({
      task: taskId,
      cron,
      deduplicationKey: `${taskId}-${cron}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    alert("Schedule created!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Cron expression:
        <input value={cron} onChange={(e) => setCron(e.target.value)} />
      </label>
      <button type="submit">Create Schedule</button>
    </form>
  );
}
