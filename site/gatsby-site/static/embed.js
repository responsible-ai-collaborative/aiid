(function () {
  let lookupData = [];

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

  // Given a report URL, find matching incidents from our local JSON
  function findIncidentsByReportUrl(url) {
    if (!isValidURL(url)) return [];

    const parsedURL = new URL(url);

    // We'll gather any incidents that contain a matching report URL
    const matchedIncidents = [];

    for (const incident of lookupData) {
      const hasMatch = incident.r
        .filter((report) => isValidURL(report.u))
        .some((report) => {
          const reportURL = new URL(report.u);

          return reportURL.host + reportURL.pathname === parsedURL.host + parsedURL.pathname;
        });

      if (hasMatch) {
        matchedIncidents.push(incident);
      }
    }
    return matchedIncidents;
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
      // Fetch lookupIndex.json from the same location as the script
      const res = await fetch(`${baseUrl}/lookupIndex.json`);

      if (!res.ok) {
        console.error(`Could not retrieve ${baseUrl}/lookupIndex.json`);
        return;
      }
      lookupData = await res.json();
    } catch (err) {
      console.error(`Error fetching ${baseUrl}/lookupIndex.json:`, err);
      return;
    }

    const embedContainers = document.querySelectorAll('.aiid-embed');

    for (const container of embedContainers) {
      // Apply container styles
      container.style.cssText = styles.container;

      const incidentId = container.dataset.incidentId;

      const reportUrl = container.dataset.reportUrl;

      let incidents = [];

      if (incidentId) {
        // If we already know the incident ID, just show that one
        incidents = [{ i: incidentId }];
      } else if (reportUrl) {
        // Otherwise, find all incidents matching that URL
        incidents = findIncidentsByReportUrl(reportUrl);
      }

      // If we didn't find anything, show a fallback
      if (!incidents.length) {
        container.textContent = 'No associated incidents were found.';
        continue;
      }

      // Build out the link(s)
      const buttonContainer = document.createElement('div');

      buttonContainer.style.cssText = styles.buttonContainer;

      for (const inc of incidents) {
        const link = document.createElement('a');

        link.href = `${baseUrl}/cite/${inc.i}`;
        link.textContent = `See it on the AIID #${inc.i}`;
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

  // Check if DOM is already loaded
  if (document.readyState === 'loading') {
    // If still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', initializeEmbeds);
  } else {
    // If already loaded, run immediately
    initializeEmbeds();
  }
})();
