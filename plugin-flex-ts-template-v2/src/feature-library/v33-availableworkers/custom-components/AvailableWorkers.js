/* eslint-disable prettier/prettier */
import { useEffect,useState } from 'react';

import AvailableIcon from './AvailableIcon';
import { getAvailableWorkers } from '../flex-hooks/helpers/AvailableWorkersConfigService';



const AvailableWorkers = () => {
  const [workers, setWorkers] = useState({});

  const fetchAvailableWorkers = async () => {
      try {
        const response = await getAvailableWorkers();
        setWorkers(response.data);
      } catch (error) {
        console.error('Error fetching available workers:', error);
      }
    };


  useEffect(() => {
    fetchAvailableWorkers();
    const interval = setInterval(() => {
      fetchAvailableWorkers();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }
  , []);
 
  
  return (
    <>
      <div
        style={{
          margin: 'auto 0',
        }}
      >
        <p
          style={{
            textAlign: 'center',
          }}
        >
          Service Conseil
        </p>
        <div
          style={{
            width: 120,
            height: 30,
            display: 'flex',

            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <AvailableIcon color="green" number={workers.dispo} info="Agents disponibles"></AvailableIcon>
          <p>/</p>
          <AvailableIcon color="orange" number={workers.renfo} info="Agents en renfort"></AvailableIcon>
          <p>/</p>
          <AvailableIcon color="red" number={workers.indispo} info="Agents déconnectés"></AvailableIcon>
        </div>
      </div>
    </>
  );
};
export default AvailableWorkers;
