import { useState, useCallback } from 'react';
import { PLANETS } from '../Data';
import { usePlanetNavigation } from '../hooks/usePlanetNavigation';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

import { Sidebar } from '../components/solarPageComponets/Sidebar';
import { PlanetScene } from '../components/solarPageComponets/PlanetScene';
import { PlanetInfo } from '../components/solarPageComponets/PlanetInfo';
import { PlanetDetails } from '../components/solarPageComponets/PlanetDetails';

const SolarPlanet = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { idx, go } = usePlanetNavigation(isDetailsOpen);

  useBodyScrollLock(isDetailsOpen);

  const activePlanet = PLANETS[idx];

  const handleReadMore = useCallback(() => {
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
  }, []);

  return (
    <div className="solar-page">
    
      <Sidebar planets={PLANETS} currentIndex={idx} onPlanetSelect={go} />
      <PlanetScene planets={PLANETS} currentIndex={idx} />
      <PlanetInfo
        planets={PLANETS}
        currentIndex={idx}
        onReadMore={handleReadMore}
      />
      <PlanetDetails
        planet={activePlanet}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default SolarPlanet;