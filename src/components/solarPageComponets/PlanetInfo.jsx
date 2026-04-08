import React from 'react';

export const PlanetInfo = React.memo(function PlanetInfo({ planets, currentIndex, onReadMore }) {
  return (
    <>
      <div className="top-labels">
        {planets.map((p, i) => (
          <div key={p.id} className={`top-block ${i === currentIndex - 1 ? 'active' : ''}`}>
            <div className="tb-type" style={{ color: p.color }}>PLANET</div>
            <div className="tb-name">{p.name.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div className="main-labels">
        {planets.map((p, i) => (
          <div key={p.id} className={`main-block ${i === currentIndex ? 'active' : ''}`}>
            <div className="mb-type" style={{ color: p.color }}>PLANET</div>
            <div className="mb-name">{p.name.toUpperCase()}</div>
            <div className="mb-desc">{p.desc}</div>
            <div 
              className="mb-more" 
              style={{ borderBottomColor: p.color, color: p.color }}
              onClick={onReadMore}
            >
              READ MORE
            </div>
          </div>
        ))}
      </div>
    </>
  );
});
