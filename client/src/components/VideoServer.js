import React, { useEffect } from 'react';
import {
  ButtonToolbar, Button, Container, Col, Row
} from 'react-bootstrap';
import SignalingConnection from './SignalingConnection';


let signalingConnection;

const style = {
  fontSize: 20,
  color: '#080808',
  textAlign: 'center',
  backgroundColor: '#F5F5F5',
  width: 200,
  height: 35,
  margin: '5%'
};


const VideoServer = () => {
  const [startAvailable, setStart] = React.useState(true);
  const [callAvailable, setCall] = React.useState(false);
  const [hangupAvailable, setHangup] = React.useState(false);
  const localVideoRef = React.useRef(null);
  const localStreamRef = React.useRef(null);
  const remoteVideoRef = React.useRef(null);
  const username = React.useRef(null);
  const [clientID, setClientID] = React.useState(null);
  const [listUsers, setlistUsers] = React.useState([]);
  const call = () => {
    setCall(false);
    setHangup(true);
    localStreamRef.current
      .getTracks();
  };
  const onSignalingMessage = (msg) => {
    console.log('signaling message : ', msg);
    switch (msg.type) {
      case 'id':
        setClientID(msg.id);
        break;
      case 'rejectusername':
        console.log('rejectusername');
        break;
      case 'userlist': // Received an updated user list
        setlistUsers((msg.users).map((user) => (
          <h3 key={user}>
            {user}
            {' '}
            <Button onClick={() => { call(user); }} disabled={!callAvailable}>
              <span aria-label="call" role="img">📞</span>
            </Button>
          </h3>
        )));
        break;
      // Signaling messages: these messages are used to trade WebRTC
      // signaling information during negotiations leading up to a video
      // call.
      case 'connection-offer': // Invitation and offer to chat
        console.log('connection-offer');
        break;
      case 'connection-answer': // Callee has answered our offer
        console.log('connection-answer');
        break;
      case 'new-ice-candidate': // A new ICE candidate has been received
        console.log('new-ice-candidate');
        break;
      case 'hang-up': // The other peer has hung up the call
        console.log('hang-up');
        break;
      default:
        console.log('Default');
    }
  };

  useEffect(() => {
    signalingConnection = new SignalingConnection({
      socketURL: window.location.host,
      onOpen: () => { console.log('signalingConnection open'); },
      onMessage: onSignalingMessage,
    });
  }, []);

  const gotStream = (stream) => {
    localVideoRef.current.srcObject = stream;
    setCall(true); // On fait en sorte d'activer le bouton permettant de commencer un appel
    localStreamRef.current = stream;
  };

  const start = () => {
    setStart(false);
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(gotStream)
      .catch((e) => {
        console.log(e);
        alert(`getUserMedia() error:${e.name}`);
      });
  };

  /* const gotRemoteStream = (event) => {
    [remoteVideoRef.current.srcObject] = event.streams;
  };
*/
  const hangUp = () => {
    setHangup(false);
    setCall(true);
  };

  const pushUsername = () => {
    signalingConnection.sendToServer({
      name: username.current.value,
      date: Date.now(),
      id: clientID,
      type: 'username',
    });
  };

  return (
    <div>
      <div>
        <Container>
          <Row className="justify-content-md-center">
            <Col xs lg="2">
              <input
                style={style}
                type="text"
                placeholder="select contact "
                id="username"
                name="UserName"
                ref={username}
              />

            </Col>
            <Col xs lg="2">
              <Button variant="primary" onClick={() => pushUsername()}>
                <span aria-label="check mark" role="img"> ✔</span>
              </Button>

            </Col>
          </Row>
        </Container>
      </div>
      <ul>{listUsers}</ul>
      <video ref={localVideoRef} autoPlay muted>
        <track kind="captions" srcLang="en" label="english_captions" />
      </video>
      <video ref={remoteVideoRef} autoPlay>
        <track kind="captions" srcLang="en" label="english_captions" />
      </video>
      <ButtonToolbar>
        <Container>
          <Row className="justify-content-md-center">
            <Col xs lg="2">
              <Button onClick={start} disabled={!startAvailable}>
          Start
              </Button>

            </Col>
            <Col xs lg="2">
              <Button variant="danger" onClick={hangUp} disabled={!hangupAvailable}>
          Hang Up
              </Button>
            </Col>
          </Row>
        </Container>
      </ButtonToolbar>
    </div>
  );
};
export default VideoServer;
