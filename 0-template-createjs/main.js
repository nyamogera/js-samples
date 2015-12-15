'use strict'

class MyStar extends createjs.Shape{
	constructor(graphics){
		this.centerX = 0;
		this.centerY = 0;
		super(graphics)
	}
	
}

window.onload = function () {
	var canvasObject = document.getElementById('myCanvas');
	stage = new createjs.Stage(canvasObject);

	var Graphics = createjs.Graphics;
	var graphics = new Graphics();

	graphics
		.setStrokeStyle(4.0) // 線の太さ
		.beginStroke(Graphics.getRGB(0, 0, 0)) // 線の色
		.beginFill(Graphics.getRGB(255, 0, 0)) // 塗りの色
		.drawPolyStar(-25, -25, 50, 5, 0.5, 0) // x, y, radius, sides, pointSize, angle
		.endFill() // 塗りの設定を閉じる
		.endStroke(); // 線の設定を閉じる

	// 土台
	shape = new createjs.Shape(graphics);
	stage.addChild(shape);
	
	stage.update(stage);
	
	
	var graphics2 = new Graphics();
	graphics.setStrokeStyle(4.0)
		.beginStroke(Graphics.getRGB(0, 0, 0)) // 線の色
		.beginFill("white")
		.drawRect(-25,-25,50,50) // x, y, radius, sides, pointSize, angle
		.endFill() // 塗りの設定を閉じる
		.endStroke(); // 線の設定を閉じる

		var matrix = shape.getMatrix();
		//matrix.scale(3,3)
		matrix.decompose(shape);

	var shape2 = new createjs.Shape(graphics2);
	stage.addChild(shape2);
	
	exporter = new SVGExporter(stage, false, false, false);
	exporter.run();

	setTimeout(addDownload, 1); // for some reason, it takes a tick for the browser to init the SVG
	document.body.appendChild(exporter.svg);
	
	document.addEventListener("mouseup",mouseUpHandler);
	document.addEventListener("mousedown",mouseDownHandler);
	document.addEventListener("mousemove",onMouseMove);
};

var shape;
var mousedown = false;
var stage;

function mouseUpHandler(event) {
	mousedown = false;
}

function mouseDownHandler(evt) {
  console.log(this); // 出力：Window
  var target = evt.target;
  console.log(target.name); // 出力：circle
  shape.x = mouseX;
	shape.y = mouseY;
	
	mousedown = true;
}

var mouseX, mouseY;

function onMouseMove(event) {
	mouseX = event.clientX;
	mouseY = event.clientY;
	
	if( mousedown ) {
  	shape.x = mouseX;
		shape.y = mouseY;
	}
	stage.update(stage);
}

var exporter;

function addDownload() {
	var serializer = new XMLSerializer();
	var svgStr = serializer.serializeToString(exporter.svg);
	var link = document.createElement("a");
	link.innerText = "SAVE SVG TO FILE";
	link.download = "export.svg";
	link.href = "data:image/svg+xml,\n"+encodeURIComponent(svgStr);
	document.body.appendChild(link);
}