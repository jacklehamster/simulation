import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import SceneContent from './SceneContent';
import SceneNavigator from './SceneNavigator';

function App() {
  const [scenes, setScenes] = useState<string[]>([]);
  const [activeScene, activateScene] = useState<string | undefined>();


  useEffect(() => {
    setScenes(["scene-1", "scene-2"])
  }, []);

  return (
    <div className="App">
      <SceneContent name="scene-1" activeScene={activeScene}>
        <div style={{backgroundColor: "#ffeeee", width: "100%", height: "100%", position: "absolute"}}></div>
      </SceneContent>
      <SceneNavigator scenes={scenes} activeScene={activeScene} activateScene={activateScene} />
    </div>
  );
}

export default App;
