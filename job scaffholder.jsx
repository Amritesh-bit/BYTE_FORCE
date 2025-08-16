import React, { useState } from 'react';

const JobTemplates = [
  { id: 'cron', name: 'Cron Scheduled Job' },
  { id: 'webhook', name: 'Webhook Triggered Job' },
  { id: 'delay', name: 'Delay Job' },
];

function JobScaffolder() {
  const [selectedTemplate, setSelectedTemplate] = useState(JobTemplates[0].id);
  const [jobName, setJobName] = useState('');
  const [cronSchedule, setCronSchedule] = useState('0 0 * * *');
  const [codePreview, setCodePreview] = useState('');

  const generateCode = () => {
    let code = '';
    if (selectedTemplate === 'cron') {
      code = `
import { task } from "@trigger.dev/sdk";

export const ${jobName} = task({
  id: "${jobName}-task",
  run: async () => {
    console.log("Running scheduled job: ${jobName}");
  },
  schedule: "cron: '${cronSchedule}'"
});`;
    }
    // Add other templates as needed

    setCodePreview(code);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateCode();
        }}
      >
        <h3>Create a new Job</h3>
        <label>
          Job Name:
          <input value={jobName} onChange={(e) => setJobName(e.target.value)} required />
        </label>
        <br />
        <label>
          Job Template:
          <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
            {JobTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        {selectedTemplate === 'cron' && (
          <label>
            Cron Schedule:
            <input value={cronSchedule} onChange={(e) => setCronSchedule(e.target.value)} required />
          </label>
        )}
        <br />
        <button type="submit">Generate</button>
      </form>
      <pre style={{ background: '#f0f0f0', padding: '1rem', flex: 1 }}>{codePreview}</pre>
    </div>
  );
}

export default JobScaffolder;
