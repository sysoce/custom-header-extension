document.addEventListener('DOMContentLoaded', () => {
  const headerList = document.getElementById('headerList');
  const addHeaderForm = document.getElementById('addHeaderForm');
  
  // Get current tab's host and headers
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const host = new URL(tabs[0].url).host;
    document.querySelector('h3').textContent = `Headers for ${host}`;
    
    chrome.runtime.sendMessage({ action: 'getHeaders', host }, (response) => {
      if (response && response.headers) {
        updateHeaderList(response.headers);
      }
    });
  });

  // Update header list display
  function updateHeaderList(headers) {
    headerList.innerHTML = Object.entries(headers).map(([name, value]) => `
      <div class="header-item">
        <span>${name}: ${value}</span>
        <button class="remove-btn" data-name="${name}">Remove</button>
      </div>
    `).join('');
    
    // Add remove button event listeners
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const headerName = btn.dataset.name;
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const host = new URL(tabs[0].url).host;
          chrome.runtime.sendMessage({ 
            action: 'removeHeader', 
            host,
            name: headerName 
          }, () => {
            chrome.runtime.sendMessage({ action: 'getHeaders', host }, (response) => {
              if (response && response.headers) {
                updateHeaderList(response.headers);
              }
            });
          });
        });
      });
    });
  }

  // Handle form submission
  addHeaderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const headerName = document.getElementById('headerName').value.trim();
    const headerValue = document.getElementById('headerValue').value.trim();
    
    if (headerName && headerValue) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const host = new URL(tabs[0].url).host;
        chrome.runtime.sendMessage({
          action: 'addHeader',
          host,
          name: headerName,
          value: headerValue
        }, (response) => {
          if (response && response.success) {
            chrome.runtime.sendMessage({ action: 'getHeaders', host }, (response) => {
              if (response && response.headers) {
                updateHeaderList(response.headers);
              }
            });
            addHeaderForm.reset();
          }
        });
      });
    }
  });
});