
const $ = id => document.getElementById(id);

let posts = JSON.parse(localStorage.getItem("creatorflowPosts") || "[]");
let currentMonth = new Date();
let selectedDate = dateKey(new Date());

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function savePosts() {
  localStorage.setItem("creatorflowPosts", JSON.stringify(posts));
  render();
}

function resetForm() {
  $("postForm").reset();
  $("postId").value = "";
  $("formHeading").textContent = "Create a post";
  $("saveButton").textContent = "Save Post";
  $("cancelButton").hidden = true;
  $("date").value = selectedDate;
}

$("postForm").addEventListener("submit", event => {
  event.preventDefault();

  const id = $("postId").value;

  const post = {
    id: id || (crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now())),
    title: $("title").value.trim(),
    platform: $("platform").value,
    caption: $("caption").value.trim(),
    date: $("date").value,
    time: $("time").value,
    status: $("status").value
  };

  if (!post.title || !post.date || !post.time) {
    alert("Please fill in the title, date and time.");
    return;
  }

  if (id) {
    posts = posts.map(item => item.id === id ? post : item);
  } else {
    posts.push(post);
  }

  selectedDate = post.date;
  currentMonth = new Date(
    Number(post.date.slice(0, 4)),
    Number(post.date.slice(5, 7)) - 1,
    1
  );

  savePosts();
  resetForm();
});

$("cancelButton").addEventListener("click", resetForm);

function editPost(id) {
  const post = posts.find(item => item.id === id);
  if (!post) return;

  $("postId").value = post.id;
  $("title").value = post.title;
  $("platform").value = post.platform;
  $("caption").value = post.caption;
  $("date").value = post.date;
  $("time").value = post.time;
  $("status").value = post.status;

  $("formHeading").textContent = "Edit post";
  $("saveButton").textContent = "Update Post";
  $("cancelButton").hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deletePost(id) {
  if (!confirm("Delete this post?")) return;
  posts = posts.filter(post => post.id !== id);
  savePosts();
}

function renderCalendar() {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  $("monthLabel").textContent =
    currentMonth.toLocaleDateString("en", {
      month: "long",
      year: "numeric"
    });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = dateKey(new Date());

  let html = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    .map(day => `<div class="day-name">${day}</div>`)
    .join("");

  for (let i = 0; i < firstDay; i++) {
    html += "<div></div>";
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const key = dateKey(new Date(year, month, day));
    const hasPost = posts.some(post => post.date === key);

    const classes = [
      "day",
      key === selectedDate ? "selected" : "",
      key === today ? "today" : "",
      hasPost ? "has-post" : ""
    ].filter(Boolean).join(" ");

    html += `<button type="button" class="${classes}"
      data-date="${key}" aria-label="${key}${hasPost ? ", has posts" : ""}">
      ${day}${hasPost ? " •" : ""}
    </button>`;
  }

  $("calendar").innerHTML = html;
}

$("calendar").addEventListener("click", event => {
  const button = event.target.closest("[data-date]");
  if (!button) return;

  selectedDate = button.dataset.date;
  $("date").value = selectedDate;
  render();
});

$("prevMonth").addEventListener("click", () => {
  currentMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() - 1,
    1
  );
  render();
});

$("nextMonth").addEventListener("click", () => {
  currentMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1
  );
  render();
});

function renderPosts() {
  const ordered = [...posts].sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time)
  );

  $("postCount").textContent =
    `${posts.length} post${posts.length === 1 ? "" : "s"}`;

  const visible = ordered.filter(post => post.date === selectedDate);

  if (visible.length === 0) {
    $("postList").innerHTML =
      `<p class="empty">No posts for ${selectedDate}. Select another calendar date or create a post.</p>`;
    return;
  }

  $("postList").replaceChildren();

  visible.forEach(post => {
    const card = document.createElement("article");
    card.className = "post-card";

    const heading = document.createElement("h3");
    heading.textContent = post.title;

    const meta = document.createElement("div");
    meta.className = "badge";
    meta.textContent =
      `${post.platform} · ${post.date} · ${post.time} · ${post.status}`;

    const caption = document.createElement("p");
    caption.textContent = post.caption || "No caption added.";

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.addEventListener("click", () => editPost(post.id));

    const remove = document.createElement("button");
    remove.className = "secondary";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deletePost(post.id));

    card.append(heading, meta, caption, edit, remove);
    $("postList").append(card);
  });
}

function render() {
  renderCalendar();
  renderPosts();
}

resetForm();
render();

const analyticsData = [
  {
    platform: "Instagram",
    followers: 2400,
    title: "My Coding Journey",
    views: 5200,
    likes: 460,
    comments: 52,
    date: "Oct 20"
  },
  {
    platform: "Instagram",
    followers: 2400,
    title: "Study Tips for Students",
    views: 3800,
    likes: 310,
    comments: 38,
    date: "Oct 21"
  },
  {
    platform: "YouTube",
    followers: 1800,
    title: "HTML Tutorial",
    views: 8500,
    likes: 720,
    comments: 95,
    date: "Oct 22"
  },
  {
    platform: "YouTube",
    followers: 1800,
    title: "CSS Beginner Guide",
    views: 6100,
    likes: 540,
    comments: 64,
    date: "Oct 23"
  },
  {
    platform: "Facebook",
    followers: 950,
    title: "Project Showcase",
    views: 2100,
    likes: 170,
    comments: 25,
    date: "Oct 24"
  },
  {
    platform: "LinkedIn",
    followers: 1200,
    title: "My Developer Portfolio",
    views: 3200,
    likes: 290,
    comments: 48,
    date: "Oct 25"
  }
];

let performanceChart = null;
let platformChart = null;

function formatNumber(number) {
  return number.toLocaleString("en-IN");
}

function renderAnalytics() {
  const filter = document.getElementById("analyticsPlatform");
  if (!filter) return;

  const selectedPlatform = filter.value;

  const data = selectedPlatform === "All"
    ? analyticsData
    : analyticsData.filter(
        item => item.platform === selectedPlatform
      );

  const views = data.reduce((sum, item) => sum + item.views, 0);
  const likes = data.reduce((sum, item) => sum + item.likes, 0);
  const comments = data.reduce(
    (sum, item) => sum + item.comments, 0
  );

  // Count each account's followers only once.
  const followerCounts = {};
  data.forEach(item => {
    followerCounts[item.platform] = item.followers;
  });

  const followers = Object.values(followerCounts)
    .reduce((sum, count) => sum + count, 0);

  const engagement = views
    ? ((likes + comments) / views) * 100
    : 0;

  document.getElementById("totalViews").textContent =
    formatNumber(views);

  document.getElementById("totalLikes").textContent =
    formatNumber(likes);

  document.getElementById("totalFollowers").textContent =
    formatNumber(followers);

  document.getElementById("engagementRate").textContent =
    engagement.toFixed(2) + "%";

  // Update views and likes chart.
  if (performanceChart) performanceChart.destroy();

  const performanceCanvas =
    document.getElementById("performanceChart");

  performanceChart = new Chart(performanceCanvas, {
    type: "line",
    data: {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: "Views",
          data: data.map(item => item.views),
          borderColor: "#c8ff36",
          backgroundColor: "rgba(200,255,54,0.12)",
          fill: true,
          tension: 0.3
        },
        {
          label: "Likes",
          data: data.map(item => item.likes),
          borderColor: "#65a8ff",
          backgroundColor: "rgba(101,168,255,0.12)",
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#f5f7ff" }
        }
      },
      scales: {
        x: {
          ticks: { color: "#b7bfd3" },
          grid: { color: "#29324a" }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#b7bfd3" },
          grid: { color: "#29324a" }
        }
      }
    }
  });

  // Compare views across social platforms.
  const platformNames = [
    "Instagram", "YouTube", "Facebook", "LinkedIn"
  ];

  const platformViews = platformNames.map(platform =>
    analyticsData
      .filter(item => item.platform === platform)
      .reduce((sum, item) => sum + item.views, 0)
  );

  if (platformChart) platformChart.destroy();

  platformChart = new Chart(
    document.getElementById("platformChart"),
    {
      type: "bar",
      data: {
        labels: platformNames,
        datasets: [{
          label: "Views",
          data: platformViews,
          backgroundColor: [
            "#c8ff36", "#65a8ff", "#ffad66", "#c28bff"
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: "#b7bfd3" },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#b7bfd3" },
            grid: { color: "#29324a" }
          }
        }
      }
    }
  );

  // Show top-performing content by views.
  const topPosts = document.getElementById("topPosts");
  topPosts.replaceChildren();

  [...data]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3)
    .forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "post-card";

      const title = document.createElement("h3");
      title.textContent = `${index + 1}. ${item.title}`;

      const details = document.createElement("p");
      details.textContent =
        `${item.platform} · ${formatNumber(item.views)} views · ` +
        `${formatNumber(item.likes)} likes`;

      card.append(title, details);
      topPosts.append(card);
    });
}

const analyticsFilter =
  document.getElementById("analyticsPlatform");

if (analyticsFilter) {
  analyticsFilter.addEventListener("change", renderAnalytics);
  renderAnalytics();
}

const brandStorageKey = "creatorflowBrandDeals";

let brandDeals = JSON.parse(
  localStorage.getItem(brandStorageKey) || "[]"
);

const brandById = id =>
  brandDeals.find(deal => deal.id === id);

const brandMoney = amount =>
  "₹" + Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2
  });

function saveBrandDeals() {
  localStorage.setItem(
    brandStorageKey,
    JSON.stringify(brandDeals)
  );
  renderBrandDeals();
}

function resetBrandForm() {
  document.getElementById("brandDealForm").reset();
  document.getElementById("brandDealId").value = "";
  document.getElementById("amountReceived").value = "0";
  document.getElementById("brandFormHeading").textContent =
    "Add a Brand Deal";
  document.getElementById("brandSaveButton").textContent =
    "Save Deal";
  document.getElementById("brandCancelButton").hidden = true;
}

document.getElementById("brandDealForm").addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const id = document.getElementById("brandDealId").value;
    const amount = Number(
      document.getElementById("dealAmount").value
    );
    const received = Number(
      document.getElementById("amountReceived").value
    );

    if (!Number.isFinite(amount) ||
        !Number.isFinite(received) ||
        amount < 0 || received < 0) {
      alert("Enter valid, non-negative payment amounts.");
      return;
    }

    if (received > amount) {
      alert("Amount received cannot exceed the deal amount.");
      return;
    }

    const start = document.getElementById("campaignStart").value;
    const deadline = document.getElementById("campaignDeadline").value;

    if (start && deadline && start > deadline) {
      alert("Start date cannot be after the delivery deadline.");
      return;
    }

    const deal = {
      id: id || (
        crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now())
      ),
      brand: document.getElementById("brandName").value.trim(),
      contact: document.getElementById("brandContact").value.trim(),
      email: document.getElementById("brandEmail").value.trim(),
      campaign: document.getElementById("campaignName").value.trim(),
      start,
      deadline,
      amount,
      received,
      contract: document.getElementById("contractStatus").value,
      status: document.getElementById("collabStatus").value,
      notes: document.getElementById("brandNotes").value.trim()
    };

    if (id) {
      brandDeals = brandDeals.map(item =>
        item.id === id ? deal : item
      );
    } else {
      brandDeals.push(deal);
    }

    saveBrandDeals();
    resetBrandForm();
  }
);

document.getElementById("brandCancelButton").addEventListener(
  "click",
  resetBrandForm
);

function editBrandDeal(id) {
  const deal = brandById(id);
  if (!deal) return;

  document.getElementById("brandDealId").value = deal.id;
  document.getElementById("brandName").value = deal.brand;
  document.getElementById("brandContact").value = deal.contact;
  document.getElementById("brandEmail").value = deal.email;
  document.getElementById("campaignName").value = deal.campaign;
  document.getElementById("campaignStart").value = deal.start;
  document.getElementById("campaignDeadline").value = deal.deadline;
  document.getElementById("dealAmount").value = deal.amount;
  document.getElementById("amountReceived").value = deal.received;
  document.getElementById("contractStatus").value = deal.contract;
  document.getElementById("collabStatus").value = deal.status;
  document.getElementById("brandNotes").value = deal.notes;

  document.getElementById("brandFormHeading").textContent =
    "Edit Brand Deal";
  document.getElementById("brandSaveButton").textContent =
    "Update Deal";
  document.getElementById("brandCancelButton").hidden = false;

  document.getElementById("brandFormHeading").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function deleteBrandDeal(id) {
  if (!brandById(id)) return;

  if (!confirm("Are you sure you want to delete this brand deal?")) {
    return;
  }

  brandDeals = brandDeals.filter(deal => deal.id !== id);
  saveBrandDeals();
}

function renderBrandDeals() {
  const total = brandDeals.reduce(
    (sum, deal) => sum + deal.amount, 0
  );
  const received = brandDeals.reduce(
    (sum, deal) => sum + deal.received, 0
  );

  document.getElementById("brandTotalDeals").textContent =
    brandDeals.length;

  document.getElementById("brandTotalValue").textContent =
    brandMoney(total);

  document.getElementById("brandReceived").textContent =
    brandMoney(received);

  document.getElementById("brandPending").textContent =
    brandMoney(total - received);

  const query = document.getElementById("brandSearch")
    .value.trim().toLowerCase();

  const filter = document.getElementById("brandStatusFilter").value;

  const filtered = brandDeals.filter(deal => {
    const matchesSearch =
      deal.brand.toLowerCase().includes(query) ||
      deal.campaign.toLowerCase().includes(query);

    const matchesStatus =
      filter === "All" || deal.status === filter;

    return matchesSearch && matchesStatus;
  });

  const list = document.getElementById("brandDealList");
  list.replaceChildren();

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "brand-empty";
    empty.textContent = brandDeals.length
      ? "No matching deals found."
      : "No brand deals yet. Add your first collaboration above.";
    list.append(empty);
    return;
  }

  filtered.forEach(deal => {
    const card = document.createElement("article");
    card.className = "brand-deal-card";

    const heading = document.createElement("h3");
    heading.textContent = deal.brand + " — " + deal.campaign;

    const meta = document.createElement("p");
    meta.className = "deal-meta";
    meta.textContent =
      `Contract: ${deal.contract} | Collaboration: ${deal.status}`;

    const contact = document.createElement("p");
    contact.textContent =
      `Contact: ${deal.contact || "Not provided"} | Email: ${deal.email || "Not provided"}`;

    const deadline = document.createElement("p");
    deadline.textContent =
      `Start: ${deal.start || "Not set"} | Deadline: ${deal.deadline}`;

    const payment = document.createElement("p");
    payment.textContent =
      `Deal: ${brandMoney(deal.amount)} | Received: ${brandMoney(deal.received)} | Pending: ${brandMoney(deal.amount - deal.received)}`;

    const progress = document.createElement("div");
    progress.className = "brand-progress";

    const bar = document.createElement("span");
    bar.style.width = (
      deal.amount > 0
        ? Math.min(100, deal.received / deal.amount * 100)
        : 0
    ) + "%";

    progress.append(bar);

    const notes = document.createElement("p");
    notes.textContent = "Notes: " + (deal.notes || "None");

    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => editBrandDeal(deal.id));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "secondary";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteBrandDeal(deal.id));

    card.append(
      heading, meta, contact, deadline, payment,
      progress, notes, edit, remove
    );

    list.append(card);
  });
}

document.getElementById("brandSearch").addEventListener(
  "input", renderBrandDeals
);

document.getElementById("brandStatusFilter").addEventListener(
  "change", renderBrandDeals
);

renderBrandDeals();

const financeStorageKey = "creatorflowFinanceTransactions";

let financeTransactions = JSON.parse(
  localStorage.getItem(financeStorageKey) || "[]"
);

function finElement(id) {
  return document.getElementById(id);
}

function finMoney(value) {
  return "₹" + Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2
  });
}

function finToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function finCurrentMonth() {
  return finToday().slice(0, 7);
}

function finSave() {
  localStorage.setItem(
    financeStorageKey,
    JSON.stringify(financeTransactions)
  );
  finRender();
}

function finResetForm() {
  finElement("financeForm").reset();
  finElement("finId").value = "";
  finElement("finDate").value = finToday();
  finElement("finFormHeading").textContent = "Add Transaction";
  finElement("finSaveButton").textContent = "Save Transaction";
  finElement("finCancelButton").hidden = true;
}

finElement("financeForm").addEventListener("submit", event => {
  event.preventDefault();

  const id = finElement("finId").value;
  const amount = Number(finElement("finAmount").value);

  if (!Number.isFinite(amount) || amount <= 0) {
    alert("Enter an amount greater than zero.");
    return;
  }

  const transaction = {
    id: id || (
      crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now())
    ),
    type: finElement("finType").value,
    description: finElement("finDescription").value.trim(),
    category: finElement("finCategory").value,
    amount,
    date: finElement("finDate").value,
    notes: finElement("finNotes").value.trim()
  };

  if (!transaction.description || !transaction.date) {
    alert("Please complete all required fields.");
    return;
  }

  if (id) {
    financeTransactions = financeTransactions.map(item =>
      item.id === id ? transaction : item
    );
  } else {
    financeTransactions.push(transaction);
  }

  finSave();
  finResetForm();
});

finElement("finCancelButton").addEventListener("click", finResetForm);

function finEditTransaction(id) {
  const transaction = financeTransactions.find(item => item.id === id);
  if (!transaction) return;

  finElement("finId").value = transaction.id;
  finElement("finType").value = transaction.type;
  finElement("finDescription").value = transaction.description;
  finElement("finCategory").value = transaction.category;
  finElement("finAmount").value = transaction.amount;
  finElement("finDate").value = transaction.date;
  finElement("finNotes").value = transaction.notes;

  finElement("finFormHeading").textContent = "Edit Transaction";
  finElement("finSaveButton").textContent = "Update Transaction";
  finElement("finCancelButton").hidden = false;

  finElement("finFormHeading").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function finDeleteTransaction(id) {
  if (!financeTransactions.some(item => item.id === id)) return;

  if (!confirm("Delete this transaction?")) return;

  financeTransactions = financeTransactions.filter(
    item => item.id !== id
  );

  finSave();
}

function finGetPendingBrandPayments() {
  // Read the deals created in the Brand Deal Manager.
  // This does not count pending money as received income.
  let deals = [];

  try {
    deals = JSON.parse(
      localStorage.getItem("creatorflowBrandDeals") || "[]"
    );
  } catch {
    deals = [];
  }

  return deals.reduce((total, deal) => {
    const amount = Number(deal.amount) || 0;
    const received = Number(deal.received) || 0;
    return total + Math.max(0, amount - received);
  }, 0);
}

function finRender() {
  const income = financeTransactions
    .filter(item => item.type === "Income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = financeTransactions
    .filter(item => item.type === "Expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  finElement("finIncome").textContent = finMoney(income);
  finElement("finExpenses").textContent = finMoney(expenses);

  const profitElement = finElement("finProfit");
  profitElement.textContent = finMoney(income - expenses);
  profitElement.style.color =
    income >= expenses ? "#c8ff36" : "#ff9b9b";

  finElement("finPending").textContent =
    finMoney(finGetPendingBrandPayments());

  // Monthly summary
  const month = finElement("finMonth").value || finCurrentMonth();

  const monthly = financeTransactions.filter(
    item => item.date.slice(0, 7) === month
  );

  const monthIncome = monthly
    .filter(item => item.type === "Income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const monthExpenses = monthly
    .filter(item => item.type === "Expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  finElement("finMonthIncome").textContent = finMoney(monthIncome);
  finElement("finMonthExpenses").textContent = finMoney(monthExpenses);
  finElement("finMonthProfit").textContent =
    finMoney(monthIncome - monthExpenses);

  // Search and filters
  const query = finElement("finSearch").value.trim().toLowerCase();
  const typeFilter = finElement("finTypeFilter").value;
  const categoryFilter = finElement("finCategoryFilter").value;

  const filtered = [...financeTransactions]
    .filter(item => {
      const matchesText =
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.notes.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All" || item.type === typeFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      return matchesText && matchesType && matchesCategory;
    })
    .sort((a, b) =>
      (b.date + b.id).localeCompare(a.date + a.id)
    );

  const list = finElement("financeList");
  list.replaceChildren();

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "finance-empty";
    empty.textContent = financeTransactions.length
      ? "No transactions match your search or filters."
      : "No transactions yet. Add your first income or expense above.";
    list.append(empty);
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "finance-card";

    const heading = document.createElement("h3");
    heading.textContent = item.description;

    const amount = document.createElement("p");
    amount.className = item.type === "Income"
      ? "finance-income"
      : "finance-expense";

    amount.textContent =
      `${item.type === "Income" ? "+" : "−"}${finMoney(item.amount)}`;

    const details = document.createElement("p");
    details.textContent =
      `${item.category} · ${item.date} · ${item.type}`;

    const notes = document.createElement("p");
    notes.textContent = item.notes
      ? "Notes: " + item.notes
      : "";

    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "Edit";
    edit.addEventListener("click", () =>
      finEditTransaction(item.id)
    );

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "secondary";
    remove.textContent = "Delete";
    remove.addEventListener("click", () =>
      finDeleteTransaction(item.id)
    );

    card.append(heading, amount, details, notes, edit, remove);
    list.append(card);
  });
}

finElement("finMonth").value = finCurrentMonth();
finElement("finDate").value = finToday();

finElement("finMonth").addEventListener("change", finRender);
finElement("finSearch").addEventListener("input", finRender);
finElement("finTypeFilter").addEventListener("change", finRender);
finElement("finCategoryFilter").addEventListener("change", finRender);

finRender();

const aiForm = document.getElementById("aiContentForm");
const aiResults = document.getElementById("aiResults");
const aiMessage = document.getElementById("aiMessage");

let aiGenerated = {};

function aiCapitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function aiGenerate() {
  const topic = document.getElementById("aiTopic").value.trim();
  const platform = document.getElementById("aiPlatform").value;
  const tone = document.getElementById("aiTone").value;
  const type = document.getElementById("aiType").value;

  if (!topic) {
    aiMessage.textContent = "Please enter a content topic.";
    return;
  }

  const subject = aiCapitalize(topic.replace(/[.!?]+$/, ""));
  const toneText = {
    Friendly: "Let's learn and grow together!",
    Professional: "Here are some key insights worth sharing.",
    Funny: "Who knew this could be such an adventure? 😄",
    Motivational: "Keep going. Small steps lead to big achievements! 🚀"
  }[tone];

  const platformText = {
    Instagram: "Save this post and share it with a friend.",
    YouTube: "Watch, learn, and share your thoughts in the comments.",
    Facebook: "What do you think? Share your thoughts below.",
    LinkedIn: "I'd love to hear your perspective in the comments."
  }[platform];

  const captions = [
    `${subject} ✨\n\n${toneText}\n\n${platformText}`,
    `My latest focus: ${subject} 💡\n\nEvery experience is a chance to learn something new. Let's keep improving!`,
    `Let's talk about ${subject}! 🌟\n\nHere's your reminder to stay curious, take action, and keep learning.`
  ];

  const words = subject
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const tags = [
    ...words.slice(0, 4).map(word => "#" + word),
    "#ContentCreator",
    "#CreativeJourney",
    "#LearnAndGrow",
    "#" + platform.replace(/\s/g, "")
  ];

  const ideas = [
    `Beginner's guide to ${subject}`,
    `5 lessons I learned about ${subject}`,
    `Common mistakes to avoid when exploring ${subject}`,
    `My personal experience with ${subject}`,
    `Tips and tools to improve at ${subject}`
  ];

  const description =
    `Welcome to my post about ${subject}!\n\n` +
    `In this post, I am exploring ${subject.toLowerCase()} ` +
    `and sharing useful thoughts, experiences, and ideas.\n\n` +
    `${toneText}\n\n${platformText}\n\n` +
    `Follow along for more content and updates!`;

  aiGenerated = {
    captions,
    hashtags: [...new Set(tags)].join(" "),
    ideas,
    description
  };

  document.querySelectorAll(".ai-result-card").forEach(card => {
    card.hidden = type !== "all" &&
      card.dataset.result !== type;
  });

  const captionsBox = document.getElementById("aiCaptions");
  captionsBox.replaceChildren();

  captions.forEach((caption, index) => {
    const option = document.createElement("div");
    option.className = "ai-caption-option";

    const text = document.createElement("p");
    text.textContent = `${index + 1}. ${caption}`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Use this caption";

    button.addEventListener("click", () => {
      aiGenerated.selectedCaption = caption;
      aiMessage.textContent =
        "Caption selected. You can copy it or send it to your planner.";
    });

    option.append(text, button);
    captionsBox.append(option);
  });

  document.getElementById("aiHashtags").textContent =
    aiGenerated.hashtags;

  const ideasBox = document.getElementById("aiIdeas");
  ideasBox.replaceChildren();

  ideas.forEach(idea => {
    const item = document.createElement("p");
    item.textContent = "💡 " + idea;
    ideasBox.append(item);
  });

  document.getElementById("aiDescription").textContent =
    description;

  aiGenerated.selectedCaption = captions[0];
  aiResults.hidden = false;
  aiMessage.textContent =
    "Content generated! Review and edit it before publishing.";
}

aiForm.addEventListener("submit", event => {
  event.preventDefault();
  aiGenerate();
});

document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", async () => {
    const element = document.getElementById(button.dataset.copy);
    const text = element.innerText || element.textContent;

    try {
      await navigator.clipboard.writeText(text);
      aiMessage.textContent = "Copied successfully!";
    } catch {
      aiMessage.textContent =
        "Copy unavailable. Select the text and copy it manually.";
    }
  });
});

document.getElementById("aiUseCaption").addEventListener(
  "click", () => {
    const caption = aiGenerated.selectedCaption;

    if (!caption) {
      aiMessage.textContent = "Generate and select a caption first.";
      return;
    }

    const plannerCaption = document.getElementById("caption");
    const plannerPlatform = document.getElementById("platform");
    const plannerTitle = document.getElementById("title");

    plannerCaption.value = caption;
    plannerPlatform.value =
      document.getElementById("aiPlatform").value;

    if (!plannerTitle.value.trim()) {
      plannerTitle.value =
        document.getElementById("aiTopic").value.trim();
    }

    document.getElementById("postForm").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    aiMessage.textContent =
      "Caption added to your Content Planner. Choose a date and time, then save the post.";
  }
);