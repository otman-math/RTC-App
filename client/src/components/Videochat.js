import React from 'react';
import {
  ButtonToolbar, Button, Container, Row, Col
} from 'react-bootstrap';

const VideoChat = () => {
  const [startAvailable, setStart] = React.useState(true);
  const [callAvailable, setCall] = React.useState(false);
  const [hangupAvailable, setHangup] = React.useState(false);
  const localVideoRef = React.useRef(null);
  const localStreamRef = React.useRef(null);
  const client1Ref = React.useRef(null);
  const client2Ref = React.useRef(null);
  const remoteVideoRef = React.useRef(null);
  const serversRef = React.useRef(null);
  const onIceStateChange = (param1, param2) => {
    console.log(param1, param2);
  };
  const onCreateAnswerSuccess = (desc) => {
    client1Ref.current.setRemoteDescription(desc).then(
      () => console.log('client1 setRemoteDescription complete createAnswer'),
      (error) => console.error(
        'client1 Failed to set session description in onCreateAnswer',
        error.toString()
      )
    );
    client2Ref.current.setLocalDescription(desc).then(
      () => console.log('client2 setLocalDescription complete createAnswer'),
      (error) => console.error(
        'client2 Failed to set session description in onCreateAnswer',
        error.toString()
      )
    );
  };
  const onCreateOfferSuccess = (desc) => {
    client1Ref.current.setLocalDescription(desc).then(
      () => console.log('client1 setLocalDescription complete createOffer'),
      (error) => console.error(
        'client1 Failed to set session description in createOffer',
        error.toString()
      )
    );
    client2Ref.current.setRemoteDescription(desc).then(
      () => {
        console.log('client2 setRemoteDescription complete createOffer');
        client2Ref.current
          .createAnswer()
          .then(onCreateAnswerSuccess, (error) => console.error(
            'client2 Failed to set session description in createAnswer',
            error.toString()
          ));
      },
      (error) => console.error(
        'client2 Failed to set session description in createOffer',
        error.toString()
      )
    );
  };
  const onIceCandidate = (pc, event) => {
    console.log('!!!!pc');
    console.log(pc);
    if (event.candidate) {
      const otherPc = pc === client1Ref ? client2Ref.current : client1Ref.current;
      otherPc.addIceCandidate(event.candidate).then(
        () => console.log('addIceCandidate success'),
        (error) => console.error('failed to add ICE Candidate', error.toString())
      );
    }
  };
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
        video: true
      })
      .then(gotStream)
      .catch((e) => {
        console.log(e);
        alert(`getUserMedia() error:${e.name}`);
      });
  };
  const gotRemoteStream = (event) => {
    [remoteVideoRef.current.srcObject] = event.streams;
  };
  const call = () => {
    setCall(false);
    setHangup(true);
    client1Ref.current = new RTCPeerConnection(serversRef.current);
    client2Ref.current = new RTCPeerConnection(serversRef.current);
    client1Ref.current.onicecandidate = (e) => onIceCandidate(client1Ref, e);
    client1Ref.current.oniceconnectionstatechange = (e) => onIceStateChange(client1Ref.current, e);
    client2Ref.current.onicecandidate = (e) => onIceCandidate(client2Ref, e);
    client2Ref.current.oniceconnectionstatechange = (e) => onIceStateChange(client2Ref.current, e);
    client2Ref.current.ontrack = gotRemoteStream;
    localStreamRef.current
      .getTracks()
      .forEach((track) => client1Ref.current.addTrack(track, localStreamRef.current));
    client1Ref.current
      .createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      })
      .then(onCreateOfferSuccess, (error) => console.error('Failed to create session description', error.toString()));
  };

  const hangUp = () => {
    client1Ref.current.close();
    client2Ref.current.close();
    client1Ref.current = null;
    client2Ref.current = null;
    setHangup(false);
    setCall(true);
  };
  return (
    <div>
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
              <Button variant="success" onClick={call} disabled={!callAvailable}>
          Call
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
export default VideoChat;
