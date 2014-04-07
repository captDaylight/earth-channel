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
	buzz.defaults.preload = 'none';
	var camera, projector, scene, renderer, mouse;
	var cameraCube, sceneCube;

	var mesh, lightMesh, geometry, centralBeacon;
	var spheres = [];
	var loader = new THREE.JSONLoader(); // init the loader util
	var uniforms1;
	var sphere, lightMesh, pointLight;
	
	var onMaterial, offMaterial;


	var directionalLight, pointLight;

	var mouseX = 0, mouseY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );

	// the first one will be the default, the rest for each object
	var skyboxDirectories = [
		'NeoShade',
		'GlobeW',
		'DeathStar',
		'Vulcan',
		'Starz',
		'Xiix',
		'Cube',
		'LineCave',
		'MindHelix'
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
		new buzz.sound( '/sounds/10_Razor.mp3'),
		new buzz.sound( '/sounds/13_Venom.mp3'),
		new buzz.sound( '/sounds/04_Goathead.mp3'),
		new buzz.sound( '/sounds/05_Magic.mp3'),
		new buzz.sound( '/sounds/06_Skinny.mp3'),
		new buzz.sound( '/sounds/01_Tyson.mp3'),
		new buzz.sound( '/sounds/08_Ancient.mp3'),
		new buzz.sound( '/sounds/09_Signals.mp3'),
		new buzz.sound( '/sounds/12_Sleep.mp3')
	];
	

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
	function createMusicOrb(geometry, material, object, sound, texture, x, y, z, id){
	    loader.load('objects/' + object, function (geometry) {
	        // create a new material
	        // var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } )

	        

	        // FOR TESTING NEW MATERIALS
	        // material = materials[10];

	        // create a mesh with models geometry and material
			var material = new THREE.MeshLambertMaterial( { color: 0xff6600, ambient: 0x993300, envMap: skyMaterials[0], combine: THREE.MixOperation, reflectivity: 0.3 } );
	        
			var material = new THREE.MeshLambertMaterial( { color: 0xccaaaa, ambient: 0xffffff, envMap: skyMaterials[3], refractionRatio: 0.95, combine: THREE.Multiply, reflectivity: .75 } );
	        var mesh = new THREE.Mesh(
	            geometry,
	            material
	        );

	        mesh.scale.x = mesh.scale.y = mesh.scale.z = 22;

			mesh.position.x = x;
			mesh.position.y = y;
			mesh.position.z = z;

			mesh.active = false;
			mesh.stableScale = mesh.scale.x;
			mesh.sound = sound;
			mesh.soundTexture = texture;
			mesh.orbID = id;
			mesh.sound.bind('ended', function(e) {
				mesh.active = false;
				playOrb(mesh.orbID);
			});


			scene.add( mesh );
			spheres.push( mesh );
	    });
	}

	function playOrb(orbID){
		var obj;
		console.log('PLAY ORB');
		console.log(orbID);
		if(orbID === spheres.length){
			// play the first song
			obj = spheres[0]
		}else{
			// play the last song
			obj = spheres[orbID+1]
		}
		console.log(obj)
		obj.sound.play();
		obj.active = true;
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

		mouse = new THREE.Vector2();

		// bind event listeners to end of song
		for(var i = 0; i < soundsObjs.length; i++){
			soundsObjs[i].bind('ended', function(e) {
				
			});
		}



		uniforms1 = {
			time: { type: "f", value: 1.0 },
			resolution: { type: "v2", value: new THREE.Vector2() }
		};







		var texture = new THREE.Texture( generateTexture() );
		texture.needsUpdate = true;




		// SET UP SCENE, CAMERA, LIGHTS
		////////////////////

	    container = document.createElement( 'div' );
	    document.body.appendChild( container );

	    camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 100000 );
	    camera.position.z = -25000;

	    cameraCube = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 100000 );

	    scene = new THREE.Scene();
	    sceneCube = new THREE.Scene();
	    projector = new THREE.Projector();
			    
	    var hemiLight1 = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );

	    hemiLight1.color.setHSL( 0.6, 1, 0.6 );
	    hemiLight1.groundColor.setHSL( .01, 0, 0.2 );
	    hemiLight1.position.set( 0, 500, 0 );
	    scene.add( hemiLight1 );


	    // add a circulating light
	    pointLight = new THREE.PointLight( 0xff0000, 1 );
		scene.add( pointLight );
		sphere = new THREE.SphereGeometry( 10000, 16, 8 );
		lightMesh = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
		lightMesh.position = pointLight.position;
		lightMesh.scale.x = lightMesh.scale.y = lightMesh.scale.z = 0.05;
		// console.log(lightMesh);
		// scene.add( lightMesh );  // visualize the light
	    ////////////////////



	    // START UP ALL OF THE SKY MATERIALS
	    ////////////////////
	    var count = 0;
	    for(var i = 0; i < skyboxDirectories.length; i++){
			var urls = getSkyboxImageArray(skyboxDirectories[i]);
	    	var textureCube = THREE.ImageUtils.loadTextureCube( urls, new THREE.CubeRefractionMapping(), function(){
	    		count++;

	    		if ( skyboxDirectories.length === count ) {
	    			buzz.defaults.preload = 'auto';
	    		}
	    	} );
	    	var material = new THREE.MeshBasicMaterial( { color: 0xeeeeee, envMap: textureCube, refractionRatio: 0.99 } );
	    	// var material = new THREE.MeshBasicMaterial( { color: 0xaaaaff, envMap: textureCube } );
	    	// var material = new THREE.MeshLambertMaterial( { color: 0xffffff, emissive: 0x0000ff, shading: THREE.FlatShading } );
	    	skyMaterials.push({material: material, textureCube: textureCube});
	    }

	    ////////////////////



	    // CREATE THE SKYBOX MATERIAL AND CUBE
	    ////////////////////

	    var geometry = new THREE.SphereGeometry( 800, 4, 4 );
	    var material = skyMaterials[currentBackground]['material'];
	    
	    ////////////////////

		onMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, ambient: 0xff8585, envMap: skyMaterials[3], combine: THREE.Multiply, reflectivity: 0 } );
		offMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, ambient: 0xffffff, envMap: skyMaterials[3], refractionRatio: 1, combine: THREE.Multiply, reflectivity: .6 } );

	    // CREATE MUSIC ORBS
	    //////////////////// (+left - right) (+up -down) (+back - forward)

		createMusicOrb(geometry, material, sphereObjects[0], soundsObjs[0], skyMaterials[0], -7000, -23000, 30000, 1);
		createMusicOrb(geometry, material, sphereObjects[1], soundsObjs[1], skyMaterials[1], -15000, 10000, 5000, 2);
		createMusicOrb(geometry, material, sphereObjects[2], soundsObjs[2], skyMaterials[2], 28000, -5000, 11000, 3);
		createMusicOrb(geometry, material, sphereObjects[3], soundsObjs[3], skyMaterials[3], 9000, -10000, -3500, 4);
		createMusicOrb(geometry, material, sphereObjects[4], soundsObjs[4], skyMaterials[4], 15000, 12000, 5000, 5);
		createMusicOrb(geometry, material, sphereObjects[5], soundsObjs[5], skyMaterials[5], -12000, 27000, 38000, 6);
		createMusicOrb(geometry, material, sphereObjects[6], soundsObjs[6], skyMaterials[6], -12000, -6000, -7000, 7);
		createMusicOrb(geometry, material, sphereObjects[7], soundsObjs[7], skyMaterials[7], 28000, -8000, 48000, 8);
		createMusicOrb(geometry, material, sphereObjects[6], soundsObjs[8], skyMaterials[8], -31000, 3000, 29000, 9);

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

	    renderer = new THREE.WebGLRenderer({ antialiasing: false });
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
	        var material = new THREE.MeshBasicMaterial( { color: 0x666666, envMap: skyMaterials[0], refractionRatio: 0.99 } );
	        var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0xff0000, shininess: 50, shading: THREE.FlatShading } )
			var material = new THREE.MeshLambertMaterial( { color: 0xffffff, ambient: 0xaaaaaa, envMap: skyMaterials[0] } )
			var material = new THREE.MeshLambertMaterial( { color: 0xff0000, ambient: 0xffffff, envMap: skyMaterials[3], refractionRatio: 0.95 } );
			//var material = new THREE.MeshLambertMaterial( { color: 0xff6600, ambient: 0x993300, envMap: skyMaterials[0], combine: THREE.MixOperation, reflectivity: 0.3 } );
	        var material = offMaterial;
	        // create a mesh with models geometry and material
	        var mesh = new THREE.Mesh(
	            geometry,
	            material
	        );

	        centralBeacon = mesh;
	        centralBeacon.scale.x = centralBeacon.scale.y = centralBeacon.scale.z = 38;

	        scene.add(centralBeacon);
	    });



	    // on window resize
		window.addEventListener( 'resize', onWindowResize, false );
		

	}




	var orbFluxAmount = 0.6;
	function render() {
	    var timer = 0.001 * Date.now();
	    
	    // move the light around the scene
		lightMesh.position.x = 20000 * Math.cos( timer );
		lightMesh.position.z = 20000 * Math.sin( timer );

	    if(centralBeacon !== undefined){
		    centralBeacon.position.y = -7000
		    centralBeacon.position.x = -1000
		    centralBeacon.position.z = 10000
		    centralBeacon.rotation.y += .005
		    centralBeacon.rotation.x += .000;
	    }
	    for(var i = 0; i < spheres.length; i++){
	    	if(spheres[i].active){
	    		spheres[i].scale.x = spheres[i].stableScale + (Math.cos(timer*3) / orbFluxAmount);
	    		spheres[i].scale.y = spheres[i].stableScale + (Math.cos(timer*3) / orbFluxAmount);
	    		spheres[i].scale.z = spheres[i].stableScale + (Math.cos(timer*3) / orbFluxAmount);

	    		// ANDREW, CHANGE THE NUMBER AFTER THE TIMER TO SLOD AND SPEED UP
	    		var mathTest = Math.cos(timer*3);

	    		spheres[i].material.color.r = (Math.cos(timer*3) + 1)/4 + .5;
	    		// spheres[i].material.color.g = Math.cos(timer);
	    	}
	    	if (spheres[i].hover && !spheres[i].active) {
	    		spheres[i].scale.x = spheres[i].stableScale + (Math.cos(timer*6) / orbFluxAmount*2);
	    		spheres[i].scale.y = spheres[i].stableScale + (Math.cos(timer*6) / orbFluxAmount*2);
	    		spheres[i].scale.z = spheres[i].stableScale + (Math.cos(timer*6) / orbFluxAmount*2);
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
				spheres[i].material = offMaterial;
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

			obj.material = onMaterial;
		}
	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function onDocumentMouseMove(event) {

		event.preventDefault();

		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );

		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( spheres );

		if ( intersects.length > 0 ) {
			console.log('here');
			// intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
			var obj = intersects[ 0 ].object

			obj.scale.x = obj.stableScale + 20;

		    for(var i = 0; i < spheres.length; i++){
		    	if(spheres[i].hover){
		    		spheres[i].hover = false;
		    	}
		    }
		    obj.hover = true;
		}

	    mouseX = ( event.clientX - windowHalfX ) * 22;
	    mouseY = -( event.clientY - windowHalfY ) * 22;

	}

	function animate() {

	    requestAnimationFrame( animate );
	    render();

	}

  });

