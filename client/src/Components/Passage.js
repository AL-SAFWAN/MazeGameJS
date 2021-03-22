import React from 'react'
import { useBox } from 'use-cannon'
import { api } from '../Store'

// a passage is made up of 3 walls
const Wall = (props) => {
    const { rotation, position, size, color } = props
    const [ref] = useBox(() => ({ mass: 100, type: "Static", rotation, position, args: size }))
    return (
        <mesh ref={ref}>
            <boxBufferGeometry attach="geometry" args={size} />
            <meshStandardMaterial color={"lightblue"} />
        </mesh>
    )
}

const verticalPassageFromDoor = (door, size, room) => {
    if (door === 'N') {
        const length = 200 + (size / 2)
        return verticalPassage(room, length, size)
    }
    if (door === 'S') {
        const length = -200 - (size / 2)
        return verticalPassage(room, length, size)
    }
}

const horizontalPassageFromDoor = (door, size, room) => {
    if (door === 'E') {
        const length = -200 - (size / 2)
        return horizontalPassage({ x: room.x, z: room.z }, length, size)
    }
    if (door === 'W') {
        const length = 200 + (size / 2)
        return horizontalPassage({ x: room.x, z: room.z }, length, size)
    }
}


const verticalPassage = (position, length, size) => {
    return (<>
        <Wall rotation={[0, 0, 0]} position={[35 + position.x, 35, position.z - length]} size={[20, 70, size]} />
        <Wall rotation={[0, 0, 0]} position={[-35 + position.x, 35, position.z - length]} size={[20, 70, size]} />
        <Wall rotation={[0, 0, 0]} position={[0 + position.x, 80, position.z - length]} size={[90, 20, size]} />
    </>)
}

const horizontalPassage = (position, length, size) => {
    return (<>
        <Wall rotation={[0, 0, 0]} position={[position.x - length, 35, 35 + position.z]} size={[size, 70, 20]} />
        <Wall rotation={[0, 0, 0]} position={[position.x - length, 35, -35 + position.z]} size={[size, 70, 20]} />
        <Wall rotation={[0, 0, 0]} position={[position.x - length, 80, 0 + position.z]} size={[size, 20, 90]} />
    </>)
}


// corner connector 
const RightTopCorner = (x, z) => {
    return <>
        <Wall rotation={[0, 0, 0]} position={[35 + x, 35, 0 + z]} size={[20, 70, 50]} />
        <Wall rotation={[0, 0, 0]} position={[10 + x, 35, -35 + z]} size={[70, 70, 20]} />
        <Wall rotation={[0, 0, 0]} position={[10 + x, 80, -10 + z]} size={[70, 20, 70]} />
    </>
}
const LeftTopCorner = (x, z) => {
    return <>
        <Wall rotation={[0, 0, 0]} position={[-35 + x, 35, 0 + z]} size={[20, 70, 50]} />
        <Wall rotation={[0, 0, 0]} position={[-10 + x, 35, -35 + z]} size={[70, 70, 20]} />
        <Wall rotation={[0, 0, 0]} position={[-10 + x, 80, -10 + z]} size={[70, 20, 70]} /></>
}
const LeftBottomCorner = (x, z) => {
    return <>
        <Wall rotation={[0, 0, 0]} position={[-35 + x, 35, 0 + z]} size={[20, 70, 50]} />
        <Wall rotation={[0, 0, 0]} position={[-10 + x, 35, 35 + z]} size={[70, 70, 20]} />
        <Wall rotation={[0, 0, 0]} position={[-10 + x, 80, 10 + z]} size={[70, 20, 70]} /></>
}
const RightBottomCorner = (x, z) => {
    return <>
        <Wall rotation={[0, 0, 0]} position={[35 + x, 35, 0 + z]} size={[20, 70, 50]} />
        <Wall rotation={[0, 0, 0]} position={[10 + x, 35, 35 + z]} size={[70, 70, 20]} />
        <Wall rotation={[0, 0, 0]} position={[10 + x, 80, 10 + z]} size={[70, 20, 70]} /></>
}



const selfConnectNE = (room) => {
    return <>
        {horizontalPassage({ x: 25 + room.x, z: -270 - 55 + room.z }, -275 / 2, 275)}
        {RightTopCorner(270 + 55 + room.x, -270 - 55 + room.z)}
        {LeftTopCorner(room.x, -270 - 55 + room.z)}

        {RightBottomCorner(270 + 55 + room.x, room.z)}

        {verticalPassage({ x: 270 + 55 + room.x, z: -25 + room.z }, 275 / 2, 275)}
        {horizontalPassageFromDoor('E', 100, room)}
        {verticalPassageFromDoor("N", 100, room)}
    </>

}
const selfConnectES = (room) => {
    return <>
        {verticalPassageFromDoor("S", 100, room)}
        {horizontalPassage({ x: 25 + room.x, z: 270 + 55 + room.z }, -275 / 2, 275)}
        {LeftBottomCorner(room.x, 270 + 55 + room.z)}

        {RightBottomCorner(270 + 55 + room.x, 270 + 55 + room.z)}

        {horizontalPassageFromDoor('E', 100, room)}
        {RightTopCorner(270 + 55 + room.x, room.z)}
        {verticalPassage({ x: 270 + 55 + room.x, z: 25 + room.z }, -275 / 2, 275)}
    </>
}
const selfConnectSW = (room) => {
    return <>

        {verticalPassageFromDoor("S", 100, room)}
        {horizontalPassage({ x: -25 + room.x, z: 270 + 55 + room.z }, 275 / 2, 275)}
        {RightBottomCorner(room.x, 270 + 55 + room.z)}

        {LeftBottomCorner(-270 - 55 + room.x, 270 + 55 + room.z)}

        {horizontalPassageFromDoor('W', 100, room)}
        {LeftTopCorner(-270 - 55 + room.x, room.z)}
        {verticalPassage({ x: -270 - 55 + room.x, z: 25 + room.z }, -275 / 2, 275)}

    </>
}

const selfConnectWN = (room) => {
    return <>
        {verticalPassageFromDoor("N", 100, room)}
        {horizontalPassage({ x: -25 + room.x, z: -270 - 55 + room.z }, 275 / 2, 275)}
        {RightTopCorner(room.x, -270 - 55 + room.z)}

        {LeftTopCorner(-270 - 55 + room.x, -270 - 55 + room.z)}

        {horizontalPassageFromDoor('W', 100, room)}
        {LeftBottomCorner(-270 - 55 + room.x, room.z)}
        {verticalPassage({ x: -270 - 55 + room.x, z: -25 + room.z }, 275 / 2, 275)}

    </>
}

export default function Passage(room1, room2, room1Door, room2Door) {
    this.room1 = room1
    this.room2 = room2
    this.room1Door = room1Door
    this.room2Door = room2Door
}

Passage.prototype.proxyCreatePassage = function (room1, room2, room1Door, room2Door) {
    new Passage(room1, room2, room1Door, room2Door).createPassage()

}
Passage.prototype.proxyCreateDirectPassage = function (room1, room2, door) {
    new Passage(room1, room2, null, null).directConnect(door)
}
Passage.prototype.createPassage = function () {
    const deltaX = this.room2.x - this.room1.x
    const deltaZ = this.room2.z - this.room1.z
    // if diagonal 
    if (deltaX > 0 && deltaZ > 0) {
        if (this.room1Door === "S" && this.room2Door === "W") {
            api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
                {/* this is for the inner connectors  */}
                {verticalPassageFromDoor("S", Math.abs(deltaZ) - 200 - 25, this.room1)}
                {LeftBottomCorner(this.room1.x, this.room2.z)}
                {horizontalPassageFromDoor("W", Math.abs(deltaX) - 200 - 25, this.room2)}
            </React.Fragment>)
        }
        if (this.room1Door === "E" && this.room2Door === "N") {
            api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
                {/* this is for the inner connectors  */}
                {verticalPassageFromDoor("N", Math.abs(deltaZ) - 200 - 25, this.room2)}
                {RightTopCorner(this.room2.x, this.room1.z)}
                {horizontalPassageFromDoor("E", Math.abs(deltaX) - 200 - 25, this.room1)}
            </React.Fragment>)
        }
    }
    if (deltaX > 0 && deltaZ < 0) {
        if (this.room1Door === "N" && this.room2Door === "W") {
            api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
                {/* this is for the inner connectors  */}
                {verticalPassageFromDoor("N", Math.abs(deltaZ) - 200 - 25, this.room1)}
                {LeftTopCorner(this.room1.x, this.room2.z)}
                {horizontalPassageFromDoor("W", Math.abs(deltaX) - 200 - 25, this.room2)}
            </React.Fragment>)
        }
        if (this.room1Door === "E" && this.room2Door === "S") {
            api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
                {/* this is for the inner connectors  */}
                {verticalPassageFromDoor("S", Math.abs(deltaZ) - 200 - 25, this.room2)}
                {RightBottomCorner(this.room2.x, this.room1.z)}
                {horizontalPassageFromDoor("E", Math.abs(deltaX) - 200 - 25, this.room1)}
            </React.Fragment>)
        }
    } else { console.log("Room position error ") }
    if (deltaX < 0 && deltaZ < 0) {
        if (this.room1Door === "N" && this.room2Door === "E") {
            api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
                {/* this is for the inner connectors  */}
                {verticalPassageFromDoor("N", Math.abs(deltaZ) - 200 - 25, this.room1)}
                {RightTopCorner(this.room1.x, this.room2.z)}
                {horizontalPassageFromDoor("E", Math.abs(deltaX) - 200 - 25, this.room2)}
            </React.Fragment>)
        }
        if (this.room1Door === "W" && this.room2Door === "S") {
            api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
                {/* this is for the inner connectors  */}
                {verticalPassageFromDoor("S", Math.abs(deltaZ) - 200 - 25, this.room2)}
                {LeftBottomCorner(this.room2.x, this.room1.z)}
                {horizontalPassageFromDoor("W", Math.abs(deltaX) - 200 - 25, this.room1)}
            </React.Fragment>)
        }
    } else { console.log("Room position error ") }
    if (deltaX < 0 && deltaZ > 0) {
        if (this.room1Door === "W" && this.room2Door === "N") {
            api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
                {/* this is for the inner connectors  */}
                {verticalPassageFromDoor("N", Math.abs(deltaZ) - 200 - 25, this.room2)}
                {LeftTopCorner(this.room2.x, this.room1.z)}
                {horizontalPassageFromDoor("W", Math.abs(deltaX) - 200 - 25, this.room1)}
            </React.Fragment>)
        }
        if (this.room1Door === "S" && this.room2Door === "E") {
            api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
                {/* this is for the inner connectors  */}
                {verticalPassageFromDoor("S", Math.abs(deltaZ) - 200 - 25, this.room1)}
                {RightBottomCorner(this.room1.x, this.room2.z)}
                {horizontalPassageFromDoor("E", Math.abs(deltaX) - 200 - 25, this.room2)}
            </React.Fragment>)
        }
    } else { console.log("Room position error ") }

}

Passage.prototype.directConnect = function (door) {
    // NE EN
    const deltaX = this.room2.x - this.room1.x
    const deltaZ = this.room2.z - this.room1.z

    if (deltaX === 0 && deltaZ < 0 && door === 'N') {
        console.log("going north")
        api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
            {verticalPassageFromDoor("N", Math.abs(deltaZ) - 400, this.room1)}
        </React.Fragment>)
    }
    if (deltaX === 0 && deltaZ > 0 && door === 'S') {
        console.log("going south")
        api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
            {verticalPassageFromDoor("S", Math.abs(deltaZ) - 400, this.room1)}
        </React.Fragment>)
    }
    if (deltaZ === 0 && deltaX < 0 && door === 'W') {
        console.log("going west")
        api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2.name + this.room2Door}>
            {horizontalPassageFromDoor("W", Math.abs(deltaX) - 400, this.room1)}
        </React.Fragment>)
    }
    if (deltaZ === 0 && deltaX > 0 && door === 'E') {
        console.log("going east")
        api.getState().addPassage(<React.Fragment key={this.room1.name + this.room1Door + this.room2Door}>
            {horizontalPassageFromDoor("E", Math.abs(deltaX) - 400, this.room1)}
        </React.Fragment>)
    }
}


Passage.prototype.selfConnect = function (room, d1, d2) {
    // NE EN
    if (d1 === 'N' && d2 === "E" || d1 === 'E' && d2 === "N") {
        api.getState().addPassage(
            selfConnectNE(room))
    }
    // ES SE
    if (d1 === 'E' && d2 === 'S' || d1 === 'S' && d2 === 'W') {
        api.getState().addPassage(
            selfConnectES(room))
    }
    // SW WS
    if (d1 === 'S' && d2 === "W" || d1 === 'W' && d2 === "S") {
        api.getState().addPassage(
            selfConnectSW(room))
    }
    //WN NW
    if (d1 === 'W' && d2 === 'N' || d1 === 'N' && d2 === 'W') {
        api.getState().addPassage(
            selfConnectWN(room))
    }
}


