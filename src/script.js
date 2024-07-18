import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { gsap } from 'gsap'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'


const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const cardBackTexture = textureLoader.load('./textures/card/dt_bg.jpg')
const cardFrontTexture = textureLoader.load('./textures/card/dt_1.jpg')
const cardAlphaTexture = textureLoader.load('./textures/card/alpha.jpg')
const sceneForestTexture = textureLoader.load('./textures/scene/wood.jpg')
const scenePlainTexture = textureLoader.load('./textures/scene/wood.jpg')

cardBackTexture.colorSpace = THREE.SRGBColorSpace
cardFrontTexture.colorSpace = THREE.SRGBColorSpace
sceneForestTexture.colorSpace = THREE.SRGBColorSpace
scenePlainTexture.colorSpace = THREE.SRGBColorSpace

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)


/**
 * Objects
 */
const sceneMaterial = new THREE.MeshBasicMaterial()
sceneMaterial.map = sceneForestTexture

const cardFrontMaterial = new THREE.MeshBasicMaterial()
cardFrontMaterial.map = cardFrontTexture
cardFrontMaterial.transparent = true
cardFrontMaterial.alphaMap = cardAlphaTexture

const cardBackMaterial = new THREE.MeshBasicMaterial()
cardBackMaterial.map = cardBackTexture
cardBackMaterial.transparent = true
cardBackMaterial.alphaMap = cardAlphaTexture

// Objects
const sceneBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 12),
    sceneMaterial
)

const rowSize = 4
const colSize = 6
const spacing = 0.2
const cardWidth = 1.6
const cardHeight = 2.4
const spacingX = cardWidth + spacing
const spacingY = cardHeight + spacing

const cards = [];

const cardAxis = new THREE.AxesHelper( 5 );

const planeGeometry = new THREE.PlaneGeometry(1.6, 2.4)

for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {

        const cardFront = new THREE.Mesh(planeGeometry, cardFrontMaterial);
        const cardBack = new THREE.Mesh(planeGeometry, cardBackMaterial);

        const card = new THREE.Group();
        card.add(cardFront);
        cardBack.rotation.y = Math.PI;
        card.add(cardBack);

        card.position.z = 0.05;
        card.position.x = j * spacingX - (colSize * spacingX / 2) + spacingX/2
        card.position.y = i * spacingY - (rowSize * spacingY / 2) + spacingY/2
        
        cardFront.name = 'cardFront '+ i + ' ' + j
        cardBack.name = 'cardBack '+ i + ' ' + j

        card.name = 'card '+ i + ' ' + j

        cards.push(card)
        scene.add(card);
    }
}


scene.add(sceneBoard)

const clock = new THREE.Clock()
const raycaster = new THREE.Raycaster()
/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const aspectRatio = sizes.width / sizes.height
//const camera = new THREE.OrthographicCamera(- 1 * aspectRatio*5, 1 * aspectRatio*5, 5, -5, 1, 100)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = -4
camera.position.z = 10

scene.add(camera)

const cameraGUI = gui.addFolder("Camera")
cameraGUI.add(camera.position,'x').min(0).max(10).step(0.1)
cameraGUI.add(camera.position,'y').min(-10).max(10).step(0.1)
cameraGUI.add(camera.position,'z').min(0).max(10).step(0.1)

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) =>
    {
        mouse.x = event.clientX / sizes.width * 2 - 1
        mouse.y = - (event.clientY / sizes.height) * 2 + 1
    })


window.addEventListener('click', () =>
{
    console.log(mouse)

    if(currentIntersect)
    {
        console.log(currentIntersect.object.parent)

        const flip = currentIntersect.object.parent.rotation.y == 0 ? Math.PI : 0

        const timeline = gsap.timeline({ yoyo: true });
        timeline
            .to(currentIntersect.object.parent.position, { duration: 0.3, z: spacingX/2 })
            .to(currentIntersect.object.parent.rotation, { duration: 0.3, y: flip})
            .to(currentIntersect.object.parent.position, { duration: 0.3, z: 0.05 })
        
    }

    currentIntersect = null
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    raycaster.setFromCamera(mouse, camera)
    
    const intersects = raycaster.intersectObjects(cards)
    
    if(intersects.length)
    {
        currentIntersect = intersects[0]
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()