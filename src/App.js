import logo from './logo.svg';
import './App.css';
import HeroSection from './components/HeroSection';
import Countdown from './components/Countdown';
import Reminders from './components/Reminders';
import Eighteens from './components/Eighteens';
import RSVP from './components/RSVP';

function App() {
  return (
    <>
      <div className="w-full min-h-screen text-white scroll-smooth">
        <HeroSection />
        <Countdown />
        <Reminders />
        <Eighteens />
        <RSVP />
    </div>
    </>
  );
}

export default App;
