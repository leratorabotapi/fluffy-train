// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { drawRect } from "./utilities";
import { List, Typography, Row, Col, Avatar, Card } from 'antd';
import 'antd/dist/antd.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [objects, setObjects] = useState();

  const { Title } = Typography;
  const { Meta } = Card;

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    console.log("Object Recognition model: loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const obj = await net.detect(video);

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);
      setObjects(obj);
      console.log(obj)
    }
  };

  useEffect(()=>{runCoco()},[]);

  return (
    <div className="App">
    
      <Row justify="center">
        <Title justify="center">Object Recognition App</Title>
     

      <header className="App-header">

        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "50px",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "50px",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
      </Row>
      <Row justify="center" style={{ marginTop: "80px"}}>
        
        
        <Title level={2}>Objects Detected:</Title>

      <Col span={24}>
      <List
      grid={{ gutter: 16, column: 4 }}
      dataSource={objects}
      renderItem={item => (
        <Card style={{ width: 300, marginTop: 16 }} >
        <Meta
          avatar={<Avatar icon="🔎" />}
          title={item.class}
          description="Recognition score:"
        />
      </Card>
      )}
    />
    </Col>

    </Row>

     
    </div>
  );
}

export default App;
