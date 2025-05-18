import { Route, Routes } from 'react-router-dom'
import Landingpage from './component/landingpage'
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
