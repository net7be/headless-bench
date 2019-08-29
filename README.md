# Headless Benchmark
Quick attempt at having an easy way to get many data points of a timing that would be close or equal to the time for the DOM-loaded event on a browser.

We're using [Nighmare](https://github.com/segmentio/nightmare) for now but that might not be the best choice.

The idea is that calling `nightmare.goto(url)` waits for all the assets to be downloaded from the underlying Electron process that does the download and render.

Usage:
```
node index.js "https://your_test_url:port"
```

Outputs timings in seconds.

We added another script to compute the average and standard deviation by reading from a file that contains the output of the previous command:
```
node parse-results.js <SOME_RESULT_FILE>
```