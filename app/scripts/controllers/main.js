'use strict';

angular.module('champagneRocksApp')
  .controller('MainCtrl', function ($scope, $http) {
    // $http.get('/api/awesomeThings').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;


    // });
    
    // var scene = new THREE.Scene();
    console.log(scene);






/**
 * @author renej
 * NURBS curve object
 *
 * Derives from Curve, overriding getPoint and getTangent.
 *
 * Implementation is based on (x, y [, z=0 [, w=1]]) control points with w=weight.
 *
 **/


/**************************************************************
 *  NURBS curve
 **************************************************************/

THREE.NURBSCurve = function ( degree, knots /* array of reals */, controlPoints /* array of Vector(2|3|4) */) {

    this.degree = degree;
    this.knots = knots;
    this.controlPoints = [];
    for (var i = 0; i < controlPoints.length; ++i) { // ensure Vector4 for control points
        var point = controlPoints[i];
        this.controlPoints[i] = new THREE.Vector4(point.x, point.y, point.z, point.w);
    }

};


THREE.NURBSCurve.prototype = Object.create( THREE.Curve.prototype );


THREE.NURBSCurve.prototype.getPoint = function ( t ) {

    var u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]); // linear mapping t->u

    // following results in (wx, wy, wz, w) homogeneous point
    var hpoint = THREE.NURBSUtils.calcBSplinePoint(this.degree, this.knots, this.controlPoints, u);

    if (hpoint.w != 1.0) { // project to 3D space: (wx, wy, wz, w) -> (x, y, z, 1)
        hpoint.divideScalar(hpoint.w);
    }

    return new THREE.Vector3(hpoint.x, hpoint.y, hpoint.z);
};


THREE.NURBSCurve.prototype.getTangent = function ( t ) {

    var u = this.knots[0] + t * (this.knots[this.knots.length - 1] - this.knots[0]);
    var ders = THREE.NURBSUtils.calcNURBSDerivatives(this.degree, this.knots, this.controlPoints, u, 1);
    var tangent = ders[1].clone();
    tangent.normalize();

    return tangent;
};

/**
 * @author renej
 * NURBS utils
 *
 * See NURBSCurve and NURBSSurface.
 *
 **/


/**************************************************************
 *  NURBS Utils
 **************************************************************/

THREE.NURBSUtils = {

    /*
    Finds knot vector span.

    p : degree
    u : parametric value
    U : knot vector
    
    returns the span
    */
    findSpan: function( p,  u,  U ) {
        var n = U.length - p - 1;

        if (u >= U[n]) {
            return n - 1;
        }

        if (u <= U[p]) {
            return p;
        }

        var low = p;
        var high = n;
        var mid = Math.floor((low + high) / 2);

        while (u < U[mid] || u >= U[mid + 1]) {
          
            if (u < U[mid]) {
                high = mid;
            } else {
                low = mid;
            }

            mid = Math.floor((low + high) / 2);
        }

        return mid;
    },
    
        
    /*
    Calculate basis functions. See The NURBS Book, page 70, algorithm A2.2
   
    span : span in which u lies
    u    : parametric point
    p    : degree
    U    : knot vector
    
    returns array[p+1] with basis functions values.
    */
    calcBasisFunctions: function( span, u, p, U ) {
        var N = [];
        var left = [];
        var right = [];
        N[0] = 1.0;

        for (var j = 1; j <= p; ++j) {
       
            left[j] = u - U[span + 1 - j];
            right[j] = U[span + j] - u;

            var saved = 0.0;

            for (var r = 0; r < j; ++r) {

                var rv = right[r + 1];
                var lv = left[j - r];
                var temp = N[r] / (rv + lv);
                N[r] = saved + rv * temp;
                saved = lv * temp;
             }

             N[j] = saved;
         }

         return N;
    },


    /*
    Calculate B-Spline curve points. See The NURBS Book, page 82, algorithm A3.1.
 
    p : degree of B-Spline
    U : knot vector
    P : control points (x, y, z, w)
    u : parametric point

    returns point for given u
    */
    calcBSplinePoint: function( p, U, P, u ) {
        var span = this.findSpan(p, u, U);
        var N = this.calcBasisFunctions(span, u, p, U);
        var C = new THREE.Vector4(0, 0, 0, 0);

        for (var j = 0; j <= p; ++j) {
            var point = P[span - p + j];
            var Nj = N[j];
            var wNj = point.w * Nj;
            C.x += point.x * wNj;
            C.y += point.y * wNj;
            C.z += point.z * wNj;
            C.w += point.w * Nj;
        }

        return C;
    },


    /*
    Calculate basis functions derivatives. See The NURBS Book, page 72, algorithm A2.3.

    span : span in which u lies
    u    : parametric point
    p    : degree
    n    : number of derivatives to calculate
    U    : knot vector

    returns array[n+1][p+1] with basis functions derivatives
    */
    calcBasisFunctionDerivatives: function( span,  u,  p,  n,  U ) {

        var zeroArr = [];
        for (var i = 0; i <= p; ++i)
            zeroArr[i] = 0.0;

        var ders = [];
        for (var i = 0; i <= n; ++i)
            ders[i] = zeroArr.slice(0);

        var ndu = [];
        for (var i = 0; i <= p; ++i)
            ndu[i] = zeroArr.slice(0);

        ndu[0][0] = 1.0;

        var left = zeroArr.slice(0);
        var right = zeroArr.slice(0);

        for (var j = 1; j <= p; ++j) {
            left[j] = u - U[span + 1 - j];
            right[j] = U[span + j] - u;

            var saved = 0.0;

            for (var r = 0; r < j; ++r) {
                var rv = right[r + 1];
                var lv = left[j - r];
                ndu[j][r] = rv + lv;

                var temp = ndu[r][j - 1] / ndu[j][r];
                ndu[r][j] = saved + rv * temp;
                saved = lv * temp;
            }

            ndu[j][j] = saved;
        }

        for (var j = 0; j <= p; ++j) {
            ders[0][j] = ndu[j][p];
        }

        for (var r = 0; r <= p; ++r) {
            var s1 = 0;
            var s2 = 1;

            var a = [];
            for (var i = 0; i <= p; ++i) {
                a[i] = zeroArr.slice(0);
            }
            a[0][0] = 1.0;

            for (var k = 1; k <= n; ++k) {
                var d = 0.0;
                var rk = r - k;
                var pk = p - k;

                if (r >= k) {
                    a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
                    d = a[s2][0] * ndu[rk][pk];
                }

                var j1 = (rk >= -1) ? 1 : -rk;
                var j2 = (r - 1 <= pk) ? k - 1 :  p - r;

                for (var j = j1; j <= j2; ++j) {
                    a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j];
                    d += a[s2][j] * ndu[rk + j][pk];
                }

                if (r <= pk) {
                    a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r];
                    d += a[s2][k] * ndu[r][pk];
                }

                ders[k][r] = d;

                var j = s1;
                s1 = s2;
                s2 = j;
            }
        }

        var r = p;

        for (var k = 1; k <= n; ++k) {
            for (var j = 0; j <= p; ++j) {
                ders[k][j] *= r;
            }
            r *= p - k;
        }

        return ders;
    },


    /*
    Calculate derivatives of a B-Spline. See The NURBS Book, page 93, algorithm A3.2.

    p  : degree
    U  : knot vector
    P  : control points
    u  : Parametric points
    nd : number of derivatives

    returns array[d+1] with derivatives
    */
    calcBSplineDerivatives: function( p,  U,  P,  u,  nd ) {
        var du = nd < p ? nd : p;
        var CK = [];
        var span = this.findSpan(p, u, U);
        var nders = this.calcBasisFunctionDerivatives(span, u, p, du, U);
        var Pw = [];

        for (var i = 0; i < P.length; ++i) {
            var point = P[i].clone();
            var w = point.w;

            point.x *= w;
            point.y *= w;
            point.z *= w;

            Pw[i] = point;
        }
        for (var k = 0; k <= du; ++k) {
            var point = Pw[span - p].clone().multiplyScalar(nders[k][0]);

            for (var j = 1; j <= p; ++j) {
                point.add(Pw[span - p + j].clone().multiplyScalar(nders[k][j]));
            }

            CK[k] = point;
        }

        for (var k = du + 1; k <= nd + 1; ++k) {
            CK[k] = new THREE.Vector4(0, 0, 0);
        }

        return CK;
    },


    /*
    Calculate "K over I"

    returns k!/(i!(k-i)!)
    */
    calcKoverI: function( k, i ) {
        var nom = 1;

        for (var j = 2; j <= k; ++j) {
            nom *= j;
        }

        var denom = 1;

        for (var j = 2; j <= i; ++j) {
            denom *= j;
        }

        for (var j = 2; j <= k - i; ++j) {
            denom *= j;
        }

        return nom / denom;
    },


    /*
    Calculate derivatives (0-nd) of rational curve. See The NURBS Book, page 127, algorithm A4.2.

    Pders : result of function calcBSplineDerivatives

    returns array with derivatives for rational curve.
    */
    calcRationalCurveDerivatives: function ( Pders ) {
        var nd = Pders.length;
        var Aders = [];
        var wders = [];

        for (var i = 0; i < nd; ++i) {
            var point = Pders[i];
            Aders[i] = new THREE.Vector3(point.x, point.y, point.z);
            wders[i] = point.w;
        }

        var CK = [];

        for (var k = 0; k < nd; ++k) {
            var v = Aders[k].clone();

            for (var i = 1; i <= k; ++i) {
                v.sub(CK[k - i].clone().multiplyScalar(this.calcKoverI(k,i) * wders[i]));
            }

            CK[k] = v.divideScalar(wders[0]);
        }

        return CK;
    },


    /*
    Calculate NURBS curve derivatives. See The NURBS Book, page 127, algorithm A4.2.

    p  : degree
    U  : knot vector
    P  : control points in homogeneous space
    u  : parametric points
    nd : number of derivatives

    returns array with derivatives.
    */
    calcNURBSDerivatives: function( p,  U,  P,  u,  nd ) {
        var Pders = this.calcBSplineDerivatives(p, U, P, u, nd);
        return this.calcRationalCurveDerivatives(Pders);
    },


    /*
    Calculate rational B-Spline surface point. See The NURBS Book, page 134, algorithm A4.3.
 
    p1, p2 : degrees of B-Spline surface
    U1, U2 : knot vectors
    P      : control points (x, y, z, w)
    u, v   : parametric values

    returns point for given (u, v)
    */
    calcSurfacePoint: function( p, q, U, V, P, u, v ) {
        var uspan = this.findSpan(p, u, U);
        var vspan = this.findSpan(q, v, V);
        var Nu = this.calcBasisFunctions(uspan, u, p, U);
        var Nv = this.calcBasisFunctions(vspan, v, q, V);
        var temp = [];

        for (var l = 0; l <= q; ++l) {
            temp[l] = new THREE.Vector4(0, 0, 0, 0);
            for (var k = 0; k <= p; ++k) {
                var point = P[uspan - p + k][vspan - q + l].clone();
                var w = point.w;
                point.x *= w;
                point.y *= w;
                point.z *= w;
                temp[l].add(point.multiplyScalar(Nu[k]));
            }
        }

        var Sw = new THREE.Vector4(0, 0, 0, 0);
        for (var l = 0; l <= q; ++l) {
            Sw.add(temp[l].multiplyScalar(Nv[l]));
        }

        Sw.divideScalar(Sw.w);
        return new THREE.Vector3(Sw.x, Sw.y, Sw.z);
    }

};














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

    // var nurbsControlPoints = [];
    // var nurbsKnots = [];
    // var nurbsDegree = 3;

    // for ( var i = 0; i <= nurbsDegree; i ++ ) {

    //     nurbsKnots.push( 0 );

    // }

    // for ( var i = 0, j = 5; i < j; i ++ ) {

    //     nurbsControlPoints.push(
    //         new THREE.Vector4(
    //             Math.random() * 400 - 200,
    //             Math.random() * 400,
    //             Math.random() * 400 - 200,
    //             1 // weight of control point: higher means stronger attraction
    //         )
    //     );

    //     var knot = ( i + 1 ) / ( j - nurbsDegree );
    //     nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );

    // }

    // var nurbsCurve = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, nurbsControlPoints);

    // var nurbsGeometry = new THREE.Geometry();
    // nurbsGeometry.vertices = nurbsCurve.getPoints( 200 );
    // var nurbsMaterial = new THREE.LineBasicMaterial( { linewidth: 10, color: 0x333333 } );

    // var nurbsLine = new THREE.Line( nurbsGeometry, nurbsMaterial );
    // nurbsLine.position.set( 0, -100, 0 );
    // group.add( nurbsLine );

    // var nurbsControlPointsGeometry = new THREE.Geometry();
    // nurbsControlPointsGeometry.vertices = nurbsCurve.controlPoints;
    // var nurbsControlPointsMaterial = new THREE.LineBasicMaterial( { linewidth: 2, color: 0x333333, opacity: 0.25 } );

    // var nurbsControlPointsLine = new THREE.Line( nurbsControlPointsGeometry, nurbsControlPointsMaterial );
    // nurbsControlPointsLine.position.copy( nurbsLine.position );
    // group.add( nurbsControlPointsLine );


    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}

function createNurbObject(){

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
    // xPos += 1;

    // addShape( shape, color, x, y, z, rx, ry,rz, s );
    // addShape( createCircle(timer), 0xffffff, xPos, 0, camera.position.z- 500, 0, 0, 0, 1 );


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
