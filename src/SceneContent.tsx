import React, { ReactNode } from "react";

interface Props {
    name: string;
    activeScene?: string;
    children?: ReactNode;
}

export default function SceneContent({ name, activeScene, children }: Props) {
    const showScene = name === activeScene;
    return <>{showScene ? children : <></>}</>;
}