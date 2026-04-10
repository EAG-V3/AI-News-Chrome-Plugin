document.addEventListener('DOMContentLoaded', () => {
  updateTimeAndTheme();
  // Update time every minute
  setInterval(updateTimeAndTheme, 60000);
  
  fetchNews();
});

function updateTimeAndTheme() {
  const now = new Date();
  const hours = now.getHours();
  let minutes = now.getMinutes();
  
  // Format time
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const timeString = `${hours}:${minutes}`;
  document.getElementById('time-display').textContent = timeString;
  
  // Determine Greeting and Theme
  const greetingEl = document.getElementById('greeting');
  const body = document.body;
  
  if (hours >= 5 && hours < 12) {
    greetingEl.textContent = 'Good Morning';
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  } else if (hours >= 12 && hours < 18) {
    greetingEl.textContent = 'Good Afternoon';
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
  } else if (hours >= 18 && hours < 22) {
    greetingEl.textContent = 'Good Evening';
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
  } else {
    greetingEl.textContent = 'Good Night';
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
  }
}

function fetchNews() {
  chrome.runtime.sendMessage({ action: 'fetchNews' }, (response) => {
    const newsContainer = document.getElementById('news-container');
    
    if (chrome.runtime.lastError || !response || !response.success) {
      console.error('Error fetching news:', chrome.runtime.lastError || (response && response.error));
      newsContainer.innerHTML = '<p style="text-align:center;color:#ef4444;margin-top:20px;">Failed to load news. Please check your connection.</p>';
      return;
    }
    
    try {
      const text = response.data;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      
      const items = xmlDoc.querySelectorAll('item');
      
      // Clear skeleton loaders
      newsContainer.innerHTML = '';
      
      if (items.length === 0) {
        newsContainer.innerHTML = '<p style="text-align:center;color:var(--text-secondary);margin-top:20px;">No news found.</p>';
        return;
      }
      
      // Render top 15 news items
      const limit = Math.min(items.length, 15);
      for (let i = 0; i < limit; i++) {
        const item = items[i];
        const title = item.querySelector('title')?.textContent || 'No title';
        const link = item.querySelector('link')?.textContent || '#';
        const pubDate = item.querySelector('pubDate')?.textContent;
        const descriptionHtml = item.querySelector('description')?.textContent || '';
        
        // Extract just text from description using a temporary element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = descriptionHtml;
        const descriptionText = tempDiv.textContent || tempDiv.innerText || '';
        const summary = descriptionText.length > 120 ? descriptionText.substring(0, 117) + '...' : descriptionText;
        
        const timeAgo = formatTimeAgo(pubDate);
        const source = 'TechCrunch';
        
        const card = document.createElement('a');
        card.href = link;
        card.target = '_blank';
        card.className = 'news-card';
        
        card.innerHTML = `
          <div class="news-title">${title}</div>
          <div class="news-summary">${summary}</div>
          <div class="news-meta">
            <span class="news-source">${source}</span>
            <span class="news-time">${timeAgo}</span>
          </div>
        `;
        
        newsContainer.appendChild(card);
      }
    } catch (parseError) {
      console.error('Error parsing news XML:', parseError);
      newsContainer.innerHTML = '<p style="text-align:center;color:#ef4444;margin-top:20px;">Failed to parse news. Please try again later.</p>';
    }
  });
}

function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
