import React, { useRef, useEffect } from 'react'
import { addEffect, addTail } from 'react-three-fiber'

export default function Fps() {
    let ref = useRef()
    useEffect(() => {
        let decimalPlacesRatio = Math.pow(10, 0)
        let timeMeasurements = []
        let fps = 0
        let last = -1
        let msPassed = 0
        // addEffect is like a global useFrame, it runs every time r3f renders
        const unsub1 = addEffect(() => {
            timeMeasurements.push(performance.now())
            msPassed = timeMeasurements[timeMeasurements.length - 1] - timeMeasurements[0]
            if (msPassed >= 0.25 * 1000) {
                fps = Math.round((timeMeasurements.length / msPassed) * 1000 * decimalPlacesRatio) / decimalPlacesRatio
                timeMeasurements = []
            }
            if (fps !== last) ref.current.innerText = 'fps ' + fps
            last = fps
        })
        // addTail is another global effect that is called once rendering stops
        const unsub2 = addTail(() => (ref.current.innerText = 'fps 0'))
        return () => (unsub1(), unsub2())
    }, [])
    return <div className="fps" ref={ref} style={{ position: 'absolute',  top: '15px', left: '15px', width: '300px'}} />
}

