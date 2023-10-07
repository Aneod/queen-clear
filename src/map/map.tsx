import './map.css'
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet'

type Props = {
    lat: number
    lng: number
    accuracy: number
    listOfArea: {
        xPos: number;
        yPos: number;
        size: number;
    }[]
    startPoint: {xPos: number, yPos: number, gameSize: number}
}

const Map: React.FC<Props> = ({lat, lng, accuracy, listOfArea, startPoint}) => {

    const createCircles = (listOfArea: {
            xPos: number;
            yPos: number;
            size: number;
        }[]) => {
        return listOfArea.map((circle, i) => {
            return <Circle key={i} center={[circle.xPos, circle.yPos]} pathOptions={{ fillColor: 'blue' }} radius={circle.size} />
        })
      }

    return <MapContainer center={[47.9686735, -1.8663154]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}></Marker>

        {createCircles(listOfArea)}
        <Circle key={'startCircle'} center={[startPoint.xPos, startPoint.yPos]} pathOptions={{ fillColor: 'none', color: 'black' }} radius={startPoint.gameSize} />

    </MapContainer>
}

export default Map