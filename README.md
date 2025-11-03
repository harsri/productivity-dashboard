# Productivity Dashboard

An all-in-one personal productivity dashboard built with **Vanilla JavaScript** to help you manage your **tasks, time, and goals**.  
This project runs entirely in the browser and saves all your data to **localStorage**, ensuring your progress is always preserved.

---

## Core Features

This dashboard combines several productivity tools into a single, cohesive interface:

### Live Weather Header
- Displays the current **time, date, and live weather forecast** for your location using the **Geolocation API** (with a fallback to a default city).

### To-Do List
- Add tasks with **titles and descriptions**.  
- Mark tasks as **“Important”** to highlight them.  
- Mark tasks as **complete** (synced with a pending task counter).  
- **Collapsible tasks** – show title only, expand on hover.

### Daily Planner
- Plan your day **hour-by-hour** from 6:00 AM to midnight.  
- All entries are saved **locally as you type**.

### Pomodoro Timer
- Fully functional **25-minute work / 5-minute break** timer.  
- Includes **play**, **pause**, and **restart** functionality.  
- Features a **flashing text animation** to announce work/break cycles.

### Life Goals
- Dedicated section to note down and review up to **8 long-term goals**.

### Customizable Themes
- Cycle through **7+ hand-picked color themes** to personalize your dashboard.

### Dark/Light Mode
- Instantly invert theme colors (primary ↔ tertiary) for comfortable viewing in any lighting.

### Persistent Storage
- All tasks, plans, goals, and preferences are saved to your browser’s **localStorage**.  
- Everything remains exactly as you left it, even after closing the browser.

---

## Technology Stack

- **HTML5**  
- **SCSS** (compiled to CSS)  
- **Vanilla JavaScript (ES6+)**

### Browser APIs
- `localStorage`
- `navigator.geolocation`

### External APIs
- [WeatherAPI.com](http://api.weatherapi.com) — for live weather data.

---

## How to Use

1. **Clone the Repository**
   ```bash
   git clone https://github.com/harsri/productivity-dashboard.git
   cd productivity-dashboard
