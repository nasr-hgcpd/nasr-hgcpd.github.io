(() => {
  const scenes = {
    cow: 'Cow',
    duck: 'Duck',
    chair: 'Chair',
    fandisk: 'Fandisk',
    moai: 'Moai'
  };
  const methods = {
    noisy: 'noisy input',
    iterativepfn: 'denoised by IterativePFN',
    asdn: 'denoised by ASDN',
    p2p: 'denoised by P2P-Bridge',
    gpd: 'denoised by GPD',
    ours: 'denoised by our method',
    gt: 'ground truth'
  };
  const buttons = [...document.querySelectorAll('[data-gallery-scene]')];
  const cards = [...document.querySelectorAll('[data-gallery-method]')];
  const gallery = document.querySelector('.method-gallery');
  const heading = document.getElementById('selected-scene');

  function showScene(scene) {
    if (!Object.hasOwn(scenes, scene)) return;
    heading.textContent = scenes[scene];
    gallery.dataset.orientation = scene === 'cow' || scene === 'duck' ? 'landscape' : 'portrait';

    for (const button of buttons) {
      const active = button.dataset.galleryScene === scene;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    }

    for (const card of cards) {
      const method = card.dataset.galleryMethod;
      const path = `./assets/gallery/${scene}/${method}.png`;
      const image = card.querySelector('img');
      card.querySelector('a').href = path;
      image.src = path;
      image.alt = `${scenes[scene]} ${methods[method]}`;
    }
  }

  for (const button of buttons) {
    button.addEventListener('click', () => showScene(button.dataset.galleryScene));
  }
})();
