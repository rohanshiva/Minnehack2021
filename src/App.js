import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem, SidebarHeader } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import "./styles.css";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseConfig from "./firebaseConfig";
import MapBox from "./components/MapBox";

import Add from "./components/Modal";
import { render } from "@testing-library/react";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

firebase.initializeApp(firebaseConfig);

export default function App() {
  const [user] = useAuthState(firebase.auth());
  const [collapsed, setCollapsed] = useState(false);

  const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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

  const renderModal = () => {
    render(Add);
  };

  return (
    <div className="layout">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Marker</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <aside>
        <ProSidebar collapsed={collapsed}>
          <Menu iconShape="square">
            <MenuItem>Home</MenuItem>
            <MenuItem onClick={signIn}>Login</MenuItem>
            <MenuItem onClick={setShow}>Add</MenuItem>
            <MenuItem onClick={signOut}>Log Out</MenuItem>
          </Menu>
        </ProSidebar>
      </aside>
      <main className="content">
        <div>
          <a href="!#" className="btn" onClick={() => setCollapsed(!collapsed)}>
            Collapse
          </a>
          {user ? <MapBox /> : <h1> Logged Out</h1>}
        </div>
      </main>
    </div>
  );
}
