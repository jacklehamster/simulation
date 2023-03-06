import { useEffect, useState } from 'react';
import './App.css';
import SceneNavigator from './SceneNavigator';

function App() {
  const [scenes, setScenes] = useState<string[]>([]);
  const [activeScene, activateScene] = useState(0);


  useEffect(() => {
    setScenes(["scene-1", "scene-2"])
  }, []);

  return (
    <div className="App">
      <SceneNavigator scenes={scenes} activeScene={activeScene} activateScene={activateScene} />
    </div>
  );
}

export default App;
