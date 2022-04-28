import React, { Suspense } from "react";

import style from "./styles/app.module.css";
import "./styles/app.css";

const News = React.lazy(() => import("./components/News"));

const App = () => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <h1>Hello SSR!!!</h1>
        <span className={style.colorRed}>css module: color red;</span>
        <News />
      </Suspense>
    </main>
  );
};
export default App;
