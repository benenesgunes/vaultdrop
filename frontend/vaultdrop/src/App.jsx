import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from "./pages/Home"
import Layout from "./Layout"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import MyFiles from "./pages/MyFiles"

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/files" element={<MyFiles />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
