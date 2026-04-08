import React from 'react';

export const PlanetInfo = React.memo(function PlanetInfo({ planets, currentIndex, onReadMore }) {
  const prev = planets[currentIndex - 1];
  const current = planets[currentIndex];

  return (
    <>
      <div className="top-labels">
        {prev && (
          <div className="top-block active">
            <div className="tb-type" style={{ color: prev.color }}>PLANET</div>
            <div className="tb-name">{prev.name.toUpperCase()}</div>
          </div>
        )}
      </div>

      <div className="main-labels">
        {current && (
          <div className="main-block active">
            <div className="mb-type" style={{ color: current.color }}>PLANET</div>
            <div className="mb-name">{current.name.toUpperCase()}</div>
            <div className="mb-desc">{current.desc}</div>
            <div
              className="mb-more"
              style={{ borderBottomColor: current.color, color: current.color }}
              onClick={onReadMore}
            >
              READ MORE
            </div>
          </div>
        )}
      </div>
    </>
  );
});