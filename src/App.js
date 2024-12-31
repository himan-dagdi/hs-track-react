// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './pages/About';

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      {/* Add your home page content here */}
    </div>
  );
}

function App() {
  const trackPage = (path) => {
    if (window._hsq) {
      const searchParams = new URLSearchParams(window.location.search);
      const utmParams = {
        'utm_campaign': decodeURIComponent(searchParams.get('utm_campaign') || ''),
        'utm_source': decodeURIComponent(searchParams.get('utm_source') || ''),
        'utm_medium': decodeURIComponent(searchParams.get('utm_medium') || '')
      };

      try {
        // Clear previous tracking data
        window._hsq = window._hsq || [];
        
        // Set content metadata
        window._hsq.push(['setContentMetadata', {
          campaign_name: utmParams.utm_campaign,
          campaign_source: utmParams.utm_source,
          campaign_medium: utmParams.utm_medium,
          page_path: path
        }]);

        // Set the current page path including UTM parameters
        window._hsq.push(['setPath', path + window.location.search]);

        // Explicitly set campaign data
        window._hsq.push(['setCampaign', utmParams.utm_campaign]);

        // Identify the visitor with UTM parameters and additional context
        window._hsq.push(['identify', {
          ...utmParams,
          last_visit: new Date().toISOString(),
          campaign_id: utmParams.utm_campaign,
          current_page: path
        }]);

        // Track the page view with explicit campaign context
        window._hsq.push(['trackPageView', {
          campaignName: utmParams.utm_campaign,
          campaignSource: utmParams.utm_source,
          campaignMedium: utmParams.utm_medium,
          pagePath: path
        }]);

        console.log('Tracking data sent:', {
          path: path + window.location.search,
          campaign: utmParams.utm_campaign,
          source: utmParams.utm_source,
          medium: utmParams.utm_medium
        });

      } catch (error) {
        console.error('Error in HubSpot tracking:', error);
      }
    } else {
      console.warn('HubSpot not loaded yet, retrying...');
      setTimeout(() => trackPage(path), 1000);
    }
  };

  useEffect(() => {
    // Initial page load tracking
    const currentPath = window.location.pathname;
    setTimeout(() => trackPage(currentPath), 2000);
  }, []);

  // Track page changes
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      trackPage(currentPath);
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;