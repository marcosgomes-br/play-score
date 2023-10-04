import React, { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import './App.css';

interface IPoints {
  player1: number;
  player2: number;
}

function App() {
  const pointsGame = ['15', '30', '40', 'AD'];
  const [match, setMatch] = useState<{
    game: {
      player1: {
        name: string;
        points: string;
      };
      player2: {
        name: string;
        points: string;
      };
    },
    sets: IPoints[]
  }>({
      game: {
        player1: {
          name: '', 
          points: '0'
        }, 
        player2: {
          name: '', 
          points: '0'
        }
      },
      sets: [{ player1: 0, player2: 0 }]
    });
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const updateSet = (player: string) => {
    const currentSet: any = match.sets[match.sets.length-1];
    currentSet[player] += 1;
    debugger;
    if(currentSet[player] === 3){
      setMatch({...match, game: {
        player1: {
          ...match.game.player1, 
          points: '0'
        },
        player2: {
          ...match.game.player2, 
          points: '0'
        },
      }, 
      sets: [
        ...match.sets, {
        player1: 0,
        player2: 0
      }]});
      return;
    }
    setMatch({
      ...match, 
      game: {
        player1: {
          ...match.game.player1,
          points: '0'
        },
        player2: {
          ...match.game.player2,
          points: '0'
        }
      },
      sets: [
      ...match.sets.filter((x, i) => i !== (match.sets.length-1)),
      currentSet
    ]})
  }

  useEffect(() => {
    if(transcript) {
      if(transcript.toLowerCase().includes(`ponto ${match.game.player1.name.toLowerCase()}`) && 
        match.game.player1?.name){
        resetTranscript();
        let nextPoint = pointsGame[0];
        if(match.game.player1.points){
          const index = pointsGame.findIndex(x => x === match.game.player1.points) + 1;
          if(index === pointsGame.length){
            updateSet('player1');
            return;
          }
          nextPoint = pointsGame[index];
        }
        setMatch({...match, game: {...match.game, player1: {...match.game.player1, points: nextPoint}}})
      }
      if(transcript.toLowerCase().includes(`ponto ${match.game.player2.name.toLowerCase()}`) && 
        match.game.player2.name){
          resetTranscript();
          let nextPoint = pointsGame[0];
          if(match.game.player2.points){
            const index = pointsGame.findIndex(x => x === match.game.player2.points) + 1;
            if(index === pointsGame.length){
              updateSet('player2');
              return;
            }
            nextPoint = pointsGame[index];
          }
          setMatch({...match, game: {...match.game, player2: {...match.game.player2, points: nextPoint}}})
      }
    }
  }, [transcript]);

  return (
    <div className="App">
      {!listening && <button onClick={() => {SpeechRecognition.startListening({continuous: true})}}>Iniciar Jogo</button>}
      {listening ? <span>Jogando</span> : <span>Habilite o microfone e inicie o jogo</span>}
      {!browserSupportsSpeechRecognition && <span>Navegador não tem suporte a reconhecimento de voz.</span>}
      {/*<p>{transcript}</p>*/}
      <h1 style={{textAlign: 'center'}}>Play Score</h1>
      <div style={{display: 'flex'}}>
        <div style={{width: '50vw'}}>
          <input 
            style={{fontSize: '2rem'}} 
            type='text' 
            value={match.game.player1.name} 
            placeholder="Jogador 1"
            onChange={(e) => {
              setMatch({
                ...match, 
                game: {
                  ...match.game,
                  player1: {
                    name: e.target.value, 
                    points: '0'
                  }, 
                },
                sets: [{player1: 0, player2: 0}]
              })
            }} 
          />
          <h3 style={{fontSize: '10rem', margin: '0'}}>{match.game.player1.points || 0}</h3>
        </div>
        <div>
            <input 
              style={{fontSize: '2rem'}} 
              type='text' value={match.game.player2.name} 
              placeholder="Jogador 2" 
              onChange={(e) => {
                setMatch({
                  ...match, 
                  game: {
                    ...match.game,
                    player2: {
                      name: e.target.value, 
                      points: '0'
                    }, 
                  },
                  sets: [{player1: 0, player2: 0}]
                })
              }}
            /> 
          <h3 style={{fontSize: '10rem', margin: '0'}}>{match.game.player2.points || 0}</h3>
        </div>
      </div>
      {<table style={{textAlign: 'center', margin: '10px auto', fontSize: '2.5rem'}}>
        <tbody>
          <tr>
            <td>{match.game.player1.name.toUpperCase()}</td>
            {match.sets.map(x => {
              return <td style={x.player1 === 3 ? {color: '#05ff05', background: '#213a0f'} : {}}>{x.player1}</td>
            })}
          </tr>
          <tr>
            <td></td>
            {match.sets.map((x, i) => {
              return <td>Set {i + 1}</td>
            })}
          </tr>
          <tr>
            <td>{match.game.player2.name.toUpperCase()}</td>
            {match.sets.map(x => {
              return <td style={x.player2 === 3 ? {color: '#05ff05', background: '#213a0f'} : {}}>{x.player2}</td>
            })}
          </tr>
        </tbody>
      </table>}
    </div>
  );
}

export default App;
