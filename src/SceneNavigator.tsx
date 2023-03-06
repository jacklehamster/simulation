interface Props {
    scenes: string[];
    activeScene: number;
    activateScene(scene: number): void;
}

export default function SceneNavigator({ scenes, activeScene, activateScene }: Props) {
    return <div style={{
    position: "fixed",
    width: "100%",
    height: 30,
    backgroundColor: "#00000077",
    bottom: 0,
    display: "flex",
    gap: 2,
  }}>
    {
        scenes.map((scene, index) => 
            <div key={index} style={{
                backgroundColor: activeScene === index ? "white" : "silver",
                padding: "5px 15px",
                borderRadius: "0 0 15px 15px",
                cursor: "pointer",
            }} onClick={() => activateScene(index)}>{scene}</div>
        )
    }
  </div>;
}