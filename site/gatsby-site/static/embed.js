(function () {
  let lookupData = {};

  // Default styles for the embed
  const styles = {
    container: `
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    `,
    button: `
      display: inline-flex;
      align-items: center;
      padding: 8px 16px;
      background-color: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s;
      margin-right: 8px;
    `,
    buttonHover: `
      background-color: #1d4ed8;
    `,
    buttonContainer: `
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    `,
  };

  // Simple helper to confirm a URL is parseable
  function isValidURL(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  // FNV-1a hash function for URL normalization with longer output
  function hashString(str) {
    // Use two 32-bit hashes to create a 64-bit hash
    let h1 = 0x811c9dc5;

    let h2 = 0x811c9dc5;

    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);

      h1 ^= c;
      h2 ^= c;

      h1 = (h1 * 16777619) >>> 0;
      h2 = (h2 * 16777619) >>> 0;
    }

    // Combine the two hashes into a single string
    return h1.toString(36) + h2.toString(36);
  }

  function normalizeURL(url) {
    const parsedURL = new URL(url);

    return parsedURL.host + parsedURL.pathname;
  }

  // Given a report URL, find matching incident IDs from our local JSON
  function findIncidentIdsByReportUrl(url) {
    if (!isValidURL(url)) return [];

    const normalizedUrl = normalizeURL(url);

    const urlHash = hashString(normalizedUrl);

    // Use the hash to look up incident IDs directly
    return lookupData[urlHash] || [];
  }

  // Main initialization function
  async function initializeEmbeds() {
    // Get the base URL from the current script's location
    const scriptEl = document.currentScript;

    if (!scriptEl) {
      console.error('Could not find the embed script element');
      return;
    }

    // Get the base URL by removing '/embed.js' from the script's src
    const baseUrl = scriptEl.src.replace('/embed.js', '');

    try {
      // Fetch the lookup index file
      const res = await fetch(`${baseUrl}/lookupIndex.json`);

      if (!res.ok) {
        console.error('Could not retrieve lookup index file');
        return;
      }

      lookupData = await res.json();
    } catch (err) {
      console.error('Error fetching lookup index file:', err);
      return;
    }

    const embedContainers = document.querySelectorAll('.aiid-embed');

    for (const container of embedContainers) {
      // Apply container styles
      container.style.cssText = styles.container;

      const incidentId = container.dataset.incidentId;

      const reportUrl = container.dataset.reportUrl;

      let incidentIds = [];

      if (incidentId) {
        // If we already know the incident ID, just use that one
        incidentIds = [incidentId];
      } else if (reportUrl) {
        // Otherwise, find all incident IDs matching that URL
        incidentIds = findIncidentIdsByReportUrl(reportUrl);
      }

      // If we didn't find anything, show a fallback
      if (!incidentIds.length) {
        container.textContent = 'No associated incidents were found.';
        continue;
      }

      // Build out the link(s)
      const buttonContainer = document.createElement('div');

      buttonContainer.style.cssText = styles.buttonContainer;

      for (const id of incidentIds) {
        const link = document.createElement('a');

        link.href = `${baseUrl}/cite/${id}`;
        link.textContent = `See it on the AIID #${id}`;
        link.style.cssText = styles.button;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        // Add hover effect
        link.addEventListener('mouseenter', () => {
          link.style.cssText = styles.button + styles.buttonHover;
        });
        link.addEventListener('mouseleave', () => {
          link.style.cssText = styles.button;
        });

        buttonContainer.appendChild(link);
      }

      container.innerHTML = '';
      container.appendChild(buttonContainer);
    }
  }

  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEmbeds);
  } else {
    initializeEmbeds();
  }
})();
