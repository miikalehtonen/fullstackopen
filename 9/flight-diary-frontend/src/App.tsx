import { useState, useEffect } from 'react';
import { getDiaries, createDiary } from './services/diaryService';
import { DiaryEntry, NewDiaryEntry, Weather, Visibility } from './types';
import axios from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState<NewDiaryEntry>({
    date: '',
    weather: 'sunny',
    visibility: 'great',
    comment: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDiaries()
      .then(data => setDiaries(data))
      .catch(err => console.error(err));
  }, []);

  const addDiary = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const addedDiary = await createDiary(newEntry);
      setDiaries(diaries.concat(addedDiary));
      setNewEntry({ date: '', weather: 'sunny', visibility: 'great', comment: '' });
      setError(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || 'Error adding entry');
      } else {
        setError('Unknown error occurred');
      }
    }
  };

  return (
    <div>
      <h1>Flight Diary</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={addDiary}>
        <div>
          Date:
          <input
            type="date"
            value={newEntry.date}
            onChange={({ target }) => setNewEntry({ ...newEntry, date: target.value })}
          />
        </div>
        <div>
          Weather:
          {(['sunny', 'rainy', 'cloudy', 'stormy', 'windy'] as Weather[]).map(weather => (
            <label key={weather}>
              <input
                type="radio"
                name="weather"
                value={weather}
                checked={newEntry.weather === weather}
                onChange={({ target }) => setNewEntry({ ...newEntry, weather: target.value as Weather })}
              />
              {weather}
            </label>
          ))}
        </div>
        <div>
          Visibility:
          {(['great', 'good', 'ok', 'poor'] as Visibility[]).map(visibility => (
            <label key={visibility}>
              <input
                type="radio"
                name="visibility"
                value={visibility}
                checked={newEntry.visibility === visibility}
                onChange={({ target }) =>
                  setNewEntry({ ...newEntry, visibility: target.value as Visibility })
                }
              />
              {visibility}
            </label>
          ))}
        </div>
        <div>
          Comment:
          <input
            type="text"
            value={newEntry.comment}
            onChange={({ target }) => setNewEntry({ ...newEntry, comment: target.value })}
          />
        </div>
        <button type="submit">Add</button>
      </form>
      <h2>Diary Entries</h2>
      <ul>
        {diaries.map(diary => (
          <li key={diary.id}>
            <strong>{diary.date}</strong> - {diary.weather}, {diary.visibility}
            {diary.comment && <p>{diary.comment}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
