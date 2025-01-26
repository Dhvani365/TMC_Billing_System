import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import  Homepage  from './pages/Homepage'
import Layout from './Layout'

const App = () => {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Homepage />} />
          </Routes>
        </Layout>
    </Router>
  );
};

export default App
