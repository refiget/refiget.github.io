const now = new Date();
const currentYear = now.getFullYear();
const today = `${currentYear}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const yearFiles = new Map();

function loadYear(year) {
  if (!yearFiles.has(year)) {
    yearFiles.set(year, fetch(`data/schedule/${year}.json`).then((response) => response.json()));
  }
  return yearFiles.get(year);
}

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

function sortDates(items, direction = 1) {
  return items.sort((a, b) => direction * a.date.localeCompare(b.date));
}

async function renderSchedule(years) {
  const recentList = document.querySelector('[data-schedule="recent"]');
  const upcomingList = document.querySelector('[data-schedule="upcoming"]');
  const archiveList = document.querySelector('[data-schedule="archive-years"]');
  const upcomingYears = years.filter((year) => year >= currentYear).sort((a, b) => a - b);
  const currentItems = years.includes(currentYear) ? await loadYear(currentYear) : [];
  const upcomingItems = (await Promise.all(upcomingYears.map(loadYear))).flat().filter((item) => item.date >= today);
  const upcoming = sortDates(upcomingItems);
  const recentHistory = sortDates(currentItems.filter((item) => item.date < today), -1);
  const olderYears = years.filter((year) => year < currentYear).sort((a, b) => b - a);

  for (const year of olderYears) {
    if (recentHistory.length >= Math.max(0, 3 - upcoming.length)) break;
    const items = await loadYear(year);
    recentHistory.push(...sortDates(items.filter((item) => item.date < today), -1));
  }

  const recent = [...upcoming, ...recentHistory].slice(0, 3);

  if (recentList) {
    recent.forEach((item) => recentList.append(createScheduleEntry(item)));
    document.querySelector('[data-schedule-empty="recent"]').hidden = recent.length > 0;
  }

  if (upcomingList) {
    upcoming.forEach((item) => upcomingList.append(createScheduleEntry(item)));
    document.querySelector('[data-schedule-empty="upcoming"]').hidden = upcoming.length > 0;
  }

  if (archiveList) {
    const archiveYears = years.filter((year) => year <= currentYear).sort((a, b) => b - a);
    document.querySelector('[data-schedule-empty="history"]').hidden = archiveYears.length > 0;

    archiveYears.forEach((year) => {
      const section = document.createElement("section");
      section.className = "archive-year";

      const button = document.createElement("button");
      button.className = "archive-year-toggle";
      button.type = "button";
      button.textContent = String(year);
      button.setAttribute("aria-expanded", "false");

      const entries = document.createElement("div");
      entries.className = "schedule-list-page";
      entries.hidden = true;
      let loaded = false;

      button.addEventListener("click", async () => {
        if (entries.hidden) {
          if (!loaded) {
            const items = await loadYear(year);
            const history = sortDates(items.filter((item) => item.date < today), -1);
            history.forEach((item) => entries.append(createScheduleEntry(item)));
            if (history.length === 0) {
              const empty = document.createElement("p");
              empty.className = "schedule-empty-page";
              empty.textContent = "这一年还没有历史记录。";
              entries.append(empty);
            }
            loaded = true;
          }
          entries.hidden = false;
          button.setAttribute("aria-expanded", "true");
        } else {
          entries.hidden = true;
          button.setAttribute("aria-expanded", "false");
        }
      });

      section.append(button, entries);
      archiveList.append(section);
    });
  }
}

fetch("data/schedule/index.json")
  .then((response) => response.json())
  .then((years) => renderSchedule(years));
