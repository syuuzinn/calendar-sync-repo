const fs = require("fs");
const path = require("path");

const notesDir = "./notes";
const tasks = [];

fs.readdirSync(notesDir).forEach(file => {
  const content = fs.readFileSync(path.join(notesDir, file), "utf8");
  const matches = content.match(/- \[ \] .+/g);
  if (matches) {
    matches.forEach(task => {
      // 例: - [ ] 2025-05-25 10:00 Lunch with Sato
      const match = task.match(/- \[ \] (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) (.+)/);
      if (match) {
        const [, date, time, summary] = match;
        const start = new Date(`${date}T${time}:00`);
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1時間後
        tasks.push({
          summary: summary.trim(),
          startTime: start.toISOString(),
          endTime: end.toISOString()
        });
      }
    });
  }
});

fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
