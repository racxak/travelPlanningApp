import "./Map.css";
import React, {useEffect} from "react";
import { Map, useLeaflet, useMap} from 'react-leaflet'
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch'
import locationPinIcon from "../../images/location-pin2.png";
import L from "leaflet";
import "../../../node_modules/leaflet-geosearch/assets/css/leaflet.css"

const Search = (props) => {
  const map = useMap();
  const { provider } = props;

  useEffect(() => {

    const customIcon = new L.Icon({
      iconUrl: locationPinIcon,
      iconSize: [38, 38], 
  		iconAnchor: [18, 42], 
  		popupAnchor: [1.8, -38], 
    });
    
    const searchControl = new GeoSearchControl({
      provider,
      showMarker: true, 
      position: 'topright',
      marker: {
        icon: customIcon 
      }
    });

    map.addControl(searchControl);

    map.on('geosearch/showlocation', (e) => {
      const handleAddToJourneyClick = () => {
        const fakeEvent = { latlng: L.latLng(e.location.y, e.location.x) };
        props.handleMapClick(fakeEvent); 
      };
    
      const popupContent = L.DomUtil.create('div');

      const addP = L.DomUtil.create('p', '', popupContent);
      addP.innerText = `${e.location.label}`;

      const addButton = L.DomUtil.create('button', '', popupContent);
      addButton.style.backgroundColor = 'transparent';
      addButton.style.color = '#2596be';
      addButton.innerText = 'Dodaj do podróży';


      L.DomEvent.on(addButton, 'click', handleAddToJourneyClick);
    
      e.marker.bindPopup(popupContent).openPopup();

  });

  return () => {
    map.removeControl(searchControl);
    map.off('geosearch/showlocation');
    delete window.handleAddToJourneyClick;
  };
  }, [props]);

  return null;
}

export default Search;