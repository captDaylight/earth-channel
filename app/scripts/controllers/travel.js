'use strict';

angular.module('champagneRocksApp')
  .controller('TravelCtrl', function ($scope, $http) {
console.log('travel controller');	
	var camera, scene, renderer;
	var geometry, material, mesh, group;
	var ground;

	init();
	animate();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	var xPos = 0;

	function init() {

	    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	    camera.position.z = 500;

	    scene = new THREE.Scene();

	    group = new THREE.Object3D();
	    group.position.y = -100;
	    scene.add( group );


	    // add ground
	    var groundMaterial = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } )
		ground = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000, 50, 50 ), groundMaterial );
		ground.position.y = -750;
		ground.rotation.x = -1.5;
		// mesh.position.z = -2000;
		scene.add( ground );

	    renderer = new THREE.CanvasRenderer();
	    renderer.setClearColor( 0x666666 );
	    renderer.setSize(window.innerWidth, window.innerHeight);

	    document.body.appendChild(renderer.domElement);
	    console.log(scene.__objectsAdded[1]);

	}

	function addShape( shape, color, x, y, z, rx, ry, rz, s ) {

	    // // flat shape

	    // var geometry = new THREE.ShapeGeometry( shape );
	    // var material = new THREE.MeshBasicMaterial( { color: color, overdraw: true } );

	    // var mesh = new THREE.Mesh( geometry, material );
	    // mesh.position.set( x, y, z );
	    // mesh.rotation.set( rx, ry, rz );
	    // mesh.scale.set( s, s, s );
	    // group.add( mesh );

	    // // line

	    var geometry = shape.createPointsGeometry();
	    var material = new THREE.LineBasicMaterial( { linewidth:2, color: color, transparent: true } );

	    var line = new THREE.Line( geometry, material );
	    line.position.set( x, y, z );
	    line.rotation.set( rx, ry, rz );
	    line.scale.set( s, s, s );
	    // group.add( line );
	    scene.add(line);
	}

	var xPos = 0;
	var radius = 300;
	var rotation = 0;

	var mouseX = 0;
	var mouseY = 0;

	function animate() {
	    var timer = 0.005 * Date.now();

	    //removing objects from the scene, to lighten the load
	  	if(scene.__objectsAdded.length > 200 ){
	  		// 3 signifies not to delete the base objects like ground plane
	  		scene.remove(scene.__objectsAdded[3]);
	  	}

	    function componentToHex(c) {
	        var hex = c.toString(16);
	        return hex.length == 1 ? "0" + hex : hex;
	    }

	    function rgbToHex(r, g, b) {
	        return componentToHex(r) + componentToHex(g) + componentToHex(b);
	    }

	    // var circleRadius = 100 + (Math.cos(timer) * 20);

	    var material = new THREE.MeshBasicMaterial({
	        color: new THREE.Color( Math.cos(timer), Math.sin(timer), -Math.sin(timer) )
	    });



				// Rectangle

		var rectLength = 200, rectWidth = 200;

		var rectShape = new THREE.Shape();
		rectShape.moveTo( 0,0 );
		rectShape.lineTo( 0, rectWidth );
		rectShape.lineTo( rectLength + (Math.cos(timer) * 100), rectWidth + (Math.cos(timer) * 100) );
		rectShape.lineTo( rectLength, 0 );
		rectShape.lineTo( 0, 0 );

		var color = new THREE.Color( Math.cos(timer), 1, 1 )
		
		// addShape( rectShape, 0x005500, -150, 150, 0, 0, 0, 0, 1 );
		addShape( rectShape, color, mouseX, mouseY, xPos*10, 0, 0, 0, 1 );

	    // // create triangle from circle generator
	    // var segments = 20;

	    // var circleGeometry = new THREE.CircleGeometry( radius + (Math.cos(timer) * 100), segments );              
	    // var circle = new THREE.Mesh( circleGeometry, material );

	    // circle.position.x = mouseX;
	    // circle.position.y = mouseY;
	    // circle.position.z = xPos*10;
	    // circle.rotation.z = rotation;
	    // rotation += .1;
	    // xPos += 1;
	    // scene.add( circle );

	    rotation += .05;
		xPos += 1;
		// ground.rotation.y = rotation

	    // note: three.js includes requestAnimationFrame shim
	    requestAnimationFrame(animate);

	    // mesh.rotation.x += 0.01;
	    // mesh.rotation.y += 0.02;

	    renderer.render(scene, camera);
	    camera.position.z += 10;

	}

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	function onDocumentMouseMove(event) {
	    
	    mouseX = ( event.clientX - windowHalfX );

	    // console.log(mouseX);

	    mouseY = - ( event.clientY - windowHalfY );

	}
  });
