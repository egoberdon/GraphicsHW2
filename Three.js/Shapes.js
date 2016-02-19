// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
// custom global variables
var cube;
var shapes;
var tetra, dome, diamond, cone, bagel;
var shapeMaterial;
var parameters;
var gui;

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
	scene.add(light);

	// need to add an ambient light
	//  for ambient colors to be visible
	// make the ambient light darker so that
	//  it doesn't overwhelm (like emmisive light)
	var light2 = new THREE.AmbientLight(0x333333);
	light2.position.set( light.position );
	scene.add(light2);
	
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
	// var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
	// var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
	// var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  // scene.add(skyBox);
	scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

	////////////
	// CUSTOM //
	////////////

	// Using phongMaterial
	shapeMaterial = new THREE.MeshPhongMaterial( { color:0xff0000, transparent:true, opacity:1 } );

	//tetrahedron
	var tetraGeometry = new THREE.TetrahedronGeometry( 40, 0);
	tetra = new THREE.Mesh(tetraGeometry, shapeMaterial);
	tetra.position.set(0,23,-200); //23 is half height based on tetrahedron geometry
	scene.add(tetra);

	//dome
	var domeGeometry = new THREE.SphereGeometry( 40, 32, 16, 0, 2 * Math.PI, 0, Math.PI / 2 )
	dome = new THREE.Mesh(domeGeometry, shapeMaterial);
	dome.position.set(0, 0, -100); //bottom of object is where it is set so height set to 0
	scene.add( dome );

	//torus - diamond
	var diamondGeometry = new THREE.TorusGeometry( 25, 10, 8, 4 );
	diamond = new THREE.Mesh(diamondGeometry, shapeMaterial);
	diamond.position.set(0, 35, 0); //height is radius of torus plus diameter of tube
	scene.add( diamond );

	//var - cone
	var coneGeometry = new THREE.CylinderGeometry( 10, 30, 100, 20, 4 );
	cone = new THREE.Mesh(coneGeometry, shapeMaterial);
	cone.position.set(0, 50, 100); // height is half height of cone
	scene.add(cone);

	//torus - bagel
	var bagelGeometry = new THREE.TorusGeometry( 30, 20, 16, 40 );
	bagel = new THREE.Mesh(bagelGeometry, shapeMaterial);
	bagel.position.set(0, 50, 200); //height is radius of torus plus diameter of tube
	scene.add( bagel );

	// create a small sphere to show position of light
	var lightbulb = new THREE.Mesh(
		new THREE.SphereGeometry( 10, 16, 8 ),
		new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
	);
	lightbulb.position = light.position;
	scene.add( lightbulb );

	gui = new dat.GUI();

	shapes = [tetra, dome, diamond, cone, bagel];

	parameters =
	{
		color:  "#ff0000", // color (change "#" to "0x")
		colorA: "#000000", // color (change "#" to "0x")
		colorE: "#000033", // color (change "#" to "0x")
		colorS: "#ffff00", // color (change "#" to "0x")
        shininess: 30,
		opacity: 1,
		visible: true,
		material: "Phong"
	};

	var shapeColor = gui.addColor( parameters, 'color' ).name('Color (Diffuse)').listen();
	shapeColor.onChange(function(value) // onFinishChange
	{  	tetra.material.color.setHex( value.replace("#", "0x") );
			dome.material.color.setHex( value.replace("#", "0x") );
			diamond.material.color.setHex( value.replace("#", "0x") );
			cone.material.color.setHex( value.replace("#", "0x") );
			bagel.material.color.setHex( value.replace("#", "0x") ); });
	var shapeColorA = gui.addColor( parameters, 'colorA' ).name('Color (Ambient)').listen();
	shapeColorA.onChange(function(value) // onFinishChange
	{   tetra.material.ambient.setHex( value.replace("#", "0x") );
			dome.material.ambient.setHex( value.replace("#", "0x") );
			diamond.material.ambient.setHex( value.replace("#", "0x") );
			cone.material.ambient.setHex( value.replace("#", "0x") );
			bagel.material.ambient.setHex( value.replace("#", "0x") ); });
	var shapeColorE = gui.addColor( parameters, 'colorE' ).name('Color (Emissive)').listen();
	shapeColorE.onChange(function(value) // onFinishChange
	{   tetra.material.emissive.setHex( value.replace("#", "0x") );
			dome.material.emissive.setHex( value.replace("#", "0x") );
			diamond.material.emissive.setHex( value.replace("#", "0x") );
			cone.material.emissive.setHex( value.replace("#", "0x") );
			bagel.material.emissive.setHex( value.replace("#", "0x") ); });
	var shapeColorS = gui.addColor( parameters, 'colorS' ).name('Color (Specular)').listen();
	shapeColorS.onChange(function(value) // onFinishChange
	{   tetra.material.specular.setHex( value.replace("#", "0x") );
			dome.material.specular.setHex( value.replace("#", "0x") );
			diamond.material.specular.setHex( value.replace("#", "0x") );
			cone.material.specular.setHex( value.replace("#", "0x") );
			bagel.material.specular.setHex( value.replace("#", "0x") ); });
	var shapeShininess = gui.add( parameters, 'shininess' ).min(0).max(60).step(1).name('Shininess').listen();
	shapeShininess.onChange(function(value)
	{   tetra.material.shininess = value;
			dome.material.shininess = value;
			diamond.material.shininess = value;
			cone.material.shininess = value;
			bagel.material.shininess = value; });
	var shapeOpacity = gui.add( parameters, 'opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
	shapeOpacity.onChange(function(value)
	{   tetra.material.opacity = value;
			dome.material.opacity = value;
			diamond.material.opacity = value;
			cone.material.opacity = value;
			bagel.material.opacity = value; });

	var shapeMaterial2 = gui.add( parameters, 'material', [ "Basic", "Lambert", "Phong", "Wireframe" ] ).name('Material Type').listen();
	shapeMaterial2.onChange(function(value)
	{   updateShapes();   });

	gui.open();
	updateShapes();
}

function updateShapes()
{
	var value = parameters.material;
	var newMaterial;
	if (value == "Basic")
		newMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );
	else if (value == "Lambert")
		newMaterial = new THREE.MeshLambertMaterial( { color: 0x000000 } );
	else if (value == "Phong")
		newMaterial = new THREE.MeshPhongMaterial( { color: 0x000000 } );
	else // (value == "Wireframe")
		newMaterial = new THREE.MeshBasicMaterial( { wireframe: true } );
		updateShape(tetra, newMaterial);
		updateShape(dome, newMaterial);
		updateShape(diamond, newMaterial);
		updateShape(cone, newMaterial);
		updateShape(bagel, newMaterial);
}

function updateShape(shape, newMaterial){
	shape.material = newMaterial;
	shape.material.color.setHex( parameters.color.replace("#", "0x") );
	if (shape.material.ambient)
		shape.material.ambient.setHex( parameters.colorA.replace("#", "0x") );
		if (shape.material.emissive)
		shape.material.emissive.setHex( parameters.colorE.replace("#", "0x") );
	if (shape.material.specular)
		shape.material.specular.setHex( parameters.colorS.replace("#", "0x") );
		if (shape.material.shininess)
		shape.material.shininess = parameters.shininess;
	shape.material.opacity = parameters.opacity;
	shape.material.transparent = true;
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
