import React, { useRef, useState, useEffect,mapRef } from "react";
import {
	MapContainer,
	Marker,
	TileLayer,
	Popup,
	ScaleControl,
	useMapEvents,
	useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import { Icon, divIcon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { db } from "../../firebase";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import "leaflet-control-geocoder";
import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import L from "leaflet";
import styles from "../../pages/Pages.module.css";
import Search from "./Search";
import { OpenStreetMapProvider } from "leaflet-geosearch";

function MapNewCenterFromMarker({showAt}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(showAt, 13);
  }, [showAt, map]);
    
	return null;
}

function LocateControl({ isLocationAddedRef }) {
	const map = useMap();

	useEffect(() => {
		if (!isLocationAddedRef.current) {
			L.control.locate({ flyTo: true }).addTo(map);
			isLocationAddedRef.current = true;
		}
	}, [map, isLocationAddedRef]);

	return null;
}

const MyMap = ({centerMarker}) => {
	const [showMarkerLocationGeocode, setShowMarkerLocationGeocode] = useState([51.107134757977626, 17.016574168441714])
	const { travelId } = useParams();
	const ZOOM_LEVEL = 13;
	const [userMarkers, setUserMarkers] = useState([]);
	const [newMarker, setNewMarker] = useState(false);
	const [title, setTitle] = useState("");
	const [info, setInfo] = useState("");
	const [error, setError] = useState(false);
	const [openPopupMarkerId, setOpenPopupMarkerId] = useState(null);

	const MapClickHandler = ({ onMapClick}) => {
		useMapEvents({
			click: (e) => {
				onMapClick(e);
			},
		});
		return null;
	};

	const customIcon = new Icon({
		iconUrl: require("../../images/location-pin.png"),
		iconSize: [38, 38],
		iconAnchor: [18, 42],
		popupAnchor: [1.8, -38],
	});

	const createClusterCustomIcon = function (cluster) {
		return new divIcon({
			html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
			className: "custom-marker-cluster",
			iconSize: [38, 38],
		});
	};

	const addMarkerToDatabase = async (marker) => {
		try {
			const journalRef = doc(db, "allJournals", travelId);
			const userMarkersCollectionRef = collection(journalRef, "userMarkers");

			await addDoc(userMarkersCollectionRef, {
				title: marker.title,
				geocode: marker.geocode,
				info: marker.info,
			});
		} catch (error) {
			console.error("Error adding marker: ", error);
		}
	};

	const handleMapClick = (e) => {
		const newLat = e.latlng.lat;
		const newLng = e.latlng.lng;

		const newMarker = {
			id: Date.now(),
			title: ` `,
			geocode: [newLat, newLng],
			info: ` `,
		};

		setUserMarkers((currentMarkers) => [...currentMarkers, newMarker]);
		fetchMarkersFromDatabase(newMarker);
		setOpenPopupMarkerId(newMarker.id);
	};

	const handleSave = (markerId) => {
		const updatedMarker = userMarkers.find((marker) => marker.id === markerId);
		if (updatedMarker) {
			if (title === "") {
				alert(
					"Nie podano tytułu - jest to pole obowiązakowe. UWAGA: bez podania tytyłu i zapisania zmian pienzka zostanie usunięta"
				);
				setError(true);
			} else {
				updatedMarker.title = title;
				updatedMarker.info = info;
				addMarkerToDatabase(updatedMarker);
				setNewMarker(false);
				setError(false);
				setTitle("");
				setInfo("");
			}
		}
	};

useEffect(() => {
	if (centerMarker.length	!==0){
		
	console.log(centerMarker)
  const newLet = centerMarker[0];
  const newLang = centerMarker[1];
  setShowMarkerLocationGeocode([newLet, newLang]);
	}
}, [centerMarker]);

	useEffect(() => {
		fetchMarkersFromDatabase();
	}, []);

	const fetchMarkersFromDatabase = async (newMarker) => {
		const journalRef = doc(db, "allJournals", travelId);
		const userMarkersCollectionRef = collection(journalRef, "userMarkers");

		onSnapshot(userMarkersCollectionRef, (snapshot) => {
			const markersFromDB = snapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));

			if (
				newMarker &&
				!markersFromDB.find(
					(marker) =>
						marker.geocode[0] === newMarker.geocode[0] &&
						marker.geocode[1] === newMarker.geocode[1]
				)
			) {
				setUserMarkers([...markersFromDB, newMarker]);
			} else {
				setUserMarkers(markersFromDB);
			}
		});
	};

	const isLocationAddedRef = useRef(false);

	return (
		<div>
			<MapContainer 
				center= {[51.107134757977626, 17.016574168441714]}
				zoom={ZOOM_LEVEL}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<MapClickHandler onMapClick={handleMapClick} />

				<MarkerClusterGroup
					chunkedLoading
					iconCreateFunction={createClusterCustomIcon}
					maxClusterRadius={30}
				>
					{userMarkers.map((marker) => (
						<Marker
							key={marker.id}
							position={marker.geocode}
							icon={customIcon}
							eventHandlers={{
								add: (e) => {
									if (openPopupMarkerId === marker.id) {
										e.target.openPopup();
									}
								},
							}}
						>
							<Popup className="popup">
								{openPopupMarkerId === marker.id ? (
									<div>
										<input
											type="text"
											placeholder="tytuł"
											value={title}
											onChange={(e) => setTitle(e.target.value)}
											className="input-l"
										/>

										<textarea
											type="text"
											placeholder="notatka (opcjonalnie)"
											value={info}
											onChange={(e) => setInfo(e.target.value)}
											className="input-l"
										/>
										<button
											className={`${styles.btn} btn`}
											onClick={() => handleSave(marker.id)}
										>
											Zapisz
										</button>
									</div>
								) : (
									<div>
										<p id="title">{marker.title}</p>
										<span id="geocode">
											{marker.geocode[0]}, {marker.geocode[1]}
										</span>
										<p  id="note" >{marker.info}</p>
									</div>
								)}
							</Popup>
						</Marker>
					))}
				<MapNewCenterFromMarker showAt={showMarkerLocationGeocode}/>
				</MarkerClusterGroup>
				<ScaleControl />
				<LocateControl isLocationAddedRef={isLocationAddedRef} />
				<Search
					provider={new OpenStreetMapProvider()}
					handleMapClick={handleMapClick}
				/>
			</MapContainer>
		</div>
	);
};

export default MyMap;
