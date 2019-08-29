const fs = require('fs');

if (process.argv.length < 3) {
  console.log('Please provide a results file in argument.');
  process.exit();
}

const filename = process.argv[2];

if (fs.existsSync(filename)) {
  const readStream = fs.createReadStream(filename, 'utf8');
  let values = {sum: 0, values: []};
  readStream.on('data', data => {
    values = data.split('\n').reduce((acc, cur) => {
      const val = Number(cur);
      // Number will pase '' as 0, we need to check for 
      // that.
      if (cur !== '' && !isNaN(val)) {
        acc.sum += val;
        acc.values.push(val);
      }
      return acc;
    }, values);
  });
  readStream.on('end', () => {
    // Compute mean and standard deviation and
    // display results:
    values.avg = values.values.reduce(
      (acc, cur) => acc + cur/values.values.length
      , 0
    );
    values.sd = 0;
    if (values.values.length > 1) {
      values.sd = Math.sqrt(
        values.values.reduce(
          (acc, cur) => acc + Math.pow((cur - values.avg), 2)
        ) / (values.values.length - 1)
      );
    }
    console.log(`Parsed ${values.values.length} values for ${filename}.`);
    console.log(`Average: ${values.avg}`);
    console.log(`Standard deviation: ${values.sd}`);
  });
} else {
  console.log('File does not exist.');
}