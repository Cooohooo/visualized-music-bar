const audio = document.querySelector("audio");
const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");

function initCvs() {
    cvs.width = window.innerWidth * devicePixelRatio;
    cvs.height = (window.innerHeight / 2) * devicePixelRatio;
}

initCvs();

let isInit = false;

let dataArray;

let analyser;

audio.onplay = function () {
    if (isInit) {
        return;
    }

    // AudioContext控制它包含的节点的创建和音频处理或解码的执行
    const audioCtx = new AudioContext();
    // 创建一个MediaElementAudioSourceNode接口来关联HTMLMediaElement. 这可以用来播放和处理来自<video>或<audio>元素的音频。
    const source = audioCtx.createMediaElementSource(audio);
    // AudioContext的createAnalyser()方法能创建一个AnalyserNode，可以用来获取音频时间和频率数据，以及实现数据可视化。
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    isInit = true;
};

function draw() {
    requestAnimationFrame(draw);

    const { width, height } = cvs;
    ctx.clearRect(0, 0, width, height);
    if (!isInit) {
        return;
    }
    analyser.getByteFrequencyData(dataArray);
    // 条的数量 取前半部分 高频部分人耳几乎听不到 看不到波形
    const len = dataArray.length / 2;
    const barWidth = width / len / 2;
    ctx.fillStyle = "#e0f9b5";
    for (let i = 0; i < len; i++) {
        const data = dataArray[i];
        const barHeight = (data / 255) * height;
        const x1 = i * barWidth + width / 2;
        // 右边区域中条的X坐标
        const x2 = width / 2 - (i + 1) * barWidth;
        // 左边区域中条的X坐标 镜像
        const y = height - barHeight;
        ctx.fillRect(x1, y, barWidth, barHeight);
        ctx.fillRect(x2, y, barWidth, barHeight);
    }
}

draw();
