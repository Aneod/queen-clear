import './map.css'
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet'

type Props = {
    lat: number
    lng: number
    accuracy: number
    listOfArea: {
        xPos: number;
        yPos: number;
        size: number;
        lifeTime: number;
    }[]
    gameCircle: {xPos: number, yPos: number, size: number}
    restrictedCircle: {xPos: number, yPos: number, size: number}
    CHECKPOINT_TIMELAPSE_M: number
    COORDS_FINAL_CHECKPOINT: number[]
}

const Map: React.FC<Props> = ({lat, lng, accuracy, listOfArea, gameCircle, restrictedCircle, CHECKPOINT_TIMELAPSE_M, COORDS_FINAL_CHECKPOINT}) => {

    const circlesColor = 'green'

    const createCircles = (listOfArea: {
            xPos: number;
            yPos: number;
            size: number;
            lifeTime: number;
        }[]) => {
        return listOfArea.map((circle, i) => {

            const printTimeLapse = (lifeTime: number) => {

                if(lifeTime >= 3600){
                    return `Temps restant: ${Math.trunc(lifeTime/3600)}h ${Math.trunc((lifeTime%3600)/60)}m ${(lifeTime%3600)%60}s`
                }
                if(lifeTime >= 60){
                    return `Temps restant: ${Math.trunc(lifeTime/60)}m ${lifeTime%60}s`
                }
                return `Temps restant: ${lifeTime}s`
            }

            const colorByTimeLapse = (lifeTime: number, CHECKPOINT_TIMELAPSE_M: number) => {

                const totalSeconds = CHECKPOINT_TIMELAPSE_M * 60
                const secondsOfRest = lifeTime

                const ratio = secondsOfRest/totalSeconds

                const red = 255 - (255 * ratio)
                const green = 255 * ratio

                return `rgb(${red}, 0, ${green})`
            }

            if(circle.size > 0){
                return <Circle key={i} center={[circle.xPos, circle.yPos]} pathOptions={{ fillColor: colorByTimeLapse(circle.lifeTime, CHECKPOINT_TIMELAPSE_M), color: colorByTimeLapse(circle.lifeTime, CHECKPOINT_TIMELAPSE_M) }} radius={circle.size}>
                    <Popup>
                        {printTimeLapse(circle.lifeTime)}
                    </Popup>
                </Circle>
            }
        })
      }

    return <MapContainer center={[lat, lng]} zoom={14} scrollWheelZoom={true}>
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}></Marker>
        <Marker position={[COORDS_FINAL_CHECKPOINT[0], COORDS_FINAL_CHECKPOINT[1]]}></Marker>

        {createCircles(listOfArea)}
        <Circle key={'restrictedCircle'} center={[restrictedCircle.xPos, restrictedCircle.yPos]} pathOptions={{ fillColor: 'none', color: 'red' }} radius={restrictedCircle.size} />
        <Circle key={'gameCircle'} center={[gameCircle.xPos, gameCircle.yPos]} pathOptions={{ fillColor: 'none', color: 'black' }} radius={gameCircle.size} />

    </MapContainer>
}

export default Map