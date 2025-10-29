import { useRouter, matchRoute } from './lib/router';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Stay } from './pages/Stay';
import { Gallery } from './pages/Gallery';
import { Amenities } from './pages/Amenities';
import { Area } from './pages/Area';
import { Reviews } from './pages/Reviews';
import { Policies } from './pages/Policies';
import { About } from './pages/About';
import { Book } from './pages/Book';
import { Confirmation } from './pages/Confirmation';
import { Reservation } from './pages/Reservation';

function App() {
  const { currentRoute, navigate } = useRouter();

  const getPageComponent = () => {
    const reservationMatch = matchRoute('/reservation/:code', currentRoute);
    if (reservationMatch.match) {
      return <Reservation confirmationCode={reservationMatch.params.code} onNavigate={navigate} />;
    }

    if (currentRoute.startsWith('/confirmation')) {
      const params = new URLSearchParams(currentRoute.split('?')[1]);
      const code = params.get('code');
      return <Confirmation confirmationCode={code || ''} onNavigate={navigate} />;
    }

    switch (currentRoute) {
      case '/':
        return <Home onNavigate={navigate} />;
      case '/stay':
        return <Stay onNavigate={navigate} />;
      case '/gallery':
        return <Gallery onNavigate={navigate} />;
      case '/amenities':
        return <Amenities onNavigate={navigate} />;
      case '/area':
        return <Area onNavigate={navigate} />;
      case '/reviews':
        return <Reviews onNavigate={navigate} />;
      case '/policies':
        return <Policies onNavigate={navigate} />;
      case '/about':
        return <About onNavigate={navigate} />;
      case '/book':
        return <Book onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={navigate} currentRoute={currentRoute} />
      <main className="flex-grow">{getPageComponent()}</main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

export default App;
