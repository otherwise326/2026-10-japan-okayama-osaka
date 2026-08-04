const typeLabels = {
  lodging: "住宿",
  transport: "交通",
  sight: "景點",
  restaurant: "餐食",
  shopping: "購物",
  break: "短停",
  note: "提醒"
};

// Tabler Icons 3.44.0 outline nodes, MIT licensed.
const iconSvgs = {
  lodging: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/></svg>',
  route: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M19 7a2 2 0 1 0 0 -4a2 2 0 0 0 0 4"/><path d="M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5"/></svg>',
  station: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 13c0 -3.87 -3.37 -7 -10 -7h-8"/><path d="M3 15h16a2 2 0 0 0 2 -2"/><path d="M3 6v5h17.5"/><path d="M3 11v4"/><path d="M8 11v-5"/><path d="M13 11v-4.5"/><path d="M3 19h18"/></svg>',
  food: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12"/><path d="M19 15v6h-1v-3"/><path d="M8 4v17"/><path d="M5 4v3a3 3 0 1 0 6 0v-3"/></svg>',
  park: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 13l-2 -2"/><path d="M12 12l2 -2"/><path d="M12 21v-13"/><path d="M9.824 16a3 3 0 0 1 -2.743 -3.69a3 3 0 0 1 .304 -4.833a3 3 0 0 1 4.615 -3.707a3 3 0 0 1 4.614 3.707a3 3 0 0 1 .305 4.833a3 3 0 0 1 -2.743 3.69"/></svg>',
  landmark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 18l2 -13l2 -2l2 2l2 13"/><path d="M5 21v-3h14v3"/><path d="M3 21l18 0"/></svg>',
  shopping: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304"/><path d="M9 11v-5a3 3 0 0 1 6 0v5"/></svg>',
  airport: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2 -7h-4l-2 2h-3l2 -4l-2 -4h3l2 2h4l-2 -7h3l4 7"/></svg>',
  walk: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"/><path d="M7 21l3 -4"/><path d="M16 21l-2 -4l-3 -3l1 -6"/><path d="M6 12l2 -3l4 -1l3 3l3 1"/></svg>',
  note: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3m0 2a2 2 0 0 1 2 -2h8l4 4v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"/><path d="M15 3v4h4"/><path d="M9 13h6"/><path d="M9 17h3"/></svg>'
};

function getIconKey(item) {
  const text = `${item.title || ""} ${item.place?.name || ""}`;
  if (item.type === "transport") return "route";
  if (item.type === "restaurant") return "food";
  if (item.type === "lodging") return "lodging";
  if (item.type === "shopping") return "shopping";
  if (item.type === "break") return "walk";
  if (item.type === "note") return "note";
  if (/機場/.test(text)) return "airport";
  if (/公園|庭園|散步|綠道|河岸|水邊|夜間/.test(text)) return "park";
  if (/步行/.test(text)) return "walk";
  if (/站|車站|地下街|機場|港/.test(text)) return "station";
  if (/城|寺|神社|美術館|博物館|地標/.test(text)) return "landmark";
  return "landmark";
}

function setText(selector, text) {
  const node = document.querySelector(selector);
  if (node) node.textContent = text || "";
}

function formatDateRange(range) {
  if (!range) return "";
  return `${range.start} - ${range.end} · ${range.days} days`;
}

function createList(items, className = "") {
  const ul = document.createElement("ul");
  if (className) ul.className = className;
  for (const item of items || []) {
    const li = document.createElement("li");
    li.textContent = typeof item === "string" ? item : item.description || item.title || "";
    ul.appendChild(li);
  }
  return ul;
}

function renderSummary(days) {
  const wrapper = document.querySelector("#summaryDays");
  wrapper.innerHTML = "";
  for (const day of days || []) {
    const link = document.createElement("a");
    link.className = "day-jump";
    link.href = `#${day.anchor || `day-${day.day}`}`;
    const strong = document.createElement("strong");
    strong.textContent = `Day ${day.day} · ${day.date}`;
    const span = document.createElement("span");
    span.textContent = day.title.replace(/^Day\s+\d+\s*-\s*/, "");
    link.append(strong, span);
    wrapper.appendChild(link);
  }
}

function renderTripStats(data) {
  const stats = document.querySelector("#tripStats");
  stats.innerHTML = "";
  const days = data.days || [];
  const timelineCount = days.reduce((sum, day) => sum + (day.timeline || []).length, 0);
  const confirmCount = days.reduce((sum, day) => sum + (day.to_confirm || []).length, 0);
  const candidates = (data.candidate_days || []).length;
  const items = [
    `正式日程 ${days.length} 天`,
    `行程點 ${timelineCount} 個`,
    `候選 ${candidates} 條`,
    `待確認 ${confirmCount} 項`
  ];
  for (const item of items) {
    const pill = document.createElement("span");
    pill.className = "trip-stat";
    pill.textContent = item;
    stats.appendChild(pill);
  }
}

function renderInfoBox(title, items, emptyText) {
  const box = document.createElement("section");
  box.className = "info-box";
  const heading = document.createElement("h4");
  heading.textContent = title;
  box.appendChild(heading);

  const list = document.createElement("ul");
  const normalized = items && items.length ? items : [emptyText];
  for (const item of normalized) {
    const li = document.createElement("li");
    if (typeof item === "string") {
      li.textContent = item;
    } else {
      li.textContent = item.description ? `${item.title}：${item.description}` : item.title;
    }
    list.appendChild(li);
  }
  box.appendChild(list);
  return box;
}

function buildMealLinks(item) {
  const areaOptions = (item.food_area || []).map((area) => ({
    label: "區域",
    name: area.name,
    note: area.reason || "",
    map_url: area.map_url,
  }));
  return [...areaOptions, ...(item.alternatives || [])];
}

function renderMealOptions(container, options) {
  container.innerHTML = "";
  if (!options || !options.length) return;

  const details = document.createElement("details");
  details.className = "meal-details";
  const summary = document.createElement("summary");
  summary.className = "meal-toggle";
  summary.textContent = `展開餐食選項（${options.length}）`;
  const list = document.createElement("div");
  list.className = "meal-option-list";

  for (const option of options) {
    const block = document.createElement("div");
    block.className = "meal-option";
    const title = document.createElement("strong");
    title.textContent = `${option.label || "備案"}：${option.name}`;
    const note = document.createElement("span");
    note.textContent = option.note || "";
    block.append(title, note);
    if (option.map_url) {
      const link = document.createElement("a");
      link.href = option.map_url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = "查看地點";
      block.appendChild(link);
    }
    list.appendChild(block);
  }

  details.append(summary, list);
  container.appendChild(details);
}

function renderExploreLinks(container, resources) {
  if (!resources || !resources.length) return;
  const group = document.createElement("div");
  group.className = "explore-links";

  for (const resource of resources) {
    if (!resource.url || !resource.label) continue;
    const link = document.createElement("a");
    link.className = `explore-link ${resource.kind || "guide"}`;
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = resource.label;
    group.appendChild(link);
  }

  if (group.childElementCount) container.appendChild(group);
}

function orderExploreResources(resources) {
  return [...resources].sort(
    (left, right) => Number(left.kind !== "video") - Number(right.kind !== "video")
  );
}

function buildExploreResources(item) {
  if (item.resources?.length) return orderExploreResources(item.resources);
  const placeName = item.place?.name || item.title;
  if (!placeName || item.type === "transport" || item.type === "lodging") return [];
  const videoQuery = encodeURIComponent(`${placeName} 日本旅遊`);
  const guideQuery = encodeURIComponent(`${placeName} 旅遊 達人 攻略`);
  return orderExploreResources([
    { label: "看 YouTube", url: `https://www.youtube.com/results?search_query=${videoQuery}`, kind: "video" },
    { label: "找旅人攻略", url: `https://www.google.com/search?q=${guideQuery}`, kind: "guide" }
  ]);
}

function formatTime(item) {
  if (!item.time) return "";
  return item.end_time ? `${item.time}-${item.end_time}` : item.time;
}

function updateTransportToggle(showTransport) {
  document.body.classList.toggle("transport-hidden", !showTransport);
  const toggle = document.querySelector("#transportToggle");
  if (!toggle) return;
  toggle.setAttribute("aria-pressed", showTransport ? "true" : "false");
  toggle.textContent = showTransport ? "隱藏交通" : "顯示交通";
}

function setupTransportToggle() {
  const toggle = document.querySelector("#transportToggle");
  if (!toggle || toggle.dataset.bound === "true") return;
  toggle.dataset.bound = "true";
  updateTransportToggle(false);
  toggle.addEventListener("click", () => {
    updateTransportToggle(document.body.classList.contains("transport-hidden"));
  });
}

function renderTimelineItem(item) {
  const template = document.querySelector("#timelineTemplate");
  const node = template.content.firstElementChild.cloneNode(true);
  node.dataset.type = item.type || "";
  node.dataset.icon = getIconKey(item);
  node.querySelector(".time-block").textContent = formatTime(item);
  node.querySelector(".timeline-icon").innerHTML = iconSvgs[getIconKey(item)] || iconSvgs.landmark;
  node.querySelector(".item-type").textContent = typeLabels[item.type] || item.type || "項目";
  const flag = node.querySelector(".item-flag");
  if (item.flag) {
    flag.textContent = item.flag;
  } else {
    flag.remove();
  }
  node.querySelector("h4").textContent = item.title || "";
  node.querySelector(".item-summary").textContent = item.summary || "";

  node.querySelector(".item-note").remove();

  const mealLinks = item.type === "restaurant" ? buildMealLinks(item) : [];
  renderMealOptions(node.querySelector(".meal-options"), mealLinks);

  const map = node.querySelector(".map-button");
  const hasMealMaps = mealLinks.some((option) => option.map_url);
  if (!hasMealMaps && item.place && item.place.map_url) {
    map.href = item.place.map_url;
    map.setAttribute("aria-label", `查看 ${item.place.name || item.title} 地點`);
  } else {
    map.remove();
  }

  renderExploreLinks(node.querySelector(".timeline-content"), buildExploreResources(item));

  if (item.info_status === "needs_confirmation") {
    const status = document.createElement("span");
    status.className = "status-pill";
    status.textContent = "待確認";
    node.querySelector(".item-topline").appendChild(status);
  }

  return node;
}

function renderDay(day, asCandidate = false) {
  const template = document.querySelector("#dayTemplate");
  const node = template.content.firstElementChild.cloneNode(true);
  if (asCandidate) node.classList.add("candidate-day");
  node.id = day.anchor || `day-${day.day || day.id}`;
  node.querySelector(".day-date").textContent = day.date ? `Day ${day.day} · ${day.date}` : "Candidate";
  node.querySelector("h3").textContent = day.title || "";
  node.querySelector(".day-base").remove();
  node.querySelector(".day-pace").textContent = day.pace || "候選路線";

  const reminders = node.querySelector(".daily-reminders");
  reminders.replaceWith(createList(day.daily_reminders || [], "daily-reminders"));

  const timeline = node.querySelector(".timeline");
  for (const item of day.timeline || []) {
    timeline.appendChild(renderTimelineItem(item));
  }

  const footer = node.querySelector(".day-footer");
  footer.querySelector(".fallbacks").replaceWith(
    renderInfoBox("備案", day.fallbacks, "依現場狀況調整。")
  );
  footer.querySelector(".to-confirm").replaceWith(
    renderInfoBox("待確認", day.to_confirm, "目前沒有待確認項目。")
  );

  return node;
}

function renderCandidates(days) {
  const section = document.querySelector("#candidateSection");
  const wrapper = document.querySelector("#candidateDays");
  wrapper.innerHTML = "";
  if (!days || !days.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  for (const day of days) {
    wrapper.appendChild(renderDay(day, true));
  }
}

function renderNotes(notes) {
  const section = document.querySelector("#notesSection");
  const list = document.querySelector("#tripNotes");
  list.innerHTML = "";
  if (!notes || !notes.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  for (const note of notes) {
    const li = document.createElement("li");
    li.textContent = typeof note === "string" ? note : note.text || note.title;
    list.appendChild(li);
  }
}

function renderItinerary(data) {
  setText("#tripDestination", data.trip.destination);
  setText("#tripTitle", data.trip.title);
  setText("#tripDates", formatDateRange(data.trip.date_range));

  const reminders = document.querySelector("#importantReminders");
  reminders.innerHTML = "";
  for (const reminder of data.trip.important_reminders || []) {
    const li = document.createElement("li");
    li.textContent = reminder;
    reminders.appendChild(li);
  }

  renderSummary(data.summary.days);
  renderTripStats(data);

  const days = document.querySelector("#days");
  days.innerHTML = "";
  for (const day of data.days || []) {
    days.appendChild(renderDay(day));
  }

  renderCandidates(data.candidate_days);
  renderNotes(data.notes);
  document.title = data.trip.title;
}

async function main() {
  try {
    setupTransportToggle();
    const response = await fetch("./itinerary.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderItinerary(data);
  } catch (error) {
    document.body.innerHTML = `<div class="load-error">讀取 itinerary.json 失敗：${error.message}</div>`;
  }
}

main();
