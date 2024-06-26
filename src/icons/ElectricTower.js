import React from 'react';
import avatar from '../images/ntower.png';


/**
 * @description the electric tower svg components
 * @param {*} param0 the class to style the component
 * @returns 
 */
const ElectricTower = ({ className }) =>{
  return (
//     <svg 
//         stroke="currentColor"
//         className={className}
//         id="Layer_5" 
//         enable-background="new 0 0 64 64" 
//         height="512" viewBox="0 0 64 64" 
//         width="512" 
//         xmlns="http://www.w3.org/2000/svg"
//         >
//     <path d="m61 61h2v2h-2z" />
//     <path d="m1 61h2v2h-2z" />
//     <path d="m41.18 27h8.82v1c0 1.654 1.346 3 3 3s3-1.346 3-3v-1h2v-3.748l-17-5v-2.252h9v1c0 1.654 1.346 3 3 3s3-1.346 3-3v-1h2v-3.748l-17-5v-4.252h-2v-2h-2v2h-10v-2h-2v2h-2v4.252l-17 5v3.748h2v1c0 1.654 1.346 3 3 3s3-1.346 3-3v-1h9v2.252l-17 5v3.748h2v1c0 1.654 1.346 3 3 3s3-1.346 3-3v-1h8.82l-5.667 34h-12.153v2h54v-2h-12.153zm-2.08 14-7.1 5.557-7.1-5.557zm-14.186-2 7.086-5.511 7.086 5.511zm16.671 2.594 2.389 14.334-10.352-8.102zm-7.956-9.372 5.661-4.403 1.686 10.117zm3.457-5.222-5.086 3.955-5.086-3.955zm-9.866-2 4.78-3.286 4.78 3.286zm11.78-.901-5.235-3.599 5.235-3.599zm-2.22-8.099-4.78 3.286-4.78-3.286zm-8-2 3.22-1.409 3.22 1.409zm5.714-2.5 4.506-1.971v3.943zm-2.494-1.091-3.22-1.409h6.44zm-2.494 1.091-4.506 1.971v-3.942zm-4.506 5.401 5.235 3.599-5.235 3.599zm5.371 15.321-7.347 5.714 1.686-10.117zm.007 15.604-10.352 8.102 2.389-14.334zm1.622 1.269 10.1 7.905h-20.2zm22-21.095c0 .552-.448 1-1 1s-1-.448-1-1v-1h2zm2-3.252v.252h-15v-4.664zm-2-7.748c0 .552-.448 1-1 1s-1-.448-1-1v-1h2zm2-3.252v.252h-15v-4.664zm-17-8.748v2h-14v-2zm-27 12c0 .552-.448 1-1 1s-1-.448-1-1v-1h2zm-4-3v-.252l15-4.412v4.664zm0 10.748 15-4.412v4.664h-15zm4 3.252c0 .552-.448 1-1 1s-1-.448-1-1v-1h2zm7.514 31h24.973l.333 2h-25.64z" />
// </svg>
  <img className={className} src={avatar} alt='' /> 
  );
}

export default ElectricTower;
