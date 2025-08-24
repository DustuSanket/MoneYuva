import React from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/Landing.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Landing />
    </>
  );
}

export default App;
