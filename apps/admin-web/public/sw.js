// Campus Helper Service Worker (Offline-First Resilient PWA Engine)
const CACHE_NAME = 'campus-helper-v1.2';

const CORE_ASSETS = [
  '/',
  '/student/dashboard',
  '/admin/dashboard',
  '/manifest.json',
  '/images/campus-students.png',
  '/rec-campus-bg.jpg'
];

// Install Event: Pre-cache core application shell & static branding
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching core application shell for offline use');
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Note on pre-cache assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up previous stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[ServiceWorker] Clearing outdated cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Network-First with Offline Cache Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (POST, PUT, DELETE, etc.)
  if (request.method !== 'GET') {
    return;
  }

  // 1. API Calls (/api/...) -> Network-First, fallback to cached data
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response(
              JSON.stringify({
                offline: true,
                message: 'You are currently in offline mode. Displaying cached campus data.'
              }),
              {
                headers: { 'Content-Type': 'application/json' },
                status: 200
              }
            );
          });
        })
    );
    return;
  }

  // 2. Navigation Requests (Page Visits) -> Network first, fallback to cached page shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedPage) => {
            if (cachedPage) return cachedPage;
            if (url.pathname.startsWith('/student')) {
              return caches.match('/student/dashboard');
            }
            if (url.pathname.startsWith('/admin')) {
              return caches.match('/admin/dashboard');
            }
            return caches.match('/');
          });
        })
    );
    return;
  }

  // 3. Static Assets (Scripts, Styles, Fonts, Images) -> Cache-First with Revalidation
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Background revalidation
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone);
        });
        return response;
      });
    })
  );
});

// Push Notifications Listener (For Pass Approvals & Campus Alerts)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Campus Helper Notification',
      icon: '/images/campus-students.png',
      badge: '/images/campus-students.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/student/dashboard' }
    };
    event.waitUntil(self.registration.showNotification(data.title || 'Campus Helper Alert', options));
  } catch (err) {
    console.warn('[ServiceWorker] Push notification error:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data?.url || '/student/dashboard');
      }
    })
  );
});
