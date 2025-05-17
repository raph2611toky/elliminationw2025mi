import { Route, Routes } from 'react-router-dom'
import Landingpage from './landinpage/landingpage'
import Inscription from './authentification/inscription'
import Connexion from './authentification/connexion'
function App() {
  
  return(<>
   <Routes>
            <Route path ="/"  element={<Landingpage/>}/>
            <Route path ="/inscription"  element={<Inscription/>}/>
            <Route path='/connexion' element={<Connexion/>}/>
   </Routes>  
  </>)
}

export default App
