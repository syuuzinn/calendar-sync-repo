const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

const notesDir = "./notes";
const tasks = [];

fs.readdirSync(notesDir).forEach(file => {
  const filePath = path.join(notesDir, file);
  if (!fs.lstatSync(filePath).isFile()) return;

  const content = fs.readFileSync(filePath, "utf8");
  const matches = content.match(/- \[ \] .+/g);

  if (matches) {
    matches.forEach(task => {
      // 例: - [ ] 2025-05-25 13:00 Lunch with Sato
      const match = task.match(/- \[ \] (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) (.+)/);
      if (match) {
        const [, date, time, summary] = match;

        const start = moment.tz(`${date} ${time}`, "YYYY-MM-DD HH:mm", "Asia/Tokyo");
        const end = start.clone().add(1, "hour");

        tasks.push({
          summary: summary.trim(),
          startTime: start.toISOString(),  // ← JSTの13:00を正しくUTCで表現
          endTime: end.toISOString()
        });
      }
    });
  }
});

fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
