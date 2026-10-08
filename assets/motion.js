(() => {
  const board = document.querySelector('.motion-board');
  const videos = [...document.querySelectorAll('.motion-row video')];
  const replay = document.querySelector('.motion-replay');
  const playback = document.querySelector('.motion-playback');
  if (!board || !videos.length || !replay || !playback) return;

  const visible = new Set();
  let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function playVideo(video) {
    if (!video.paused) return;
    const peer = [...video.closest('.motion-row').querySelectorAll('video')]
      .find(other => other !== video && !other.paused && other.readyState >= 1);
    if (peer && video.readyState >= 1 && Number.isFinite(video.duration)) {
      video.currentTime = peer.currentTime % video.duration;
    }
    video.play().catch(() => {});
  }

  function syncPlayback() {
    for (const video of videos) {
      if (paused || !visible.has(video)) video.pause();
      else playVideo(video);
    }
  }

  playback.addEventListener('click', () => {
    paused = !paused;
    playback.textContent = paused ? 'Play motion' : 'Pause motion';
    syncPlayback();
  });

  replay.addEventListener('click', () => {
    for (const video of videos) {
      if (video.readyState >= 1) video.currentTime = 0;
    }
    paused = false;
    playback.textContent = 'Pause motion';
    syncPlayback();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      syncPlayback();
    }, { threshold: 0.1 });
    for (const video of videos) observer.observe(video);
  } else {
    for (const video of videos) visible.add(video);
    syncPlayback();
  }

  if (paused) playback.textContent = 'Play motion';
})();
