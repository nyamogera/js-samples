'use strict'

class MyStar extends createjs.Shape {

	constructor() {
		let centerX = 0;
		let centerY = 0;
		let radius = 30;
		let sides = 5;
		let angle = 0;
		
		let pointSize = 0.3;
		
		let Graphics = createjs.Graphics;
		let graphics = new Graphics();
		
		super(graphics)

		graphics.setStrokeStyle(4.0)
		graphics.beginStroke(Graphics.getRGB(0, 0, 0))
		graphics.beginFill(Graphics.getRGB(255, 0, 0));
			
		let x = centerX + radius * Math.cos(angle);
		let y = centerY + radius * Math.sin(angle);
		
		graphics.drawPolyStar(100, 0, radius, sides, pointSize, angle) // x, y, radius, sides, pointSize, angle
		
		graphics.moveTo(x,y);
		
		for(var i = 1; i < sides + 1; i ++ ) {	
			
			if( pointSize != 0 ) {
				let radiusHarf = radius * (1-pointSize);
				let rotate = -((Math.PI) / sides) + ((Math.PI * 2) / sides * i + angle);
				let x = centerX + radiusHarf * Math.cos(rotate);
				let y = centerY + radiusHarf * Math.sin(rotate);
				graphics.lineTo(x,y);
				
			}
			
			let rotate = (Math.PI * 2) / sides * i + angle;
			let x = centerX + radius * Math.cos(rotate);
			let y = centerY + radius * Math.sin(rotate);
			graphics.lineTo(x,y);
			
			
		}
		
		graphics.endFill();
		graphics.endStroke();
	}

}

window.onload = function () {
	let canvasObject = document.getElementById('myCanvas');
	let stage = new createjs.Stage(canvasObject);


	// 土台
	let shape = new MyStar;
	stage.addChild(shape);

	shape.x = 50;
	shape.y = 50;

	stage.update(stage);
};
