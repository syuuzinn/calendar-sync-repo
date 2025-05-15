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
      calendarId: "your-calendar-id@gmail.com",
      requestBody: {
        summary: task.summary,
        start: {
          dateTime: task.startTime,
          timeZone: "Asia/Tokyo"
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

// ✅ 最後に必ず必要！
main();