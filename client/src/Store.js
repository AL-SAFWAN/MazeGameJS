import * as THREE from 'three'
import create from 'zustand'
import axios from 'axios'


const [useStore, api] = create((set, get) => {
  let cancelLaserTO = undefined
  return {
    username: '',
    setName: (username) => set({ username }),
    step: 0,
    setSteps: (step) => set({ step }),
    difficulty: 'Normal',
    setDifficulty: (difficulty) => set({ difficulty }),
    config:{"Normal" :0},
    setConfig:(config) => set({ config }),

    position: new THREE.Vector3(0, 0, 0),
    setPosition: (position) => set({ position }),

    load: true,
    startPosition: new THREE.Vector3(0, 0, 0),
    setStartPosition: (startPosition) => set({ startPosition, load: false }),

    rotation: new THREE.Euler(0, 0, 0),
    setRotation: (rotation) => set({ rotation }),

    positionE: new THREE.Vector3(0, 0, 0),
    setPositionE: (positionE) => set({ positionE }),

    lasers: [],

    rooms: [],
    setRoom: (rooms) => set({ rooms }),
    passage: [],
    addPassage: (p) => set(get().passage.push(p)),


    Enemy: [],
    setEnemy: (Enemy) =>{ set({ Enemy })},
    addEnemy: (e) => set(get().Enemy.push(e)),
    enemyCreateIn: [],
    addEnemyCreateIn: (e) => set(get().enemyCreateIn.push(e)),

    points: 0,

    treasure: [],
    setTreasure: (treasure) => set({ treasure }),
    addTreasure: (e) => {
      set(get().treasure.push(e))
    },
    treasureCreatedIn: [],
    addTreasureCreatedIn: (e) => set(get().treasureCreatedIn.push(e)),
    treasurePickUp: [],
    addTreasurePickUp: (e) => {
      set({ points: get().points + 100 })
      set(get().treasurePickUp.push(e))
    },

    coins: [],
    setCoin: (coins) => set({ coins }),
    addCoin: (e) => {
      set({ points: get().points - 20 })
      set(get().coins.push(e))
    },
    removeCoin: (e) => {
      set({ points: get().points + 20 })
      set({ coins: get().coins.filter(c => { return c.id != e }) })
    },

    doorsOpened: true,
    closeDoors: () => set({ doorsOpened: false }),
    openDoors: () => set({ doorsOpened: true }),

    drop: false,
    pickUp: false,
    setDrop: (b) => set({ drop: b }),
    setPickUp: (b) => set({ pickUp: b }),

    allUsers: {},
    setAllUsers: (allUsers) => set({ allUsers }),

    setUserData: (user) => {
      set({
        username: user.username,
        position: user.position,
        coins: user.coins,
        enemyCreateIn: user.enemyCreateIn,
        treasureCreatedIn: user.treasureCreatedIn,
        treasure: user.treasure,
        points: user.points,
      })
    },
    getUserData: () => {
      const {
        username,
        position,
        coins,
        enemyCreateIn,
        treasureCreatedIn,
        treasure,
        points } = get()

      return {
        username,
        position,
        coins,
        enemyCreateIn,
        treasureCreatedIn,
        treasure,
        points
      }
    },
    reset: () => {

      set({
        coins: [],
        enemyCreateIn: [],
        treasureCreatedIn: [],
        // treasure: [],
        // points: 0,
      })
    },

    actions: {
      shoot() {
        set(state => ({ lasers: [...state.lasers, Date.now()] }))
        clearTimeout(cancelLaserTO)
        cancelLaserTO = setTimeout(() => set(state => ({ lasers: state.lasers.filter(t => Date.now() - t <= 500) })), 500)
        console.log("shoot is preformed at ", get().position)
      },

      updateCurrentUser: () => {
        const {
          username,
          position,
          coins,
          enemyCreateIn,
          treasureCreatedIn,
          treasure,
          points,
          allUsers } = get()

        allUsers[username] = {
          username,
          coins,
          position,
          enemyCreateIn,
          treasureCreatedIn,
          treasure,
          points
        }

        axios.post(`api/users/${JSON.stringify(allUsers)}`)

      }

    }
  }
})

export default useStore

export { api }

