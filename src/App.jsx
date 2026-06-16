import { Routes, Route } from 'react-router-dom'
import MockPage from './pages/MockPage.jsx'
import ControlsPage from './pages/ControlsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MockPage />} />
      <Route path="/controls" element={<ControlsPage />} />
    </Routes>
  )
}
