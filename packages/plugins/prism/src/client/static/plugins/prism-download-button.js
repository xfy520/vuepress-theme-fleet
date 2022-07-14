(function () {
  if (typeof Prism === 'undefined' || typeof document === 'undefined' || !document.querySelector) {
    return;
  }

  Prism.plugins.toolbar.registerButton('download-file', function (env) {
    const pre = env.element.parentNode;
    if (
      !pre ||
      !/pre/i.test(pre.nodeName) ||
      !pre.hasAttribute('data-url') ||
      !pre.hasAttribute('download-label')
    ) {
      return;
    }
    const src = pre.getAttribute('data-url');
    const a = document.createElement('a');
    a.textContent = pre.getAttribute('download-label') || 'Download';
    a.setAttribute('download', '');
    a.href = src;
    return a;
  });
})();
