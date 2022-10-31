
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Store from 'electron-store';

import firebase from "./../../util/firebase";
import calcUserTotalScores from './../../util/score.js';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button } from 'react-bootstrap';

import Leaderboard from "../leaderboard";
import Avatar from "../avatar";
import Welcome from "../welcome";
import UserDetail from "../userdetail";
import Transmit from "../transmit";


function renderMain(userId, users) {
  // const users = users.sort();
  const currentUser = users.find(({ id }) => id === userId);
  if (!currentUser) {
    console.error("user not found", userId);
  }
  return (
    <div>
      <Row>
        <Col sm={8}>
          <UserDetail forUser={currentUser} users={users} />
        </Col>

	    <Col sm={4}>
	      <h2>Transfer Data</h2>
	      <p>Select the device below you want to transfer data from</p>

          <Transmit userId={userId}/>
        </Col>
      </Row>

      <br />
      <br />

      <Row>
        <Col sm={8}>
          <Leaderboard users={users} rows={5} />
        </Col>

        <Col sm={4}>
          <Avatar forUser={currentUser} users={users} />
        </Col>
      </Row>
    </div>
  );
}

function Main() {
  const [users, setUsers] = useState([]);
  const [weightings, setWeightings] = useState({});

  const db = firebase.firestore();
  const usersRef = db.collection('users');
  const weightingsRef = db.collection('weightings');

  // the store should have the following structure
  // {
  //   username: username,
  //   id: unique identifier
  // }
  const store = new Store();
  const loadUserConfig = () => store.store;

  // NOTE: current user is different than the user object in users
  // Stores the json object of the config loaded via electron-store
  const [userConfig, setUserConfig] = useState({id: null, name: ""});

  useEffect(() => {
    weightingsRef.onSnapshot(snapshot => {
      const newWeightings = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        newWeightings[doc.id] = data.weighting;
      });
      console.log("new weightings", newWeightings);
      setWeightings(newWeightings);
    });

    usersRef.onSnapshot(snapshot => {
      const snapData = snapshot.docs.map(doc => {
        const user = doc.data();
        user.id = doc.id;
        return user;
      });

      calcUserTotalScores(snapData, weightings);
      setUsers(snapData);
    });

    // TODO: remove in final
    // The following can force a user creation
    // store.set('username', "apple");
    // store.set('id', null);
    setUserConfig(loadUserConfig());
  }, []);

  useEffect(() => {
    setUserConfig(loadUserConfig());
  }, [users]);

  // just to make sure the correct scores will be calculated
  useEffect(() => {
    calcUserTotalScores(users, weightings);
  }, [weightings]);

  // the callback function when we can proceed setting up user
  // creation for the hub, naming could be changed
  const handleCreation = (username) => {
    // TODO: this is for testing, for finals remove and uncomment the following block
    // store.set({username: username, id: "testuser2"});
    createUser(username);
    console.log("user creation handled", username, userConfig);
  };

  const createUser = (username) => {
    usersRef.add({ name: username })
      .then((userRef) => {
        store.set({username: username,
                   id: userRef.id});
        setUserConfig(loadUserConfig());

        console.log("User added with ID: ", userRef.id);
      }).catch((error) => {
        console.error("Error adding user: ", error);
      });
  };

  // Just for testing
  console.log("Users: ", users);
  console.log("Current user: ", userConfig);

  return (!users || users.length == 0)
    ? null
    : (
      <Container>
        { userConfig.id
          ? renderMain(userConfig.id, users)
          : <Welcome users={users} handleCreation={handleCreation} /> }
      </Container>
    );
};

export default Main;
