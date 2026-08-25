const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = 'c:/chalmaji_infra/frontend/public/assets/images/ayodhara/shapes';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const urls = [
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/palm-pattern.png',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/curve-img-01.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/palma-icon.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/birds.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/shape-1.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/curve-line-01.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/curve-img.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/birds-flying.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/tree-img.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/stars.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/line-shape.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/curve-line.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/tab-active-line.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/shapes/line.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/bg/flat-bg.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/bg/contact-form-bg.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/right-arrow.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/nav-left-arrow.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/nav-right-arrow.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/down-arrow.svg',
  'https://myscape.in/wp-content/themes/myscape/palma/images/line.svg'
];

const agent = new https.Agent({ rejectUnauthorized: false });

urls.forEach(url => {
  const filename = path.basename(url);
  const dest = path.join(dir, filename);
  const file = fs.createWriteStream(dest);
  https.get(url, { agent, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    if (res.statusCode === 200) {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Downloaded ' + filename);
      });
    } else {
      console.log('Status ' + res.statusCode + ' for ' + filename);
    }
  }).on('error', err => {
    console.error('Error on ' + filename + ': ' + err.message);
  });
});
