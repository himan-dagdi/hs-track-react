import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    const trackHubSpot = () => {
      if (window._hsq) {
        console.log('HubSpot object exists:', !!window._hsq);
        
        // Get and decode UTM parameters
        const searchParams = new URLSearchParams(window.location.search);
        const utmParams = {
          'utm_campaign': decodeURIComponent(searchParams.get('utm_campaign') || ''),
          'utm_source': decodeURIComponent(searchParams.get('utm_source') || ''),
          'utm_medium': decodeURIComponent(searchParams.get('utm_medium') || '')
        };

        // Log debugging information
        console.log('Raw URL:', window.location.search);
        console.log('Decoded UTM params:', utmParams);

        try {
          // Set the current page path including UTM parameters
          window._hsq.push(['setPath', window.location.pathname + window.location.search]);
          console.log('Path set successfully');

          // Identify the visitor with UTM parameters
          window._hsq.push(['identify', utmParams]);
          console.log('Identity set successfully');

          // Track the page view
          window._hsq.push(['trackPageView']);
          console.log('PageView tracked successfully');
        } catch (error) {
          console.error('Error in HubSpot tracking:', error);
        }
      } else {
        console.warn('HubSpot not loaded yet, retrying...');
        setTimeout(trackHubSpot, 1000);
      }
    };

    // Initialize tracking
    trackHubSpot();

    // Optional: Track page changes if you're using React Router
    return () => {
      // Cleanup if needed
    };
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="App">
      {/* Your app content here */}
    </div>
  );
}

export default App;