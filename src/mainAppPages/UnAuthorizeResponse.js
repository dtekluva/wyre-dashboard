import React from 'react';
import { Link } from 'react-router-dom';

function UnAuthorizeResponse() {
  return (
    <div className='error-page'>
      <div className='error-card'>
        <h1 className='error-heading'>Not Allowed</h1>

        <p className='error-paragraph'>
          You are not authorised to view this page.
        </p>

        <Link className='error-cta' to='/'>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default UnAuthorizeResponse;
