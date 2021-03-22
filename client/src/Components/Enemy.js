import React from 'react'
import { useFrame } from 'react-three-fiber'
import { useBox } from 'use-cannon'
import  { api } from '../Store'

function Box({ args = [15, 30, 15], room }) {

    const { position, config,difficulty } = api.getState(state => state)


    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    const randomX = Math.floor(Math.random() * 150)*plusOrMinus 
    const randomZ = Math.floor(Math.random() * 150)*plusOrMinus 

    const [ref, apiBox] = useBox(() => ({ mass: 6, type: "Dynamic", args: args,
     position: [room.x +randomX , 15, room.z +randomZ] }))

     
    useFrame(state => {
        api.getState().setPositionE(ref.current.position)
        apiBox.rotation.set(0, 0, 0)
        const enemyPos = ref.current.position
        const playerPos = position
        const deltaX = playerPos.x - enemyPos.x
        const deltaZ = playerPos.z - enemyPos.z

        const moveX = () => {
            const goLeftOrRight = deltaX < 0 ? -1 : 1
            const v = Math.abs(deltaX) < 25 ? 5 : 50 +config[difficulty]
            return v * goLeftOrRight
        }
        const moveZ = () => {
            const goUpOrDown = deltaZ < 0 ? -1 : 1
            const v = Math.abs(deltaZ) < 25 ? 5 : 50+config[difficulty]
            return v * goUpOrDown
        }
        if (Math.abs(deltaZ) < 20 && Math.abs(deltaX) < 20) {
            api.getState().setSteps(6)
            console.log("you have died")
        }
        const Vx = moveX()
        const Vz = moveZ()
        apiBox.velocity.set(Vx, 0, Vz)
    })

    return (
        <>
            <mesh ref={ref} >
                <boxBufferGeometry args={args} />
                <meshStandardMaterial color={'darkred'} roughness={0} />
            </mesh>
        </>

    )
}

export default function Enemy(room) {
    this.room = room
}

Enemy.prototype.addEnemy = function () {
    console.log("adding e")
    api.getState().addEnemy(
        <React.Fragment key={this.room.name + 'ENEMY'}>
            <Box key={this.room.name + 'ENEMYobj'} room={this.room} />
        </React.Fragment >
    )
    
}




// export default function Room(doors,x,z) {
//     return new CreateRoom(doors, x, z)
// }
