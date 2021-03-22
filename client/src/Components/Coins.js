import React, { useEffect, useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import { api } from '../Store'





function ACoin({ args = [2, 2, 1, 32, 32], p, id }) {

    const { position, coins, setCoin } = api.getState(state => state)
    const ref = useRef()


    useEffect(() => {
        ref.current.position.set(p.x, 3, p.z)
        coins[coins.length - 1].p = ref.current.position
        setCoin(coins)
    }, [])

    useFrame(state => {
        // console.log(api.getState().points)

        ref.current.rotation.set(Math.PI / 2, 0, state.clock.elapsedTime * Math.PI / 2)

        const coin = ref.current.position
        const playerPos = position
        const deltaX = playerPos.x - coin.x
        const deltaZ = playerPos.z - coin.z
        let distance = Math.sqrt((deltaX * deltaX) + (deltaZ * deltaZ))

        if (api.getState().pickUp && distance < 20) {

            console.log("pick up Coin and remove from store", id)
            api.getState().removeCoin(id)

            console.log("pick up Coin and remove from store", api.getState().coins)
        }
    })
    return (
        <>
            <mesh ref={ref} >
                <pointLight intensity={1} distance={5} decay={1.5} />
                <cylinderBufferGeometry args={args} />
                <meshStandardMaterial color={'gold'} roughness={0} />
            </mesh>
        </>
    )

}

export default function Coin() { }

Coin.prototype.addCoin = function (p) {
    const id = Math.random()

    api.getState().addCoin(
        { p, id }
    )

}

Coin.prototype.makeCoin = function (p, id) {

    return (
        <React.Fragment key={id}>
            <ACoin key={id + 'coinObj'} p={p} id={id} />
        </React.Fragment >
    )

}

