
import './App.css'
import BackendConnection from "./assets/backendConnection"
import { Routes,Route,Link } from 'react-router-dom';

function App() {


  return (
    <div>
      <nav>

        <Link to="/register" >Register</Link>

      </nav>

      <BackendConnection />
    </div>
  )
}

export default App
