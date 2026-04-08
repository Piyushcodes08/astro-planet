import React from 'react';

export const PlanetScene = React.memo(function PlanetScene({ planets, currentIndex }) {
  return (
    <>
      {planets.map((p, i) => {
        const d = i - currentIndex;
        let stateClass = 'hidden';
        if (d === 0) stateClass = 'active';
        else if (d === -1) stateClass = 'prev';
        else if (d === 1) stateClass = 'next';
        else if (d < -1) stateClass = 'hidden hidden-before';
        else if (d > 1) stateClass = 'hidden hidden-after';

        // Lazy rendering: avoid mounting sphere animations for hidden planets
        if (d < -1 || d > 1) {
          return <div key={p.id} className={`planet-scene ${stateClass}`}></div>;
        }

        return (
          <div key={p.id} className={`planet-scene ${stateClass}`}>
            {/* Planet Sphere */}
            <div className="planet-sphere" style={{ backgroundImage: `url(${p.img})` }}></div>
            <div className="planet-shadow-overlay"></div>

            {/* Planetary Rings (Fake 3D) */}
            {p.id === 'saturn' && <div className="planet-rings saturn-rings" />}
            {p.id === 'uranus' && <div className="planet-rings uranus-rings" />}
          </div>
        );
      })}
    </>
  );
});
