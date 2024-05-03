import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EditorPage from "./components/EditorPage";
import Home from "./components/Home";
import { Provider } from "react-redux";
import store from "./utils/store";
import { ColorRing } from "react-loader-spinner";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/editor/:roomId",
      element: <EditorPage />,
    },
  ]);
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
