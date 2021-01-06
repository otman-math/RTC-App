import React from 'react';
import {
  Button, Container, Row, Col
} from 'react-bootstrap';
import Videochat from './Videochat';
import VideoServer from './VideoServer';

const Part1 = () => (
  <Videochat />
);

const Part2 = () => (
  <VideoServer />
);

const Home = () => {
  const [part, setPart] = React.useState('home');

  const handleClick = (condition) => {
    setPart(condition);
  };
  switch (part) {
    case 'home':
      return (
        <Container>
          <Row>
            <Col md="6">
              <Button onClick={() => handleClick('part1')}>Tester Part 1</Button>

            </Col>
            <Col md="6">
              <Button onClick={() => handleClick('part2')}>Tester Part 2</Button>
            </Col>
          </Row>
        </Container>
      );
    case 'part1':
      return (
        <div>
          <Button onClick={() => handleClick('home')}>Home</Button>
          <Part1 />
        </div>
      );
    case 'part2':
      return (
        <div>
          <Button onClick={() => handleClick('home')}>Home</Button>
          <Part2 />
        </div>
      );

    default:
      return null;
  }
};
export default Home;
