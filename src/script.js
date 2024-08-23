import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { gsap } from 'gsap'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import Card from './GameObject/Card.js'

const gui = new GUI()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const clock = new THREE.Clock()
const raycaster = new THREE.Raycaster()

/**
 * Loader
 */
const loadingBarElement = document.querySelector('.loading-bar')
const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        // Wait a little
        window.setTimeout(() =>
        {
            // Animate overlay
            const timeline = gsap.timeline({ yoyo: true });

            timeline
            .to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })
            .add( function() { scene.remove(overlay )} )
            //gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 })
            

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
        }, 500)
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    transparent: true,
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main()
        {   
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})

const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
//overlay.position.set(6.0,6.0,6.0)
scene.add(overlay)

/**
 * Sizes
 */

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

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
camera.rotation.x = 0.35

scene.add(camera)

const cameraGUI = gui.addFolder("Camera")
cameraGUI.add(camera.position,'x').min(0).max(10).step(0.1)
cameraGUI.add(camera.position,'y').min(-10).max(10).step(0.1)
cameraGUI.add(camera.position,'z').min(0).max(10).step(0.1)
cameraGUI.add(camera.rotation,'x').min(0).max(10).step(0.1)
cameraGUI.add(camera.rotation,'y').min(-10).max(10).step(0.1)
cameraGUI.add(camera.rotation,'z').min(0).max(10).step(0.1)

const mouse = new THREE.Vector2()

/**
 * Audios
 * Sound Effect from <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=48088">Pixabay</a>
 * Sound Effect by <a href="https://pixabay.com/users/u_ss015dykrt-26759154/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=146292">u_ss015dykrt</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=146292">Pixabay</a>
 */
const listener = new THREE.AudioListener()
camera.add(listener)


const audioLoader = new THREE.AudioLoader(loadingManager)
const mixcard = new THREE.Audio( listener )
const flipcard = new THREE.Audio( listener )
const movecard = new THREE.Audio( listener )
const fail = new THREE.Audio( listener )
const success = new THREE.Audio( listener )

// load a sound and set it as the Audio object's buffer
audioLoader.load( './sound/mixcard.mp3', function( buffer ) {
	mixcard.setBuffer( buffer );
	mixcard.setVolume( 0.3 );
});

audioLoader.load( './sound/flipcard.mp3', function( buffer ) {
	flipcard.setBuffer( buffer );
	flipcard.setVolume( 0.5 );
});

audioLoader.load( './sound/movecard.mp3', function( buffer ) {
	movecard.setBuffer( buffer );
	movecard.setVolume( 0.1 );
});

audioLoader.load( './sound/fail.mp3', function( buffer ) {
	fail.setBuffer( buffer );
	fail.setVolume( 0.7 );
});

audioLoader.load( './sound/success.mp3', function( buffer ) {
	success.setBuffer( buffer );
	success.setVolume( 0.5 );
});

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader(loadingManager)

const sceneForestTexture = textureLoader.load('./textures/scene/wood.jpg')
const scenePlainTexture = textureLoader.load('./textures/scene/wood.jpg')

const cardBackTexture = textureLoader.load('./textures/card/card_bg.jpg')
const cardAlphaTexture = textureLoader.load('./textures/card/card_alpha.jpg')
const startGameBoardTexture = textureLoader.load('./textures/card/startm.jpg')

const cardsTexture = []
cardsTexture.push(textureLoader.load('./textures/card/card_1.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_2.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_3.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_4.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_5.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_6.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_7.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_8.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_9.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_10.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_11.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_12.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_13.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_14.jpg'))
cardsTexture.push(textureLoader.load('./textures/card/card_15.jpg'))

cardsTexture.forEach((cardTexture) => cardTexture.colorSpace = THREE.SRGBColorSpace);

startGameBoardTexture.colorSpace = THREE.SRGBColorSpace
cardBackTexture.colorSpace = THREE.SRGBColorSpace
sceneForestTexture.colorSpace = THREE.SRGBColorSpace
scenePlainTexture.colorSpace = THREE.SRGBColorSpace

/**
 * UI 
 */

const startGameBoardGeometric = new THREE.PlaneGeometry(12, 8)
const startGameBoardMaterial = new THREE.MeshBasicMaterial()
startGameBoardMaterial.map = startGameBoardTexture

const startGameBoard = new THREE.Mesh(startGameBoardGeometric, startGameBoardMaterial)

const gameBoard = gui.addFolder("Start Game Board")

startGameBoard.position.z = 4
startGameBoard.position.y = -2
startGameBoard.rotation.x = 0.35

gameBoard.add(startGameBoard.position,'x').min(-10.0).max(10.0).step(0.01)
gameBoard.add(startGameBoard.position,'y').min(-10.0).max(10.0).step(0.01)
gameBoard.add(startGameBoard.position,'z').min(-10.0).max(10.0).step(0.01)

gameBoard.add(startGameBoard.rotation,'x').min(-10.0).max(10.0).step(0.01)
gameBoard.add(startGameBoard.rotation,'y').min(-10.0).max(10.0).step(0.01)
gameBoard.add(startGameBoard.rotation,'z').min(-10.0).max(10.0).step(0.01)

scene.add(startGameBoard)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

/**
 * Objects: Scene Setup and Board
 */

const sceneMaterial = new THREE.MeshBasicMaterial()
sceneMaterial.map = sceneForestTexture

const sceneBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 12),
    sceneMaterial
)

scene.add(sceneBoard)

/**
 * Objects: Cards
 */

const rowSize = 3
const colSize = 5
const spacing = 0.2
const cardWidth = 1.6
const cardHeight = 2.4
const spacingX = cardWidth + spacing
const spacingY = cardHeight + spacing
const flip = Math.PI * 2

const PositionArray = []
PositionArray.push(new THREE.Vector3(-spacingX, -4.5001,4.21))
PositionArray.push(new THREE.Vector3(0.0,-4.5001,4.16))
PositionArray.push(new THREE.Vector3(spacingX,-4.5001,4.21))

const SelectedCardPosition = new THREE.Vector3(0.0,-3.4,8.21)
const SelectedCardRotation = Math.PI/6

let cards = []

const planeGeometry = new THREE.PlaneGeometry(1.6, 2.4)

for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {

        const cardTexture_no = i*5+j

        const cardFrontMaterial = new THREE.MeshBasicMaterial()
        cardFrontMaterial.map = cardsTexture[cardTexture_no]
        cardFrontMaterial.transparent = true
        cardFrontMaterial.alphaMap = cardAlphaTexture

        const cardBackMaterial = new THREE.MeshBasicMaterial()
        cardBackMaterial.map = cardBackTexture
        cardBackMaterial.transparent = true
        cardBackMaterial.alphaMap = cardAlphaTexture

        const cardFront = new THREE.Mesh(planeGeometry, cardFrontMaterial);
        const cardBack = new THREE.Mesh(planeGeometry, cardBackMaterial);

        const card_Group = new THREE.Group();
        card_Group.add(cardFront);
        cardBack.rotation.y = Math.PI;
        card_Group.add(cardBack);

        card_Group.position.z = 0.05;
        card_Group.position.x = j * spacingX - (colSize * spacingX / 2) + spacingX/2
        card_Group.position.y = i * spacingY - (rowSize * spacingY / 2) + spacingY/2
        card_Group.rotation.y = Math.PI
        
        cardFront.name = 'cardFront '+ cardTexture_no
        cardBack.name = 'cardBack '+ cardTexture_no
        card_Group.name = 'card '+ cardTexture_no

        const type = Math.floor(cardTexture_no / 3)
        const cardData = new Card(card_Group.position.clone(), card_Group.rotation.clone(), type);
        
        card_Group.userData = cardData

        cards.push(card_Group)
        scene.add(card_Group);
    }
}

let isCardShuffled = false

function ShuffleCards()
{
    mixcard.play()
    const tempCards = []

    while(cards.length)
    {
        const randomIndex = Math.floor(Math.random() * cards.length)
        const tempCard = cards.splice(randomIndex,1)
        tempCards.push(tempCard[0])
    }
    cards = tempCards

    console.log(cards)

    const timeline = gsap.timeline({ yoyo: true });

    for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < colSize; j++) 
        {
            const index = i*5+j
            const x = j * spacingX - (colSize * spacingX / 2) + spacingX/2
            const y = i * spacingY - (rowSize * spacingY / 2) + spacingY/2

            timeline.to(cards[index].position, { duration: 0.1, x: x, y:y })
            cards[index].userData.ori_position.x = x
            cards[index].userData.ori_position.y = y
        }
    }

    isCardShuffled = true
}

const SelectedCardPositionGUI = gui.addFolder("Selected Card Position")
SelectedCardPositionGUI.add(SelectedCardPosition,'x').min(0).max(10).step(0.1)
SelectedCardPositionGUI.add(SelectedCardPosition,'y').min(-10).max(10).step(0.1)
SelectedCardPositionGUI.add(SelectedCardPosition,'z').min(0).max(10).step(0.1)

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

window.addEventListener('mousemove', (event) =>
    {
        mouse.x = event.clientX / sizes.width * 2 - 1
        mouse.y = - (event.clientY / sizes.height) * 2 + 1
    })

 let selectedCard = null

window.addEventListener('click', () =>
{
    if(!isCardShuffled)
    {   
        scene.remove(startGameBoard)
        ShuffleCards()
        return
    }


    raycaster.setFromCamera(mouse, camera)
    
    const intersects = raycaster.intersectObjects(cards)
    
    if(intersects.length)
    {
        currentIntersect = intersects[0]
    }
    
    if(currentIntersect)
    {
        // console.log(currentIntersect.object.parent)

        if(selectedCard == null)
        {
            selectedCard = currentIntersect.object.parent
            SelectedCardMove()
        }
        else
        {
            SelectedCardGoToHand()
            selectedCard = null
        }
    }

    currentIntersect = null
})

function SelectedCardMove()
{
    const timeline = gsap.timeline({ yoyo: true });

    timeline
        .add( function() { movecard.play() } )
        .to(selectedCard.position, { 
            duration: 0.3,
            x: SelectedCardPosition.x,
            y: SelectedCardPosition.y,
            z: SelectedCardPosition.z
        })
        .to(selectedCard.rotation, { duration: 0.3, x: SelectedCardRotation})
        .add( function() { flipcard.play() } )
        .to(selectedCard.rotation, { duration: 0.3, y: flip})
}

let handIndex = 0
let matchedCount = 0
let cardsOnHand = []

function SelectedCardGoToHand()
{
    const timeline = gsap.timeline({ yoyo: true })

    let index = cardsOnHand.findIndex(cardInHand => cardInHand === selectedCard);
    
    if(index == -1)
    {
        index = handIndex
    }
    else
    {
        handIndex = index
    }

    timeline
        .add( function() { movecard.play() } )
        .to(selectedCard.position, { 
            duration: 0.3,
            x: PositionArray[handIndex].x,
            y: PositionArray[handIndex].y,
            z: PositionArray[handIndex].z
        })

    cardsOnHand.push(selectedCard)
    
    if(index != -1)
        handIndex++

    if(handIndex == 3){ MatchCard() }
}

function MatchCard()
{
    const timeline = gsap.timeline({ yoyo: true });

    timeline
    .to(cardsOnHand[0].position, { y: PositionArray[0].y+0.5 })
    .to(cardsOnHand[1].position, { y: PositionArray[1].y+0.5 })
    .to(cardsOnHand[2].position, { y: PositionArray[2].y+0.5 })

    console.log(cardsOnHand[0].userData.type + ' ' + cardsOnHand[1].userData.type + ' ' + cardsOnHand[2].userData.type)

    if(cardsOnHand[0].userData.type == cardsOnHand[1].userData.type &&
        cardsOnHand[0].userData.type == cardsOnHand[2].userData.type)
    {
        matchSuccess()
        success.play()
        console.log('Match Success')
    }
    else
    {
        matchFail()
        fail.play()
        console.log('Match Fail')
    }
}

function matchSuccess()
{
    ReturnCardsToBoardUp()
    CheckIfWin()
}

function matchFail()
{
    ReturnCardsToBoard()
}

function ReturnCardsToBoard()
{
    console.log('Return to board called')

    const timeline = gsap.timeline({ yoyo: true });

    movecard.play()

    timeline
    .to(cardsOnHand[0].rotation, { 
        x: cardsOnHand[0].userData.ori_rotation.x,
        y: cardsOnHand[0].userData.ori_rotation.y,
        z: cardsOnHand[0].userData.ori_rotation.z})
    .to(cardsOnHand[1].rotation, { 
        x: cardsOnHand[1].userData.ori_rotation.x,
        y: cardsOnHand[1].userData.ori_rotation.y,
        z: cardsOnHand[1].userData.ori_rotation.z})
    .to(cardsOnHand[2].rotation, { 
        x: cardsOnHand[2].userData.ori_rotation.x,
        y: cardsOnHand[2].userData.ori_rotation.y,
        z: cardsOnHand[2].userData.ori_rotation.z})
    .add( function() { movecard.play() } )
    .to(cardsOnHand[0].position, { 
        x: cardsOnHand[0].userData.ori_position.x,
        y: cardsOnHand[0].userData.ori_position.y,
        z: cardsOnHand[0].userData.ori_position.z})
    .add( function() { movecard.play() } )
    .to(cardsOnHand[1].position, { 
        x: cardsOnHand[1].userData.ori_position.x,
        y: cardsOnHand[1].userData.ori_position.y,
        z: cardsOnHand[1].userData.ori_position.z})
    .add( function() { movecard.play() } )
    .to(cardsOnHand[2].position, { 
        x: cardsOnHand[2].userData.ori_position.x,
        y: cardsOnHand[2].userData.ori_position.y,
        z: cardsOnHand[2].userData.ori_position.z})

    cardsOnHand = []
    handIndex = 0
}

function ReturnCardsToBoardUp()
{
    console.log('Return to board facing up called')

    const timeline = gsap.timeline({ yoyo: true });

    movecard.play()

    timeline
    .to(cardsOnHand[0].rotation, { 
        x: cardsOnHand[0].userData.ori_rotation.x,
        y: Math.PI*2,
        z: cardsOnHand[0].userData.ori_rotation.z})
    .to(cardsOnHand[1].rotation, { 
        x: cardsOnHand[1].userData.ori_rotation.x,
        y: Math.PI*2,
        z: cardsOnHand[1].userData.ori_rotation.z})
    .to(cardsOnHand[2].rotation, { 
        x: cardsOnHand[2].userData.ori_rotation.x,
        y: Math.PI*2,
        z: cardsOnHand[2].userData.ori_rotation.z})
    .add( function() { movecard.play() } )
    .to(cardsOnHand[0].position, { 
        x: cardsOnHand[0].userData.ori_position.x,
        y: cardsOnHand[0].userData.ori_position.y,
        z: cardsOnHand[0].userData.ori_position.z})
    .add( function() { movecard.play() } )
    .to(cardsOnHand[1].position, { 
        x: cardsOnHand[1].userData.ori_position.x,
        y: cardsOnHand[1].userData.ori_position.y,
        z: cardsOnHand[1].userData.ori_position.z})
    .add( function() { movecard.play() } )
    .to(cardsOnHand[2].position, { 
        x: cardsOnHand[2].userData.ori_position.x,
        y: cardsOnHand[2].userData.ori_position.y,
        z: cardsOnHand[2].userData.ori_position.z})

    matchedCount += 3
    cardsOnHand = []
    handIndex = 0
}

function CheckIfWin()
{
    if(matchedCount >= 15 )
    {
        success.play()
        
    }
}

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

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


    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()