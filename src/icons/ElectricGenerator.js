import React from 'react';
import avatar from '../images/nelectric.png';



/**
 * @description the electric tower svg components
 * @param {*} param0 the class to style the component
 * @returns 
 */
const ElectricGenerator = ({ className }) =>{
  return (
    // <svg 
    //     height="512" 
    //     viewBox="0 0 64 64" 
    //     width="512" 
    //     xmlns="http://www.w3.org/2000/svg"
    //     stroke="currentColor"
    //     className={className}
    //     >
    //     <g id="outline">
    //         <path d="m59 14h-7v-2h1a1 1 0 0 0 1-1v-1h1a3 3 0 0 0 3-3v-5h-2v5a1 1 0 0 1 -1 1h-1v-1a1 1 0 0 0 -1-1h-18a1 1 0 0 0 -1 1v4a1 1 0 0 0 1 1h1v2h-31a3 3 0 0 0 -3 3v40a1 1 0 0 0 1 1h4v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3h26v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3h4a1 1 0 0 0 1-1v-40a3 3 0 0 0 -3-3zm-23-6h16v2h-16zm14 4v2h-2v-2zm-4 0v2h-4v-2zm-6 0v2h-2v-2zm-23 48h-8v-2h8zm38 0h-8v-2h8zm5-4h-56v-4h56zm-49-11h-2v-2h2zm0-20h-2v-2h2zm2 25v-30h14v30zm16 0v-30h4v30zm6 0v-30h18v30zm25 0h-5v-31a1 1 0 0 0 -1-1h-42a1 1 0 0 0 -1 1v2h-3a1 1 0 0 0 -1 1v4a1 1 0 0 0 1 1h3v14h-3a1 1 0 0 0 -1 1v4a1 1 0 0 0 1 1h3v3h-7v-33a1 1 0 0 1 1-1h54a1 1 0 0 1 1 1z" />
    //         <path d="m24 22h-8a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a1 1 0 0 0 -1-1zm-1 8h-6v-6h6z" />
    //         <path d="m43.789 37.614 7-9a1 1 0 0 0 -.789-1.614h-3.233l2.09-3.485a1 1 0 0 0 -.857-1.515h-5a1 1 0 0 0 -.874.514l-5 9a1 1 0 0 0 .874 1.486h4v4a1 1 0 0 0 .676.946 1.01 1.01 0 0 0 .324.054 1 1 0 0 0 .789-.386zm-4.089-6.614 3.89-7h2.644l-2.09 3.485a1 1 0 0 0 .856 1.515h2.955l-3.955 5.085v-2.085a1 1 0 0 0 -1-1z" />
    //         <path d="m15 34h10v2h-10z" />
    //         <path d="m15 38h4v2h-4z" />
    //         <path d="m21 38h4v2h-4z" />
    //         <path d="m49 46h-2v2h3a1 1 0 0 0 1-1v-6h-2z" />
    //         <path d="m43 46h2v2h-2z" />
    //         <path d="m39 46h2v2h-2z" />
    //     </g>
    // </svg>
    <img className={className} src={avatar} alt='' /> 
  );
}

export default ElectricGenerator;