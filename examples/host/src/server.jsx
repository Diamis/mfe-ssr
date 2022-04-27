import React, { Suspense } from "react";

const OtherComponent = React.lazy(() => import("./OtherComponent"));

const App = () => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <h1>Hello SSR</h1>
        <OtherComponent />
      </Suspense>
    </main>
  );
};
export default App;
