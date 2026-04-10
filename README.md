# AI News Daily Chrome Extension

**[🎬 Watch the Video Demo Here](https://youtu.be/W_zi2x8wvRE)**

## Features
- **Daily AI News:** Fetches the top Artificial Intelligence news articles from TechCrunch reliably.
- **Dynamic Themes:** Adapts its theme based on the current time of the day:
  - Morning/Afternoon: Light mode
  - Evening/Night: Dark mode
- **Dynamic Greetings:** Greets you with "Good Morning", "Good Afternoon", "Good Evening", or "Good Night" depending on the local time.
- **Modern Interface:** A sleek and premium UI to easily read the current news items on the go.

## Installation Instructions

1. Clone this repository or download the files.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** in the top left corner.
5. Select the directory containing these extension files.
6. The extension is now installed and ready to use! Pin it to your browser toolbar for quick access.

## Architecture & Built With

- **HTML/CSS:** For modern popup layout and interactive UI.
- **Vanilla JavaScript:** For popup logic, XML/RSS parsing, and DOM manipulation.
- **Chrome Extension API (`manifest.json` V3):** Using background service workers and permissions (`host_permissions`) to fetch the content directly via `chrome.runtime.sendMessage`.
