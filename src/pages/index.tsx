// pages/index.tsx
import Head from 'next/head';
import Board from '../components/Board';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Mancala Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center w-full flex-1 px-4 text-center">
        <h1 className="text-4xl mb-6">Welcome to Mancala!</h1>
        <Board />
      </main>
    </div>
  );
};

export default Home;