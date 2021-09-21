import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { load } from '@tensorflow-models/mobilenet';
import { create } from '@tensorflow-models/knn-classifier';


export default function TrainModel() {
  const webcamRef = useRef(null);
  const [classifier] = useState(create());
  const [model, setModel] = useState();
  const [webcam, setWebcam] = useState();
  const [result, setResult] = useState('');

  const loadModel = async () => {
    setModel(await load());
  }

  const accessWebcam = async () => {
    setWebcam(await tf.data.webcam(webcamRef.current));
  }

  useEffect(() => {
    loadModel();
    accessWebcam();
  }, [])

  const train = async command => {
    const img = await webcam.capture();
    const activation = model.infer(img, true);
    classifier.addExample(activation, command);
    img.dispose();
  }

  const identify = async () => {
    if (classifier.getNumClasses() > 0) {
      const img = await webcam.capture();
      const activation = model.infer(img, 'conv_preds');
      const result = await classifier.predictClass(activation);
      console.log(result)
      setResult(result);
      img.dispose();
    } else {
      alert('Train the model first')
    }
    await tf.nextFrame();
  }

  return (
    <div>
      <video autoPlay={ true } playsInline={ true } muted={ true } ref={ webcamRef } width="300" height="300"></video>
      <p>Train Model</p>
      <button type="button" onClick={() => train('up')}>Up</button>
      <button type="button" onClick={() => train('down')}>Down</button>
      <button type="button" onClick={() => train('left')}>Left</button>
      <button type="button" onClick={() => train('right')}>Right</button><br/><br/><br/><br/>
      <button type="button" onClick={ identify }>Identify</button>
      <p>Result:</p>
      <p>{ result.label }</p>
    </div>
  )
}
