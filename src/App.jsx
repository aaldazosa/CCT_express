import { useState } from 'react';
import InputScreen from './components/InputScreen';
import ResultsScreen from './components/ResultsScreen';
import HomeScreen from './components/HomeScreen';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [data, setData] = useState(null);

  const handleStart = () => setScreen('input');
  const handleSubmit = (inputData) => {
    setData(inputData);
    setScreen('results');
  };
  const handleReset = () => {
    setData(null);
    setScreen('home');
  };

  return (
    <>
      <Toaster position="bottom-center" toastOptions={{ duration: 1500, limit: 1 }} />
      {screen === 'home' && <HomeScreen onStart={handleStart} />}
      {screen === 'input' && <InputScreen onSubmit={handleSubmit} />}
      {screen === 'results' && data && <ResultsScreen data={data} onReset={handleReset} />}
    </>
  );
}
