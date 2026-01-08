import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Error() {

  const location = useLocation();
  
  const locationToGoTo = location.pathname.split('/')[1]

  return (
    <div className="error-page">
      <div className="error-card">
        <h1 className="error-heading">Access Denied</h1>

        <p className="error-paragraph">
          You are not authorised to view the page you just requested. This may
          be due to any of the following:
        </p>

        <ul className="error-list">
          <li className="error-list-item">
            You have been logged out due to inactivity.
          </li>
          <li className="error-list-item">
            No branches have been assigned to you yet.
          </li>
          <li className="error-list-item">
            Organisation does not have any branches yet.
          </li>
          <li className="error-list-item">
            Organisation's configuration is still in progress.
          </li>
        </ul>

        <Link className="error-cta" to={`log-in?from=${locationToGoTo}`}>
          Login
        </Link>
      </div>
    </div>
  );
}

export default Error;
