import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Wheel = ({ items }) => {
  const canvasRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const numItems = items.length;
    const arcSize = (2 * Math.PI) / numItems;

    const drawWheel = () => {
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(size / 2, size / 2);

      items.forEach((item, i) => {
        const angle = i * arcSize;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, size / 2, angle, angle + arcSize);
        ctx.fillStyle = `hsl(${(i * 360) / numItems}, 70%, 50%)`;
        ctx.fill();
        ctx.save();
        ctx.rotate(angle + arcSize / 2);
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText(item, 10, 0);
        ctx.restore();
      });

      ctx.restore();
    };

    drawWheel();
  }, [items]);

  const spinWheel = () => {
    setSpinning(true);
    const duration = 3; // duración de la animación en segundos
    const selectedItemIndex = Math.floor(Math.random() * items.length);
    const degreesPerItem = 360 / items.length;
    const finalRotation =
      360 * 5 + (360 - selectedItemIndex * degreesPerItem - degreesPerItem / 2);

    canvasRef.current.style.transition = "none";
    canvasRef.current.style.transform = "rotate(0deg)";

    requestAnimationFrame(() => {
      canvasRef.current.style.transition = `transform ${duration}s ease-out`;
      canvasRef.current.style.transform = `rotate(${finalRotation}deg)`;
    });

    setTimeout(() => {
      setSpinning(false);
      setSelectedItem(items[selectedItemIndex]);
    }, duration * 1000);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "400px",
      }}>
      <div className="pointer"></div>
      <canvas
        ref={canvasRef}
        width="300"
        height="300"></canvas>
      <button
        onClick={spinWheel}
        disabled={spinning}>
        Girar
      </button>
      {selectedItem && <div>Seleccionado: {selectedItem}</div>}
    </div>
  );
};

Wheel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Wheel;
