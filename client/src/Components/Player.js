
import React, { useState, useEffect, useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import { useSphere } from 'use-cannon'
import * as THREE from "three"
import { api } from '../Store'
import Coin from './Coins'
import Enemy from './Enemy'
import Treasure from './Treasure'

const keys = { KeyW: "forward", KeyS: "backward", KeyA: "left", KeyD: "right", ShiftLeft: "run", Space: 'shoot', KeyE: "pickUp", KeyQ: "dropDown" }
const moveFieldByKey = (key) => keys[key]

const zVector = new THREE.Vector3()
const xVector = new THREE.Vector3()
const boxDirection = new THREE.Vector3()

const usePlayerControls = () => {
  const [movement, setMovement] = useState({ forward: false, backward: false, left: false, right: false, jump: false, run: false, shoot: false, pickUp: false, dropDown: false })
  useEffect(() => {
    const handleKeyDown = (e) => setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }))
    const handleKeyUp = (e) => setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyUp)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("keyup", handleKeyUp)
    }
  }, [])
  return movement
}

const inRoom = (room, p) => {
  const { x, z } = room
  const range = 180
  if ((p.x < x + range && p.x > x - range) && (p.z < z + range && p.z > z - range)) {
    return true
  }
  return false
}

export default function Player({ args = [5, 25, 5] }) {
  const { setPosition, position, setRotation, actions, setDrop, setPickUp, points, config,difficulty } = api.getState(state => state)
  const { camera } = useThree()
  const [ref, apiPlayer] = useSphere(() => ({ mass: 60, type: "Dynamic", args: 13, position: [position.x, position.y, position.z] }))
  const controls = usePlayerControls()
  const { forward, backward, left, right, run, shoot, dropDown, pickUp } = controls
  let cancelLaserTO = undefined
  const refLight = useRef()

  useFrame(state => {
    if (shoot) {
      clearTimeout(cancelLaserTO)
      cancelLaserTO = setTimeout(() => actions.shoot(), 10)
    }
    if (dropDown && points >= 20) {
      clearTimeout(cancelLaserTO)
      cancelLaserTO = setTimeout(() => new Coin().addCoin(ref.current.position), 100)
    }

    setPosition(ref.current.position)
    setRotation(ref.current.rotation)
    setDrop(dropDown)
    setPickUp(pickUp)

    // player controls
    const speed = run ? 50 -config[difficulty] : 20
    const offsetAng = new THREE.Vector3(0, (Math.sin(state.clock.elapsedTime * speed / 5) * 1.1) + 10, 0)
    camera.position.copy(position).add(offsetAng)
    apiPlayer.rotation.set(0, camera.rotation.y, 0)
    refLight.current.rotation.set(0, -camera.rotation.x, 0)
    // refLight.current.position.set(position.x,position.y,position.z)
    zVector.set(0, 0, Number(backward) - Number(forward))
    xVector.set(Number(right) - Number(left), 0, 0)
    boxDirection.addVectors(zVector, xVector).normalize().multiplyScalar(5)// this direction is more to movement 

    const movement = new THREE.Vector3(0, 0, 0).lerp(boxDirection, speed)

    //update player controls based on direction of the camera rotation 
    const forwardVector = new THREE.Vector3().copy(camera.getWorldDirection(new THREE.Vector3()))
    forwardVector.y = 0
    forwardVector.normalize()
    const vectorUp = new THREE.Vector3(0, 1, 0)
    const sideVector = vectorUp.cross(forwardVector)
    const velVector = forwardVector.multiplyScalar(movement.z).add(sideVector.multiplyScalar(movement.x))
    apiPlayer.velocity.set(-velVector.x, 0, -velVector.z)

    api.getState().rooms.forEach(room => {
      if (inRoom(room, api.getState().position)) {
        if (room.name == 'end') {
          setTimeout(() => {
            api.getState().setSteps(6)
          }, 1000);
        }
        if (api.getState().Enemy.length === 0 && api.getState().enemyCreateIn.indexOf(room.name) === -1 && room.hasEnemy) {
          api.getState().addEnemyCreateIn(room.name)
          setTimeout(() => {
            // bring it back to match the fps of the screen 
            new Enemy(room).addEnemy()
            api.getState().closeDoors()
          }, 350);
        }
        if (api.getState().treasure.length === 0 && api.getState().treasureCreatedIn.indexOf(room.name) === -1 && room.hasTreasure) {
          api.getState().addTreasureCreatedIn(room.name)
          new Treasure(room).addTreasure()
        }
      }
    })
  })

  return (
    <>
      <mesh ref={ref} castShadow  >
        <pointLight ref={refLight} intensity={0.9} distance={200} decay={5} />
        {/* add model */}
      </mesh>
    </>

  )
}

