import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { useDropzone } from 'react-dropzone';
import '@tensorflow/tfjs';
import { load } from '@tensorflow-models/coco-ssd';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  height: 600,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

function ObjectIdentification() {
const [model, setModel] = useState();
  const [files, setFiles] = useState([]);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [predictions, setPredictions] = useState([])
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const loadModel = async () => {
    setModel(await load());
  }

  useEffect(() => {
    loadModel()
  }, [])

  const drawCanvas = (predictions) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    predictions.forEach(prediction => {
      ctx.strokeStyle = prediction.color;
      ctx.lineWidth = 5;
      ctx.strokeRect(...prediction.bbox);
    })
  }

  const detect = async () => {
    const predictions = await model.detect(imgRef.current);
    predictions.forEach(prediction => {
      prediction.color = `#${((1<<24)*Math.random() | 0).toString(16)}`
    })
    console.log(predictions)
    setPredictions(predictions);
    drawCanvas(predictions);
  }

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img id="preview"
          ref={ imgRef }
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>
        { thumbs }
      </aside>
      <button type="button" onClick={ detect }>Detect Objects</button>
      <aside>
        <ul>
          {
            predictions.map(prediction => (<li style={{ color: prediction.color }}>{ prediction.class }</li>))
          }
        </ul>
        <canvas ref={ canvasRef }></canvas>
      </aside>
    </section>
  );
}

export default ObjectIdentification;
