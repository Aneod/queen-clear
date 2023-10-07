import './App.css';
import Map from './map/map';
import { useState } from 'react';

function App() {

  let [lat, setLat] = useState(0)
  let [lng, setLng] = useState(0)
  let [accuracy, setAccuracy] = useState(0)
  let [winPoint, setWinPoint] = useState(0)

  let [gameCircle, setgameCircle] = useState({xPos: 0, yPos: 0, size: 0})

  let [listOfArea, setListOfArea] = useState([
    {xPos: 47.9684735, yPos: -1.8623154, size: 100},
    {xPos: 47.9684735, yPos: -1.8633154, size: 100},
    {xPos: 47.9684735, yPos: -1.8643154, size: 100},
  ])

  const GAME_SIZE = 200

  if(gameCircle.size === 0 && lat !== 0 && lng !== 0) setgameCircle({xPos: lat, yPos: lng, size: GAME_SIZE})

  const inCircle = (lat: number, lng: number, circle: { xPos: number, yPos: number, size: number }) => {
    if(
        lat < circle.xPos + .000008993 * circle.size &&
        lat > (circle.xPos + .000008993 * circle.size) - 2 * circle.size * .000008993 &&
        lng < circle.yPos + .000013464 * circle.size &&
        lng > (circle.yPos + .000013464 * circle.size) - 2 * circle.size * .000013464
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
    var crd = pos.coords;

    setLat(crd.latitude)
    setLng(crd.longitude)
    setAccuracy(crd.accuracy)
  }

  function error() {
    setLat(0)
    setLng(0)
    setAccuracy(0)
  }

  
  const setListOfNotReachedCircle = () => {
    let allCircleTests: boolean[] = []
    listOfArea.forEach(circle => {
      allCircleTests.push(inCircle(lat, lng, circle))
    })

    const listOfNotReachedCircle: {
      xPos: number;
      yPos: number;
      size: number;
    }[] = []

    allCircleTests.forEach((isReached, index) => {
      if(!isReached) listOfNotReachedCircle.push(listOfArea[index])
      else {
        const newCircle = findClearAreaCoordinates(100)
        listOfNotReachedCircle.push(newCircle)
        setWinPoint(winPoint + 1)
      }
    })

    setListOfArea(listOfNotReachedCircle)
  }

  const findClearAreaCoordinates = (size: number) => {

    let newXPos = 0
    let newYPos = 0
    do{
      newXPos = getRandomLatInGame
      newYPos = getRandomLngInGame
    } while(!inCircle(newXPos, newYPos, gameCircle) && inCircle(lat, lng, {xPos: newXPos, yPos: newYPos, size}))

    return {xPos: newXPos, yPos: newYPos, size}
  }

  const getRandomArbitrary = (min: number, max: number) => Math.random() * (max - min) + min

  const getRandomLatInGame = getRandomArbitrary(
    gameCircle.xPos + .000008993 * gameCircle.size,
    (gameCircle.xPos + .000008993 * gameCircle.size) - 2 * gameCircle.size * .000008993
  )

  const getRandomLngInGame = getRandomArbitrary(
    gameCircle.yPos + .000013464 * gameCircle.size,
    (gameCircle.yPos + .000013464 * gameCircle.size) - 2 * gameCircle.size * .000013464
  )

  setTimeout(setListOfNotReachedCircle, 1000)

  navigator.geolocation.watchPosition(success, error)

  return <div className='App'>
    <Map
      lat = {lat}
      lng = {lng}
      accuracy={accuracy}
      listOfArea = {listOfArea}
      gameCircle = {gameCircle}
    />
    <div className='infoCoordinates'>
      <p>xPos: {lat}</p>
      <p>yPos: {lng}</p>
      <p>Accuracy: {Math.floor(accuracy)}m</p>
      <p>Winpoint: {winPoint}</p>
    </div>
  </div>
}

export default App;
