import React, { useState, useEffect } from "react";
import clickIcon from "./assets/click.png";
import shopIcon from "./assets/shop.png";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClick, setAutoClick] = useState(0);
  const [shopVisible, setShopVisible] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState([]);

  const loja = [
    { nome: "AutoClick +1", custo: 50, efeito: () => setAutoClick((p) => p + 1) },
    { nome: "AutoClick +5", custo: 200, efeito: () => setAutoClick((p) => p + 5) },
    { nome: "Multiplicador x2", custo: 150, efeito: () => setClickPower((p) => p * 2) },
    { nome: "Multiplicador x3", custo: 300, efeito: () => setClickPower((p) => p * 3) },
    { nome: "AutoClick x2", custo: 500, efeito: () => setAutoClick((p) => p * 2) },
    { nome: "Click +10", custo: 1000, efeito: () => setClickPower((p) => p + 10) },
  ];

  const handleClick = (e) => {
    setScore((prev) => prev + clickPower);

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newText = {
      id: Date.now(),
      x,
      y,
      value: `+${clickPower}`,
    };
    setFloatingTexts((prev) => [...prev, newText]);
  };

  const comprarItem = (item) => {
    if (score >= item.custo) {
      setScore((prev) => prev - item.custo);
      item.efeito();
    } else {
      alert("Pontos insuficientes!");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setFloatingTexts((texts) =>
        texts.filter((text) => Date.now() - text.id < 1000)
      );
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClick > 0) {
        setScore((prev) => prev + autoClick);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClick]);

  return (
    <div className="App">
      <h1>Jogo de Clique</h1>
      <div className="score-display">Pontos: {score}</div>

      <button onClick={handleClick} className="image-button">
        <img src={clickIcon} alt="Clicar" className="icon" />
      </button>

      <button
        onClick={() => setShopVisible(!shopVisible)}
        className={`shop-toggle ${shopVisible ? "transparent" : ""}`}
      >
        <img src={shopIcon} alt="Loja" className="icon" />
      </button>

      {shopVisible && (
        <div className="shop">
          <div className="shop-header">
            <h2>Loja</h2>
            <button className="close-shop" onClick={() => setShopVisible(false)}>X</button>
          </div>
          {loja.map((item, index) => (
            <div key={index} className="shop-item">
              <span>{item.nome} - {item.custo} pontos</span>
              <button onClick={() => comprarItem(item)}>Comprar</button>
            </div>
          ))}
        </div>
      )}

      {floatingTexts.map((text) => (
        <span
          key={text.id}
          className="floating-text"
          style={{ left: text.x, top: text.y }}
        >
          {text.value}
        </span>
      ))}
    </div>
  );
}

export default App;
