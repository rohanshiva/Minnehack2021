import React from "react";
import { useState, useEffect } from "react";
import DATA from "../data/restaurants.json";

import firebase from "firebase/app";
import "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

// DATA = firebase.get('');

import MapGL, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";

import Pins from "./Pins";

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 20;

function MapBox() {
  const [popupInfo, setPopupInfo] = useState(null);
  const [data, setData] = useState([]);

  const [viewport, setViewport] = useState({
    latitude: 37,
    longitude: 95,
    zoom: 0,
    bearing: 0,
    pitch: 0,
  });

  useEffect(() => {

    firebase.firestore().collection("markers").where("active", "==", true)
    .onSnapshot(function(snapshot) {

      var temp = [...data]

        snapshot.forEach(function(doc) {
          console.log(doc.data())
            temp.push(doc.data());
        });
        
        setData(temp)

    });

  }, []);
  const geolocateStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    padding: "10px",
  };

  const fullscreenControlStyle = {
    position: "absolute",
    top: 36,
    left: 0,
    padding: "10px",
  };

  const navStyle = {
    position: "absolute",
    top: 72,
    left: 0,
    padding: "10px",
  };

  const scaleControlStyle = {
    position: "absolute",
    bottom: 36,
    left: 0,
    padding: "10px",
  };

  return (
    <MapGL
      {...viewport}
      width="100vw"
      height="100vh"
      mapStyle="mapbox://styles/charlesshi12/ckkaa0jmg33kc18r75ibr03zd"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      mapboxApiAccessToken="pk.eyJ1IjoiY2hhcmxlc3NoaTEyIiwiYSI6ImNrY2dpdWMwbzBxMXAyeW1ra2Y1MHNhM2MifQ.5EFIAkdxG5us-suPI567Xg"
    >
      <Pins
        data={data}
        onClick={(e) => {
          setPopupInfo(e);
        }}
      ></Pins>

      {popupInfo && (
        <Popup
          style={{ backgroundColor: "red" }}
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => setPopupInfo(null)}
        >
          <h1>{popupInfo.info}</h1>
        </Popup>
      )}
      <div style={geolocateStyle}>
        <GeolocateControl />
      </div>
      <div style={fullscreenControlStyle}>
        <FullscreenControl />
      </div>
      <div style={navStyle}>
        <NavigationControl />
      </div>
      <div style={scaleControlStyle}>
        <ScaleControl />
      </div>
    </MapGL>
  );
}

export default MapBox;
