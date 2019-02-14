document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') {
    const elSubTitle: HTMLElement = document.querySelector('.subtitle') as HTMLElement;
    elSubTitle.textContent = 'hello from TS';
  }
});
