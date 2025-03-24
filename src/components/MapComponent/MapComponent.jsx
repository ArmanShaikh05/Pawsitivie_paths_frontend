/* eslint-disable react/prop-types */
import "mapbox-gl/dist/mapbox-gl.css"; // Ensure styles are loaded
import Map, { Marker } from "react-map-gl";

const MapComponent = ({ latitude, longitude }) => {
  return (
    <Map
      initialViewState={{
        latitude: latitude,
        longitude: longitude,
        zoom: 10,
      }}
      style={{ width: "100%", height: "100%", borderRadius: "10px" }}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      <Marker latitude={latitude} longitude={longitude} />
    </Map>
  );
};

export default MapComponent;
