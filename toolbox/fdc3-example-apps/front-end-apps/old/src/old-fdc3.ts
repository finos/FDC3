window.addEventListener('load', () => {
  const button = document.getElementById('connect');
  const el = document.getElementById('app');

  button?.addEventListener('click', async () => {
    const fdc3 = window.fdc3;
    if (fdc3) {
      console.log('FDC3 API is available');
      el!.textContent = 'Loaded FDC3 API' + JSON.stringify(await fdc3.getInfo());
    } else {
      console.log('FDC3 API is not available');
      el!.textContent = 'FDC3 API is not available';
    }
  });
});
