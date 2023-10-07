import './App.css';
import Map from './map/map';
import { useState } from 'react';

function App() {

  let [lat, setLat] = useState(0)
  let [lng, setLng] = useState(0)
  let [accuracy, setAccuracy] = useState(0)

  let [listOfArea, setListOfArea] = useState([
    {xPos: 47.9696735, yPos: -1.8683154, size: 50},
    {xPos: 47.9686735, yPos: -1.8683154, size: 50},
    {xPos: 47.9684735, yPos: -1.8643154, size: 50},
  ])

  const GAME_SIZE = 200

  let startPoint
  if(!startPoint){
    startPoint = {xPos: lat, yPos: lng, gameSize: GAME_SIZE}
  }

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

    modifyPos()
  }

  
  const modifyPos = () => {
    let allCircleTests: boolean[] = []
    listOfArea.forEach(circle => {
      allCircleTests.push(inCircle(lat, lng, circle))
    })

    const listOfNotReachedCircle: {
      xPos: number;
      yPos: number;
      size: number;
    }[] = []

    allCircleTests.forEach((isHere, index) => {
      if(!isHere) listOfNotReachedCircle.push(listOfArea[index])
    })

    setListOfArea(listOfNotReachedCircle)
  }

  // setTimeout(modifyPos, 1000)

  navigator.geolocation.watchPosition(success)

  return <div className='App'>
    <Map
      lat = {lat}
      lng = {lng}
      accuracy={accuracy}
      listOfArea = {listOfArea}
      startPoint = {startPoint}
    />
    <div className='infoCoordinates'>
      <p>{lat}</p>
      <p>{lng}</p>
      <p>{accuracy}</p>
    </div>
  </div>
}

export default App;