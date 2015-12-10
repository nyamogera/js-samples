window.onload = function () {
  init();
  animate();
};


var camera, scene, renderer, composer;
var object, light;

// /////////////////////////////////////シェーダー部分///始まり
const uniforms = {
  "tDiffuse": { type: "t", value: null }
};

const vertexShader = `
varying vec2 vUv;
  void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`

const fragmentShader = `
#define R_LUMINANCE 0.298912
#define G_LUMINANCE 0.586611
#define B_LUMINANCE 0.114478
 
varying vec2 vUv;
uniform sampler2D tDiffuse;
 
float rand(vec2 co) {
  float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
  float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));
  float t = fract(s * 43758.5453);
  return t;
}
void main() {
  vec4 color = texture2D(tDiffuse, vUv);

  float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;

  if (v < rand(vUv)) {
      color.x = 1.0;
      color.y = 1.0;
      color.z = 1.0;

  } else {
      color.x = 0.0;
      color.y = 0.0;
      color.z = 0.0;
  }
  // 描画
  gl_FragColor = color;
}

`

var shader = {
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
}

// /////////////////////////////////////シェーダー部分///終わり

function init() {

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

  var pass = new THREE.ShaderPass(shader);
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
  //renderer.render(scene, camera);
}