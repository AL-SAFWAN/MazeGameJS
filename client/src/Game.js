
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree, extend } from 'react-three-fiber'
import { Physics, usePlane } from 'use-cannon'
import * as THREE from "three"
import Player from './Components/Player'
import { PointerLockControls } from "@react-three/drei"
import { loadRoom } from './Components/Maze'
import useStore, { api } from './Store'
import Coins from './Components/Coins'
import './index.css';

extend({ PointerLockControls })

const Ground = ({ x, z }) => {
  const [ref] = usePlane(() => ({ type: "Static", position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0], args: [x, z] }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[x, z]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  )
}

const Passages = () => {
  const { passage } = api.getState(state => state)

  return (
    <>{passage}</>
  )
}
function Laser() {
  const { Enemy, setEnemy, openDoors } = api.getState(state => state)
  const { position, positionE } = api.getState(state => state)
  const { camera } = useThree()
  const d = useRef()
  const refBullet = useRef()
  useEffect(() => {
    refBullet.current.position.set(position.x, 21, position.z)
    d.current = new THREE.Vector3().copy(camera.getWorldDirection(new THREE.Vector3())).multiply(new THREE.Vector3(5, 5, 5))
  }, [])

  useFrame((state) => {
    refBullet.current.position.add(d.current)
    if (Enemy.length === 1) {
      const bulletPos = refBullet.current.position
      const deltaX = positionE.x - bulletPos.x
      const deltaZ = positionE.z - bulletPos.z
      let distance = Math.sqrt((deltaX * deltaX) + (deltaZ * deltaZ))
      if (distance < 10) {
        Enemy.pop()
        console.log("hit", Enemy)
        setEnemy(Enemy)
        openDoors()
      }
    }
  })
  return (
    <>
      <mesh ref={refBullet} >
        <sphereBufferGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
    </>
  )
}

const Lasers = () => {
  const [lasers, setLasers] = useState()
  useFrame(() => {
    setLasers(api.getState().lasers.map(item => <Laser key={item} />))
  })
  return (
    <>
      {lasers}
    </>
  )

}

const Enemy = () => {
  const [Enemy, setEnemy] = useState()
  useFrame(() => {
    setEnemy(api.getState().Enemy.map(e => e))
  })
  return (
    <>
      {Enemy}
    </>
  )
}

const Treasure = () => {
  const { treasure } = useStore()
  return (
    <>{
      treasure.map(e => e)}
    </>
  )
}

function Coin() {
  const [coins, setCoins] = useState()
  useFrame(() => {
    setCoins(api.getState(state => state.coins).coins.map(item => new Coins().makeCoin(item.p, item.id)))
  })
  return (
    <>
      {coins}
    </>
  )
}

const Rooms = () => {
  const { rooms } = api.getState()
  return rooms.map(room => room.create())
}

const Update = () => {
  const { points, actions } = useStore()
  useEffect(() => {
    actions.updateCurrentUser()
  }, [points])
  return <></>
}

function Game({ inMenu }) {
  console.log('is the game here')
  return (
    <>
      <Canvas invalidateFrameloop shadowMap
        onCreated={() => {
          loadRoom()
        }}
      >
        <Update />
        <ambientLight intensity={.1} />

        <Physics gravity={[0, -400, 0]} >
          <Suspense fallback={null}>
            <Treasure />
            <Coin />
            <Enemy />
            <Lasers />
            <Player></Player>
            <Rooms />
            <Passages />
            <Ground x={10000} z={10000} />
          </Suspense>
        </Physics>

        {inMenu && <PointerLockControls />}
      </Canvas>

    </>
  );
}

export default Game;

