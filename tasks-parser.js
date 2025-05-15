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
      // 例: - [ ] 2025-05-26 15:00-17:00 Project meeting
      const match = task.match(/- \[ \] (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})(?:-(\d{2}:\d{2}))? (.+)/);
      if (match) {
        const [, date, startTimeStr, endTimeStr, summary] = match;

        const start = moment.tz(`${date} ${startTimeStr}`, "YYYY-MM-DD HH:mm", "Asia/Tokyo");
        const end = endTimeStr
          ? moment.tz(`${date} ${endTimeStr}`, "YYYY-MM-DD HH:mm", "Asia/Tokyo")
          : start.clone().add(1, "hour");

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