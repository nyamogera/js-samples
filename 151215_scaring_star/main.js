/// <reference path="typings/bundle.d.ts" /> 
var MyStar = (function () {
    function MyStar() {
        var _this = this;
        this.vertex = [];
        this.vertexOriginal = [];
        this.setVertex = function () {
            var x = _this.centerX + _this.radius * Math.cos(_this.angle);
            var y = _this.centerY + _this.radius * Math.sin(_this.angle);
            for (var i = 0; i < _this.sides + 1; i++) {
                if (_this.pointSize != 0) {
                    var radiusHarf = _this.radius * (1 - _this.pointSize);
                    var rotate_1 = -(Math.PI / _this.sides) + (Math.PI * 2 / _this.sides * i + _this.angle);
                    var x_1 = _this.centerX + radiusHarf * Math.cos(rotate_1);
                    var y_1 = _this.centerY + radiusHarf * Math.sin(rotate_1);
                    _this.vertex.push(new createjs.Point(x_1, y_1));
                    _this.vertexOriginal.push(new createjs.Point(x_1, y_1));
                }
                var rotate = Math.PI * 2 / _this.sides * i + _this.angle;
                var x_2 = _this.centerX + _this.radius * Math.cos(rotate);
                var y_2 = _this.centerY + _this.radius * Math.sin(rotate);
                _this.vertex.push(new createjs.Point(x_2, y_2));
                _this.vertexOriginal.push(new createjs.Point(x_2, y_2));
            }
        };
        this.draw = function () {
            var Graphics = createjs.Graphics;
            _this.graphics.setStrokeStyle(4.0);
            _this.graphics.beginStroke(Graphics.getRGB(0, 0, 0));
            _this.graphics.beginFill(Graphics.getRGB(255, 0, 0));
            _this.graphics.moveTo(_this.vertex[0].x, _this.vertex[0].y);
            var vertexLentgh = _this.vertex.length;
            for (var i = 1; i < vertexLentgh; i++) {
                _this.graphics.lineTo(_this.vertex[i].x, _this.vertex[i].y);
            }
            _this.graphics.endFill();
            _this.graphics.endStroke();
        };
        this.centerX = 0;
        this.centerY = 0;
        this.radius = 30;
        this.sides = 5;
        this.angle = 0;
        this.newMatrix = new createjs.Matrix2D();
        this.pointSize = 0.3;
        var Graphics = createjs.Graphics;
        this.graphics = new Graphics();
        this.shape = new createjs.Shape(this.graphics);
        this.newMatrix.scale(5.2, 1.4);
        this.setVertex();
        this.setMatrix(this.newMatrix);
        this.draw();
    }
    MyStar.prototype.setMatrix = function (matrix) {
        var vertexLentgh = this.vertex.length;
        for (var i = 0; i < vertexLentgh; i++) {
            this.vertex[i] = matrix.transformPoint(this.vertexOriginal[i].x, this.vertexOriginal[i].y);
        }
    };
    return MyStar;
})();
window.onload = function () {
    var canvasObject = document.getElementById("myCanvas");
    var stage = new createjs.Stage(canvasObject);
    // 土台
    var star = new MyStar();
    stage.addChild(star.shape);
    star.shape.x = 130;
    star.shape.y = 50;
    var Graphics = createjs.Graphics;
    var graphics = new Graphics();
    var shape = new createjs.Shape(graphics);
    stage.addChild(shape);
    graphics.setStrokeStyle(4.0);
    graphics.beginStroke(Graphics.getRGB(0, 0, 0));
    graphics.beginFill(Graphics.getRGB(255, 0, 0));
    graphics.drawPolyStar(0, 0, star.radius, star.sides, star.pointSize, star.angle); // x, y, radius, sides, pointSize, angle
    graphics.endFill();
    graphics.endStroke();
    star.newMatrix.decompose(shape);
    shape.x = 130;
    shape.y = 150;
    stage.update();
};
