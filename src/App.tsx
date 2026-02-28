import { Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header'
import NavBar from './components/layout/NavBar'
import SidebarLeft from './components/layout/sidebars/SidebarLeft'
import SidebarRight from './components/layout/sidebars/SidebarRight'
import Home from './pages/home/Home'
import '@assets/styles/app.css'
import Blogs from './pages/blogs/Blogs'
import Creations from './pages/creations/Creations'
import Project from './pages/project/Project'
import Services from './pages/services/Services'
import Blog from './pages/blog/Blog'
import Games from './pages/games/Games'
import { GainLifeGame } from './games/gain-life/GainLifeGame'
function App() {
  const links = [
    {
      id: 1,
      link: '/',
      title: 'Stack',
      description: 'The development stack is a set of technologies that work together, covering all the stages of creating an application.'
    },

    {
      id: 2,
      link: '/blog',
      title: 'Blog',
      description: 'Here I keep logs of my plans and updates on the development of the project.'
    },

    {
      id: 3,
      link: '/services',
      title: 'Services',
      description: 'Suscipit est consequatur nemo voluptatem est labore saepe.'
    },

    {
      id: 4,
      link: '/creations',
      title: 'creations',
      description: 'My creations are small worlds made of code and meaning.'
    },

    {
      id: 5,
      link: '/games',
      title: 'games',
      description: 'Suscipit est consequatur nemo voluptatem est labore saepe.'
    }
  ]
  return (
    <div className="app">
      <div className='gradient'></div>
      <Header />

      <div className="container">
        <SidebarLeft />

        <NavBar links={links}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blogs/>} />
            <Route path="/creations" element={<Creations />} />
            <Route path="/services" element={<Services />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/gain-life" element={<GainLifeGame />} />
            <Route path="/creations/:id" element={<Project />} />
            <Route path="/blog/:id" element={<Blog />} />
          </Routes>
        </NavBar>

        <SidebarRight />
      </div>
    </div>
  )
}

export default App
