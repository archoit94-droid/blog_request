const sharp = require('./node_modules/sharp');
const path = require('path');

const input = path.join(__dirname, 'assets', 'U_ALF.jpg');
const output = path.join(__dirname, 'assets', 'U_ALF.png');

sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const { width, height, channels } = info;
    for (let i = 0; i < width * height; i++) {
      const r = data[i * channels];
      const g = data[i * channels + 1];
      const b = data[i * channels + 2];
      // 흰 배경 제거: 밝기가 높고 채도가 낮은 픽셀을 투명 처리
      const brightness = (r + g + b) / 3;
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const saturation = maxC === 0 ? 0 : (maxC - minC) / maxC;
      if (brightness > 230 && saturation < 0.12) {
        // 완전 투명
        data[i * channels + 3] = 0;
      } else if (brightness > 200 && saturation < 0.15) {
        // 반투명 (엣지 부드럽게)
        const alpha = Math.round(255 * (1 - (brightness - 200) / 55));
        data[i * channels + 3] = alpha;
      }
    }
    return sharp(data, { raw: { width, height, channels } })
      .png()
      .toFile(output);
  })
  .then(() => console.log('완료: assets/U_ALF.png'))
  .catch(console.error);
