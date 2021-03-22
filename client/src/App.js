
import React, {  useState, useEffect } from 'react'
import { loadRoom } from './Components/Maze'
import  { api } from './Store'
import './index.css';
import Menu from './Components/Menu'
import Game from './Game'
import axios from 'axios'
import Fps from './Components/Fps'


function App() {
  const { setAllUsers,setConfig } = api.getState(state => state)

  const [inMenu, setInMenu] = useState(false)

  useEffect(() => {
    loadRoom()
    // this will get the information
    axios.get('/api/users').then((res, req) => {
      let data = JSON.parse(res.data)
      console.log(data)
      setAllUsers(data)
    })
    axios.get('/api/game').then((res, req) => {
      let data = JSON.parse(res.data)
      console.log(data)
      setConfig(data)
    })
  }, [setAllUsers])


  return (
    <>
      {inMenu && <Game inMenu={inMenu} />}
      <Menu inMenu={inMenu} setInMenu={setInMenu} />
      <Fps />
    </>
  );
}

export default App;
