import React from 'react'
import DriverData from './DriverData';
import DriverGraphs from './DriverGraphs';
import { Link } from 'react-router-dom';
import DriverStandings from './DriverStandings';
import StartingPosition from './StartingPosition';
import Podiums from './Podiums';

const DisplayBar = ({driver}) => {
    return (
        <div className="p-4">
          <h1 className="text-3xl font-bold">Driver Stats</h1>
          {/* <button className='black'><Link to='/comparedriver'>Compare Drivers</Link></button> */}
          <div className='flex justify-end h-[40px]'>
          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black hover:border transition duration-200">
          <Link to="/comparedriver">Compare Drivers</Link>
          </button>
          </div>
          <DriverData driver={driver}/>
          <DriverStandings driverName={driver}/>
          <DriverGraphs driver={driver}/>
          <StartingPosition driver={driver}/>
          <Podiums driver={driver}/>
        </div>
      );
}

export default DisplayBar