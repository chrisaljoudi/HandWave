// HandWave.js - MIT Licensed
// Chris Aljoudi (2015)
(function() {
var BASE64 = {
	chrs: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	enc: [],
	init: function() {
		for(var i = 0; i < 4096; i++) {
			this.enc[i] = this.chrs[i >> 6] + this.chrs[i & 0x3F];
		}
	},
	encode: function(src) {
			var len = src.length;
			var res = "", i = 0, n;
			while(len > 2) {
				n = (src[i] << 16) | (src[i + 1] << 8) | src[i + 2];
				res += this.enc[n >> 12] + this.enc[n & 0xFFF];
				len -= 3;
				i += 3;
			}
			if(len > 0) {
				var n1 = (src[i] & 0xFC) >> 2;
				var n2 = (src[i] & 0x03) << 4;
				if(len > 1) {
					n2 |= (src[++ i] & 0xF0) >> 4;
				}
				res += this.chrs[n1];
				res += this.chrs[n2];
				if(len == 2) {
					var n3 = (src[i ++] & 0x0F) << 2;
					n3 |= (src[i] & 0xC0) >> 6;
					res += this.chrs[n3];
				}
				if(len == 1) {
					res += "=";
				}
				res += "=";
			}
			return res;
		}
}
function u32ToArray(i) {
	return [i & 0xFF, (i >> 8) & 0xFF, (i >> 16) & 0xFF, (i >> 24) & 0xFF];
}
function u16ToArray(i) {
	return [i & 0xFF, (i >> 8) & 0xFF];
}
function split16bitArray(data) {
	var r = [];
	var j = 0;
	var len = data.length;
	for(var i = 0; i < len; i++) {
		r[j ++] = data[i] & 0xFF;
		r[j ++] = (data[i] >> 8) & 0xFF;
	}
	return r;
}
BASE64.init();
var chunkId = [0x52, 0x49, 0x46, 0x46],
	format = [0x57, 0x41, 0x56, 0x45],
	subChunk1Id = [0x66, 0x6d, 0x74, 0x20], 
	subChunk1Size = 16, 
	PCM = 1, 
	subChunk2Id = [0x64, 0x61, 0x74, 0x61];
var defaults = {
	sampleSize: 8,
	sampleRate: 8000,
	channels: 1,
};
var HandWave = function(samples, opts) {
	if(!(samples instanceof Array)) {
		throw new TypeError("First parameter must be an array of samples; received a parameter of type '" + typeof samples + "'");
		return false;
	}
	opts = opts || {};
	for(var key in opts) {
		if(!opts.hasOwnProperty(key)) {
			continue;
		}
		if(!defaults.hasOwnProperty(key)) {
			throw new RangeError("Unexpected option passed: '" + key + "'");
			return false;
		}
	}
	for(var key in defaults) {
		if(!defaults.hasOwnProperty(key)) {
			continue;
		}
		if(typeof opts[key] === "undefined") {
			opts[key] = defaults[key];
		}
	}
	var blockAlign = (opts.channels * opts.sampleSize) >> 3,
		byteRate = blockAlign * opts.sampleRate,
		subChunk2Size = samples.length * (opts.sampleSize >> 3),
		chunkSize = 36 + subChunk2Size;
	var wav = chunkId.concat(u32ToArray(chunkSize), format, subChunk1Id, u32ToArray(subChunk1Size), u16ToArray(PCM),
					u16ToArray(opts.channels), u32ToArray(opts.sampleRate), u32ToArray(byteRate), u16ToArray(blockAlign),
					u16ToArray(opts.sampleSize), subChunk2Id, u32ToArray(subChunk2Size),
					opts.sampleSize == 16 ? split16bitArray(samples) : samples);
	return "data:audio/wav;base64," + BASE64.encode(wav);
	
};
window.HandWave = HandWave;
})();
