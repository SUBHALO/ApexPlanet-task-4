"use strict";

// ===== MOBILE NAVIGATION =====

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navItems.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Highlight the current section in the navigation.
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navItems.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      });
    },
    { rootMargin: "-25% 0px -60% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// ===== DATE AND FOOTER =====

const today = new Date();

document.getElementById("todayDate").textContent =
  today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

document.getElementById("year").textContent = today.getFullYear();

// ===== TO-DO APP WITH LOCAL STORAGE =====

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyTasks = document.getElementById("emptyTasks");
const clearCompleted = document.getElementById("clearCompleted");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const progressMessage = document.getElementById("progressMessage");

const STORAGE_KEY = "syncora-aesthetic-tasks";

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (task) =>
        task &&
        typeof task.id === "string" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean"
    );
  } catch {
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    alert("Your tasks could not be saved. Check browser storage settings.");
    return false;
  }
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressPercent.textContent = percent + "%";
  progressBar.style.width = percent + "%";

  if (total === 0) {
    progressMessage.textContent = "Every little step counts.";
  } else if (percent === 100) {
    progressMessage.textContent = "Beautiful! You did it. ♡";
  } else if (percent >= 50) {
    progressMessage.textContent = "Look at you making progress!";
  } else {
    progressMessage.textContent = "One little win at a time.";
  }

  taskCount.textContent =
    `${total} ${total === 1 ? "task" : "tasks"} · ${completed} done`;
}

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task-item" + (task.completed ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Complete " + task.text);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Remove";
    deleteButton.setAttribute("aria-label", "Remove " + task.text);

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, deleteButton);
    taskList.appendChild(item);
  });

  emptyTasks.hidden = tasks.length !== 0;
  updateProgress();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now() + "-" + Math.random().toString(36).slice(2),
    text,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskForm.reset();
  taskInput.focus();
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();

// ===== PRODUCT COLLECTION =====

const products = [
  {
    id: 1,
    name: "Cloud Headphones",
    category: "tech",
    price: 2499,
    rating: 4.8,
    icon: "🎧",
    description: "A little music for your everyday moments.",
    color: "#e9e0f3"
  },
  {
    id: 2,
    name: "Everyday Watch",
    category: "tech",
    price: 3999,
    rating: 4.6,
    icon: "⌚",
    description: "Simple design for your daily routine.",
    color: "#e1e9df"
  },
  {
    id: 3,
    name: "Weekend Tote",
    category: "fashion",
    price: 1299,
    rating: 4.7,
    icon: "👜",
    description: "Your little companion for every outing.",
    color: "#f3e2d5"
  },
  {
    id: 4,
    name: "Classic Sneakers",
    category: "fashion",
    price: 2199,
    rating: 4.5,
    icon: "👟",
    description: "Easy comfort, effortlessly styled.",
    color: "#e8e2f1"
  },
  {
    id: 5,
    name: "Sunday Candle",
    category: "lifestyle",
    price: 599,
    rating: 4.9,
    icon: "🕯️",
    description: "A softer glow for your quiet evenings.",
    color: "#f3e5d9"
  },
  {
    id: 6,
    name: "Little Desk Plant",
    category: "lifestyle",
    price: 449,
    rating: 4.4,
    icon: "🪴",
    description: "A touch of green for your workspace.",
    color: "#dfe9d9"
  }
];

const productGrid = document.getElementById("productGrid");
const productSearch = document.getElementById("productSearch");
const categoryFilter = document.getElementById("categoryFilter");
const sortProducts = document.getElementById("sortProducts");
const noProducts = document.getElementById("noProducts");

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function renderProducts() {
  const search = productSearch.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const sort = sortProducts.value;

  let filtered = products.filter((product) => {
    const matchesText =
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesText && matchesCategory;
  });

  if (sort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  productGrid.replaceChildren();

  filtered.forEach((product) => {
    const card = createElement("article", "product-card");

    const visual = createElement("div", "product-image");
    visual.style.backgroundColor = product.color;
    visual.setAttribute("aria-hidden", "true");

    const emoji = createElement("span", "product-emoji", product.icon);
    visual.appendChild(emoji);

    const info = createElement("div", "product-info");

    const categoryText = createElement(
      "p",
      "product-category",
      product.category
    );

    const title = createElement("h3", "", product.name);
    const description = createElement(
      "p",
      "product-description",
      product.description
    );

    const bottom = createElement("div", "product-bottom");

    const price = createElement(
      "span",
      "product-price",
      "₹" + product.price.toLocaleString("en-IN")
    );

    const rating = createElement(
      "span",
      "product-rating",
      "★ " + product.rating.toFixed(1)
    );

    bottom.append(price, rating);
    info.append(categoryText, title, description, bottom);
    card.append(visual, info);
    productGrid.appendChild(card);
  });

  noProducts.hidden = filtered.length > 0;
}

productSearch.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortProducts.addEventListener("change", renderProducts);

renderProducts();