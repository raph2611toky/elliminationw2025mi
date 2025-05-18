import { Route, Routes } from 'react-router-dom'
import Landingpage from './landinpage/landingpage'
import Inscription from './authentification/inscription'
import Connexion from './authentification/connexion'
import ChatBotTheEnd from './finalBot/finalBoth'
function App() {
  
  return(<>
   <Routes>
            <Route path ="/"  element={<Landingpage/>}/>
            <Route path ="/inscription"  element={<Inscription/>}/>
            <Route path='/connexion' element={<Connexion/>}/>
            <Route path='/home/finalBot' element={<ChatBotTheEnd/>}/>
   </Routes>  
  </>)
}

export default App
