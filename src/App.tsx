import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import User from './pages/User'

function App() {
  return (
    
    <Routes>
      <Route path='/'  element={<Home/>}/>
      <Route path='/edit-user/:id' element={<User/>}/>

    </Routes>
  )
}

export default App