import Room from './Room'
import Passage from './Passage'
import {api} from '../Store'

const room1 = new Room([1, 1, 1, 1], 5, 13, "room1",true,false)
const room2 = new Room([1, 1, 1, 1], 8, 9, "room2",true,true)
const room3 = new Room([1, 1, 1, 1], 1, 7, "room3",true,false)
const room4 = new Room([1, 1, 1, 1], -9, 10, "room4",true,true)
const room5 = new Room([1, 1, 1, 0], -2, 10, "room5",true,false)
const room6 = new Room([1, 1, 1, 1], -5, 7, "room6",true,true)
const room7 = new Room([0, 1, 1, 1], 5, 4, "room7",true,false)
const room8 = new Room([0, 1, 1, 1], -9, 4, "room8", false, true)
const room9 = new Room([1, 1, 0, 1], 13, 13, "room9", true, false)
const end = new Room([1, 0, 0, 0], 5,16, "end", false,false)

const rooms = [
  room1,
  room2,
  room3,
  room4,
  room5,
  room6,
  room7,
  room8,
  room9,
end,]

const loadRoom =()=>{
api.getState().setRoom(rooms)
}

// // // self connection 
room4.selfConnect('W','S')
room6.selfConnect('N','W')
room3.selfConnect('N','W')
room2.selfConnect('E', 'S')
room9.selfConnect('N','E')

// // room connection 
const passage = new Passage()
passage.proxyCreatePassage(room1,room2,'N','W')
passage.proxyCreatePassage(room1,room5,'W','S')
passage.proxyCreateDirectPassage(room1,room9, 'E')
passage.proxyCreatePassage(room2,room7,"N","E")
passage.proxyCreatePassage(room5, room3, 'E', 'S')
passage.proxyCreatePassage(room5,room6, 'N','E')
passage.proxyCreatePassage(room4, room6,'E','S')
passage.proxyCreateDirectPassage(room4,room8, "N")
passage.proxyCreateDirectPassage(room8,room7, "E")
passage.proxyCreatePassage(room3,room7, 'E','S')
passage.proxyCreateDirectPassage(end,room1, 'N')

export {loadRoom}