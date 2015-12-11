window.onload = function () {
  init();
  animate();
};

var camera, scene, renderer, composer;
var object, light, shader,uniforms;
var pass;
var mouseX, mouseY, time;


document.onmousemove = function (e){
	mouseX = e.clientX;
	mouseY = e.clientY;
};

document.onmousedown = function (e){
  time += 0.01;
};

function initShader() {
        
    uniforms = {
      "tDiffuse": {type: "t", value: null},
      "vScreenSize": {type: "v2", value: new THREE.Vector2(300, 200)},
      "vCenter": {type: "v2", value: new THREE.Vector2(window.innerWidth/2, window.innerHeight/2)},
      "fRadius": {type: "f", value: 500.0},
      "fUzuStrength": {type: "f", value: 2.5}
    };
    
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `
    
    const fragmentShader = `
    uniform sampler2D tDiffuse; varying vec2 vUv;
    uniform vec2 vScreenSize;
    uniform vec2 vCenter;
    uniform float fRadius;
    uniform float fUzuStrength; 
    void main() { 
      vec2 pos = ( vUv * vScreenSize ) - vCenter; 
      float len = length(pos); if( len >= fRadius ) { 
        gl_FragColor = texture2D(tDiffuse,vUv); return; 
      } 
      float uzu = min( max( 1.0 - ( len / fRadius),0.0),1.0) * fUzuStrength; 
      float x = pos.x * cos(uzu) - pos.y * sin(uzu); 
      float y = pos.x * sin(uzu) + pos.y * cos(uzu); 
      vec2 retPos = (vec2( x, y ) + vCenter ) / vScreenSize ; 
      vec4 color = texture2D(tDiffuse, retPos ); 
      gl_FragColor = color; 
    }`
    
    shader = {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
    }

}

function init() {
  initShader();
  
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 1, 1000);

  object = new THREE.Object3D();
  scene.add(object);

  var geometry = new THREE.SphereGeometry(1, 4, 4);
  var material = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading });

  for (var i = 0; i < 100; i++) {

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(Math.random() * 400);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
    object.add(mesh);

  }

  scene.add(new THREE.AmbientLight(0x222222));
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  // postprocessing
  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));

  pass = new THREE.ShaderPass(shader);
  composer.addPass(pass);
  pass.renderToScreen = true;
  pass.enabled = true;

  window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
  requestAnimationFrame(animate);

  object.rotation.x += 0.005;
  object.rotation.y += 0.01;

  composer.render();
 
  pass.uniforms["vScreenSize"].value.x = window.innerWidth;
  pass.uniforms["vScreenSize"].value.y = window.innerHeight;
  
  pass.uniforms["vCenter"].value.x = mouseX;
  pass.uniforms["vCenter"].value.y = window.innerHeight - mouseY;
  
}