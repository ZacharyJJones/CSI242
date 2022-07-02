let _sound;
const _audioContext = new AudioContext();

async function loadSound() {
	const options = {
		method: "GET",
		headers: new Headers({ "content-type": "arraybuffer" }),
	};

	const response = await fetch("./TextNoise.wav", options);
	const responseAsArrayBuffer = await response.arrayBuffer();
	_sound = await _audioContext.decodeAudioData(responseAsArrayBuffer);
}
loadSound();

function playSoundForIndices(array, colorProps, volume) {
	if (!_sound) {
		return;
	}

	if (colorProps !== undefined && colorProps.activeIndices !== undefined) {
		const active = colorProps.activeIndices;

		let iPlus = 1;
		if (active.length > 10) {
			iPlus = Math.floor(active.length / 10);
		}

		for (let i = 0; i < active.length; i += iPlus) {
			_playSound(array, active[i], volume);
		}
	}
}

function _playSound(array, index, volume) {
	let _gainNode = _audioContext.createGain();
	_gainNode.connect(_audioContext.destination);
	_gainNode.gain.value = volume;

	// Setup
	var source = _audioContext.createBufferSource();
	source.connect(_gainNode);
	source.buffer = _sound;

	// scale to appropriate pitch
	// get interpolant value: -1 <-> +1
	const t = (2 * index) / array.length - 1;
	source.detune.value = 1000 * t;

	source.start(0);
}
