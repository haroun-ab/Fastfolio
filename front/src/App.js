import { Route, BrowserRouter, Routes } from "react-router-dom";
import Home from './pages/Home';
import './styles/index.css';
import './styles/normalize.css'
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
