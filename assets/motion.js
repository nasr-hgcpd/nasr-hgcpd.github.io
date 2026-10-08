(() => {
  const scenes = { cow: 'Cow', duck: 'Duck', eight: 'Eight', elephant: 'Elephant' };
  const descriptions = {
    noisy: 'noisy input',
    iterativepfn: 'denoised by IterativePFN',
    asdn: 'denoised by ASDN',
    p2p: 'denoised by P2P',
    baseline: 'baseline denoising',
    ours: 'denoised by our method',
    gt: 'ground truth'
  };
  const buttons = [...document.querySelectorAll('[data-motion-scene]')];
  const cards = [...document.querySelectorAll('[data-motion-method]')];
  const grid = document.querySelector('.motion-grid');
  const caption = document.getElementById('motion-caption');
  const playback = document.querySelector('.motion-playback');
  if (!grid || !caption || !playback) return;

  let currentScene = 'cow';
  let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = false;

  function syncPlayback() {
    for (const card of cards) {
      const video = card.querySelector('video');
      if (paused || !visible) video.pause();
      else video.play().catch(() => {});
    }
  }

  function showScene(scene) {
    if (!Object.hasOwn(scenes, scene) || scene === currentScene) return;
    currentScene = scene;
    caption.textContent = `${scenes[scene]} · rotating comparison`;
    for (const button of buttons) {
      const active = button.dataset.motionScene === scene;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    for (const card of cards) {
      const method = card.dataset.motionMethod;
      const video = card.querySelector('video');
      video.pause();
      video.src = `./assets/motion/${scene}/${method}.mp4`;
      video.setAttribute('aria-label', `${scenes[scene]} ${descriptions[method]} rotating`);
      video.load();
    }
    syncPlayback();
  }

  for (const button of buttons) {
    button.addEventListener('click', () => showScene(button.dataset.motionScene));
  }
  playback.addEventListener('click', () => {
    paused = !paused;
    playback.textContent = paused ? 'Play motion' : 'Pause motion';
    syncPlayback();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }, { rootMargin: '250px 0px' });
    observer.observe(grid);
  } else {
    visible = true;
    syncPlayback();
  }
  if (paused) playback.textContent = 'Play motion';
})();
