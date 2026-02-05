import React from 'react';
import LatestLogo from '../icons/LatestLogo';



function Loader() {
  return (
    <div className='loader-wrapper'>
      {/* <Logo className='loader' /> */}
      <LatestLogo className='loader-new-logo' />
    </div>
  );
}

export default Loader;
