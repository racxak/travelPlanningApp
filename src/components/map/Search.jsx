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
      iconAnchor: [12, 41], 
      popupAnchor: [7, -36], 
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

    return () => map.removeControl(searchControl);
  }, [props]);

  return null;
}

export default Search;