window.onload = function () {
  init();
  animate();
};


var camera, scene, renderer, composer;
var object, light, shader, pass;

function initShader() {
        
    var uniforms = {
    "tDiffuse": { type: "t", value: null },
    "vScreenSize" : { type: "v2", value: new THREE.Vector2(1200, 500) }
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
    uniform vec2 vScreenSize;
    
    void main() {
    
        vec4 color = texture2D(tDiffuse, vUv);
        
        float x = floor( vUv.x * vScreenSize.x );
        float y = floor( vUv.y * vScreenSize.y );
        
        // 4ピクセルごとに使用する閾値の表
        mat4 m = mat4(
            vec4( 0.0,  8.0,    2.0,    10.0),
            vec4( 12.0, 4.0,    14.0,   6.0),
            vec4( 3.0,  11.0,   1.0,    9.0),
            vec4( 15.0, 7.0,    13.0,   5.0)
        );
        
        float xi = mod( x,4.0) ;
        float yi = mod( y,4.0) ;
        
        float threshold = 0.0;
        
        if( xi == 0.0 )
        {
            if( yi == 0.0 ) { threshold = m[0][0]; }
            if( yi == 1.0 ) { threshold = m[0][1]; }
            if( yi == 2.0 ) { threshold = m[0][2]; }
            if( yi == 3.0 ) { threshold = m[0][3]; }
        }
        if( xi == 1.0) {
            if( yi == 0.0 ) { threshold = m[1][0]; }
            if( yi == 1.0 ) { threshold = m[1][1]; }
            if( yi == 2.0 ) { threshold = m[1][2]; }
            if( yi == 3.0 ) { threshold = m[1][3]; }
        }
        if( xi == 2.0) {
            if( yi == 0.0 ) { threshold = m[2][0]; }
            if( yi == 1.0 ) { threshold = m[2][1]; }
            if( yi == 2.0 ) { threshold = m[2][2]; }
            if( yi == 3.0 ) { threshold = m[2][3]; }
        }
        if( xi == 3.0) {
            if( yi == 0.0 ) { threshold = m[3][0]; }
            if( yi == 1.0 ) { threshold = m[3][1]; }
            if( yi == 2.0 ) { threshold = m[3][2]; }
            if( yi == 3.0 ) { threshold = m[3][3]; }
        }
        
        color = color * 16.0;
        
        float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;
        
        if (v < threshold ) {
            color.x = 0.0;
            color.y = 0.0;
            color.z = 0.0;
        } else {
            color.x = 1.0;
            color.y = 1.0;
            color.z = 1.0;
        }
        // 描画
        gl_FragColor = color;
    
    }
    `
    
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
  //renderer.render(scene, camera);
}