import React, { useState, useEffect } from "react";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { PythonShell } from 'python-shell';

const State = {
  idle: 0,
  started: 1,
  finished: 2,
  error: 3
};

export default function Transmit({userId, ...props}) {
  const [show, setShow] = useState(false);
  const [state, setState] = useState(State.started);
  const [script, setScript] = useState(null);

  const handleTransmit = () => {
    const options = {
      mode: 'text',
      // pythonPath:
      pythonOptions: ['-u'],
      scriptPath: './scripts/',
      args: [userId]
    };

    if (script) {
      PythonShell.run(script, options, (err, results) => {
        if (err) {
          console.error(err);
          setState(State.error);
        } else {
          setState(State.finished);
        }
        console.log('results: ', results);
      });
    } else {
      console.error('no script is set to execute');
      setState(State.finished);
    }
  };

  const handleOpenForDevice = (script) => {
    setShow(true);
    setScript(script);
    setState(State.started);
  };

  const handleClose = () => setShow(false);

  useEffect(() => {
    if (show) {
      handleTransmit();
    }
    // console.log("Transmit open modal changed state to: ", show);
  }, [show]);

  useEffect(() => {
    if (state == State.finished)
    {
      setTimeout(() => {
        console.log("should be closing now");
        handleClose();
      }, 3000); // 3 seconds testing
    }
  }, [state]);

  return (
    <div>
      <Row>
        <Col>
          <Button variant="info" onClick={() => handleOpenForDevice("pi_ble_uv.py")}>
            Transmit UV Sensor
          </Button>
        </Col>
        <Col>
          <Button variant="info" onClick={() => handleOpenForDevice("pi_ble_steps.py")}>
            Transmit Pedometer
          </Button>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <center>
            {
              (state == State.started)
                ? (<div>
                    <p> Getting data from the devices </p>
                    <Spinner animation="border" role="status" />
                  </div>)
                : (<div/>)
            }
            {
              (state == State.error) ? (<p>Error: cannot find the device</p>) : (<p/>)
            }
          </center>
        </Modal.Body>
        <Modal.Footer>
          {
            (state == State.finished) ? (<p>Closing in 3 secs</p>) : (<p/>)
          }
          <Button variant="info"
                  onClick={handleClose} >
            Cancel
          </Button>
          <Button variant="primary"
                  onClick={handleClose}
                  disabled={state != State.finished} >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
