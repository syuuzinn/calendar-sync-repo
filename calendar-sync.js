const { google } = require("googleapis");
const fs = require("fs");

// ✅ GitHub SecretsからBase64文字列を取得しcredentials.jsonに復元
const base64 = process.env.GOOGLE_CREDENTIALS;
fs.writeFileSync("credentials.json", Buffer.from(base64, "base64").toString("utf-8"));

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/calendar"]
  });

  const client = await auth.getClient();
  const calendar = google.calendar({ version: "v3", auth: client });

  const tasks = JSON.parse(fs.readFileSync("tasks.json", "utf8"));
  for (const task of tasks) {
    await calendar.events.insert({
      calendarId: "syuuzinn12@gmail.com", // ← あなたのカレンダーIDに変更！
      requestBody: {
        summary: task.summary,
        start: {
          dateTime: task.startTime,
          timeZone: "Asia/Tokyo"  // ✅ 時刻ずれ対策
        },
        end: {
          dateTime: task.endTime,
          timeZone: "Asia/Tokyo"
        }
      }
    });
  }

  console.log("Tasks synced to Google Calendar.");
}

main();