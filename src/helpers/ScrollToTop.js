// import React, { useEffect, Fragment } from 'react';
// import { withRouter } from 'react-router-dom';

// function ScrollToTop({ history, children }) {
//   useEffect(() => {
//     const unlisten = history.listen(() => {
//       window.scrollTo(0, 0);
//     });
//     return () => {
//       unlisten();
//     };
//     // eslint-disable-next-line
//   }, []);

//   return <Fragment>{children}</Fragment>;
// }

// export default withRouter(ScrollToTop);

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
}

export default ScrollToTop;
