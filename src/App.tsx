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
    {xPos: 47.9686742, yPos: -1.8663187, size: 100},
    {xPos: 48.0903168, yPos: -1.6842752, size: 100},
  ])

  const GAME_SIZE = 3000

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
    var crd = pos.coords;

    setLat(crd.latitude)
    setLng(crd.longitude)
    setAccuracy(crd.accuracy)

    setListOfNotReachedCircle(crd.latitude, crd.longitude)
  }
  
  const setListOfNotReachedCircle = (lat: number, lng: number) => {

    const listOfNotReachedCircle: {
      xPos: number;
      yPos: number;
      size: number;
    }[] = []

    listOfArea.forEach((circle, index) => {
      if(!inCircle(lat, lng, circle)) listOfNotReachedCircle.push(listOfArea[index])
      else {
        const upToDateGameCircle = gameCircle.xPos == 0 ? {xPos: lat, yPos: lng, size: GAME_SIZE} : gameCircle
        let newCircle: {xPos: number, yPos: number, size: number}
        do newCircle = findClearAreaCoordinates(100, upToDateGameCircle)
        while(!inCircle(newCircle.xPos, newCircle.yPos, upToDateGameCircle) || inCircle(lat, lng, newCircle))

        listOfNotReachedCircle.push(newCircle)

        setWinPoint(winPoint + 1)
      }
    })

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

    return {xPos: newXPos, yPos: newYPos, size}
  }

  const getPosition = () => navigator.geolocation.getCurrentPosition(success)
  setTimeout(getPosition, 1000)

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