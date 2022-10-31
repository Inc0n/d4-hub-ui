import React from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function dataDatetoString(secs) {
  return new Date(secs * 1000).toDateString();
}

// This function could be simplified a lot further in production
function userMostRecentDate(user) {
  if (user === null || user.devices == null)
    return "None";

  const devices = user.devices;
  const devNames = Object.keys(user.devices);
  const mostrecent = devNames.reduce((mostrecent, devName) => {
    const devData = devices[devName];
    const mostrecentOfthisDevice = // find the most recent date from just this device
          devData.reduce((mostrecent, dateddata) =>
            Math.max(mostrecent, dateddata.date.seconds),
            0);
    // finally find the most recent date from all of the devices
    return Math.max(mostrecent, mostrecentOfthisDevice);
  }, 0);
  return dataDatetoString(mostrecent);
}

export default function UserDetail({forUser, users, ...props}) {
  const currentUser = forUser;
  // don't forget sort modify the original array;
  users.sort((a, b) => b.score - a.score);
  const rank = 1 + users.findIndex(user => user === currentUser);

  return (
    <>
      <h1>Welcome {currentUser.name}</h1>
      <h5>You are currently rank <b>{rank}</b> of {users.length}</h5>
      <p>Last progress on: {userMostRecentDate(currentUser)}</p>
    </>
  );
};
