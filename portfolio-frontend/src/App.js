// App.js
import '../src/css/App.css';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import AppContent from './AppContent';

function App() {
  // Redirige siempre a /portfolio al cargar la app
  useEffect(() => {
    if (window.location.pathname !== "/portfolio") {
      window.location.replace("/portfolio");
    }
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
