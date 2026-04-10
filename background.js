chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fetchNews') {
    fetch('https://techcrunch.com/category/artificial-intelligence/feed/')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.text();
      })
      .then(text => {
        sendResponse({ success: true, data: text });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.toString() });
      });
      
    // Return true to indicate that we will send a response asynchronously
    return true;
  }
});
