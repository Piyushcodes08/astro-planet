import { PLANETS } from '../Data';
import { usePlanetNavigation } from '../hooks/usePlanetNavigation';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { Sidebar } from '../components/solarPageComponets/Sidebar';
import { PlanetScene } from '../components/solarPageComponets/PlanetScene';
import { PlanetInfo } from '../components/solarPageComponets/PlanetInfo';
import { PlanetDetails } from '../components/solarPageComponets/PlanetDetails';
import { useState, useCallback } from 'react';

const SolarPlanet = () => {
 const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { idx, go } = usePlanetNavigation(isDetailsOpen);

  // Custom hook for scroll lock
  useBodyScrollLock(isDetailsOpen);

  const activePlanet = PLANETS[idx];


  const handleReadMore = useCallback(() => setIsDetailsOpen(true), []);
  const handleClose = useCallback(() => setIsDetailsOpen(false), []);

  return (
    <div className='solar-page'>
     

      <Sidebar 
        planets={PLANETS} 
        currentIndex={idx} 
        onPlanetSelect={go} 
      />

      <PlanetScene 
        planets={PLANETS} 
        currentIndex={idx} 
      />

      <PlanetInfo 
        planets={PLANETS} 
        currentIndex={idx} 
        onReadMore={handleReadMore}
      />

      <PlanetDetails 
        planet={activePlanet} 
        isOpen={isDetailsOpen} 
        onClose={handleClose} 
      />
    </div>
  )
}

export default SolarPlanet