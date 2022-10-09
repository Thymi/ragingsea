import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import { ShaderMaterial } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {

}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Color
debugObject.depthColor = '#981ffc'
debugObject.surfaceColor = '#f0d720'

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
        uTime: { value: 0.0 },

        uBigWavesElevation: { value: 0.1 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3.0 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIterations: { value: 4 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: { value: 0.1 },
        uColorMultiplier: { value: 5.0 }
    }
})

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value', 0.0, 1.0, 0.01).name('big wave elevation')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value', 0.0, 3.0, 0.01).name('big wave speed')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x', 0.0, 10.0, 0.01).name('big wave frequency X axis')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y', 0.0, 10.0, 0.01).name('big wave frequency Z axis')

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value', 0.0, 1.0, 0.01).name('small wave elevation')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value', 0.0, 3.0, 0.01).name('small wave speed')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value', 0.0, 10.0, 0.01).name('small wave frequency')
gui.add(waterMaterial.uniforms.uSmallWavesIterations, 'value', 0.0, 5.0, 1.0).name('small wave iterations')

gui.addColor(debugObject, 'depthColor').onChange((color) => {
    waterMaterial.uniforms.uDepthColor.value.set(color)
})
gui.addColor(debugObject, 'surfaceColor').onChange((color) => {
    waterMaterial.uniforms.uSurfaceColor.value.set(color)
})
gui.add(waterMaterial.uniforms.uColorOffset, 'value', 0.0, 2.0, 0.01).name('uColorOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value', 0.0, 5.0, 0.01).name('uColorMultiplier')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()