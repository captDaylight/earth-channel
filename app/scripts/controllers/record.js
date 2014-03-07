'use strict';

angular.module('champagneRocksApp')
  .controller('RecordCtrl', function ($scope, $http) {

  	// remove any previous canvases
  	$('canvas').remove();

  	$scope.about = 'We are trying to create a visualization of mommy blogs. In our opinion these blogs are the cultural vanguard of cultural innovation.';
  	$scope.title = 'Space Time'
  	$scope.previous = '/cover';
  	$scope.next = '/travel'
var clock = new THREE.Clock();

	var container;
	buzz.defaults.preload = 'auto';
	var camera, projector, scene, renderer;
	var cameraCube, sceneCube;

	var mesh, lightMesh, geometry, phone;
	var spheres = [];
	    var loader = new THREE.JSONLoader(); // init the loader util
	var uniforms1;

	var directionalLight, pointLight;

	var mouseX = 0, mouseY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );

	// the first one will be the default, the rest for each object
	var skyboxDirectories = [
		'Cube',
		'GeoCave',
		'MarbleDrift',
		'BuddleBrane',
		'night_sky',
		'BuddleBrane'
	];
	var sphereObjects = [
		'Rec_S01_0304_01.js',
		'Rec_S02_0304_01.js',
		'Rec_S03_0304_01.js',
		'Rec_S04_0304_01.js',
		'Rec_S05_0304_01.js',
		'Rec_S06_0304_01.js',
		'Rec_S07_0304_01.js',
		'Rec_S08_0304_01.js',
		'Rec_S09_0304_01.js'
	]

	var skyMaterials = [];
	var currentBackground = 0;

	var soundsObjs = [
		new buzz.sound( '/sounds/02_cocktails.mp3'),
		new buzz.sound( '/sounds/03_gone.mp3'),
		new buzz.sound( '/sounds/05_envision.mp3'),
		new buzz.sound( '/sounds/06_divine_ecstasy.mp3')
		new buzz.sound( '/sounds/08_down.mp3')
		new buzz.sound( '/sounds/09_brown_flowers.mp3')
	];
	// var materials = [

	// ]

	// kickstart the application
	init();
	animate();

	function getSkyboxImageArray(location){
		var path = 'images/skyboxes/' + location + '/';
	    var format = '.jpg';
	    var urls = [
	    	path + 'px' + format, path + 'nx' + format,
	    	path + 'py' + format, path + 'ny' + format,
	    	path + 'pz' + format, path + 'nz' + format
		];
		return urls;
	}

	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function createMusicOrb(geometry, material, object, sound, texture, x, y, z){
	    loader.load('objects/' + object, function (geometry) {
	        // create a new material
	        // var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } )

	        

	        // FOR TESTING NEW MATERIALS
	        // material = materials[10];

	        // create a mesh with models geometry and material
	        var mesh = new THREE.Mesh(
	            geometry,
	            material
	        );

	        mesh.scale.x = mesh.scale.y = mesh.scale.z = 16;

			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z = z;

			mesh.active = false;
			mesh.stableScale = mesh.scale.x;
			mesh.sound = sound;
			mesh.soundTexture = texture;
			scene.add( mesh );
			spheres.push( mesh );
	    });
	}


	function generateTexture() {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 256;
		canvas.height = 256;

		var context = canvas.getContext( '2d' );
		var image = context.getImageData( 0, 0, 256, 256 );

		var x = 0, y = 0;

		for ( var i = 0, j = 0, l = image.data.length; i < l; i += 4, j ++ ) {

			x = j % 256;
			y = x == 0 ? y + 1 : y;

			image.data[ i ] = 255;
			image.data[ i + 1 ] = 255;
			image.data[ i + 2 ] = 255;
			image.data[ i + 3 ] = Math.floor( x ^ y );

		}

		context.putImageData( image, 0, 0 );

		return canvas;

	}




	function init() {

		uniforms1 = {
			time: { type: "f", value: 1.0 },
			resolution: { type: "v2", value: new THREE.Vector2() }
		};




		var params = [ [ 'fragment_shader1', uniforms1 ], [ 'fragment_shader3', uniforms1 ], [ 'fragment_shader4', uniforms1 ] ];

		var material5 = new THREE.ShaderMaterial( {

						uniforms: params[ 2 ][ 1 ],
						vertexShader: document.getElementById( 'vertexShader' ).textContent,
						fragmentShader: document.getElementById( params[ 2 ][ 0 ] ).textContent

						} );
		var texture = new THREE.Texture( generateTexture() );
		texture.needsUpdate = true;

		// materials.push( new THREE.MeshLambertMaterial( { map: texture, transparent: true } ) );
		// materials.push( new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.FlatShading } ) );
		// materials.push( new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } ) );
		// materials.push( new THREE.MeshNormalMaterial( ) );
		// materials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } ) );
		// // materials.push( new THREE.MeshBasicMaterial( { color: 0xff0000, blending: THREE.SubtractiveBlending } ) );

		// materials.push( new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading } ) );
		// materials.push( new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.SmoothShading, map: texture, transparent: true } ) );
		// materials.push( new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading } ) );
		// materials.push( new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } ) );

		// materials.push( new THREE.MeshDepthMaterial() );

		// materials.push( new THREE.MeshLambertMaterial( { color: 0x666666, emissive: 0xff0000, ambient: 0x000000, shading: THREE.SmoothShading } ) );
		// materials.push( new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x666666, emissive: 0xff0000, ambient: 0x000000, shininess: 10, shading: THREE.SmoothShading, opacity: 0.9, transparent: true } ) );

		// materials.push( new THREE.MeshBasicMaterial( { map: texture, transparent: true } ) );
















		// SET UP SCENE, CAMERA, LIGHTS
		////////////////////

	    container = document.createElement( 'div' );
	    document.body.appendChild( container );

	    camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 100000 );
	    camera.position.z = -22000;

	    cameraCube = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 100000 );

	    scene = new THREE.Scene();
	    sceneCube = new THREE.Scene();
	    projector = new THREE.Projector();
			    
	    var hemiLight1 = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );

	    hemiLight1.color.setHSL( 0.6, 1, 0.6 );
	    hemiLight1.groundColor.setHSL( .01, 0, 0.2 );
	    hemiLight1.position.set( 0, 500, 0 );
	    scene.add( hemiLight1 );

	    

	    ////////////////////



	    // START UP ALL OF THE SKY MATERIALS
	    ////////////////////

	    for(var i = 0; i < skyboxDirectories.length; i++){
			var urls = getSkyboxImageArray(skyboxDirectories[i]);
	    	var textureCube = THREE.ImageUtils.loadTextureCube( urls, new THREE.CubeRefractionMapping() );
	    	// var material = new THREE.MeshBasicMaterial( { color: 0xeeeeee, envMap: textureCube, refractionRatio: 0.99 } );
	    	var material = new THREE.MeshBasicMaterial( { color: 0xaaaaff, envMap: textureCube } );
	    	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, emissive: 0x0000ff, shading: THREE.FlatShading } );
	    	skyMaterials.push({material: material5, textureCube: textureCube});
	    }

	    ////////////////////



	    // CREATE THE SKYBOX MATERIAL AND CUBE
	    ////////////////////

	    var geometry = new THREE.SphereGeometry( 800, 4, 4 );
	    var material = skyMaterials[currentBackground]['material'];
	    
	    ////////////////////



	    // CREATE MUSIC ORBS
	    ////////////////////
	    
		createMusicOrb(geometry, material, sphereObjects[0], soundsObjs[0], skyMaterials[1], -10000, -15000, 30000);
		createMusicOrb(geometry, material, sphereObjects[1], soundsObjs[1], skyMaterials[2], -15000, 10000, 5000);
		createMusicOrb(geometry, material, sphereObjects[2], soundsObjs[2], skyMaterials[3], -10000, -4000, -4500);
		createMusicOrb(geometry, material, sphereObjects[3], soundsObjs[3], skyMaterials[4], 24000, -5000, 10000);
		createMusicOrb(geometry, material, sphereObjects[4], soundsObjs[4], skyMaterials[5], 20000, -9000, -3500);
		createMusicOrb(geometry, material, sphereObjects[5], soundsObjs[5], skyMaterials[6], 10000, 15000, 5000);
		createMusicOrb(geometry, material, sphereObjects[6], soundsObjs[6], skyMaterials[7], -1000, 12000, 5000);

	    ////////////////////



	    // ADD SKYBOX TO SCENE WITH MATERIAL
	    ////////////////////

	    var shader = THREE.ShaderLib.cube;
	    shader.uniforms.tCube.value = skyMaterials[currentBackground]['textureCube'];
	    var material = new THREE.ShaderMaterial( {

	        fragmentShader: shader.fragmentShader,
	        vertexShader: shader.vertexShader,
	        uniforms: shader.uniforms,
	        depthWrite: false,
	        side: THREE.BackSide

	    } )
	    mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );

	    sceneCube.add( mesh );

		////////////////////








		// CREATE RENDERER
		////////////////////

	    renderer = new THREE.WebGLRenderer();
	    renderer.setSize( window.innerWidth, window.innerHeight );
	    renderer.autoClear = false;
	    container.appendChild( renderer.domElement );
		
		////////////////////



	    // LOAD THE CENTRAL OBJECT TO THE SCENE
	    ////////////////////

	    var loader = new THREE.JSONLoader(); // init the loader util

	    // init loading
	    loader.load('objects/Skull_0307.js', function (geometry) {
	        // create a new material

	        // this is the same as the other objects
	        // var material = new THREE.MeshBasicMaterial( { color: 0x666666, envMap: textureCube, refractionRatio: 0.99 } );
	        var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 100, shading: THREE.FlatShading } )

	        // create a mesh with models geometry and material
	        var mesh = new THREE.Mesh(
	            geometry,
	            material
	        );
	        phone = mesh;
	        phone.scale.x = phone.scale.y = phone.scale.z = 38;

	        scene.add(phone);
	    });

	    // ////////////////////
	   	// for(var i = 0; i < materials.length;i++){
	   	// 	console.log(i);
	    // 	console.log(materials[i]);
	    // }


	    // on window resize
		window.addEventListener( 'resize', onWindowResize, false );


	}


	function onDocumentMouseMove(event) {

	    mouseX = ( event.clientX - windowHalfX ) * 22;
	    mouseY = -( event.clientY - windowHalfY ) * 22;

	}

	

	function animate() {

	    requestAnimationFrame( animate );

	    render();

	}



	var orbFluxAmount = 1;
	function render() {
	    var timer = 0.001 * Date.now();

	    // materials[ 10 ].emissive.setHSL( 0.54, 1, 0.35 * ( 0.5 + 0.5 * Math.sin( 35 * timer ) ) )
	    var delta = clock.getDelta();
	    uniforms1.time.value += delta * 50;


	    if(phone !== undefined){
		    phone.position.y = -7000
		    phone.position.x = -1000
		    phone.position.z = 10000
		    phone.rotation.y += .005
		    phone.rotation.x += .000;
	    }
	    for(var i = 0; i < spheres.length; i++){
	    	if(spheres[i].active){
	    		spheres[i].scale.x = spheres[i].stableScale + (Math.cos(timer*3) / orbFluxAmount);
	    		spheres[i].scale.y = spheres[i].stableScale + (Math.cos(timer*3) / orbFluxAmount);
	    		spheres[i].scale.z = spheres[i].stableScale + (Math.cos(timer*3) / orbFluxAmount);
	    	}
	    	spheres[i].rotation.x += .01;
	    	spheres[i].rotation.y += .01;
	    }

	    camera.position.x += ( mouseX - camera.position.x ) * .1;
	    camera.position.y += ( - mouseY - camera.position.y ) * .1;

	    camera.lookAt( scene.position );
	    cameraCube.rotation.copy( camera.rotation );

	    renderer.render( sceneCube, cameraCube );
	    renderer.render( scene, camera );
	}




	function onDocumentMouseDown( event ) {

		event.preventDefault();

		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );

		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( spheres );

		if ( intersects.length > 0 ) {
			
			// intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
			var obj = intersects[ 0 ].object
		    
		    var musicSwitch = false;
		    // turn the other orbs off
		    for(var i = 0; i < spheres.length; i++){
		    	if(spheres[i].active){
		    		if(spheres[i].uuid === obj.uuid){
		    			musicSwitch = true;
		    		}
		    		spheres[i].sound.stop();
		    		spheres[i].active = false;
		    	}
		    }
		    if(!musicSwitch){
				obj.sound.play();
				obj.active = true;
		    }


			currentBackground++;
			if(currentBackground == skyboxDirectories.length){
				currentBackground = 0;
			}

			var material = obj.soundTexture['material'];

			for(var i = 0; i < spheres.length; i++){
				spheres[i].material = material;
			}

		    var shader = THREE.ShaderLib.cube;
		    shader.uniforms.tCube.value = obj.soundTexture['textureCube'];
		    var material = new THREE.ShaderMaterial( {

		        fragmentShader: shader.fragmentShader,
		        vertexShader: shader.vertexShader,
		        uniforms: shader.uniforms,
		        depthWrite: false,
		        side: THREE.BackSide

		    } )
		    mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );

		    sceneCube.add( mesh );


		    obj.material = obj.soundTexture['material'];
		}
	}
	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}


  });
