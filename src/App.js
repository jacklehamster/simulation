import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import FTrig from "./FTrig";

const trig = new FTrig(FTrig.LOW);
// console.log(FTrig);
// console.log(trig.sin(123));

const B = 4 / Math.PI;
const C = -4 / (Math.PI*Math.PI);

function mySin(value) {
  // return trig.sin(value % (2 * Math.PI) - Math.PI);
 return Math.sin(value);
  // const x = value % (Math.PI) - Math.PI / 2;
  //   return -(B * x + C * x * ((x < 0) ? -x : x));
}

function drawGraph1(context, funs) {
  const { width, height } = context.canvas;
  let count = 0;
  for (let {fun1, fun2, color} of funs) {
    context.beginPath();
    context.strokeStyle = color;
    for (let i = 0; i < width; i+=5) {
      const y = (fun1(i / width) + 1) / 2;
      if (i === 0) {
        context.moveTo(i, y * height);
      } else {
        context.lineTo(i, y * height);
      }
    }
    if (count++ > 10) {
      break;
    }
    context.stroke();
  }
}


function drawGraph2(context, funs) {
  const { width, height } = context.canvas;
  let count = 0;
  const range = 1000;
  for (let {fun1, fun2, color} of funs) {
    context.beginPath();
    context.strokeStyle = color;
    for (let i = 0; i < range; i++) {
      const x = (fun1(i / range) + 1) / 2;
      const y = (fun2(i / range) + 1) / 2;
      if (i === 0) {
        context.moveTo(x * width, y * height);
      } else {
        context.lineTo(x * width, y * height);
      }
    }
    if (count++ > 10) {
      break;
    }
    context.stroke();
  }
}

let raf;
function drawGraph3(context, funs) {
  const { width, height } = context.canvas;
  const speed = 1 / 10000;
  const f = (time) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    let count = 0;
    const range = 1000;
    for (let {fun1, fun2, color} of funs) {
      context.beginPath();
      context.strokeStyle = color;
      for (let i = 0; i < range; i++) {
        const diff = mySin(i / 100);
        const px = (fun1(diff * (time - 100) * speed) + 1) / 2;
        const py = (fun2(diff * (time - 100) * speed) + 1) / 2;
        const x = (fun1(diff * time * speed) + 1) / 2;
        const y = (fun2(diff * time * speed) + 1) / 2;
        context.moveTo(px * width, py * height);
        context.lineTo(x * width, y * height);
      }
      if (count++ > 5) {
        break;
      }
      context.stroke();  
    }
    raf = requestAnimationFrame(f);
  };
  raf = requestAnimationFrame(f);
}

function pick(count, range) {
  const picks = new Array(range).fill(null).map((_, index) => index);
  for (let i = 0; i < count; i++) {
    const rand = Math.floor(Math.random() * (range  - i)) + i;
    const swap = picks[i];
    picks[i] = picks[rand];
    picks[rand] = swap;
  }
  return picks.slice(0, count);
}

function createPopulation(population, count) {
  const funs = new Array(population).fill(null).map((_, index) => {
    const fun1 = combineFun(count);
    const fun2 = combineFun(count);
    const fun3 = combineFun(count);
    const fun4 = combineFun(count);
    const fun5 = combineFun(count);
    const fun6 = combineFun(count);
    const fun7 = combineFun(count);
    const fun8 = combineFun(count);
    const fun9 = combineFun(count);
    const fun10 = combineFun(count);
    const numFollows = Math.floor(Math.random() * 6);
    return {
      id: index,
      fun1, fun2, fun3, fun4, fun5, fun6, fun7, fun8, fun9, fun10,
      getPos: (time) => {
        return [(fun2(fun1(time) / 10) + 1) / 2, (fun1(fun2(time) / 10) + 1) / 2];
      },
      follows: pick(numFollows, population).map((id) => ({
        id,
        seed: combineFun(count),
        strength: Math.random() * 10,
      })),
      friendIds: [],
      color: `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
    };
  });
  funs.forEach(fun => {
    const numFriends = Math.floor(Math.random() * fun.follows.length);
    for (let i = 0; i < Math.min(numFriends, fun.follows.length); i++) {
      const follow = fun.follows[i];
      funs[follow.id].friendIds.push(fun.id);
    }
    fun.funs = funs;
  });
  funs.forEach(fun => {
    for (let friendId of fun.friendIds) {
      if (!fun.follows.find(f => f.id === friendId)) {
        fun.follows.push({
          id: friendId,
          seed: combineFun(count),
          strength: Math.random() * 100,
        });
        funs[friendId].follows.push({
          id: fun.id,
          seed: combineFun(count),
          strength: Math.random() * 100,
        });
      }
    }
  });
  
  return funs;
}

function drawGraph4(context, funs) {
  const { width, height } = context.canvas;
  const speed = 1 / 40000;
  const f = (time) => {
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (let {getPos, color} of funs) {
      context.beginPath();
      context.strokeStyle = color;
      const [px, py] = getPos((time - 100) * speed);
      const [x, y] = getPos(time * speed);
      context.moveTo(px * width, py * height);
      context.lineTo(x * width, y * height);
      context.stroke();  
    }
    raf = requestAnimationFrame(f);
  };
  raf = requestAnimationFrame(f);
}

function drawGraph5(context, funs) {
  const { width, height } = context.canvas;
  let count = 0;
  const range = 1000;
  for (let {fun1, fun2, color} of funs) {
    context.beginPath();
    context.strokeStyle = color;
    for (let i = 0; i < width; i++) {
      const value = fun1(i / width) * fun1(i / width) * fun2(i / width);
      const y = (value + 1) / 2;
      context.lineTo(i, y * height);
    }
    if (count++ > 10) {
      break;
    }
    context.stroke();
  }
}

function getPosWithFollows(time, getPos, follows, funs) {
  const individuality = 5;
  let [x, y] = getPos(time).map(a => a * individuality);
  let totalCloseness = individuality;
  for (let f of follows) {
    const follow = funs[f.id];
    const closeNess = (f.seed(time) + 1) / 2 * f.strength;
    const [fx, fy] = follow.getPos(time);
    x += closeNess * fx;
    y += closeNess * fy;
    totalCloseness += closeNess;
  }
  x /= totalCloseness;
  y /= totalCloseness;
  return [x, y];
}

function drawGraph6(context, funs) {
  const { width, height } = context.canvas;
  const speed = 1 / 200000;
  const f = (time) => {
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (let {getPos, follows, color} of funs) {
      context.beginPath();
      context.strokeStyle = color;
      const [px, py] = getPosWithFollows((time - 100) * speed, getPos, follows, funs);
      const [x, y] = getPosWithFollows(time * speed, getPos, follows, funs);
      context.moveTo(px * width, py * height);
      context.lineTo(x * width, y * height);
      context.stroke();  
    }
    raf = requestAnimationFrame(f);
  };
  raf = requestAnimationFrame(f);
}

function applyBalls(balls, pos) {
  const initialBestDist = .01;
  let bestDist = initialBestDist;
  let ball = null;
  for (let i = 0; i < balls.length; i++) {
    const [bx, by] = balls[i].pos;
    const dx = pos[0] - bx;
    const dy = pos[1] - by;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      ball = balls[i];
    }
  }
  if (ball) {
    let ballContribution = bestDist < 0.000001 ? 100 : initialBestDist / bestDist / 10;
    ballContribution *= ballContribution * ballContribution;
    const x = (pos[0] + ball.pos[0] * ballContribution) / (ballContribution + 1);
    const y = (pos[1] + ball.pos[1] * ballContribution) / (ballContribution + 1);
    return [x, y];
  }
  return pos;
}

function drawGraph7(context, funs, balls) {
  const { width, height } = context.canvas;
  const speed = 1 / 200000;
  const f = () => {
    const time = Date.now();
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (let {getPos, follows, color} of funs) {
      context.beginPath();
      context.strokeStyle = color;
      const [px, py] = applyBalls(balls, getPosWithFollows((time - 100) * speed, getPos, follows, funs));
      const [x, y] = applyBalls(balls, getPosWithFollows(time * speed, getPos, follows, funs));
      context.moveTo(px * width, py * height);
      context.lineTo(x * width, y * height);
      context.stroke();
    }
    balls.forEach(ball => {
      const { pos, createTime } = ball;
      context.beginPath();
      context.strokeStyle = "#7df";
      context.arc(pos[0] * width, pos[1] * height, 30, 0, Math.PI * 2);
      context.stroke();
    });
    raf = requestAnimationFrame(f);
  };
  raf = requestAnimationFrame(f);
}

function makeFun(stretch, shift) {
  return (x) => mySin(x * stretch + shift);
}

function combineFun(count) {
  const funs = new Array(count).fill(null).map(() => {
    const stretch = Math.random() * 200;
    const shift = Math.random() * 2000;
    return {fun: makeFun(stretch, shift), stretch, shift};
  });
  return (x) => {
    let result = 0;
    let total = 0;
    for (let i = 0; i < funs.length; i++) {
      const { fun, stretch } = funs[i];
      const val = 1/ (stretch / 10000);
      result += fun(x) * val;
      total += val;
    }
    return result / total;
  };
}

function drawGraph8(context, funs) {
  const { width, height } = context.canvas;
  let count = 0;
  const amplitude = x => (Math.sin(x * 2 * Math.PI - Math.PI/2) + 1) / 2;
  for (let {fun1, fun2, color} of funs) {
    context.beginPath();
    context.strokeStyle = color;
    for (let i = 0; i < width; i+=5) {
      const y = ((fun1(i / width) + 1) / 2) * amplitude(i / width);
      if (i === 0) {
        context.moveTo(i, y * height);
      } else {
        context.lineTo(i, y * height);
      }
    }
    if (count++ > 10) {
      break;
    }
    context.stroke();
  }  
}

function cornerXY(time, fun, balls) {
  const {follows, color, fun1, fun2, fun3, fun4, fun5, fun6, fun7, fun8, fun9, getPos} = fun;
  //  let [x, y] = [0, 0];//getPos(100 * speed);
  let x = 0;
  let y = 0;
  let total = 0;

  let topLeft = (fun1(time) + 1)/2;
  let topRight = (fun2(time) + 1)/2;
  let bottomLeft = (fun3(time) + 1)/2;
  let bottomRight = (fun4(time) + 1)/2;
    topLeft *= topLeft;
  topRight *= topRight;
  bottomLeft *= bottomLeft;
  bottomRight *= bottomRight;
  total += topLeft + topRight + bottomLeft + bottomRight;
  x += 0 * topLeft + bottomLeft * 0 + topRight + bottomRight;
  y += 0 * topLeft + bottomLeft + 0 * topRight + bottomRight;  

  const ballEffects = 10;
  const [ball1, ball2, ball3, ball4, ball5] = balls;
  if (ball1) {
    let diff = (fun5(time) + 1)/2;
    diff *= diff * diff * ballEffects;
    x += ball1.pos[0] * diff;
    y += ball1.pos[1] * diff;
    total += diff;
  }

  if (ball2) {
    let diff = (fun6(time) + 1)/2;
    diff *= diff * diff * ballEffects;
    x += ball2.pos[0] * diff;
    y += ball2.pos[1] * diff;
    total += diff;
  }

  if (ball3) {
    let diff = (fun7(time) + 1)/2;
    diff *= diff * diff * ballEffects;
    x += ball3.pos[0] * diff;
    y += ball3.pos[1] * diff;
    total += diff;
  }

  if (ball4) {
    let diff = (fun8(time) + 1)/2;
    diff *= diff * diff * ballEffects;
    x += ball4.pos[0] * diff;
    y += ball4.pos[1] * diff;
    total += diff;
  }

  if (ball5) {
    let diff = (fun9(time) + 1)/2;
    diff *= diff * diff * ballEffects;
    x += ball5.pos[0] * diff;
    y += ball5.pos[1] * diff;
    total += diff;
  }

  x /= total;
  y /= total;
  
  return [x, y];
}

function drawGraph9(context, funs, balls) {
  const { width, height } = context.canvas;
  const speed = 1 / 200000;
  const f = () => {
    const time = Date.now();
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    for (let fun of funs) {
      const {follows, color, fun1, fun2, fun3, fun4, fun5, getPos} = fun;
      context.beginPath();
      context.strokeStyle = color;
//      let [px, py] = getPos(0);
//      let [x, y] = [0, 0];//getPos(100 * speed);
      const [px, py] = cornerXY((time-100) * speed, fun, balls);
      const [x, y] = cornerXY(time * speed, fun, balls);

      context.moveTo(px * width, py * height);
      context.lineTo(x * width, y * height);
      context.stroke();
    }
    balls.forEach(ball => {
      const { pos } = ball;
      context.beginPath();
      context.strokeStyle = "#7df";
      context.arc(pos[0] * width, pos[1] * height, 20, 0, Math.PI * 2);
      context.stroke();
    });
    raf = requestAnimationFrame(f);
  };
  raf = requestAnimationFrame(f);
}

function App() {
  const count = 10;
  const canvasRef = useRef(null)
  const [graph, selectGraph] = useState("graph2");
  const [mouse, setMouse] = useState();
  const [population, setPopulation] = useState(createPopulation(1000, count));
  const [balls, setBalls] = useState([]);
  const newPopulation = useCallback(() => {
    setPopulation(createPopulation(500, count));
  }, [setPopulation]);

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      cancelAnimationFrame(raf);
      const context = canvas.getContext('2d')
      context.lineWidth = 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (graph === 'graph1') {
        drawGraph1(context, population);
      } else if (graph === "graph2") {
        drawGraph2(context, population);
      } else if (graph === "graph3") {
        drawGraph3(context, population);
      } else if (graph === "graph4") {
        drawGraph4(context, population);
      } else if (graph === "graph5") {
        drawGraph5(context, population);
      } else if (graph === "graph6") {
        drawGraph6(context, population);
      } else if (graph === "graph7") {
        drawGraph7(context, population, balls);
      } else if (graph === "graph8") {
        drawGraph8(context, population);
      } else if (graph === "graph9") {
        drawGraph9(context, population, balls);
      }
    }
  }, [canvasRef, graph, population, balls]);

  useEffect(() => {
    setBalls([]);
    if (graph === "graph7" || graph === "graph9") {
      const canvas = canvasRef.current
      if (canvas) {
        const mouseHandler = e => {
          if (e.target.id !== "canvas") {
            return;
          }
          const pos = [e.pageX / canvas.width, e.pageY / canvas.height];
          if (e.type === "mousemove") {
            setMouse(pos);
          } else if (e.type === "click") {
            setBalls((balls) => [...balls, {
              pos,
              createTime: Date.now(),
            }]);
          }
        };
        document.addEventListener("mousemove", mouseHandler);
        document.addEventListener("click", mouseHandler);
        return () => {
          document.removeEventListener("mousemove", mouseHandler);
          document.removeEventListener("click", mouseHandler);
        }  
      }
    } else {
      setMouse(undefined);
    }
  }, [graph, canvasRef]);

  return (
    <div className="App">
      <div style={{ position: "absolute", left: 5, top: 5, display: "flex", flexDirection: "row", gap: 5 }}>
        <button onClick={newPopulation}>New population</button>
        <select value={graph} onChange={e => selectGraph(e.currentTarget.value)}>
          <option value="graph1">graph1</option>
          <option value="graph2">graph2</option>
          <option value="graph3">graph3</option>
          <option value="graph4">graph4</option>
          <option value="graph5">graph5</option>
          <option value="graph6">graph6</option>
          <option value="graph7">graph7</option>
          <option value="graph8">graph8</option>
          <option value="graph9">graph9</option>
        </select>
        {graph === "graph7" || graph === "graph9" && <><div style={{
            width: 20, height: 20,
            display: "flex",
            justifyContent: "center",
            alignContent: "center", alignItems: "center",
          }}><div style={{
          width: "100%",
          height: "100%",
          borderRadius: "100%",
          backgroundColor: "#7df",
          display: "block",
        }}></div></div></>}
      </div>
      {mouse && <div style={{
        borderRadius: "50%", borderColor: "#7df", width: 30, height: 30,
        borderStyle: "solid",
        borderWidth: 2,
        position: "fixed",
        left: mouse[0] * canvasRef.current.width - 30 / 2,
        top: mouse[1] * canvasRef.current.height - 30 / 2,
        pointerEvents: "none",
        }}></div>}
      <canvas id="canvas" ref={canvasRef} width={window.innerWidth} height={window.innerHeight}
        style={{width: "100vw", height: "100vh", borderInline: "1px solid blue"}}>
        </canvas>
    </div>
  );
}

export default App;
