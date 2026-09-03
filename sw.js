// ============================================
// TEETEES ERRANDS - SERVICE WORKER
// ============================================

const CACHE_NAME = 'teetees-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.html',
  '/services.html',
  '/grocery.html',
  '/prescription.html',
  '/gift.html',
  '/dispatch.html',
  '/elderly.html',
  '/homeland.html',
  '/track.html',
  '/history.html',
  '/details.html',
  '/profile.html',
  '/payment.html',
  '/support.html',
  '/notifications.html',
  '/ratings.html',
  '/settings.html',
  '/login.html',
  '/signup.html',
  '/addresses.html',
  '/referral.html',
  '/loyalty.html',
  '/admin.html',
  '/about.html',
  '/feedback.html',
  '/scheduled.html',
  '/multistop.html',
  '/emergency.html',
  '/packages.html',
  '/loading.html',
  '/empty.html',
  '/success.html',
  '/error.html',
  '/bottomnav.html',
  '/runner-profile.html',
  '/runner-assign.html',
  '/notfound.html',
  '/tutorial.html',
  '/splash-animated.html',
  '/firebase-setup.html',
  '/firebase-connect.html',
  '/how-to-add-firebase.html',
  '/payment-setup.html',
  '/deploy-checklist.html'
];

// ============================================
// INSTALL - Cache all files
// ============================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// ============================================
// ACTIVATE - Clean old caches
// ============================================
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// ============================================
// FETCH - Serve from cache or network
// ============================================
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // Offline fallback
            return caches.match('/index.html');
          });
      })
  );
});

// ============================================
// PUSH NOTIFICATIONS
// ============================================
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      { action: 'track', title: '📍 Track Order' },
      { action: 'close', title: '❌ Close' }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Teetees Errands', options)
  );
});

// ============================================
// NOTIFICATION CLICK
// ============================================
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'track') {
    event.waitUntil(
      clients.openWindow('/track.html')
    );
  } else {
    event.waitUntil(
      clients.openWindow('/app.html')
    );
  }
});