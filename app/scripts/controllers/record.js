'use strict';

angular.module('champagneRocksApp')
  .controller('RecordCtrl', function ($scope, $http) {

		var container;

		var camera, scene, renderer;
		var cameraCube, sceneCube;

		var mesh, lightMesh, geometry, phone;
		var spheres = [];


		var directionalLight, pointLight;

		var mouseX = 0, mouseY = 0;

		var windowHalfX = window.innerWidth / 2;
		var windowHalfY = window.innerHeight / 2;

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		init();
		animate();

		function init() {

		    container = document.createElement( 'div' );
		    document.body.appendChild( container );

		    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
		    camera.position.z = -5000;

		    cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );

		    scene = new THREE.Scene();
		    sceneCube = new THREE.Scene();


		    // lights
		    console.log(THREE);
		    console.log('--');
		    console.log(THREE.HemisphereLight);
		    console.log('--');

		    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		    console.log(hemiLight);
		    hemiLight.color.setHSL( 0.6, 1, 0.6 );
		    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		    hemiLight.position.set( 0, 500, 0 );
		    scene.add( hemiLight );





		    var geometry = new THREE.SphereGeometry( 800, 4, 4 );

		    var path = 'imgages/skyboxes/';
		    var format = '.jpg';
		    var urls = [
		        path + 'px' + format, path + 'nx' + format,
		        path + 'py' + format, path + 'ny' + format,
		        path + 'pz' + format, path + 'nz' + format
		    ];

		    var textureCube = THREE.ImageUtils.loadTextureCube( urls, new THREE.CubeRefractionMapping() );
		    // var mirrorSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
		    var material = new THREE.MeshBasicMaterial( { color: 0xeeeeee, envMap: textureCube, refractionRatio: 0.99 } );
		    // var material = new THREE.MeshBasicMaterial( { envMap: mirrorSphereCamera.renderTarget } );
		    for ( var i = 0; i < 10; i ++ ) {

		        var mesh = new THREE.Mesh( geometry, material );


		        mesh.position.x = Math.random() * 8000 - 5000;
		        mesh.position.y = Math.random() * 8000 - 5000;
		        mesh.position.z = Math.random() * 12000 - 5000;

		        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 1 + 1;

		        scene.add( mesh );

		        spheres.push( mesh );

		    }

		    // Skybox

		    var shader = THREE.ShaderLib.cube;
		    shader.uniforms.tCube.value = textureCube;

		    var material = new THREE.ShaderMaterial( {

		        fragmentShader: shader.fragmentShader,
		        vertexShader: shader.vertexShader,
		        uniforms: shader.uniforms,
		        depthWrite: false,
		        side: THREE.BackSide

		    } ),

		    mesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material );
		    sceneCube.add( mesh );

		//     //

		    renderer = new THREE.WebGLRenderer();
		    renderer.setSize( window.innerWidth, window.innerHeight );
		    renderer.autoClear = false;
		    container.appendChild( renderer.domElement );

		//     //

		    window.addEventListener( 'resize', onWindowResize, false );



		    //LOAD THE OBJECT TO THE SCENE
		    var loader = new THREE.JSONLoader(); // init the loader util

		    // init loading
		    loader.load('obj/phone.js', function (geometry) {
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
		        console.log(mesh);
		        phone.scale.x = phone.scale.y = phone.scale.z = Math.random() * 10 + 1;

		        scene.add(phone);
		    });

		}

		function onWindowResize() {

		    windowHalfX = window.innerWidth / 2,
		    windowHalfY = window.innerHeight / 2,

		    camera.aspect = window.innerWidth / window.innerHeight;
		    camera.updateProjectionMatrix();

		    cameraCube.aspect = window.innerWidth / window.innerHeight;
		    cameraCube.updateProjectionMatrix();

		    renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function onDocumentMouseMove(event) {

		    mouseX = ( event.clientX - windowHalfX ) * 10;
		    mouseY = ( event.clientY - windowHalfY ) * 10;

		}

		// //

		function animate() {

		    requestAnimationFrame( animate );

		    render();

		}

		function render() {

		    var timer = 0.001 * Date.now();



		    // for ( var i = 0, il = spheres.length; i < il; i ++ ) {

		    //     var sphere = spheres[ i ];

		    //     sphere.position.x = 1000 * Math.cos( timer + i );
		    //     sphere.position.y = 1000 * Math.sin( timer + i );
		    //     sphere.position.z = 5000 * Math.sin( timer + i );

		    // }

		    phone.position.y = 1000 * Math.cos(timer);
		    phone.rotation.y += .01;
		    phone.rotation.x += .01;

		    camera.position.x += ( mouseX - camera.position.x ) * .05;
		    camera.position.y += ( - mouseY - camera.position.y ) * .05;

		    camera.lookAt( scene.position );
		    cameraCube.rotation.copy( camera.rotation );

		    renderer.render( sceneCube, cameraCube );
		    renderer.render( scene, camera );

		}
  });
