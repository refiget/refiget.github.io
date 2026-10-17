const scheduleDate = new Date();
const today = `${scheduleDate.getFullYear()}-${String(scheduleDate.getMonth() + 1).padStart(2, "0")}-${String(scheduleDate.getDate()).padStart(2, "0")}`;

function createScheduleEntry(item) {
  const entry = document.createElement("article");
  entry.className = "schedule-entry";

  const date = document.createElement("time");
  date.dateTime = item.date;
  date.textContent = new Intl.DateTimeFormat("zh-CN", { dateStyle: "long" }).format(new Date(`${item.date}T00:00:00`));
  entry.append(date);

  const title = document.createElement("h2");
  title.textContent = item.title;
  entry.append(title);

  if (item.category) {
    const category = document.createElement("span");
    category.className = "schedule-category";
    category.textContent = item.category;
    title.after(category);
  }

  if (item.content) {
    const content = document.createElement("p");
    content.textContent = item.content;
    entry.append(content);
  }
  return entry;
}

fetch("data/schedule.json")
  .then((response) => response.json())
  .then((items) => {
    const upcoming = items.filter((item) => item.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    const history = items.filter((item) => item.date < today).sort((a, b) => b.date.localeCompare(a.date));
    const recentList = document.querySelector('[data-schedule="recent"]');

    if (recentList) {
      const recent = [...upcoming, ...history].slice(0, 3);
      recent.forEach((item) => recentList.append(createScheduleEntry(item)));
      document.querySelector('[data-schedule-empty="recent"]').hidden = recent.length > 0;
    }

    const upcomingList = document.querySelector('[data-schedule="upcoming"]');
    if (upcomingList) {
      upcoming.forEach((item) => upcomingList.append(createScheduleEntry(item)));
      document.querySelector('[data-schedule-empty="upcoming"]').hidden = upcoming.length > 0;
      history.forEach((item) => document.querySelector('[data-schedule="history"]').append(createScheduleEntry(item)));
      document.querySelector('[data-schedule-empty="history"]').hidden = history.length > 0;
    }
  });
