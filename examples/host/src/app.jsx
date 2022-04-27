import React, { Suspense } from "react";
import Html from "./html";
import "./style.css";

const OtherComponent = React.lazy(() => import("./OtherComponent"));
const RemoteComponent = React.lazy(() => import("remote2/app"));

const App = ({ assets }) => {
  return (
    <Html title="Helllo">
      <Suspense fallback={<div>Loading...</div>}>
        <h1>Hello SSR!!</h1>
        <OtherComponent />
        <React.Suspense fallback="Loading RemoteComponent...">
          <RemoteComponent />
        </React.Suspense>
      </Suspense>
    </Html>
  );
};
export default App;
