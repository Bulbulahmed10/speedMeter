import { useState, useEffect } from "react";
import ReactSpeedometer from "react-d3-speedometer";

const SpeedMeter = () => {
  const [speed, setSpeed] = useState(0); // Speed in km/h
  const [status, setStatus] = useState("Waiting for location...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setStatus("Tracking speed...");
        const { speed } = position.coords; // Speed is in meters per second (m/s)
        if (speed !== null) {
          const speedInKmh = (speed * 3.6).toFixed(2); // Convert to km/h
          setSpeed(parseFloat(speedInKmh));
        } else {
          setSpeed(0); // Speed is null if stationary
        }
      },
      (error) => {
        setStatus(`Error: ${error.message}`);
        console.error(error);
      },
      { enableHighAccuracy: true }
    );

    // Clean up the geolocation watcher when the component unmounts
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Real-Time Speed Meter</h1>
      <ReactSpeedometer
        maxValue={200}
        value={speed}
        needleColor="red"
        startColor="green"
        endColor="red"
        segments={10}
        currentValueText={`${speed} km/h`}
        height={300}
      />
      <p style={{ marginTop: "20px", fontSize: "18px", color: "#555" }}>
        {status}
      </p>
    </div>
  );
};

export default SpeedMeter;
