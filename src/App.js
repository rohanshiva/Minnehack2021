import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem, SidebarHeader} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseConfig from "./firebaseConfig";
import MapBox from "./components/MapBox";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";

import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddIcon from '@material-ui/icons/Add';
import LandingPage from "./components/LandingPage";

firebase.initializeApp(firebaseConfig);

export default function App() {
  const [user] = useAuthState(firebase.auth());
  const [collapsed, setCollapsed] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [validated, setValidated] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMesage, setShowErrorMesage] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      console.log("false");
      event.preventDefault();
      event.stopPropagation();
    } else {
      console.log("looks good");
      event.preventDefault();
      event.stopPropagation();

      var fullAdress = address.trim() + "," + city.trim() + "," + zip.trim();

      var url =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        fullAdress +
        ".json?types=address&access_token=pk.eyJ1IjoiY2hhcmxlc3NoaTEyIiwiYSI6ImNrY2dpdWMwbzBxMXAyeW1ra2Y1MHNhM2MifQ.5EFIAkdxG5us-suPI567Xg";

      var response = await fetch(url);
      const data = await response.json();

      console.log(data.features);

      if (data.features.length == 0 || data.features[0].relevance < 0.9) {
        setErrorMessage("Please provide an valid adress");
        setShowErrorMesage(true);
      } else {

        var reformatedAdress = data.features[0].place_name

        var lat = data.features[0].geometry.coordinates[1]
        var lng = data.features[0].geometry.coordinates[0]

        var docRef = firebase.firestore().collection("markers").doc();

        var task = await docRef.set({
          firstName: firstName,
          lastName: lastName,
          info: info,
          latitude: lat,
          longitude: lng,
          address: fullAdress,
          active: true,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        console.log("succes, added marker");
        setShow(false);


      }
    }

    setValidated(true);
  };

  const signIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        console.log("logged in!");
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
  };

  const toggleCollapse = () => {
    if(collapsed == true){
      setCollapsed(false)
    }
    else{
      setCollapsed(true)
    }
  }

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log("Signed out");
      })
      .catch((error) => {
        // An error happened.
        console.log(error.message);
      });
  };

  return (


    <div className="layout">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Marker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="First name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="validationCustom02">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Last name"
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="validationCustom06">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide some info.
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="validationCustom03">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  required
                  onChange={(e) => setCity(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid city.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="State"
                  required
                  onChange={(e) => setState(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid state.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustom05">
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Zip"
                  required
                  onChange={(e) => setZip(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid zip.
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="12" controlId="validationCustom06">
                <Form.Label>Extra Information</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  onChange={(e) => setInfo(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide some info.
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Group>
              <Form.Check
                required
                label="Agree to terms and conditions"
                feedback="You must agree before submitting."
              />
            </Form.Group>
            <Form.Group>
              <Alert variant={"danger"} show={showErrorMesage}>
                {errorMessage}
              </Alert>
            </Form.Group>
            <Button type="submit">Submit form</Button>
          </Form>
        </Modal.Body>
      </Modal>
      <aside>
        <ProSidebar collapsed={collapsed}>
          <Menu iconShape="square">
            <MenuItem onClick={toggleCollapse} icon={<MenuIcon/>}></MenuItem>
            <MenuItem onClick={signIn} >Login</MenuItem>
            <MenuItem onClick={setShow} icon={<AddIcon/>}>Add</MenuItem>
            <MenuItem onClick={signOut} icon={<ExitToAppIcon/>}>Log Out</MenuItem>
          </Menu>
        </ProSidebar>
      </aside>
      <main className="content">
        <div>
          {/* <a href="!#" className="btn" onClick={() => setCollapsed(!collapsed)}>
            Collapse
          </a> */}
          <div>
          {user ? <MapBox /> : <h1> Logged Out</h1>}
          </div>
        </div>
      </main>
    </div>
  );
}
