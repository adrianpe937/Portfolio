import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('/api/auth/getAllUsers')
      .then(response => response.json())
      .then(data => console.log(data));
  }, []);

  return (
    <div>
      <h1>Frontend React funcionando!</h1>
    </div>
  );
}

export default App;
