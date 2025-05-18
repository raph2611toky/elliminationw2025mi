import { Route, Routes } from 'react-router-dom'
import Landingpage from './landinpage/landingpage'
import HallDesFins from './hallDesFins/hallDesFins'
function App() {
  
  return(<>
   <Routes>
      <Route path ="/"  element={<Landingpage/>}/>
      <Route path ="/hall"  element={<HallDesFins/>}/>
            
   </Routes>  
  </>)
}

export default App
