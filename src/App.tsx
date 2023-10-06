import './App.css';
import Map from './map/map';
import { useState } from 'react';

function App() {

  let [lat, setLat] = useState(0)
  let [lng, setLng] = useState(0)
  let [accuracy, setAccuracy] = useState(0)

  function success(pos: GeolocationPosition) {
    var crd = pos.coords;

    setLat(crd.latitude)
    setLng(crd.longitude)
    setAccuracy(crd.accuracy)
  }

  navigator.geolocation.getCurrentPosition(success)

  // const modifyPos = () => {
  //   position = navigator.geolocation.getCurrentPosition(success)
  // }

  // setInterval(modifyPos, 1000)

  navigator.geolocation.watchPosition(success);

  return <div className='App'>
    <Map/>
    <div className='infoCoordinates'>
      <p>{lat}</p>
      <p>{lng}</p>
      <p>{accuracy}</p>
    </div>
  </div>
}

export default App;
