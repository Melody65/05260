let video;
let facemesh;
let predictions = [];
let maskImg;

function preload() {
  maskImg = loadImage('1.jpg'); // 載入面具圖像
}

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });
}

function modelReady() {
  // 模型載入完成，可選擇顯示訊息
}

function draw() {
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 取得關鍵點以定位面具
    const [x1, y1] = keypoints[234]; // 左臉頰
    const [x2, y2] = keypoints[454]; // 右臉頰
    const [x3, y3] = keypoints[10];  // 額頭
    const maskWidth = dist(x1, y1, x2, y2) * 1.5; // 計算面具寬度
    const maskHeight = dist(x1, y1, x3, y3) * 2;  // 計算面具高度
    const maskX = (x1 + x2) / 2 - maskWidth / 2;  // 計算面具 X 座標
    const maskY = y3 - maskHeight / 3;            // 計算面具 Y 座標

    // 繪製面具
    image(maskImg, maskX, maskY, maskWidth, maskHeight);
  }
}