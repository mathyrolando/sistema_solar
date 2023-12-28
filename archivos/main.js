import * as THREE from 'three';

import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, controls, scene, renderer, effect;

let earth, moon, sun, mercury, venus, mars, jupiter, saturn, uranus, neptune;
let moonOrbit;
let rings, rings2;

const start = Date.now();
const sizesScale = 150000;
const sunSize = 2000;
const distancesScale = 200;

const aMercury = calculoA(47000000, 70000000, 696340);
const movMercury = calculoCentro(47000000,70000000, 696340);
const aVenus = calculoA(67700000, 107000000, 696340);
const movVenus = calculoCentro(67700000,107000000, 696340);
const aEarth = calculoA(147100000, 152100000, 696340);
const movEarth = calculoCentro(147100000,152100000, 696340);
const aMoon = calculoA(363104, 405696, 696340/109);
const movMoon = calculoCentro(363104,405696, 696340/109);
const aMars = calculoA(206000000, 249000000, 696340);
const movMars = calculoCentro(206000000,249000000, 696340);
const aJupiter = calculoA(741000000, 817000000, 696340);
const movJupiter = calculoCentro(741000000,817000000, 696340);
const aSaturn = calculoA(1400000000, 1500000000, 696340);
const movSaturn = calculoCentro(1400000000,1500000000, 696340);
const aUranus = calculoA(2735560000, 3006390000, 696340);
const movUranus = calculoCentro(2735560000,3006390000, 696340);
const aNeptune = calculoA(4459630000, 4536870000, 696340);
const movNeptune = calculoCentro(4459630000,4536870000, 696340);



init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000000 );
    camera.position.y = 7000;


    const path = 'archivos/texture/nebula-';
    const format = '.png';
    const urls = [
        path + 'xpos' + format, path + 'xneg' + format,
        path + 'ypos' + format, path + 'yneg' + format,
        path + 'zpos' + format, path + 'zneg' + format
    ];

    const textureCube = new THREE.CubeTextureLoader().load( urls );

    scene = new THREE.Scene();
    scene.background = textureCube;
    //scene.background = new THREE.Color( 0, 0, 0 );

    const ambientLight = new THREE.AmbientLight(0x404040, 3); // Luz ambiental grisácea
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff,3, 0, 0);
    pointLight.position.set(0,0,0)
    scene.add(pointLight);

    sistemaSolar();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    effect = new AsciiEffect( renderer, ' .,:;i1tfLCG08@', { invert: true } );
    effect.setSize( window.innerWidth, window.innerHeight );
    effect.domElement.style.color = 'white';
    effect.domElement.style.backgroundColor = 'black';

    controls = new OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;
    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize );

}

function sistemaSolar(){
    const sunGeo = new THREE.SphereGeometry(sunSize, 100, 50);
    const sunTex = new THREE.TextureLoader().load("archivos/texture/sun.jpg");
    const sunMat = new THREE.MeshPhongMaterial( {
        map: sunTex,
        flatShading: true,
        emissive: 0xff0000,
        emissiveIntensity: 1
    });

    sun = new THREE.Mesh(sunGeo,sunMat);
    sun.position.set(0,0,0)
    scene.add(sun);

    const sunLight1 = new THREE.SpotLight(0xffffff,5);
    sunLight1.position.set(0,sunSize*2,0);
    sunLight1.decay = 0;
    sunLight1.distance = sunSize*2;
    //sunLight1.angle = Math.PI/2;
    sunLight1.map = sunTex;
    scene.add(sunLight1);

    const sunLight2 = new THREE.SpotLight(0xffffff,5);
    sunLight2.position.set(0,-sunSize*2,0);
    sunLight2.decay = 0;
    sunLight2.distance = sunSize*2;
    //sunLight2.angle = Math.PI/2;
    scene.add(sunLight2);

    const sunLight3 = new THREE.SpotLight(0xffffff,5);
    sunLight3.position.set(sunSize*2,0,0);
    sunLight3.decay = 0;
    sunLight3.distance = sunSize*2;
    //sunLight3.angle = Math.PI/2;
    scene.add(sunLight3);

    const sunLight4 = new THREE.SpotLight(0xffffff,5);
    sunLight4.position.set(-sunSize*2,0,0);
    sunLight4.decay = 0;
    sunLight4.distance = sunSize*2;
    //sunLight4.angle = Math.PI/2;
    scene.add(sunLight4);

    const sunLight5 = new THREE.SpotLight(0xffffff,5);
    sunLight5.position.set(0,0,sunSize*2);
    sunLight5.decay = 0;
    sunLight5.distance = sunSize*2;
    //sunLight5.angle = Math.PI/2;
    scene.add(sunLight5);

    const sunLight6 = new THREE.SpotLight(0xffffff,5);
    sunLight6.position.set(0,0,-sunSize*2);
    sunLight6.decay = 0;
    sunLight6.distance = sunSize*2;
    //sunLight6.angle = Math.PI/2;
    scene.add(sunLight6);



    const mercuryGeo = new THREE.SphereGeometry( sizesScale/285, 200, 100 );
    const mercuryTex = new THREE.TextureLoader().load("archivos/texture/mercury.webp")
    const mercuryMat = new THREE.MeshPhongMaterial( { map: mercuryTex, flatShading: true } );
    mercury = new THREE.Mesh(mercuryGeo,mercuryMat);
    mercury.rotation.x = 0.03*Math.PI/180;

    scene.add( mercury );
    orbita(distancesScale, movMercury, aMercury);




    const venusGeo = new THREE.SphereGeometry( sizesScale/115, 200, 100 );
    const venusTex = new THREE.TextureLoader().load("archivos/texture/venus.jpg")
    const venusMat = new THREE.MeshPhongMaterial( { map: venusTex, flatShading: true } );
    venus = new THREE.Mesh(venusGeo,venusMat);
    venus.rotation.x = 2.64*Math.PI/180;

    scene.add( venus );
    orbita(distancesScale, movVenus, aVenus);

    const earthGeo = new THREE.SphereGeometry( sizesScale/109, 200, 100 );
    const earthTex = new THREE.TextureLoader().load("archivos/texture/earth.webp")
    const earthMat = new THREE.MeshPhongMaterial( { map: earthTex, flatShading: true } );
    earth = new THREE.Mesh(earthGeo,earthMat);
    earth.rotation.x = 23.44*Math.PI/180;

    scene.add( earth );
    orbita(distancesScale, movEarth, aEarth);


    const moonGeo = new THREE.SphereGeometry( sizesScale/401, 50, 25 );
    const moonTex = new THREE.TextureLoader().load("archivos/texture/moon.jpg")
    const moonMat = new THREE.MeshPhongMaterial( {map: moonTex, flatShading: true } );
    moon = new THREE.Mesh(moonGeo, moonMat);
    moon.rotation.x = 6.68*Math.PI/180;
    scene.add(moon);


    const aMoon = calculoA(363104, 405696, 696340/109);
    const movMoon = calculoCentro(363104,405696, 696340/109);
    moonOrbit = orbita(distancesScale, movMoon, aMoon);


    const marsGeo = new THREE.SphereGeometry( sizesScale/205, 200, 100 );
    const marsTex = new THREE.TextureLoader().load("archivos/texture/mars.jpg")
    const marsMat = new THREE.MeshPhongMaterial( { map: marsTex, flatShading: true } );
    mars = new THREE.Mesh(marsGeo,marsMat);
    mars.rotation.x = 25.19*Math.PI/180;

    scene.add( mars );
    orbita(distancesScale, movMars, aMars);

    const jupiterGeo = new THREE.SphereGeometry( sizesScale/10, 200, 100 );
    const jupiterTex = new THREE.TextureLoader().load("archivos/texture/jupiter.jpg")
    const jupiterMat = new THREE.MeshPhongMaterial( { map: jupiterTex, flatShading: true } );
    jupiter = new THREE.Mesh(jupiterGeo,jupiterMat);
    jupiter.rotation.x = 3.13*Math.PI/180;

    scene.add( jupiter );
    orbita(distancesScale, movJupiter, aJupiter);

    const saturnGeo = new THREE.SphereGeometry( sizesScale/12, 200, 100 );
    const saturnTex = new THREE.TextureLoader().load("archivos/texture/saturn.jpg")
    const saturnMat = new THREE.MeshPhongMaterial( { map: saturnTex, flatShading: true } );
    saturn = new THREE.Mesh(saturnGeo,saturnMat);
    saturn.rotation.x = 26.73*Math.PI/180;

    scene.add( saturn );
    orbita(distancesScale, movSaturn, aSaturn);

    const ringsGeo = new THREE.RingGeometry(sizesScale/10,sizesScale/4.93858,64);
    const ringsTex = new THREE.TextureLoader().load("archivos/texture/rings.jpg")

    const pos = ringsGeo.attributes.position;
    const uv = ringsGeo.attributes.uv;

    const center = new THREE.Vector3(); // Centro de la geometría

    for (let i = 0; i < pos.count; i++) {
        // Obtiene el vector de posición
        const v3 = new THREE.Vector3().fromBufferAttribute(pos, i);

        // Calcula la longitud normalizada para ajustar las coordenadas UV
        const lengthNormalized = v3.clone().sub(center).length() / 30000;

        // Asigna las coordenadas UV normalizadas
        uv.setXY(i, lengthNormalized, 1);
    }

    const ringsMat = new THREE.MeshPhongMaterial( { map: ringsTex, flatShading: true, side: THREE.DoubleSide } );

    rings = new THREE.Mesh( ringsGeo, ringsMat);
    rings.rotation.x = Math.PI/2 + 26.73*Math.PI/180;
    scene.add(rings);


    const uranusGeo = new THREE.SphereGeometry( sizesScale/27, 200, 100 );
    const uranusTex = new THREE.TextureLoader().load("archivos/texture/uranus.webp");
    const uranusMat = new THREE.MeshPhongMaterial( { map: uranusTex, flatShading: true } );
    uranus = new THREE.Mesh(uranusGeo,uranusMat);
    uranus.rotation.x = 82.23*Math.PI/180;

    scene.add( uranus );
    orbita(distancesScale, movUranus, aUranus);

    const ringsGeo2 = new THREE.RingGeometry(sizesScale/25,sizesScale/13.61395,64);
    const ringsTex2 = new THREE.TextureLoader().load("archivos/texture/ringsUranus.webp")

    const pos2 = ringsGeo2.attributes.position;
    const uv2 = ringsGeo2.attributes.uv;

    const center2 = new THREE.Vector3(); // Centro de la geometría

    for (let i = 0; i < pos2.count; i++) {
        // Obtiene el vector de posición
        const v3 = new THREE.Vector3().fromBufferAttribute(pos2, i);

        // Calcula la longitud normalizada para ajustar las coordenadas UV
        const lengthNormalized = v3.clone().sub(center2).length() / 30000;

        // Asigna las coordenadas UV normalizadas
        uv2.setXY(i, lengthNormalized, 1);
    }

    const ringsMat2 = new THREE.MeshPhongMaterial( { map: ringsTex2, flatShading: true, side: THREE.DoubleSide } );

    rings2 = new THREE.Mesh( ringsGeo2, ringsMat2);
    rings2.rotation.x = Math.PI/2 + 82.23*Math.PI/180;
    scene.add(rings2);

    const neptuneGeo = new THREE.SphereGeometry( sizesScale/28, 200, 100 );
    const neptuneTex = new THREE.TextureLoader().load("archivos/texture/neptune.jpg")
    const neptuneMat = new THREE.MeshPhongMaterial( { map: neptuneTex, flatShading: true } );
    neptune = new THREE.Mesh(neptuneGeo,neptuneMat);
    neptune.rotation.x = 28.32*Math.PI/180;

    scene.add( neptune );

    orbita(distancesScale, movNeptune, aNeptune);
}



function calculoA(near, far, sunRadius){
    return (far + near + sunRadius*2) / 2 / sunRadius;
}

function calculoCentro(near, far, sunRadius){
    return ((far + near) / 2 - near) / sunRadius;
}


function orbita(sunSizeAlt, movPlanet, aPlanet){
    const curvePlanet = new THREE.EllipseCurve(
        0,-movPlanet*sunSizeAlt,
        aPlanet*sunSizeAlt/2,aPlanet*sunSizeAlt,
        0, 2 * Math.PI,
        false, 0)
    const points = curvePlanet.getPoints( 50 );
    points.forEach(p => {p.z = -p.y; p.y = 0;});
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 0x6C6C6C } );
    const ellipse = new THREE.Line( geometry, material );
    scene.add(ellipse);
    return ellipse;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    const timer = Date.now() - start;
    const speed = 0.0005;

    mercury.rotation.y = timer * speed / 365 * 58.6462;
    mercury.position.z = aMercury*distancesScale*Math.cos(timer * speed/0.240846) + movMercury*distancesScale;
    mercury.position.x = aMercury*distancesScale/2*Math.sin(timer * speed/0.240846);

    venus.rotation.y = timer * speed / 365 * -243.0226;
    venus.position.z = aVenus*distancesScale*Math.cos(timer * speed/0.615) + movVenus*distancesScale;
    venus.position.x = aVenus*distancesScale/2*Math.sin(timer * speed/0.615);

    earth.rotation.y = timer * speed / 365 * 0.99726968 ;
    earth.position.z = aEarth*distancesScale*Math.cos(timer * speed) + movEarth*distancesScale;
    earth.position.x = aEarth*distancesScale/2*Math.sin(timer * speed);

    moon.position.z = aMoon*distancesScale*Math.cos(timer * speed/0.0748) + earth.position.z+ movMoon*distancesScale;
    moon.position.x = aMoon*distancesScale/2*Math.sin(timer * speed/0.0748) + earth.position.x;
    moon.position.y = -Math.sin( timer * speed/0.0748 )*300;
    moon.rotation.y = timer * speed / 365 * 27.321661;
    moonOrbit.position.z = earth.position.z;
    moonOrbit.position.x = earth.position.x;

    mars.rotation.y = timer * speed / 365 * 1.02595675;
    mars.position.z = aMars*distancesScale*Math.cos(timer * speed/1.881) + movMars*distancesScale;
    mars.position.x = aMars*distancesScale/2*Math.sin(timer * speed/1.881);

    jupiter.rotation.y = timer * speed / 365 * 0.41354;
    jupiter.position.z = aJupiter*distancesScale*Math.cos(timer * speed/11.86) + movJupiter*distancesScale;
    jupiter.position.x = aJupiter*distancesScale/2*Math.sin(timer * speed/11.86);

    saturn.rotation.y = timer * speed / 365 * 0.44002;
    saturn.position.z = aSaturn*distancesScale*Math.cos(timer * speed/29.46) + movSaturn*distancesScale;
    saturn.position.x = aSaturn*distancesScale/2*Math.sin(timer * speed/29.46);
    rings.position.z = saturn.position.z;
    rings.position.x = saturn.position.x;

    uranus.rotation.y = timer * speed / 365 * -0.71833;
    uranus.position.z = aUranus*distancesScale*Math.cos(timer * speed/84.01) + movUranus*distancesScale;
    uranus.position.x = aUranus*distancesScale/2*Math.sin(timer * speed/84.01);
    rings2.position.z = uranus.position.z;
    rings2.position.x = uranus.position.x;

    neptune.rotation.y = timer * speed / 365 * 0.67125;
    neptune.position.z = aNeptune*distancesScale*Math.cos(timer * speed/164.8) + movNeptune*distancesScale;
    neptune.position.x = aNeptune*distancesScale/2*Math.sin(timer * speed/164.8);

    //controls.update();
    renderer.render( scene, camera );

}
