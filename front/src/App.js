import { Route, BrowserRouter, Routes } from "react-router-dom";
import './styles/index.css';
import './styles/normalize.css'

import Home from './pages/Home';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/portfolio' element={<Home/>}></Route>{/* accueil de session */}
          <Route path='/project' element={<Home/>}></Route>{/* détail et description du projet consulté */}
          <Route path='/new-project' element={<Home/>}></Route>{/* formulaire nouveau projet */}
          <Route path='/edit-project' element={<Home/>}></Route>{/* formulaire édition de projet existant */} 
          <Route path='/edit-profile' element={<Home/>}></Route>{/* formulaire modification profil */}
          <Route path='/edit-skills' element={<Home/>}></Route>{/* formulaire modification compétences */}
          <Route path='/change-password' element={<Home/>}></Route>{/* formulaire modification du mot de passe */}
        </Routes>
      </BrowserRouter>
  );
}

export default App;
