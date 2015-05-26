(function() {

	var WIDTH = 800,
		HEIGHT = 400,
		context = new AudioContext(),
		canvas = document.querySelector('.visualizer');

	canvas.setAttribute('width', WIDTH);
	canvas.setAttribute('height', HEIGHT);
	var canvasCtx = canvas.getContext('2d');

	var fftSize = 64,
		analyser,
		lastAmplitudes = [0, 0];

	navigator.webkitGetUserMedia({audio:true, video:false},
		function onSuccess(stream) {
			mediaStreamBuffer = context.createMediaStreamSource(stream);
			connectAudioNodes(mediaStreamBuffer);
			draw();
		},
		function onError(err) {
			console.log(err);
			console.log('go and get a decent browser!');
		}
	);

	var connectAudioNodes = function(source) {
		analyser = context.createAnalyser();
		analyser.fftSize = fftSize;
		source.connect(analyser);
	};

	var draw = function() {
		requestAnimationFrame(draw);
		// fftData is an array of length fftSize/2 with values from 0 to 255
		var fftData = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(fftData);
		checkForKnock(fftData, 30);

		// drawing canvas
		canvasCtx.fillStyle = 'rgb(0, 0, 0)';
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
		canvasCtx.fillStyle = 'rgb(255,0,0)';

		var barWidth = WIDTH / analyser.frequencyBinCount,
			barHeight = 0,
			x = 0;

		for (var i = 0; i < analyser.frequencyBinCount; i++) {
			canvasCtx.fillRect(x, HEIGHT, barWidth, parseInt(-HEIGHT * fftData[i])/255);
			x += barWidth;
		};
	};

	var checkForKnock = function(fftData, treshold) {
		if (fftData[0] - lastAmplitudes[0] > treshold && fftData[1] - lastAmplitudes[1] > treshold) {
			console.log('Knock!');
		}
		lastAmplitudes[0] = fftData[0];
		lastAmplitudes[1] = fftData[1]
	};


})();
