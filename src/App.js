import './App.css';
import React from 'react';
import {nanoid} from 'nanoid';
import Confetti from 'react-confetti'
import Die from './COMPONENTS/Die';
function App() {
 
  const [diceObjectsArray, setDiceObjects] =React.useState(allNewDice)
  const diceItems = diceObjectsArray.map(item => <Die key={item.id} id={item.id} value={item.value} isHeld={item.isHeld} setHold={hold}/>)
  const [tenzies, setTenzies]= React.useState(false)
  const [time, setTime] = React.useState(createTimer)
  const timeParts = time.map(part => [part.min , part.sec, part.msec])
  const [min,sec,msec] = timeParts[0]
  const [rollCount, setRollCount] = React.useState(0)
  const [starter, setStarter] = React.useState(false)
  const [record, setRecord]=React.useState()
  React.useEffect(()=>{
    const result = diceObjectsArray.every(item => item.value === diceObjectsArray[0].value && item.isHeld)
    if(result){
    setTenzies(true) 
    setStarter(false)
    }
  },[diceObjectsArray])

  function createTimer(){
    const timer=[]
    timer.push(
      {
        msec:0,
        sec:0,
        min:0
      }
    )
    return timer
  }
  React.useEffect(() => {
    if(starter){
      setInterval(() => {
        setTime(old => old.map(timeElement =>{
          timeElement.msec++
          if(timeElement.msec>10)
          {
            timeElement.msec=0
            timeElement.sec++
          }
          if(timeElement.sec>59){
            timeElement.sec=0
            timeElement.min++
          }
          return {...timeElement, min:timeElement.min, sec:timeElement.sec, msec:timeElement.msec}
        }))
    }, 100)
  }
    if(tenzies) {
      const interval_id = window.setInterval(()=>{}, 99999);
      for (let i = 0; i < interval_id; i++){
        window.clearInterval(i)
      }
    }
    console.log(starter+","+tenzies)
  }, [starter])

  React.useEffect(()=>{
    let timeToSec = (min*60)+sec+(msec/10)
    let storageMin = JSON.parse(localStorage.getItem("BestMin"))
    let storageSec = JSON.parse(localStorage.getItem("BestSec"))
    let storageMSec = JSON.parse(localStorage.getItem("BestMSec"))
    let storageTime = (storageMin*60)+storageSec+(storageMSec/10)
    if(storageTime===0)
    {
      localStorage.setItem("BestTime",timeParts[0])
      localStorage.setItem("BestMin", min)
      localStorage.setItem("BestSec", sec)
      localStorage.setItem("BestMSec", msec)
      setRecord([min,sec,msec])
    }
    else if(timeToSec<storageTime && timeToSec!==0){
      localStorage.setItem("BestTime",timeParts[0])
      localStorage.setItem("BestMin", min)
      localStorage.setItem("BestSec", sec)
      localStorage.setItem("BestMSec", msec)
      setRecord([min,sec,msec])
    }
  },[tenzies])

  
  function allNewDice(){
    const diceObjArray =[]
    for(let i=0;i<10;i++)
      {
        diceObjArray.push(
          {
          id: nanoid(),
          value:Math.ceil(Math.random()*6),
          isHeld: false
          }
        )
      }
    return diceObjArray
  }

  function hold(id){
    setDiceObjects(oldDice => oldDice.map(die=>{
      return die.id === id ? 
        {...die, isHeld:!die.isHeld} :
        die
    }))
  }

  function startGame(){
    setStarter(true)
    setDiceObjects(allNewDice())
    setTenzies(false)
    setRollCount(0)
    setTime(createTimer)
  }

  function newRoll(){
    setDiceObjects(prevDice => prevDice.map(die =>{
      return die.isHeld ? die : {id:nanoid(), value:Math.ceil(Math.random()*6), isHeld: false}
    }))
    setRollCount(prev => prev +1)
  }
  function newGame(){
    setDiceObjects(allNewDice())
    setTenzies(false)
    setRollCount(0)
    setTime(createTimer)
  }
  return (
    <main className="game-map">
      <h1 className='game-title'>Gra w kości</h1>
      <p className='game-short-instruction'>Losuj dopóki wszystkie kości nie będą takie same. Klikaj je aby zabezpieczyć ich wartości przed ponownym losowaniem</p>
      {!starter && <div className='game-start-alert'>
        <button onClick={startGame} className="game-start_timer">START</button>
      </div>}
      <section className='tiles'>
        {diceItems}
      </section>
      {tenzies && <Confetti/>}
      <button className='game-roll-button' onClick={tenzies ? newGame : newRoll}>{tenzies ? 'Nowa gra' : 'Losuj'}</button>
      <div className='game-in-game-info'>
        <time>{(time[0].min<10 ? "0"+time[0].min : time[0].min) +":"+(time[0].sec<10 ? "0"+time[0].sec : time[0].sec)+":"+ (time[0].msec<10 ? "0"+time[0].msec : time[0].msec)}</time>
        <span className='game-rolls'>Losy: {rollCount}</span>
      </div>
      <div className='game-best-time'>{localStorage.getItem("BestTime") === null ? "Brak wyników" : "POPRZEDNI REKORD TO "+JSON.parse(localStorage.getItem("BestMin"))+":"+JSON.parse(localStorage.getItem("BestSec"))+":"+JSON.parse(localStorage.getItem("BestMSec"))}</div>
    </main>
  );
}

export default App;