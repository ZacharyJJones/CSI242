// Godsend: https://stackoverflow.com/questions/37206304/changing-the-pitch-of-an-audio-element-without-external-libraries

let _beepSound;
let _dingSound;
let _audioContext;
let _audioHasBeenInitialized = false;

function _initAudio() {
	_audioContext = new AudioContext();
	loadBeep();
	loadDing();
}

// =======================

function playSoundForIndices(array, colorProps, volume) {
	if (!_beepSound) {
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

// =======================

async function loadBeep() {
	const options = {
		method: "GET",
		headers: new Headers({ "content-type": "arraybuffer" }),
	};

	const response = await fetch("./src/beep.wav", options);
	const responseAsArrayBuffer = await response.arrayBuffer();
	_beepSound = await _audioContext.decodeAudioData(responseAsArrayBuffer);
}

async function loadDing() {
	const options = {
		method: "GET",
		headers: new Headers({ "content-type": "arraybuffer" }),
	};

	const response = await fetch("./src/ding.wav", options);
	const responseAsArrayBuffer = await response.arrayBuffer();
	_dingSound = await _audioContext.decodeAudioData(responseAsArrayBuffer);
}

// =======================

function _playSound(array, index, volume) {
	let _gainNode = _audioContext.createGain();
	_gainNode.connect(_audioContext.destination);
	_gainNode.gain.value = volume;

	// Setup
	var source = _audioContext.createBufferSource();
	source.connect(_gainNode);
	source.buffer = _beepSound;

	// scale to appropriate pitch
	// get interpolant value: -1 <-> +1
	const t = (2 * index) / array.length - 1;
	source.detune.value = 1000 * t;

	source.start(0);
}

function _playDingSound(volume) {
	let _gainNode = _audioContext.createGain();
	_gainNode.connect(_audioContext.destination);
	_gainNode.gain.value = clampNum(volume * 2, 0.0, 1.0);
	var source = _audioContext.createBufferSource();
	source.connect(_gainNode);
	source.buffer = _dingSound;
	source.start(0);
}
