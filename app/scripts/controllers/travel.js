'use strict';

angular.module('champagneRocksApp')
  .controller('TravelCtrl', function ($scope, $http) {
console.log('travel controller');	
	var camera, scene, renderer;
	var geometry, material, mesh, group;

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

	    renderer = new THREE.CanvasRenderer();
	    renderer.setClearColor( 0xf0f0f0 );
	    renderer.setSize(window.innerWidth, window.innerHeight);

	    document.body.appendChild(renderer.domElement);

	}

	function createCircle(timer){
	    
	    var circleRadius = 100 + (Math.cos(timer) * 20);
	    var circleShape = new THREE.Shape();
	    circleShape.moveTo( 0, circleRadius );
	    circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
	    circleShape.quadraticCurveTo( circleRadius, -circleRadius, 0, -circleRadius );
	    circleShape.quadraticCurveTo( -circleRadius, -circleRadius, -circleRadius, 0 );
	    circleShape.quadraticCurveTo( -circleRadius, circleRadius, 0, circleRadius );
	    return circleShape;
	}

	function addShape( shape, color, x, y, z, rx, ry, rz, s ) {

	    // // flat shape

	    var geometry = new THREE.ShapeGeometry( shape );
	    var material = new THREE.MeshBasicMaterial( { color: color, overdraw: true } );

	    var mesh = new THREE.Mesh( geometry, material );
	    mesh.position.set( x, y, z );
	    mesh.rotation.set( rx, ry, rz );
	    mesh.scale.set( s, s, s );
	    group.add( mesh );

	    // // line

	    var geometry = shape.createPointsGeometry();
	    var material = new THREE.LineBasicMaterial( { linewidth: 1, color: 0x333333, transparent: true } );

	    var line = new THREE.Line( geometry, material );
	    line.position.set( x, y, z );
	    line.rotation.set( rx, ry, rz );
	    line.scale.set( s, s, s );
	    group.add( line );

	}

	var xPos = 0;
	var radius = 500;
	var rotation = 0;

	var mouseX = 0;
	var mouseY = 0;

	function animate() {
	    var timer = 0.001 * Date.now();


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

	    var segments = 3;

	    var circleGeometry = new THREE.CircleGeometry( radius + (Math.cos(timer) * 20), segments );              
	    var circle = new THREE.Mesh( circleGeometry, material );

	    circle.position.x = mouseX;
	    circle.position.y = mouseY;
	    circle.position.z = xPos*10;
	    circle.rotation.z = rotation;
	    rotation += .1;
	    xPos += 1;
	    scene.add( circle );


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
