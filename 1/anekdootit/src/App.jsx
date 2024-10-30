import { useState } from 'react'

const Anecdote = (props) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.text}</p>
      <p>has {props.votes} votes</p>
    </div>
  );
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(
    anecdotes.reduce((accumulator, _, index) => ({ ...accumulator, [index]: 0 }), {})
  );

  const setRandomAnecdote = () => {
    const index = Math.floor(Math.random() * anecdotes.length);

    setSelected(index);
  };

  const getMostVotedAnecdoteIndex = Object.keys(points).reduce((maxIndex, key) =>
    points[key] > points[maxIndex] ? key : maxIndex
  );

  const vote = () => {
    const newPoints = { ...points };
    newPoints[selected] += 1;

    setPoints(newPoints);
  };

  return (
    <div>
      <Anecdote title="Anecdote of the day" text={anecdotes[selected]} votes={points[selected]} />
      <button onClick={vote}>vote</button>
      <button onClick={setRandomAnecdote}>next anecdote</button>
      <Anecdote title="Anecdote with most votes" text={anecdotes[getMostVotedAnecdoteIndex]} votes={points[getMostVotedAnecdoteIndex]} />
    </div>
  )
}

export default App