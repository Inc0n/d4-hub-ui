import React, { useState, useEffect } from "react";

import Image from 'react-bootstrap/Image';

import avatar1 from '../../assets/avatar-1.png';
import avatar2 from '../../assets/avatar-2.png';
import avatar3 from '../../assets/avatar-3.png';
import avatar4 from '../../assets/avatar-4.png';
import avatar5 from '../../assets/avatar-5.png';


// Constants
const stages = 5;
const avatars = [ avatar1, avatar2, avatar3, avatar4, avatar5 ];


function calcUserFifth(user, users) {
  let totalUsersScore = 0;

  const scores = users.map(user => user.score);
  const scoremax = Math.max(...scores);
  const scoremin = Math.min(...scores);

  const scoreratio = (user.score - scoremin) / (scoremax - scoremin);
  // console.log("the fifth:", user.score, scoremin, scoremax, scoreratio);
  return Math.floor(scoreratio * stages);
};


// Params
// forUser - the user to render the avatar for
// users - the list of users to compute the fifth portion
//
export default function Avatar({forUser, users, ...props}) {
  const currentUser = forUser;
  const [imageSrc, setImageSrc] = useState(avatar1);
  const [userGroup, setUserGroup] = useState(1);

  useEffect(() => {
    updateAvatar(currentUser);
  }, [currentUser]);

  const updateAvatar = (user) => {
    const fifth = calcUserFifth(user, users);
    if (fifth > stages || fifth < 0) {
      console.warn("Unexpected fifth: ", fifth);
    } else {
      const _userStage = Math.min(stages, fifth + 1);
      setImageSrc(avatars[_userStage - 1]);
      setUserGroup(_userStage);
    }
  };

  return (
    <>
      <h2>Avatar</h2>

      { currentUser.devices
        ? <Image src={imageSrc} fluid />
        : <p>You haven't made any progress yet!</p>
      }

      <p>Your current grouping relative to your colleagues is: {userGroup}</p>
      <p>Improving your group to a higher one means the mask on your avatar
      moves to a better position and that your are improving your health quicker
      compared to your colleagues!</p>
    </>
  );
};
