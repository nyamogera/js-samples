"use strict"

var stage, shape;
var canvas, sideText;
var start, end;
var rotate;
var radius;
var center = new Point();
var mouse = new Point;

function onMouseMove(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
}

function animate() {
	requestAnimationFrame(animate);

	rotate += 0.01

	start.x = center.x + (radius) * Math.cos(rotate);
	start.y = center.y + radius * Math.sin(rotate);

	end.x = center.x + radius * Math.cos(rotate + Math.PI);
	end.y = center.y + radius * Math.sin(rotate + Math.PI);

	shape.graphics.clear();
	shape.graphics.setStrokeStyle(2);
	shape.graphics.beginStroke("#000");
	shape.graphics.moveTo(start.x, start.y);
	shape.graphics.lineTo(end.x, end.y);
	shape.graphics.endStroke();
	stage.update();

	var currentSide = side(start, end, mouse);

	if (currentSide == 0) {
		sideText.innerHTML = "点位置:線上";
	} else if (currentSide > 0) {
		sideText.innerHTML = "点位置:右";
	} 　else {
		sideText.innerHTML = "点位置:左";
	}
}
window.onload = function () {
	sideText = document.getElementById("side");
	canvas = document.getElementById("myCanvas");

	var width = 400;
	var height = 400;

    canvas.width = width;
    canvas.height = height;

	center.x = canvas.width / 2;
	center.y = canvas.height / 2;

	sideText.innerHTML = "点位置:右";
	start = new Point();

	end = new Point();
	rotate = 0;
	radius = Math.sqrt((width * width) + (height * height));

    stage = new createjs.Stage(canvas);
    shape = new createjs.Shape();

    stage.addChild(shape);

	canvas.onmousemove = onMouseMove;

	mouse = new Point();

	animate();
};

class Point {
	constructor() {
		this.x = 0;
		this.y = 0;
	}
}

function side(a, b, p) {
	return p.x * (a.y - b.y) + a.x * (b.y - p.y) + b.x * (p.y - a.y);
}