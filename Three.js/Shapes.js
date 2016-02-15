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
	light.position.set(-100,150,100);

	// need to add an ambient light
	//  for ambient colors to be visible
	// make the ambient light darker so that
	//  it doesn't overwhelm (like emmisive light)
	var light2 = new THREE.AmbientLight(0x333333);
	light2.position.set( light.position );
	scene.add(light2);

	var lightbulbGeometry = new THREE.SphereGeometry( 10, 16, 8 );
	var lightbulbMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true,  opacity: 0.8, blending: THREE.AdditiveBlending } );
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } );
	var materialArray = [lightbulbMaterial, wireMaterial];
	var lightbulb = THREE.SceneUtils.createMultiMaterialObject( lightbulbGeometry, materialArray );
	lightbulb.position = light.position;
	scene.add(lightbulb);
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

	// var axes = new THREE.AxisHelper(10);
	// scene.add(axes);
	//
	//
	// gui = new dat.GUI();
	//
	// parameters =
	// {
	// 	x: 0, y: 30, z: 0,
	// 	color:  "#ff0000", // color (change "#" to "0x")
	// 	colorA: "#000000", // color (change "#" to "0x")
	// 	colorE: "#000033", // color (change "#" to "0x")
	// 	colorS: "#ffff00", // color (change "#" to "0x")
	// 			shininess: 30,
	// 	opacity: 1,
	// 	visible: true,
	// 	material: "Phong",
	// 	reset: function() { resetSphere() }
	// };
	//
	//
	// var folder1 = gui.addFolder('Position');
	// var sphereX = folder1.add( parameters, 'x' ).min(-200).max(200).step(1).listen();
	// var sphereY = folder1.add( parameters, 'y' ).min(0).max(100).step(1).listen();
	// var sphereZ = folder1.add( parameters, 'z' ).min(-200).max(200).step(1).listen();
	// folder1.open();
	//
	// sphereX.onChange(function(value)
	// {   sphere.position.x = value;   });
	// sphereY.onChange(function(value)
	// {   sphere.position.y = value;   });
	// sphereZ.onChange(function(value)
	// {   sphere.position.z = value;   });
	//
	// var sphereColor = gui.addColor( parameters, 'color' ).name('Color (Diffuse)').listen();
	// sphereColor.onChange(function(value) // onFinishChange
	// {   sphere.material.color.setHex( value.replace("#", "0x") );   });
	// var sphereColorA = gui.addColor( parameters, 'colorA' ).name('Color (Ambient)').listen();
	// sphereColorA.onChange(function(value) // onFinishChange
	// {   sphere.material.ambient.setHex( value.replace("#", "0x") );   });
	// var sphereColorE = gui.addColor( parameters, 'colorE' ).name('Color (Emissive)').listen();
	// sphereColorE.onChange(function(value) // onFinishChange
	// {   sphere.material.emissive.setHex( value.replace("#", "0x") );   });
	// var sphereColorS = gui.addColor( parameters, 'colorS' ).name('Color (Specular)').listen();
	// sphereColorS.onChange(function(value) // onFinishChange
	// {   sphere.material.specular.setHex( value.replace("#", "0x") );   });
	// var sphereShininess = gui.add( parameters, 'shininess' ).min(0).max(60).step(1).name('Shininess').listen();
	// sphereShininess.onChange(function(value)
	// {   sphere.material.shininess = value;   });
	// var sphereOpacity = gui.add( parameters, 'opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
	// sphereOpacity.onChange(function(value)
	// {   sphere.material.opacity = value;   });
	//
	// var sphereMaterial = gui.add( parameters, 'material', [ "Basic", "Lambert", "Phong", "Wireframe" ] ).name('Material Type').listen();
	// sphereMaterial.onChange(function(value)
	// {   updateSphere();   });
	//
	// gui.add( parameters, 'reset' ).name("Reset Sphere Parameters");
	//
	// gui.open();
	// updateSphere();

}

// function updateSphere()
// {
// 	var value = parameters.material;
// 	var newMaterial;
// 	if (value == "Basic")
// 		newMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
// 	else if (value == "Lambert")
// 		newMaterial = new THREE.MeshLambertMaterial( { color: 0x000000 } );
// 	else if (value == "Phong")
// 		newMaterial = new THREE.MeshPhongMaterial( { color: 0x000000 } );
// 	else // (value == "Wireframe")
// 		newMaterial = new THREE.MeshBasicMaterial( { wireframe: true } );
// 	sphere.material = newMaterial;
//
// 	sphere.position.x = parameters.x;
// 	sphere.position.y = parameters.y;
// 	sphere.position.z = parameters.z;
// 	sphere.material.color.setHex( parameters.color.replace("#", "0x") );
// 	if (sphere.material.ambient)
// 		sphere.material.ambient.setHex( parameters.colorA.replace("#", "0x") );
//     if (sphere.material.emissive)
// 		sphere.material.emissive.setHex( parameters.colorE.replace("#", "0x") );
// 	if (sphere.material.specular)
// 		sphere.material.specular.setHex( parameters.colorS.replace("#", "0x") );
//     if (sphere.material.shininess)
// 		sphere.material.shininess = parameters.shininess;
// 	sphere.material.opacity = parameters.opacity;
// 	sphere.material.transparent = true;
//
// }
//
// function resetSphere()
// {
// 	parameters.x = 0;
// 	parameters.y = 30;
// 	parameters.z = 0;
// 	parameters.color = "#ff0000";
// 	parameters.colorA = "#000000";
// 	parameters.colorE = "#000033";
// 	parameters.colorS = "#ffff00";
//     parameters.shininess = 30;
// 	parameters.opacity = 1;
// 	parameters.visible = true;
// 	parameters.material = "Phong";
// 	updateSphere();
// }

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
