import './map.css'
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet'

type Props = {
    lat: number
    lng: number
    accuracy: number
}

const Map: React.FC<Props> = ({lat, lng, accuracy}) => {

    const parcThabor = {
        lat: 48.114434,
        lng: -1.666914
    }

    return <MapContainer center={[47.9686735, -1.8663154]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
            <Popup>
                Starting point
            </Popup>
        </Marker>
        {/* <Circle center={[parcThabor.lat, parcThabor.lng]} pathOptions={{ fillColor: 'white' }} radius={1500} /> */}
        {/* <Circle center={[parcThabor.lat + 0.009, parcThabor.lng + 0.001]} pathOptions={{ fillColor: 'blue' }} radius={100} />
        <Circle center={[parcThabor.lat - 0.005, parcThabor.lng + 0.007]} pathOptions={{ fillColor: 'blue' }} radius={100} />
        <Circle center={[parcThabor.lat + 0.002, parcThabor.lng - 0.004]} pathOptions={{ fillColor: 'blue' }} radius={100} /> */}
    </MapContainer>
}

export default Map