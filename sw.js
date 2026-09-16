const CACHE_VERSION = 'cumplices-v9';
const CACHE_NAME = CACHE_VERSION;

const APP_FILES = [
  './',
  './index.html',

  './css/style.css',

  './js/app.js',
  './js/config.js',
  './js/utils.js',
  './js/home.js',
  './js/router.js',
  './js/games.js',

  './js/core/storage.js',
  './js/core/game.js',
  './js/core/ui.js',
  './js/core/navigation.js',
  './js/core/timer.js',

  './js/games/sintonia.js',
  './js/games/stop.js',
  './js/games/verdade.js',
  './js/games/quiz.js',
  './js/games/jogo-da-velha.js',
  './js/games/xadrez.js',

  './data/sintonia.js',
  './data/verdades-desafios.js',
  './data/quiz-perguntas.js',
  './data/stop-temas.js',
  './data/jogo-da-velha.js',

  './sounds/click.mp3',
  './sounds/correct.mp3',
  './sounds/wrong.mp3',
  './sounds/timer.mp3',
  './sounds/elimination.mp3',
  './sounds/victory.mp3',

  './manifest.json',

  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(APP_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener('fetch', event => {
  const request = event.request;

  /*
    Só tratamos requisições GET.
  */
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then(networkResponse => {

            /*
              Só salvamos respostas válidas.
            */
            if (
              !networkResponse ||
              networkResponse.status !== 200
            ) {
              return networkResponse;
            }

            const responseClone =
              networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(
                  request,
                  responseClone
                );
              });

            return networkResponse;
          })
          .catch(() => {
            /*
              Fallback para navegação offline.
            */
            if (request.mode === 'navigate') {
              return caches.match(
                './index.html'
              );
            }

            return new Response(
              '',
              {
                status: 503,
                statusText: 'Offline'
              }
            );
          });
      })
  );
});