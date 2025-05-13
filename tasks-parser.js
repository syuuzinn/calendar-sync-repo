const fs = require("fs");
const path = require("path");

const notesDir = "./notes";
const tasks = [];

fs.readdirSync(notesDir).forEach(file => {
  const content = fs.readFileSync(path.join(notesDir, file), "utf8");
  const matches = content.match(/- \[ \] .+/g);
  if (matches) {
    matches.forEach(task => {
      tasks.push({
        summary: task.replace("- [ ] ", ""),
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString()
      });
    });
  }
});

fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
