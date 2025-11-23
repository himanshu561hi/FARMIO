// import React from 'react';

// const Loan = () => {
//   return (
//     <div className="w-full h-screen overflow-hidden m-0 p-0">
//       <iframe
//         src="https://agrifarmio-loan.netlify.app/"
//         title="AgriLoan Estimator"
//         className="w-full mt-20 h-full border-0 overflow-hidden"
//         style={{ minHeight: '100vh', minWidth: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
//         allowFullScreen
//       ></iframe>
//     </div>
//   );
// };

// export default Loan;



import React from 'react';
import Footer from '../pages/Footer';

const Loan = () => {
  return (
    <>
      <div className="w-full m-0 p-0" style={{ minHeight: '100vh', paddingTop: '80px' }}>
        
        <iframe
          src="https://agrifarmio-loan.netlify.app/"
          title="AgriLoan Estimator"
          // 2. LAYOUT FIX: Remove absolute positioning and let the content flow naturally.
          // minHeight set to take up the remaining viewport height.
          className="w-full h-full border-0 overflow-hidden"
          style={{ 
            minHeight: 'calc(100vh - 80px)', // Calculate height relative to viewport (clears navbar)
            minWidth: '100%',
            display: 'block' // Ensure it's a block element
          }}
          allowFullScreen
        ></iframe>
      </div>
      
      {/* 3. Footer is now correctly rendered AFTER the main content */}
      <Footer /> 
    </>
  );
};

export default Loan;