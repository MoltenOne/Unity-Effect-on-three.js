// Описание стандартных объектов 
const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xd3d3d3 );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.y = 15;
    camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 0 );
    document.body.appendChild( renderer.domElement );

const spotLight = new THREE.SpotLight( 0xffffff );      // свет
    spotLight.position.copy(camera.position);
    scene.add( spotLight );
    spotLight.shadowMapHeight = 3000;
	spotLight.shadowMapWidth = 3000;
	spotLight.castShadow = true;
// Добавление управления камерой для удобства
let orbitControls = new THREE.OrbitControls(camera);
    let clock = new THREE.Clock();
    orbitControls.minDistance = 50;
	orbitControls.maxDistance = 300;
	let delta = clock.getDelta();

// Основая функция, запускаемая после загрузки всех текстур, описание загрузки в конце скрипта.
let onLoad = function () {
// Платформа для лучшей ориентации в пространстве
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(50,50, 50,50),
		new THREE.MeshPhongMaterial({color:0xd1d1d1, wireframe:false})
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
	scene.add(meshFloor);
	meshFloor.position.y = -10;

// Описание логики работы эффекта расходящихся кругов
	let circleGeometry = new THREE.CircleGeometry(5, 32);
	let circleMaterial = new THREE.MeshPhongMaterial({
	  		map: textures.circleTexture,
	  		opacity: 0.2,
	   		transparent: true,
	   		depthTest: false
		});

	circleMaterial.color.r = 0.827451;
    circleMaterial.color.g = 0.2117647;

	let circleListObject = {} // Каждый круг - свойство объекта-аггрегатора

	function makeCircle(count){
			for (let i = 0; i < count;i++){			
				setTimeout(function(){
					circleListObject["circle" + i] = new THREE.Mesh(circleGeometry.clone(), circleMaterial.clone());				
					circleListObject["circle" + i].position.set(0,15,0);
					circleListObject["circle" + i].scale.set(0.2,0.2,0.2);
					circleListObject["circle" + i].renderOrder = 1;
					scene.add(circleListObject["circle" + i]);
				},200*(i+1))
				
			}
	}

	 setTimeout(function(){makeCircle(4)},500);

// Описание логики работы эффекта линий-пружинок (в данном случае они имеют двухмерную текстуру)


	
//	let lineGeometry = new THREE.PlaneGeometry(10, 10, 5, 5);
	textures.line1Texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
//    let lineMaterial = new THREE.MeshPhongMaterial({
	  let lineMaterial = new THREE.SpriteMaterial({
    	map: textures.line1Texture,
    	transparent: true,
    	opacity: 1,
 //   	side: THREE.DoubleSide
    });
    lineMaterial.color.r = 0.827451;
    lineMaterial.color.g = 0.2117647;


    


// Каждой копии линии присвоено свойство "lifeline", определяющее остальные свойства позиции, скалирования, текстуры и прозрачности
    let lineListObject = {};

	for (let i = 0; i < 35;i++){
	//	lineListObject["line" + i] = new THREE.Mesh(lineGeometry.clone(), lineMaterial.clone())
		lineListObject["line" + i] = new THREE.Sprite(lineMaterial.clone());
		lineListObject["line" + i].lifeline = (1.6*i)/35;
		lineListObject["line" + i].rotated = 0;
		scene.add(lineListObject["line" + i]);
	}

// Динамичные повторяющиеся эффекты
	function animate() {
		requestAnimationFrame( animate );

	        orbitControls.update(delta);

	        spotLight.position.copy(camera.position);
	 

		renderer.render( scene, camera );

		for (let circleInstance in circleListObject) {
			circleListObject[circleInstance].scale.x +=0.06;
			circleListObject[circleInstance].scale.y +=0.06;
			circleListObject[circleInstance].scale.z +=0.06;

			if (circleListObject[circleInstance].scale.x < 1) circleListObject[circleInstance].material.opacity+=0.015;
			if (circleListObject[circleInstance].scale.x > 2) circleListObject[circleInstance].material.opacity-=0.04;
			if (circleListObject[circleInstance].scale.x > 3)  {
					circleListObject[circleInstance].scale.set(0.2,0.2,0.2);
					circleListObject[circleInstance].material.opacity = 0.2;
			}
			circleListObject[circleInstance].lookAt(camera.position);			
		}
// Меняя свойства каждой линии в объекте, они меняются и на сцене.
		for (let lineInstance in lineListObject){			
			lineListObject[lineInstance].lifeline+=0.03;
			lineListObject[lineInstance].material.opacity +=0.02;
			lineListObject[lineInstance].scale.x +=0.02;
			if (lineListObject[lineInstance].lifeline < 0.1) lineListObject[lineInstance].material.map = textures.line4Texture;
			if (lineListObject[lineInstance].lifeline >= 0.1 && lineListObject[lineInstance].lifeline < 0.2) lineListObject[lineInstance].material.map = textures.line3Texture;
			if (lineListObject[lineInstance].lifeline >= 0.2 && lineListObject[lineInstance].lifeline < 0.3) lineListObject[lineInstance].material.map = textures.line2Texture;
			if (lineListObject[lineInstance].lifeline >= 0.3 && lineListObject[lineInstance].lifeline < 0.4) lineListObject[lineInstance].material.map = textures.line1Texture;
			if (lineListObject[lineInstance].lifeline >= 0.4 && lineListObject[lineInstance].lifeline < 0.5) lineListObject[lineInstance].material.map = textures.line2Texture;
			if (lineListObject[lineInstance].lifeline >= 0.5 && lineListObject[lineInstance].lifeline < 0.6) lineListObject[lineInstance].material.map = textures.line3Texture;
			if (lineListObject[lineInstance].lifeline >= 0.6 && lineListObject[lineInstance].lifeline < 0.7) lineListObject[lineInstance].material.map = textures.line4Texture;
			if (lineListObject[lineInstance].lifeline >= 0.7 && lineListObject[lineInstance].lifeline < 0.8) lineListObject[lineInstance].material.map = textures.line3Texture;
			if (lineListObject[lineInstance].lifeline >= 0.8 && lineListObject[lineInstance].lifeline < 0.9) lineListObject[lineInstance].material.map = textures.line2Texture;
			if (lineListObject[lineInstance].lifeline >= 0.9 && lineListObject[lineInstance].lifeline < 1.0) lineListObject[lineInstance].material.map = textures.line1Texture;
			if (lineListObject[lineInstance].lifeline >= 1.0 && lineListObject[lineInstance].lifeline < 1.1) lineListObject[lineInstance].material.map = textures.line2Texture;
			if (lineListObject[lineInstance].lifeline >= 1.1 && lineListObject[lineInstance].lifeline < 1.2) lineListObject[lineInstance].material.map = textures.line3Texture;
			if (lineListObject[lineInstance].lifeline >= 1.2 && lineListObject[lineInstance].lifeline < 1.3) lineListObject[lineInstance].material.map = textures.line4Texture;
			if (lineListObject[lineInstance].lifeline >= 1.3 && lineListObject[lineInstance].lifeline < 1.4) lineListObject[lineInstance].material.map = textures.line3Texture;
			if (lineListObject[lineInstance].lifeline >= 1.4 && lineListObject[lineInstance].lifeline < 1.5) lineListObject[lineInstance].material.map = textures.line2Texture;
// Логика "растягивания линий"
			if (lineListObject[lineInstance].position.x > 0) {
				lineListObject[lineInstance].position.x +=(lineListObject[lineInstance].position.x/150)
			} else {
				lineListObject[lineInstance].position.x +=(lineListObject[lineInstance].position.x/150)
			};
			if (lineListObject[lineInstance].position.y > 15) {
				lineListObject[lineInstance].position.y +=((lineListObject[lineInstance].position.y-15)/150)
			} else {
				lineListObject[lineInstance].position.y +=((lineListObject[lineInstance].position.y-15)/150)
			};
			if (lineListObject[lineInstance].position.z > 0) {
				lineListObject[lineInstance].position.z +=(lineListObject[lineInstance].position.z/150)
			}
			else {
				lineListObject[lineInstance].position.z +=(lineListObject[lineInstance].position.z/150)
			};
// Установка расположения линий относительно нужной нам точки
		//    lineListObject[lineInstance].lookAt(0,15,0);
	    //	lineListObject[lineInstance].rotateY(Math.PI/2);
		//	lineListObject[lineInstance].material.rotation = Math.PI/2;
	    
	    	if (lineListObject[lineInstance].lifeline > 0.8) {
	    		lineListObject[lineInstance].material.opacity -=0.08
	   		}
// При достижении конечной точки своего жизненного цикла, каждая линия меняет свои параметры на
// изначальные и меняет позицию на случайную, после чего жизненный цикл отсчитывается заново.
			if (lineListObject[lineInstance].lifeline > 1.61) {
//Расчет случайной точки на радиусе условной сферы, откуда будут начинаться линии.
				function randomSpherePoint(x0,y0,z0,radius){
				   let u = Math.random();
				   let v = Math.random();
				   let theta = 2 * Math.PI * u;
				   let phi = Math.acos(2 * v - 1);
				   let x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
				   let y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
				   let z = z0 + (radius * Math.cos(phi));
				   return [x,y,z];
				}

				let randomDot = randomSpherePoint(0,15,0,13)

				lineListObject[lineInstance].lifeline = 0;
				lineListObject[lineInstance].material.opacity = 1;
				lineListObject[lineInstance].scale.x = 12;
				lineListObject[lineInstance].scale.x = 5;
				lineListObject[lineInstance].position.set(randomDot[0], randomDot[1], randomDot[2]);
			//	if (!lineListObject[lineInstance].rotated){
					let v2 = new THREE.Vector2(lineListObject[lineInstance].position.x, lineListObject[lineInstance].position.y-15)
					lineListObject[lineInstance].material.rotation = v2.angle();
			//		lineListObject[lineInstance].rotated = 1;
			//	}
			}
		}
	};
	animate();
}

// Логика асинхронной загрузки текстур
let loader = new THREE.TextureLoader();
let textures ={}


function loadTexture(src,name){
	return new Promise((resolve) => {
		setTimeout(() => resolve(loader.load(src)),100)
	}).then(function(texture){
		textures[name] = texture
	})
}

let circlePromise = loadTexture('../assets/alternativeCircle.png','circleTexture');
let line1Promise = loadTexture('../assets/image_part_001.png','line1Texture');
let line2Promise = loadTexture('../assets/image_part_002.png','line2Texture');
let line3Promise = loadTexture('../assets/image_part_003.png','line3Texture');
let line4Promise = loadTexture('../assets/image_part_004.png','line4Texture');

document.addEventListener("DOMContentLoaded", function(event) { 
	Promise.all([circlePromise,line1Promise,line2Promise,line3Promise,line4Promise]).then(() => setTimeout(function(){onLoad()}))
});

