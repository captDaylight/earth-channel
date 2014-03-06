'use strict';

angular.module('champagneRocksApp')
  .controller('RecordCtrl', function ($scope, $http) {

  	// remove any previous canvases
  	$('canvas').remove();

  	$scope.about = 'We are trying to create a visualization of mommy blogs. In our opinion these blogs are the cultural vanguard of cultural innovation.';
  	$scope.title = 'Space Time'
  	$scope.previous = '/cover';
  	$scope.next = '/travel'


	var container;
	buzz.defaults.preload = 'auto';
	var camera, projector, scene, renderer;
	var cameraCube, sceneCube;

	var mesh, lightMesh, geometry, phone;
	var spheres = [];
	    var loader = new THREE.JSONLoader(); // init the loader util


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
		'MapProof',
		'Sander',
		'night_sky'
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


	function createMusicOrb(geometry, material, object, sound, texture, x, y, z){
	    loader.load('objects/' + object, function (geometry) {
	        // create a new material
	        // var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } )

	        // create a mesh with models geometry and material
	        var mesh = new THREE.Mesh(
	            geometry,
	            material
	        );

	        mesh.scale.x = mesh.scale.y = mesh.scale.z = 5;

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



	function init() {

		// SET UP SCENE, CAMERA, LIGHTS
		////////////////////

	    container = document.createElement( 'div' );
	    document.body.appendChild( container );

	    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
	    camera.position.z = -5000;

	    cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );

	    scene = new THREE.Scene();
	    sceneCube = new THREE.Scene();
	    projector = new THREE.Projector();

	    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );

	    hemiLight.color.setHSL( 0.6, 1, 0.6 );
	    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	    hemiLight.position.set( 0, 500, 0 );
	    scene.add( hemiLight );

	    ////////////////////



	    // START UP ALL OF THE SKY MATERIALS
	    ////////////////////

	    for(var i = 0; i < skyboxDirectories.length; i++){
			var urls = getSkyboxImageArray(skyboxDirectories[i]);
	    	var textureCube = THREE.ImageUtils.loadTextureCube( urls, new THREE.CubeRefractionMapping() );
	    	var material = new THREE.MeshBasicMaterial( { color: 0xeeeeee, envMap: textureCube, refractionRatio: 0.99 } );
	    	skyMaterials.push({material: material, textureCube: textureCube});
	    }

	    ////////////////////



	    // CREATE THE SKYBOX MATERIAL AND CUBE
	    ////////////////////

	    var geometry = new THREE.SphereGeometry( 800, 4, 4 );
	    var material = skyMaterials[currentBackground]['material'];
	    
	    ////////////////////



	    // CREATE MUSIC ORBS
	    ////////////////////
	    
		createMusicOrb(geometry, material, sphereObjects[0], soundsObjs[0], skyMaterials[1], 1000, 1000, 1000);
		createMusicOrb(geometry, material, sphereObjects[1], soundsObjs[1], skyMaterials[2], 2000, 5000, 5000);
		createMusicOrb(geometry, material, sphereObjects[2], soundsObjs[2], skyMaterials[3], -2000, -2000, -2000);
		createMusicOrb(geometry, material, sphereObjects[3], soundsObjs[3], skyMaterials[4], 5000, 5000, 6000);
		createMusicOrb(geometry, material, sphereObjects[4], soundsObjs[3], skyMaterials[4], 7000, 5000, 7000);
		createMusicOrb(geometry, material, sphereObjects[5], soundsObjs[3], skyMaterials[4], 5000, 8000, 5000);

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
	    loader.load('objects/Rec_CO_0304_03.js', function (geometry) {
	        // create a new material

	        // this is the same as the other objects
	        // var material = new THREE.MeshBasicMaterial( { color: 0x666666, envMap: textureCube, refractionRatio: 0.99 } );
	        var material = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } )

	        // create a mesh with models geometry and material
	        var mesh = new THREE.Mesh(
	            geometry,
	            material
	        );
	        phone = mesh;
	        phone.scale.x = phone.scale.y = phone.scale.z = 5;

	        scene.add(phone);
	    });

	    ////////////////////

	}


	function onDocumentMouseMove(event) {

	    mouseX = ( event.clientX - windowHalfX ) * 10;
	    mouseY = -( event.clientY - windowHalfY ) * 10;

	}

	

	function animate() {

	    requestAnimationFrame( animate );

	    render();

	}



	var orbFluxAmount = 1;
	function render() {
	    var timer = 0.001 * Date.now();

	    if(phone !== undefined){
		    phone.position.y = 1000 * Math.cos(timer);
		    phone.rotation.y += .01;
		    phone.rotation.x += .01;
	    }
	    for(var i = 0; i < spheres.length; i++){
	    	if(spheres[i].active){
	    		spheres[i].scale.x = spheres[i].stableScale + (Math.cos(timer*3) / orbFluxAmount);
	    		spheres[i].scale.y = spheres[i].stableScale + (Math.cos(timer*3) / orbFluxAmount);
	    		spheres[i].scale.z = spheres[i].stableScale + (Math.cos(timer*3) / orbFluxAmount);
	    	}

	    }

	    camera.position.x += ( mouseX - camera.position.x ) * .05;
	    camera.position.y += ( - mouseY - camera.position.y ) * .05;

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


  });
