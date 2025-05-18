import { Route, Routes } from 'react-router-dom'
import Landingpage from './landinpage/landingpage'
import Inscription from './authentification/inscription'
import Connexion from './authentification/connexion'
import ChatBotTheEnd from './finalBot/finalBoth'
import Landingpage from './component/landingpage'
import HallDesFins from './hallDesFins/hallDesFins'
function App() {
  
  return(<>
   <Routes>
            <Route path ="/"  element={<Landingpage/>}/>
            <Route path ="/inscription"  element={<Inscription/>}/>
            <Route path='/connexion' element={<Connexion/>}/>
            <Route path='/home/finalBot' element={<ChatBotTheEnd/>}/>
            <Route path ="/"  element={<Landingpage/>}/>
            <Route path ="/hall"  element={<HallDesFins/>}/> 
   </Routes>  
  </>)
}

export default App
