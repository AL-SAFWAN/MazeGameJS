import React from 'react'
import { Chip, Grid, Button, Paper, FormControl, RadioGroup, FormControlLabel, Radio, MenuItem } from '@material-ui/core';
import * as THREE from "three"
import useStore, { api } from '../Store'
import axios from 'axios'
import './menu.css'
import {

    TextField,
    Typography,

} from "@material-ui/core";

export default function Menu({ setInMenu }) {
    const { points, username, setName, step, setSteps, setDifficulty, difficulty, reset, allUsers, setUserData } = useStore()
    setInMenu(false)
    switch (step) {
        case 0:
            return <OnLoad step={step} setSteps={setSteps} />

        case 1:
            return <NewGame step={step} setSteps={setSteps} setName={setName} username={username} reset={reset} />
        case 2:
            return <Options step={step} setSteps={setSteps} setDifficulty={setDifficulty} difficulty={difficulty} />
        case 3:
            return <>
                <InGame points={points} username={username} difficulty={difficulty} setSteps={setSteps} setInMenu={setInMenu}></InGame>
            </>
        case 5:
            return <>
                <LoadOldGame setUserData={setUserData} points={points} allUsers={allUsers} difficulty={difficulty} setSteps={setSteps} setInMenu={setInMenu} reset={reset} />
            </>
        case 6:
            return <>
                <Dead setUserData={setUserData} points={points} allUsers={allUsers} difficulty={difficulty} setSteps={setSteps} setInMenu={setInMenu} reset={reset} />
            </>
        default:
            return <OnLoad step={step} setSteps={setSteps} />
    }
}

const Dead = ({ points = 0, reset, setInMenu, setSteps }) => {
    setInMenu(false)
    return (<>
        <div id={'center'} style={{ position: "absolute", margin: 'auto' }}>
            <Paper
                id={'list'}
                style={{
                    margin: "auto",
                    height: 450,
                    width: 800,
                    textAlign: "center",
                    position: "absolute",
                    top: "50%"
                }}
                elevation={3}
            >
                <h1> Total Score :{points}/400 </h1>
            </Paper>
        </div>
    </>)
}

const LoadOldGame = ({ setSteps, allUsers, reset, setUserData }) => {
    console.log(allUsers)
    const [name, setName] = React.useState('');
    const username = Object.keys(allUsers)
    const handleChange = (event) => {
        setName(event.target.value);
        allUsers[event.target.value].username = event.target.value
        setUserData(allUsers[event.target.value])
    };

    return (<>
        <div id={'center'} style={{ position: "absolute", margin: 'auto' }}>
            <Paper

                id={'list'}
                style={{
                    margin: "auto",
                    height: 450,
                    width: 800,
                    textAlign: "center",
                    position: "absolute",
                    top: "50%"
                }}
                elevation={3}
            >
                <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{ paddingTop: 0 }}
                >
                    Load an old game
            </Typography>
                <form noValidate autoComplete="off" style={{ margin: '50px' }}>
                    <TextField
                        id="selectUsername"
                        select
                        label="Select"
                        value={name}
                        onChange={handleChange}
                        helperText="Please select a username"
                    >
                        {username.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </form>
                <div style={{ display: 'flex' }}>
                    <Button id={'button'}
                        style={{ marginRight: 100, marginTop: 20 }}
                        variant="contained"
                        disabled={name == ''}
                        onClick={() => {
                            setSteps(3)
                            console.log(allUsers)

                        }}
                    >
                        Start game
            </Button>
                    <Button id={'button'}
                        style={{ marginLeft: 100, marginTop: 20 }}
                        variant="contained"
                        onClick={() => {
                            setSteps(0)

                        }}
                    >
                        Back
            </Button>
                </div>
            </Paper>
        </div>
    </>)
}


const InGame = ({ points, username, difficulty, setSteps, setInMenu }) => {
    setInMenu(true)
    return (
        <div style={{ position: "absolute", top: "0", margin: 50, width: `${window.innerWidth - window.innerWidth / 6}px` }}>
            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="flex-start"
            >
                <div>
                    <Chip label={'|W|A|S|D| ← movement'} variant="outlined" size={"small"} style={{ marginRight: 10 }} />
                    <Chip label={'shift ← run'} variant="outlined" size={"small"} style={{ marginRight: 10 }} />
                    <Chip label={'space ← shoot'} variant="outlined" size={"small"} style={{ marginRight: 10 }} />
                    <Chip label={'Q ← drop coin'} variant="outlined" size={"small"} style={{ marginRight: 10 }} />
                    <Chip label={'E ← pick up item'} variant="outlined" size={"small"} style={{ marginRight: 10 }} />
                </div>
                <Chip label={`Score : ${points}`} variant="outlined" size={"small"} />
                <div>
                    <Chip label={`Username : ${username}`} variant="outlined" size={"small"} style={{ marginRight: 10 }} />
                    <Chip label={`Difficulty : ${difficulty}`} variant="outlined" size={"small"} />
                </div>

            </Grid>
        </div>

    )
}

const OnLoad = ({ setSteps }) => {

    return (<>
        <div id={'center'} style={{ position: "absolute", margin: 'auto' }}>
            <Paper
                id={'list'}
                style={{
                    margin: "auto",
                    height: 450,
                    width: 800,
                    textAlign: "center",
                    position: "absolute",
                    top: "50%"
                }}
                elevation={3}
            >
                <Button id={'button'} variant="contained" size="large" color="primary" style={{ margin: '50px' }}
                    onClick={() => setSteps(1)}>
                    New Game
        </Button>
                <Button id={'button'} variant="contained" size="large" color="primary" style={{ margin: '50px' }}
                    onClick={() => setSteps(5)}>
                    Load Old Game
        </Button>
                <Button id={'button'} variant="contained" size="large" color="primary" style={{ margin: '50px' }}
                    onClick={() => setSteps(2)}>
                    Options
        </Button>
            </Paper>
        </div>
    </>)
}

const NewGame = ({ setSteps, username, setName, reset }) => {
    const {  getUserData,  allUsers, rooms, setUserData } = api.getState(state => state)
    let randomNumber = Math.floor((Math.random() * 9))
    let r = rooms[randomNumber].position
    let p = new THREE.Vector3(r[0], 0, r[1])
    console.log(p)
    const createUser = () => {
        const {
            username,
            coins,
            enemyCreateIn,
            treasureCreatedIn,
            treasure,
            points } = getUserData()
        if (Object.keys(allUsers).length === 0) {
            let user = {}
            const userData = {
                username,
                coins,
                enemyCreateIn,
                treasureCreatedIn,
                treasure,
                points,
                position: p
            }

            user[username] = userData
            setUserData(user[username])
            axios.post(`api/users/${JSON.stringify(user)}`)
        } else {
            const userData = {
                username,
                coins,
                enemyCreateIn,
                treasureCreatedIn,
                treasure,
                points,
                position: p
            }
            allUsers[username] = userData
            setUserData(allUsers[username])
            axios.post(`api/users/${JSON.stringify(allUsers)}`)
        }
    }
    return (<>
        <div id={'center'} style={{ position: "absolute", margin: 'auto' }}>
            <Paper
                id={'list'}
                style={{
                    margin: "auto",
                    height: 450,
                    width: 800,
                    textAlign: "center",
                    position: "absolute",
                    top: "50%"
                }}
                elevation={3}
            >
                <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{ paddingTop: 0 }}
                >
                    Start a new game
            </Typography>
                <FormControl>
                    <TextField
                        // id={'button'}
                        name={"username"}
                        key={"username"}
                        label={"Enter your user name"}
                        style={{ margin: 50, width: 350, textAlign: "center" }}
                        value={username}
                        onChange={e => {
                            setName(e.target.value);
                        }}
                        variant="outlined"
                    ></TextField>
                </FormControl>
                <div style={{ display: 'flex' }}>
                    <Button id={'button'}
                        style={{ marginRight: 100, marginTop: 20 }}
                        variant="contained"
                        disabled={username == ''}
                        onClick={() => {
                            createUser()
                            setSteps(3)

                        }}
                    >
                        Start game
            </Button>
                    <Button id={'button'}
                        style={{ marginLeft: 100, marginTop: 20 }}
                        variant="contained"
                        onClick={() => {
                            setSteps(0)

                        }}
                    >
                        Back
            </Button>
                </div>
            </Paper>
        </div>
    </>)
}

const Options = ({ setSteps, difficulty, setDifficulty }) => {

    const handleChange = (event) => {
        setDifficulty(event.target.value);
    };
    return (<>

        <div id={'center'} style={{ position: "absolute", margin: 'auto' }}>
            <Paper

                id={'list'}
                style={{
                    margin: "auto",
                    height: 450,
                    width: 800,
                    textAlign: "center",
                    position: "absolute",
                    top: "50%"
                }}
                elevation={3}
            >
                <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    style={{ paddingTop: 0 }}
                >
                    Options
            </Typography>

                <FormControl component="fieldset">
                    <RadioGroup aria-label="op" name="op" value={difficulty} onChange={handleChange}>
                        {/* Use config file to set the values here */}
                        <FormControlLabel value="Hard" control={<Radio />} label="Hard" />
                        <FormControlLabel value="Normal" control={<Radio />} label="Normal" />
                        <FormControlLabel value="Easy" control={<Radio />} label="Easy" />

                    </RadioGroup>
                </FormControl>

                <Button id={'button'}
                    style={{ marginTop: 50 }}
                    variant="contained"

                    onClick={() => setSteps(0)}
                    value="Sign In!"
                >
                    Go back
            </Button>
            </Paper>
        </div>
    </>)


}




