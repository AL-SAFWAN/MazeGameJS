import React from 'react'
import { useFrame } from 'react-three-fiber'
import { useBox } from 'use-cannon'
import { api } from '../Store'

let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
const randomX = Math.floor(Math.random() * 150)*plusOrMinus 
const randomZ = Math.floor(Math.random() * 150)*plusOrMinus 

function Box({ args = [9, 5, 8], color = "silver", room }) {

    const { position,treasure,setTreasure ,addTreasurePickUp} = api.getState(state => state)

    console.log(position, room)
    const [ref, apiBox] = useBox(() => ({
        mass: 6, type: "Dynamic", args: args, 
        position: [room.x,, 15, room.z ]
    }))

    useFrame(state => {

        ref.current.position.set(room.x+randomX, (Math.sin(state.clock.elapsedTime * 5) * 1) + 20, room.z+randomZ)
        apiBox.rotation.set(0, 0, 0)
     

        const Treasure = ref.current.position
        const playerPos = position
        const deltaX = playerPos.x - Treasure.x
        const deltaZ = playerPos.z - Treasure.z
        let distance = Math.sqrt((deltaX * deltaX) + (deltaZ * deltaZ))
        // need to add a E press down and distance to pick up the treasure 
        if(api.getState().pickUp && distance< 30){
            
            treasure.pop()
            setTreasure(treasure)
            addTreasurePickUp(room.name)
            console.log("pick up treasure and remove from store")
        }
    })

    return (
        <>
            <mesh ref={ref} >
          <pointLight intensity={30} distance={25} color={"silver"} decay={2}/>
                <boxBufferGeometry args={args} />
                <meshStandardMaterial color={color} roughness={0} />
            </mesh>
        </>
    )
}
export default function Treasure(room) {
    this.room = room
}

Treasure.prototype.addTreasure = function () {
    console.log("adding t", this.room.x)
    api.getState().addTreasure(
        <React.Fragment key={this.room.name + 'Treasure'}>
            <Box key={this.room.name + 'TreasureObj'} room={this.room} />
        </React.Fragment >
    )

}




// export default function Room(doors,x,z) {
//     return new CreateRoom(doors, x, z)
// }
