import React from "react";
import "./App.css";
import classNames from "classnames";

function App() {
  const divClass = classNames({
    'flex': true,
    'justify-center': Math.random() > 0.5
  })

  return (
    <div className={divClass}>
      <h1 className="font-bold text-2xl text-blue-900">
        React and Tailwind with Vitejs!
      </h1>
    </div>
  );
}

export default App;