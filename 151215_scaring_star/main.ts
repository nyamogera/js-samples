/// <reference path="typings/bundle.d.ts" /> 

class MyStar {

	public centerX;
	public centerY;
	public radius;
	public sides;
	public angle;
	public newMatrix: createjs.Matrix2D;
	public pointSize;
	public graphics;
	public vertex: any = [];
	public vertexOriginal: any = [];
	public shape: createjs.Shape;

	constructor() {
		this.centerX = 0;
		this.centerY = 0;
		this.radius = 30;
		this.sides = 5;
		this.angle = 0;
		this.newMatrix = new createjs.Matrix2D();
		this.pointSize = 0.3;

		let Graphics = createjs.Graphics;
		this.graphics = new Graphics();

		this.shape = new createjs.Shape(this.graphics);

		this.newMatrix.scale(5.2, 1.4);

		this.setVertex();
		this.setMatrix(this.newMatrix);
		this.draw();
	}
	setVertex = () => {

		let x = this.centerX + this.radius * Math.cos(this.angle);
		let y = this.centerY + this.radius * Math.sin(this.angle);

		for (var i = 0; i < this.sides + 1; i++) {

			if (this.pointSize != 0) {
				let radiusHarf = this.radius * (1 - this.pointSize);
				let rotate = -(Math.PI / this.sides) + (Math.PI * 2 / this.sides * i + this.angle);
				let x = this.centerX + radiusHarf * Math.cos(rotate);
				let y = this.centerY + radiusHarf * Math.sin(rotate);
				
				this.vertex.push(new createjs.Point(x, y));
				this.vertexOriginal.push(new createjs.Point(x, y));
			}

			let rotate = Math.PI * 2 / this.sides * i + this.angle;
			let x = this.centerX + this.radius * Math.cos(rotate);
			let y = this.centerY + this.radius * Math.sin(rotate);
			
			this.vertex.push(new createjs.Point(x, y));
			this.vertexOriginal.push(new createjs.Point(x, y));
		}

	}
	setMatrix(matrix: createjs.Matrix2D) {


		let vertexLentgh = this.vertex.length;
		for (var i = 0; i < vertexLentgh; i++) {
			this.vertex[i] = matrix.transformPoint(this.vertexOriginal[i].x, this.vertexOriginal[i].y);
		}
	}

	draw = () => {

		let Graphics = createjs.Graphics;
		this.graphics.setStrokeStyle(4.0);
		this.graphics.beginStroke(Graphics.getRGB(0, 0, 0));
		this.graphics.beginFill(Graphics.getRGB(255, 0, 0));

		this.graphics.moveTo(this.vertex[0].x, this.vertex[0].y);

		let vertexLentgh = this.vertex.length;
		for (var i = 1; i < vertexLentgh; i++) {
			this.graphics.lineTo(this.vertex[i].x, this.vertex[i].y);
		}
		
		this.graphics.endFill();
		this.graphics.endStroke();

	}



}

window.onload = function() {
	let canvasObject = document.getElementById("myCanvas");
	let stage = new createjs.Stage(canvasObject);


	// 土台
	let star = new MyStar();
	stage.addChild(star.shape);

	star.shape.x = 130;
	star.shape.y = 50;
	

	let Graphics = createjs.Graphics;
	var graphics = new Graphics();
	
	let shape = new createjs.Shape(graphics);
	stage.addChild(shape);
	
	graphics.setStrokeStyle(4.0);
	graphics.beginStroke(Graphics.getRGB(0, 0, 0));
	graphics.beginFill(Graphics.getRGB(255, 0, 0));
	
	graphics.drawPolyStar(0, 0, star.radius, star.sides, star.pointSize, star.angle) ;// x, y, radius, sides, pointSize, angle
	
	graphics.endFill();
	graphics.endStroke();

	star.newMatrix.decompose(shape);

	shape.x = 130;
	shape.y = 150;

	stage.update();
	
};
