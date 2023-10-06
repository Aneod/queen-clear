import './App.css';
import Map from './map/map';

function App() {

  let lat = 0
  let lng = 0
  let accuracy = 0

  function success(pos: GeolocationPosition) {
    var crd = pos.coords;
    
    lat = crd.latitude
    lng = crd.longitude
    accuracy = crd.accuracy
    // return([crd.latitude, crd.longitude, crd.accuracy])
  }
  const position = navigator.geolocation.getCurrentPosition(success)

  const watcher = navigator.geolocation.watchPosition(success);

  console.log(navigator.geolocation)

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
