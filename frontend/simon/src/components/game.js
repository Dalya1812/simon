import '../App.scss';
import ColorCard from '../components/ColorCard';
import { useState, useEffect } from 'react';
import timeout from '../utils/util';
import axios from 'axios';


function Game() {
  const [isOn, setisOn] = useState(false);
const serverAddress = "http://localhost:9090";
const colorList = ["green", "red", "yellow", "blue"];
  const [isGameOver, setIsGameOver] = useState(false);

  const initPlay = {
    isDisplay: false,
    colors: [],
    score: 0,
    userPlay: false,
    userColor: [],
  };
  const [play, setPlay] = useState(initPlay);
  const [flashColor, setFlashColor] = useState("");
  const [bestScore, setBestScore] = useState(0);

  function startHandle() {
    setisOn(true);
  }

  useEffect(() => {
    if (isOn) {
      setPlay({ ...initPlay, isDisplay: true });
    } else {
      setPlay(initPlay);
    }
  }, [isOn]);



useEffect(() => {
  if (play.score > 0) {
    updateGameStatus(play.score, bestScore);
  }
}, [play.score, bestScore]);


  useEffect(() => {
    if (isOn && play.isDisplay) {
      let newColor = colorList[Math.floor(Math.random() * 4)];
      const copyColors = [...play.colors];
      copyColors.push(newColor);
    displayChosenColors(copyColors);
     displayColors();
      setPlay({ ...play, colors: copyColors });
    }
  }, [isOn, play.isDisplay]);

  useEffect(() => {
    if (isOn && play.isDisplay && play.colors.length) {
      displayColors();
    }
  }, [isOn, play.isDisplay, play.colors.length]);



async function displayChosenColors(copyColors) {
  copyColors.forEach(async (color, index) => {
    setFlashColor(color);
    await timeout(1000);
    setFlashColor("");
    await timeout(1000);
  })
}


async function displayColors() {
  play.colors.forEach(async (color, index) => {
    setFlashColor(color);
    await timeout(1000);
    setFlashColor("");
    await timeout(1000);
    if (index === play.colors.length - 1) {
      const copyColors = [...play.colors];
      setPlay({
        ...play,
        isDisplay: false,
        userPlay: true,
        userColors: copyColors.reverse(),
      });
    }
  });
}




function updateGameStatus(score, bestScore) {
  const scoreNum = parseInt(score, 10);
  const bestScoreNum = parseInt(bestScore, 10);

  axios
    .post(serverAddress+'/api/game-status', { score: scoreNum, bestScore: bestScoreNum })
    .then((res) => {
      console.log('game status updated');
    })
    .catch((err) => {
      console.error('failed to update game status');
    });
}


async function cardClickHandle(color) {
  if (!play.isDisplay && play.userPlay) {
    console.log(play.score)
    const copyUserColors = [...play.userColors];
    const lastColor = copyUserColors.pop();
    setFlashColor(color);
    if (color == lastColor) {
        const updatedScore = play.score + 1;
        console.log("right click")
        console.log(updatedScore)
      if (copyUserColors.length) {
        setPlay({ ...play, userColors: copyUserColors, score: updatedScore });
      } else {
        await timeout(1000);
        if (play.score > bestScore) {
          setBestScore(play.score);
        }
        setPlay({ ...initPlay, score: updatedScore, isDisplay: true });
      }
    } else {
      await timeout(1000);
      setIsGameOver(true);
      setPlay({ ...initPlay, score: play.score });
    }
  }
}


  return (
    <div className="App">
      <header className="App-header">
        <h1>Let`s play Simon</h1>
        <div className="cardWrapper">
        {!isGameOver && colorList && colorList.map((v,i) => <ColorCard onClick={()=>cardClickHandle(v)} color={v} flash={flashColor==v} ></ColorCard>)}

        </div>
        {!isOn && (
        <button onClick={startHandle} className='start-btn'>start</button>)}

            {isOn && (play.isDisplay || play.userPlay )&& (
              <div className="score">{play.score}</div>)}

              <div className="bestScore"> best score:{bestScore}</div>
      </header>
    </div>
  );
}

export default Game;
