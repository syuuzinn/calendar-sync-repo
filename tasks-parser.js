const fs = require("fs");
const path = require("path");

const notesDir = "./notes";
const tasks = [];

fs.readdirSync(notesDir).forEach(file => {
  const filePath = path.join(notesDir, file);

  // ディレクトリはスキップ
  if (fs.lstatSync(filePath).isDirectory()) return;

  const content = fs.readFileSync(filePath, "utf8");

  // "- [ ] " で始まる行を抽出
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

// tasks.json に書き出し
fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));