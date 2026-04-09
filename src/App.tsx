import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './screens/HomeScreen';
import { PlayerSetupScreen } from './screens/PlayerSetupScreen';
import { ThemeSelectScreen } from './screens/ThemeSelectScreen';
import { CardPeekScreen } from './screens/CardPeekScreen';
import { DiscussionScreen } from './screens/DiscussionScreen';
import { RevealScreen } from './screens/RevealScreen';
import { InsiderVoteScreen } from './screens/InsiderVoteScreen';
import { InsiderResultScreen } from './screens/InsiderResultScreen';
import { AnimatedBackground } from './components/AnimatedBackground';

export default function App() {
  return (
    <>
      <AnimatedBackground />
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/players" element={<PlayerSetupScreen />} />
          <Route path="/theme" element={<ThemeSelectScreen />} />
          <Route path="/peek" element={<CardPeekScreen />} />
          <Route path="/discussion" element={<DiscussionScreen />} />
          <Route path="/reveal" element={<RevealScreen />} />
          <Route path="/insider-vote" element={<InsiderVoteScreen />} />
          <Route path="/insider-result" element={<InsiderResultScreen />} />
        </Routes>
      </HashRouter>
    </>
  );
}
