import './App.css';
import Map from './map/map';
import { useState } from 'react';

function App() {

  let [lat, setLat] = useState(0)
  let [lng, setLng] = useState(0)
  let [accuracy, setAccuracy] = useState(0)
  let [winPoint, setWinPoint] = useState(0)

  let [gameCircle, setgameCircle] = useState({xPos: 0, yPos: 0, size: 0})

  const NB_CHECKPOINT = 20
  const GAME_SIZE = 3000
  const CHEKPOINT_SIZE = 100
  const CHECKPOINT_TIMELAPSE_M = 15
  const UPDATE_GAME_TIMELAPSE_MS = 1000
  
  const GAME_TIME_M = 60.1
  const COORDS_FINAL_CHECKPOINT = [48.0943168, -1.7142752]
  const SPEED_OF_WALK_KMH = 3

  let [restrictedCircle, setRestrictedCircle] = useState({xPos: 0, yPos: 0, size: 0})

  const MAX_MINUTES_MOVE_IN_GAME = (GAME_SIZE / (SPEED_OF_WALK_KMH * 1000)) * 60
  const SPEED_OF_CLOSING_M_TIMELAPSE = (GAME_SIZE - CHEKPOINT_SIZE)/(MAX_MINUTES_MOVE_IN_GAME*60)

  let [restMinutesGame, setRestMinutesGame] = useState(GAME_TIME_M)

  if(restrictedCircle.size == 0 && restMinutesGame <= MAX_MINUTES_MOVE_IN_GAME){
    console.log('restriction')
    setRestrictedCircle({xPos: gameCircle.xPos, yPos: gameCircle.yPos, size: GAME_SIZE})
  }

  const createAllEmptyCheckpoints = () => {
    const listOfChekpointNumber = []
    for(let i = 0; i < NB_CHECKPOINT; i++){
      listOfChekpointNumber.push(i)
    }
    return listOfChekpointNumber.map(number => {
      return {xPos: 0, yPos: 0, size: 0, lifeTime: CHECKPOINT_TIMELAPSE_M * 60}
    })
  }

  let [listOfArea, setListOfArea] = useState(createAllEmptyCheckpoints())

  if(gameCircle.size === 0 && lat !== 0 && lng !== 0) {
    setgameCircle({xPos: lat, yPos: lng, size: GAME_SIZE})
  }

  const inCircle = (lat: number, lng: number, circle: { xPos: number, yPos: number, size: number }) => {

    if(
      lat < circle.xPos + .000008993 * circle.size &&
      lat > circle.xPos - .000008993 * circle.size &&
      lng < circle.yPos + .000013464 * circle.size &&
      lng > circle.yPos - .000013464 * circle.size
    ){
      const currentLat = (lat - circle.xPos) / (.000008993 * circle.size)
      const sqrtLat = Math.pow(currentLat * 2, 2)

      const currentLng = (lng - circle.yPos) / (.000013464 * circle.size)
      const sqrtLng = Math.pow(currentLng * 2, 2)

      return sqrtLat + sqrtLng <= 4
    }
    return false
  }

  function success(pos: GeolocationPosition) {

    if(restrictedCircle.size != 0 && restrictedCircle.size > CHEKPOINT_SIZE){
      setRestrictedCircle({
        xPos: restrictedCircle.xPos - (gameCircle.xPos - COORDS_FINAL_CHECKPOINT[0]) / (MAX_MINUTES_MOVE_IN_GAME * 60),
        yPos: restrictedCircle.yPos - (gameCircle.yPos - COORDS_FINAL_CHECKPOINT[1]) / (MAX_MINUTES_MOVE_IN_GAME * 60),
        size: restrictedCircle.size - SPEED_OF_CLOSING_M_TIMELAPSE
      })

      console.log({
        xPos: restrictedCircle.xPos - (gameCircle.xPos - COORDS_FINAL_CHECKPOINT[0]) / (MAX_MINUTES_MOVE_IN_GAME * 60),
        yPos: restrictedCircle.yPos - (gameCircle.yPos - COORDS_FINAL_CHECKPOINT[1]) / (MAX_MINUTES_MOVE_IN_GAME * 60),
        size: restrictedCircle.size - SPEED_OF_CLOSING_M_TIMELAPSE
      })
    }

    setRestMinutesGame(restMinutesGame - UPDATE_GAME_TIMELAPSE_MS/(1000 * 60))

    var crd = pos.coords;

    setLat(crd.latitude)
    setLng(crd.longitude)
    setAccuracy(crd.accuracy)

    setListOfNotReachedCircle(crd.latitude, crd.longitude)
  }

  const printTimeLapse = (lifeTime: number) => {

    lifeTime = lifeTime * 60

    if(lifeTime >= 3600){
        return `Temps restant: ${Math.trunc(lifeTime/3600)}h ${Math.trunc((lifeTime%3600)/60)}m ${Math.trunc((lifeTime%3600)%60)}s`
    }
    if(lifeTime >= 60){
        return `Temps restant: ${Math.trunc(lifeTime/60)}m ${Math.trunc(lifeTime%60)}s`
    }
    return `Temps restant: ${Math.trunc(lifeTime)}s`
  }
  
  const setListOfNotReachedCircle = (lat: number, lng: number) => {

    const listOfNotReachedCircle: {
      xPos: number;
      yPos: number;
      size: number;
      lifeTime: number;
    }[] = []

    const addFreeArea = () => {
      const upToDateGameCircle = gameCircle.xPos == 0 ? {xPos: lat, yPos: lng, size: GAME_SIZE} : gameCircle
      const actualLimitCircle = restrictedCircle.size != 0 ? restrictedCircle : upToDateGameCircle
      let newCircle: {xPos: number, yPos: number, size: number, lifeTime: number}
      do newCircle = findClearAreaCoordinates(CHEKPOINT_SIZE, upToDateGameCircle)
      while(!inCircle(newCircle.xPos, newCircle.yPos, actualLimitCircle) || inCircle(lat, lng, newCircle))

      return newCircle
    }

    let winPointAdded = 0
    listOfArea.forEach((circle, index) => {
      if(circle.size == 0) listOfNotReachedCircle.push(addFreeArea())

      else if(circle.lifeTime - UPDATE_GAME_TIMELAPSE_MS/1000 <= 0){
        listOfNotReachedCircle.push(addFreeArea())
      }

      else if(!inCircle(lat, lng, circle)) {
        const newCircle = {xPos: listOfArea[index].xPos, yPos: listOfArea[index].yPos, size: listOfArea[index].size, lifeTime: listOfArea[index].lifeTime - UPDATE_GAME_TIMELAPSE_MS/1000}
        listOfNotReachedCircle.push(newCircle)
      }

      else {
        listOfNotReachedCircle.push(addFreeArea())
        winPointAdded += 1
      }
    })

    setWinPoint(winPointAdded)
    setListOfArea(listOfNotReachedCircle)
  }

  const findClearAreaCoordinates = (size: number, upToDateGameCircle: { xPos: number, yPos: number, size: number }) => {

    const getRandomArbitrary = (min: number, max: number) => Math.random() * (max - min) + min;

    const xMax = .000008993 * upToDateGameCircle.size
    const yMax = .000013464 * upToDateGameCircle.size

    const xRadius = getRandomArbitrary(-xMax, xMax)
    const yRadius = getRandomArbitrary(-yMax, yMax)

    const newXPos = upToDateGameCircle.xPos + xRadius
    const newYPos = upToDateGameCircle.yPos + yRadius

    return {xPos: newXPos, yPos: newYPos, size, lifeTime: CHECKPOINT_TIMELAPSE_M * 60}
  }

  const getPosition = () => navigator.geolocation.getCurrentPosition(success)
  setTimeout(getPosition, UPDATE_GAME_TIMELAPSE_MS)

  if(restMinutesGame == 0){
    alert('Jeu terminé')
  }

  if(gameCircle.size == 0){
    return <div className='App'>
    </div>
  }
  return <div className='App'>
    <Map
      lat = {lat}
      lng = {lng}
      accuracy={accuracy}
      listOfArea = {listOfArea}
      gameCircle = {gameCircle}
      restrictedCircle = {restrictedCircle}
      COORDS_FINAL_CHECKPOINT = {COORDS_FINAL_CHECKPOINT}
      CHECKPOINT_TIMELAPSE_M = {CHECKPOINT_TIMELAPSE_M}
    />
    <div className='infoCoordinates'>
      <p>Accuracy: {Math.floor(accuracy)}m</p>
      <p>Winpoint: {winPoint}</p>
      <p>{printTimeLapse(restMinutesGame)}</p>
    </div>
  </div>
}

export default App;