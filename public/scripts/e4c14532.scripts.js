"use strict";angular.module("champagneRocksApp",["ngCookies","ngResource","ngSanitize","ngRoute"]).config(["$routeProvider","$locationProvider",function(a,b){a.when("/",{templateUrl:"partials/main",controller:"MainCtrl"}).when("/interactive",{templateUrl:"partials/interactive",controller:"InteractiveCtrl"}).when("/cover",{templateUrl:"partials/cover",controller:"CoverCtrl"}).when("/travel",{templateUrl:"partials/travel",controller:"TravelCtrl"}).when("/record",{templateUrl:"partials/record",controller:"RecordCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0)}]),angular.module("champagneRocksApp").controller("MainCtrl",["$scope","$http",function(){console.log("main controller")}]),angular.module("champagneRocksApp").controller("NavbarCtrl",["$scope","$location",function(a,b){a.menu=[{title:"Home",link:"/"}],a.isActive=function(a){return a===b.path()}}]),angular.module("champagneRocksApp").controller("TravelCtrl",["$scope","$http",function(){function a(){d=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1e4),d.position.z=500,e=new THREE.Scene,g=new THREE.Object3D,g.position.y=-100,e.add(g),f=new THREE.CanvasRenderer,f.setClearColor(15790320),f.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(f.domElement)}function b(){var a=.001*Date.now(),c=new THREE.MeshBasicMaterial({color:new THREE.Color(Math.cos(a),Math.sin(a),-Math.sin(a))}),g=3,m=new THREE.CircleGeometry(i+20*Math.cos(a),g),n=new THREE.Mesh(m,c);n.position.x=k,n.position.y=l,n.position.z=10*h,n.rotation.z=j,j+=.1,h+=1,e.add(n),requestAnimationFrame(b),f.render(e,d),d.position.z+=10}function c(a){k=a.clientX-m,l=-(a.clientY-n)}console.log("travel controller");var d,e,f,g;a(),b(),document.addEventListener("mousemove",c,!1);var h=0,h=0,i=500,j=0,k=0,l=0,m=window.innerWidth/2,n=window.innerHeight/2}]),angular.module("champagneRocksApp").controller("RecordCtrl",["$scope","$http",function(){function a(){e=document.createElement("div"),document.body.appendChild(e),f=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,1e5),f.position.z=-5e3,i=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,1,1e5),g=new THREE.Scene,j=new THREE.Scene;var a=new THREE.HemisphereLight(16777215,16777215,.6);console.log(a),a.color.setHSL(.6,1,.6),a.groundColor.setHSL(.095,1,.75),a.position.set(0,500,0),g.add(a);var b=new THREE.SphereGeometry(800,4,4),c="images/skyboxes/",d=".jpg",m=[c+"px"+d,c+"nx"+d,c+"py"+d,c+"ny"+d,c+"pz"+d,c+"nz"+d],n=THREE.ImageUtils.loadTextureCube(m,new THREE.CubeRefractionMapping);console.log(n);for(var o=new THREE.MeshBasicMaterial({color:15658734,envMap:n,refractionRatio:.99}),p=0;10>p;p++){var q=new THREE.Mesh(b,o);q.position.x=8e3*Math.random()-5e3,q.position.y=8e3*Math.random()-5e3,q.position.z=12e3*Math.random()-5e3,q.scale.x=q.scale.y=q.scale.z=1*Math.random()+1,g.add(q),l.push(q)}var r=THREE.ShaderLib.cube;r.uniforms.tCube.value=n;var o=new THREE.ShaderMaterial({fragmentShader:r.fragmentShader,vertexShader:r.vertexShader,uniforms:r.uniforms,depthWrite:!1,side:THREE.BackSide});q=new THREE.Mesh(new THREE.BoxGeometry(100,100,100),o),j.add(q),h=new THREE.WebGLRenderer,h.setSize(window.innerWidth,window.innerHeight),h.autoClear=!1,e.appendChild(h.domElement);var s=new THREE.JSONLoader;s.load("objects/phone.js",function(a){var b=new THREE.MeshPhongMaterial({ambient:197379,color:14540253,specular:39168,shininess:30,shading:THREE.FlatShading}),c=new THREE.Mesh(a,b);k=c,console.log(c),k.scale.x=k.scale.y=k.scale.z=10*Math.random()+1,g.add(k)})}function b(a){m=10*(a.clientX-o),n=10*(a.clientY-p)}function c(){requestAnimationFrame(c),d()}function d(){.001*Date.now();f.position.x+=.05*(m-f.position.x),f.position.y+=.05*(-n-f.position.y),f.lookAt(g.position),i.rotation.copy(f.rotation),h.render(j,i),h.render(g,f)}console.log("record controller");var e,f,g,h,i,j,k,l=[],m=0,n=0,o=window.innerWidth/2,p=window.innerHeight/2;document.addEventListener("mousemove",b,!1),a(),c()}]),angular.module("champagneRocksApp").controller("CoverCtrl",["$scope","$http",function(){console.log("cover controller")}]);