import React, { useState } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from "three"
import { useBox, usePlane } from 'use-cannon'
import { api } from '../Store'
import Passage from './Passage'

import { useSpring } from "@react-spring/core";
import { a } from "@react-spring/three";

const Ground = ({ x, z, name }) => {
    const [ref] = usePlane(() => ({ type: "Static", position: [x, 0, z], rotation: [-Math.PI / 2, 0, 0], args: [400, 400] }))
    return (
        <mesh ref={ref} receiveShadow>
            <planeBufferGeometry attach="geometry" args={[400, 400]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    )
}

const Roof = ({ x, z, color }) => {
    return (
        <mesh receiveShadow position={[0 + x, 150, 0 + z]} rotation={[-Math.PI / 2, 0, 0]} >
            <rectAreaLight intensity={.3} width={400} height={400} />
            <boxBufferGeometry attach="geometry" args={[400, 400, 5]} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}

const Wall = ({ x, z, r, color }) => { return (<Brick rotation={[0, r, 0]} position={[0 + x, 75, 0 + z]} size={[400, 150, 20]} color={color} />) }

const WallWithDoor = ({ x, z, r, color }) => {
    return (
        <>
            <Brick rotation={[0, r, 0]} position={[112.5 + x, 75, 0 + z]} size={[175, 150, 20]} color={color} />
            <Brick rotation={[0, r, 0]} position={[0 + x, 100, 0 + z]} size={[50, 100, 20]} color={color} />
            <Brick rotation={[0, r, 0]} position={[-112.5 + x, 75, 0 + z]} size={[175, 150, 20]} color={color} />
            <Door rotation={[0, 0, 0]} position={[0 + x, 25, 0 + z]} size={[50, 50, 15]} type="normal" color={color} />
        </>
    )

}

const SideWall = ({ x, z, r, color }) => { return (<Brick rotation={[0, r, 0]} position={[z, 75, 0 + x]} size={[400, 150, 20]} color={color} />) }

const SideWallWithDoor = ({ x, z, r, color }) => {
    return (
        <>
            <Brick rotation={[0, r, 0]} position={[z, 75, 112.5 + x]} size={[175, 150, 20]} color={color} />
            <Brick rotation={[0, r, 0]} position={[z, 100, 0 + x]} size={[50, 100, 20]} color={color} />
            <Brick rotation={[0, r, 0]} position={[z, 75, -112.5 + x]} size={[175, 150, 20]} color={color} />
            <Door rotation={[0, r, 0]} position={[0 + z, 25, 0 + x]} size={[50, 50, 15]} type="side" color={color} />
        </>
    )

}

const Brick = (props) => {
    const { rotation, position, size, color } = props
    const [ref] = useBox(() => ({ mass: 100, type: "Static", rotation, position, args: size }))
    return (
        <mesh ref={ref}>
            <boxBufferGeometry attach="geometry" args={size} />
            <meshStandardMaterial color={color} />
        </mesh>
    )
}


const Door = (props) => {
    const { rotation, position, size, type } = props
    const [ref, apiDoor] = useBox(() => ({ mass: 100, type: "Static", rotation, position, args: size }))
    const [active, setActive] = useState(false);
    const { spring } = useSpring({
        spring: active,
        config: { mass: 5, tension: 200, friction: 50 },
    });
    const color = spring.to([0, 1], ["#e45858", "orange"]);

    useFrame(() => {
        let deltaX = position[0] - api.getState().position.x
        let deltaZ = position[2] - api.getState().position.z
        let distance = Math.sqrt((deltaX * deltaX) + (deltaZ * deltaZ))

        setActive(api.getState().doorsOpened)
        if (api.getState().doorsOpened) {
            if (type === "side") {
                const z = distance < 50 ? new THREE.Vector3(0, 0, position[2] + 80) : new THREE.Vector3(0, 0, position[2])
                const movement = new THREE.Vector3(0, 0, position[2]).lerp(z, 0.65)
                apiDoor.position.set(position[0], position[1], movement.z)
            }
            if (type === "normal") {
                const x = distance < 50 ? new THREE.Vector3(position[0] + 80, 0, 0) : new THREE.Vector3(position[0], 0, 0)
                const movement = new THREE.Vector3(position[0], 0, 0).lerp(x, 0.65)
                apiDoor.position.set(movement.x, position[1], position[2])
            }
        }
    }
    )
    return (
        <a.mesh ref={ref}>
            <boxBufferGeometry attach="geometry" args={size} />
            <a.meshStandardMaterial roughness={0.5} color={color} />
        </a.mesh>
    )
}


export default function CreateRoom(doors, x, z, name, hasEnemy = true, hasTreasure = false) {
    this.doors = doors
    this.x = x * 200
    this.z = z * 200
    this.position = [x * 200, z * 200]
    this.name = name
    this.hasEnemy = hasEnemy
    this.hasTreasure = hasTreasure
}
CreateRoom.prototype.selfConnect = function (d1, d2) {
    const pass = new Passage(this.room, null, null, null)
    const proxy = new CreateRoom(this.doors, this.x / 200, this.z / 200, this.name)
    pass.selfConnect(proxy, d1, d2)
}
CreateRoom.prototype.create = function () {
    console.log(this.name + ' is created')
    const northWall = this.doors[0] ? <WallWithDoor key={'northWall'} x={this.x} z={-190 + this.z} r={0} color={this.name != 'end' ? 'lightblue' : 'darkgreen'} /> : <Wall key={'northWall'} x={this.x} z={-190 + this.z} r={0} color={this.name != 'end' ? 'lightblue' : 'darkgreen'} />
    const eastWall = this.doors[1] ? <SideWallWithDoor key={'eastWall'} x={this.z} z={190 + this.x} r={Math.PI / 2} color={this.name != 'end' ? 'lightblue' : 'darkgreen'} /> : <SideWall key={'eastWall'} x={this.z} z={190 + this.x} r={Math.PI / 2} color={this.name != 'end' ? 'lightblue' : 'darkgreen'} />
    const southWall = this.doors[2] ? <WallWithDoor key={'southWall'} x={this.x} z={190 + this.z} r={0} color={this.name != 'end' ? 'lightblue' : 'darkgreen'} /> : <Wall key={'southWall'} x={this.x} z={190 + this.z} r={0} color={this.name != 'end' ? 'lightblue' : 'darkgreen'} />
    const westWall = this.doors[3] ? <SideWallWithDoor key={'westWall'} x={this.z} z={-190 + this.x} r={Math.PI / 2} color={this.name != 'end' ? 'lightblue' : 'darkgreen'} /> : <SideWall key={'westWall'} x={this.z} z={-190 + this.x} r={Math.PI / 2} color={this.name != 'end' ? 'lightblue' : 'darkgreen'} />
    const walls = [northWall, eastWall, southWall, westWall]

    this.room = <React.Fragment key={this.name}>
        <Ground x={this.x} z={this.z} name={this.name}></Ground>
        <Roof x={this.x} z={this.z} color={this.name != 'end' ? 'lightblue' : 'darkgreen'} />
        {walls.map(item => item)}
    </React.Fragment >
    return this.room
}
