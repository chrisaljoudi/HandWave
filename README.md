HandWave
========

A simple, fast JavaScript library to convert audio data to a wave file encoded as a data URI string.

## Usage

```javascript
var URI = HandWave(samples [, options]);
```

`samples` is an array of the samples representing the audio data you want HandWave to encode. HandWave has some parameters that you can tweak by passing an `options` object, with 0 or more of these options:

* `sampleRate`: samples per second. **Defaults to 8000Hz.**
* `sampleSize`: number of bits per sample (8 or 16). **Defaults to 8 bits.**
* `channels`: number of audio channels (samples alternate). **Defaults to 1 channel (mono).**

Once you have the URI, you can just use it as a `src` to play it:

```javascript
var synthesized = new Audio();
synthesized.src = URI;
synthesized.play();
```

## Contribution

Pull requests, issues, etc. are all welcome.

## Who made this?

HandWave was written with care and love by [Chris](https://chrismatic.io/).

Please enjoy HandWave!

## License

HandWave is released under the MIT License. [See LICENSE](LICENSE).
