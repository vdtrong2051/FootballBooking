// Local-only QR encoder, bundled by existing esbuild. No QR URL or payment token
// is sent to third-party services. QR engine: Kazuhiko Arase / qrcode-terminal vendor.
const QRCode = require('./vendor/QRCode');
const Correction = require('./vendor/QRCode/QRErrorCorrectLevel');

(() => {
  const shell = document.getElementById('fb-lan-demo-qr');
  if (!shell) return;
  const url = shell.dataset.url;
  if (!url) return;
  const target = document.getElementById('fb-lan-demo-qr-canvas');
  if (!target) return;
  try {
    const qr = new QRCode(-1, Correction.M);
    qr.addData(url);
    qr.make();
    const size = qr.getModuleCount();
    const padding = 4; // QR quiet zone.
    const xmlns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(xmlns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${size + 2 * padding} ${size + 2 * padding}`);
    svg.setAttribute('width', '320');
    svg.setAttribute('height', '320');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Mã QR thử nghiệm nội bộ LAN. Không phải mã chuyển khoản ngân hàng.');
    svg.style.cssText = 'display:block;width:100%;max-width:320px;height:auto;background:#fff;image-rendering:pixelated;';
    const background = document.createElementNS(xmlns, 'rect');
    background.setAttribute('width', size + 2 * padding);
    background.setAttribute('height', size + 2 * padding);
    background.setAttribute('fill', '#fff');
    svg.appendChild(background);
    const path = document.createElementNS(xmlns, 'path');
    const parts = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (qr.isDark(row, col)) {
          parts.push(`M${col + padding},${row + padding}h1v1h-1z`);
        }
      }
    }
    path.setAttribute('d', parts.join(''));
    path.setAttribute('fill', '#102e22');
    svg.appendChild(path);
    target.replaceChildren(svg);
  } catch (e) {
    target.textContent = 'Không sinh được mã QR. Hãy mở URL LAN bên dưới hoặc tải lại trang.';
  }
})();
