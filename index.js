const Nightmare = require('nightmare');

function getInstance(id, show = false) {
  // I don't think there is any caching when
  // you re-instanciate Nightmare all the time
  // but to be sure I huse this "persis" hack 
  // thingy.
  if (!id) id = Date.now().toString().charAt(12);
  // It's important to disable certificate validation
  // or the test won't work with the self signed
  // certificates I'm using.
  return new Nightmare(
    {
      switches: {
        'ignore-certificate-errors': true
      },
      webPreferences: {
        partition: `persist:id${id}`
      },
      show
    }
  );
}

function testUrl(url, id) {
  return new Promise((resolve, reject) => {
    const nightmare = getInstance(id);
    
    const start = Date.now();
    nightmare.goto(url)
      .end()
      .then(() => {
        resolve(Date.now() - start);
      })
      .catch(err => reject(err));
  });
}

async function makeTests(url, loops) {
  // I actually don't want to requests to go in parallel.
  for (i = 0; i < loops; i++) {
    const time = await testUrl(url, i);
    //console.log(`${i}: ${time / 1000}`);
    console.log(time / 1000);
  }
}

const loops = 20;
let show = false;

if (process.argv.length < 3) {
  console.log('Please provide a test URL in argument.');
  process.exit();
} else if (process.argv.length > 3) {
  // Look for options:
  show = process.argv.slice(3).some(v => v.startsWith('-s'));
}

const url = process.argv[2];
console.log(`Testing URL: ${url}\n`);

if (!show) {
  makeTests(url, loops);
} else {
  // I use this hacky thing to check the Chrome dev tools
  // in the Electron window (for instance to check if 
  // the protocol is HTTP/2).
  const nightmare = getInstance(null, true);
  nightmare.goto(url)
    .end()
    .wait(Number.MAX_VALUE)
    .then(res => {
      console.log(res);
    });
}
