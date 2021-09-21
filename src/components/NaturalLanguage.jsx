import React, { useState, useEffect } from 'react'
import '@tensorflow/tfjs';
import { load } from '@tensorflow-models/qna';

export default function NaturalLanguage() {
  const [passage, setPassage] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [model, setModel] = useState();
  
  const loadModel = async () => {
    setModel(await load());
  }

  const ask = async () => {
    const answers = await model.findAnswers(question, passage)
    setAnswers(answers)
  }

  useEffect(() => {
    loadModel()
  }, [])

  return (
    <div style={{padding: '20px'}}>
      <textarea value={ passage } onChange={ e => setPassage(e.target.value) } style={{ width: '700px' }} rows="5" /> <br/><br/>
      <input value={ question } onChange={ e => setQuestion(e.target.value) } style={{ width: '700px' }} /> <br/><br/>
      <button type="button" onClick={ ask }>Ask</button> <br/><br/>
      <ul>
        {
          answers.map(answer => <li key={ answer.score }>{answer.text} - (Score: {answer.score})</li>)
        }
      </ul>
    </div>
  )
}
