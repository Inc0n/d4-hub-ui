import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import { Line } from 'react-chartjs-2';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button, ButtonGroup, ToggleButton } from 'react-bootstrap';

import { getUserDeviceDateLabels, getUserDeviceDatasets, getUserAccScoreDatasets } from './../../util/score.js';

function filterDataset(datasets, devName) {
  const matchedset = datasets.find((dataset) => dataset.label == devName);
  return [matchedset];
}

export default function User(props) {
  const user = props.location.user;
  const devices = user.devices || {};

  const labels = getUserDeviceDateLabels(user);
  const normalDatasets = getUserDeviceDatasets(user);
  const accDatasets = getUserAccScoreDatasets(normalDatasets);

  const [accGraphStyle, setAccGraphStyle] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState(null);
  const [userLineData, setUserLineData] = useState({
    labels: labels,
    datasets: accDatasets,
  });

  const updateLineDataDatasets = () => {
    const datasets = accGraphStyle ? accDatasets : normalDatasets;
    const filteredDatasets = deviceFilter
          ? filterDataset(datasets, deviceFilter)
          : datasets;
    setUserLineData({labels: labels, datasets: filteredDatasets});
  };
  useEffect(updateLineDataDatasets, [deviceFilter, accGraphStyle]);

  return (
    <Container>
      <Link to="/">
        <Button variant="outline-dark">
          Go Home
        </Button>
      </Link>

      <br />
      <br />

      <h2>{user.name}'s Progression</h2>
      <Row>
        <Line
          data={userLineData}
          width={100}
          height={50}
          options={{
            maintainAspectRatio: true,
          }}
        />
      </Row>

      <br />

      <Row>
        <Col>
	  <h5>Devices owned: </h5>
          <ButtonGroup toggle>
            <ToggleButton
              type="checkbox"
              variant="info"
              name="radio"
              checked={deviceFilter === null}
              onClick={(e) => setDeviceFilter(null)}>
              All
            </ToggleButton>
            {
              Object.keys(devices).map((devName, idx) => (
                <ToggleButton
                  key={idx}
                  type="checkbox"
                  variant="info"
                  name="radio"
                  checked={deviceFilter === devName}
                  onClick={(e) => setDeviceFilter(devName)}>
                  {devName == 'uv sensor' ? 'UV Sensor' : 'Pedometer'}
                </ToggleButton>))
            }
          </ButtonGroup>
        </Col>

	<Col>
          <h5>Graph style: </h5>
          <ButtonGroup toggle>
            {
              [["Accumulative", true], ["Normal", false]].map(([name, val], idx) => (
                <ToggleButton
                  key={idx}
                  type="checkbox"
                  variant="warning"
                  name="radio"
                  checked={accGraphStyle === val}
                  onClick={(e) => setAccGraphStyle(val)}>
                  {name}
                </ToggleButton>))
            }
          </ButtonGroup>
	</Col>
      </Row>
    </Container>
  );
};
