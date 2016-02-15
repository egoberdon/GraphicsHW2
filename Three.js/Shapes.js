// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube;

init();
animate();

// FUNCTIONS
function init()
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,150,400);
	camera.lookAt(scene.position);
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer();
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// FLOOR
	var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  // scene.add(skyBox);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

	////////////
	// CUSTOM //
	////////////

	// Using wireframe materials to illustrate shape details.
	var darkMaterial = new THREE.MeshBasicMaterial( { color: 0xffffcc } );
	var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, transparent: true } );
	var multiMaterial = [ darkMaterial, wireframeMaterial ];

	// tetrahedron
	var shape = THREE.SceneUtils.createMultiMaterialObject(
		new THREE.TetrahedronGeometry( 40, 0 ),
		multiMaterial );
	shape.position.set(0, 23, -200); //23 is the height made off of tetrahedron radius calculations
	scene.add( shape );

	// dome
	var shape = THREE.SceneUtils.createMultiMaterialObject(
		new THREE.SphereGeometry( 40, 32, 16, 0, 2 * Math.PI, 0, Math.PI / 2 ),
		multiMaterial );
	// should set material to doubleSided = true so that the
	//   interior view does not appear transparent.
	shape.position.set(0, 0, -100); //bottom of object is where it is set so height set to 0
	scene.add( shape );

	// torus - diamond
	var shape = THREE.SceneUtils.createMultiMaterialObject(
	    // radius of entire torus, diameter of tube (less than total radius),
		// segments around radius, segments around torus ("sides")
		new THREE.TorusGeometry( 25, 10, 8, 4 ),
		multiMaterial );
	shape.position.set(0, 35, 0); //height is radius of torus plus diameter of tube
	scene.add( shape );

	// cone - truncated
	var shape = THREE.SceneUtils.createMultiMaterialObject(
		// radiusAtTop, radiusAtBottom, height, segmentsAroundRadius, segmentsAlongHeight,
		new THREE.CylinderGeometry( 10, 30, 100, 20, 4 ),
		multiMaterial );
	shape.position.set(0, 50, 100); // height is half height of cone
	scene.add( shape );

	// torus - bagel
	var shape = THREE.SceneUtils.createMultiMaterialObject(
	    // radius of entire torus, diameter of tube (less than total radius),
		// sides per cylinder segment, cylinders around torus ("sides")
		new THREE.TorusGeometry( 30, 20, 16, 40 ),
		multiMaterial );
	shape.position.set(0, 50, 200); //height is radius of torus plus diameter of tube
	scene.add( shape );

}

function animate()
{
    requestAnimationFrame( animate );
	render();
	update();
}

function update()
{
	if ( keyboard.pressed("z") )
	{
		// do something
	}

	controls.update();
	stats.update();
}

function render()
{
	renderer.render( scene, camera );
}
