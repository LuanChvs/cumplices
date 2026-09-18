const CACHE_VERSION = 'cumplices-v22';
const CACHE_NAME = CACHE_VERSION;

const APP_FILES = [
  './', './index.html',
  './css/style.css', './css/games/conexao.css', './css/games/em-sintonia.css', './css/games/stop.css', './css/games/verdade.css', './css/games/quiz.css', './css/games/velha.css', './css/games/xadrez.css', './css/games/quem-sou-eu.css', './css/games/termo.css', './css/games/forca.css',
  './js/app.js', './js/config.js', './js/utils.js', './js/home.js', './js/router.js', './js/games.js',
  './js/core/storage.js', './js/core/preferences.js', './js/core/game.js', './js/core/ui.js', './js/core/navigation.js', './js/core/timer.js', './js/core/sound.js',
  './js/games/conexao.js', './js/games/em-sintonia.js', './js/games/stop.js', './js/games/verdade.js', './js/games/quiz.js', './js/games/jogo-da-velha.js', './js/games/xadrez.js', './js/games/quem-sou-eu.js', './js/games/quem-sou-eu-layout.js', './js/games/forca-engine.js', './js/games/termo.js', './js/games/forca.js',
  './data/conexao.js', './data/em-sintonia.js', './data/verdades-desafios.js', './data/quiz-perguntas.js', './data/stop-temas.js', './data/jogo-da-velha.js', './data/quem-sou-eu.js', './data/termo.js', './data/forca.js',
  './sounds/click.mp3', './sounds/correct.mp3', './sounds/wrong.mp3', './sounds/timer.mp3', './sounds/elimination.mp3', './sounds/victory.mp3',
  './manifest.json', './icon.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(cacheNames => Promise.all(cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  event.respondWith(caches.match(request).then(cachedResponse => {
    if (cachedResponse) return cachedResponse;
    return fetch(request).then(networkResponse => {
      if (!networkResponse || networkResponse.status !== 200) return networkResponse;
      const responseClone = networkResponse.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
      return networkResponse;
    }).catch(() => request.mode === 'navigate' ? caches.match('./index.html') : new Response('', { status: 503, statusText: 'Offline' }));
  }));
});