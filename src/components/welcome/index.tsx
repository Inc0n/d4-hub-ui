import React, { useState } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

// props can be
// users - array of user object to test for username uniqueness
// handleCreation - creation handler on valid username, also to finish popup
export default function Welcome({users, ...props}) {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameFeedback, setUsernameFeedback] = useState("");

  const handleCreation = props.handleCreation;

  const userExistp = (name) => users.find(user => name === user.name);

  // also allow space actually
  const usernameAlphanumericp = (name) => {
    const alphaNumeric = /^[A-Za-z0-9 ]+$/;
    return alphaNumeric.test(name);
  };

  const usernameValidp = (name) =>
        (!userExistp(name)) && usernameAlphanumericp(name) && (name.length != 0);

  const onUsernameChange = (event) => {
    const input = event.target; // the username input element
    const name = event.target.value;
    const alphaNumericp = usernameAlphanumericp(name);
    const emptyUserNamep = name.length == 0;
    const invalidUserNamep = !alphaNumericp || userExistp(name) || emptyUserNamep;

    if (invalidUserNamep) {
      input.classList.add("is-invalid");
      if (emptyUserNamep) {
        setUsernameFeedback("Username is empty");
      } else
        setUsernameFeedback(alphaNumericp
                            ? "Username already exist"
                            : "Username must be alphanumric");
    } else {
      input.classList.remove("is-invalid");
    }
    setUsername(name);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() && usernameValidp(username)) {
      setValidated(true);
      // DONE: redirect back to starting page
      handleCreation(username);
    } else {
      console.error("User '", username, "' is not valid!");
      event.stopPropagation();
      setValidated(false); // force bad validation
    }
  };

  return (
    <Row className="justify-content-md-center text-center">
      <Col sm={8}>
        <h2>Welcome to</h2>
        <h1>M A S K</h1>
        <br />
        <h5>Let's get you started shortly...</h5>

        <br />
        <br />

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Row className="align-items-center">
            <Col sm={10}>
              <InputGroup id="username" size="lg">
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    User name
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  required
                  autoFocus
                  type="text"
                  id="usernameInput"
                  onChange={onUsernameChange} />
                <Form.Control.Feedback type="invalid">
                  {usernameFeedback}
                </Form.Control.Feedback>
              </InputGroup>
	        </Col>

            <Col>
	          <Button type="submit" className="my-1" size="lg">Create</Button>
	        </Col>
	      </Form.Row>
        </Form>
      </Col>
    </Row>
  );
};
