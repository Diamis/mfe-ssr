import React, { Suspense } from "react";

const App = ({ assets }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h1>Hello Remote!!</h1>
    </Suspense>
  );
};
export default App;
