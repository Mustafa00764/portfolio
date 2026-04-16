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
import ArcanoidGame from './games/arcanoid/GeometryDash'
import TowerDefense from './games/tower-defense/TowerDefense'
import Gorillas from './games/gorillas/Gorillas'
import ModalRoot from './components/layout/models/ModelRoot'
import { useModal } from './hooks/useModal'
import AboutMe from './pages/about-me/AboutMe'
import Button from './components/ui/Button'
import { useEffect, useState } from 'react'

function App() {
  const { modal } = useModal()
  const [view, setView] = useState<boolean>(true)
  const links = [
    {
      id: 1,
      link: '/',
      title: 'Stack',
      description:
        'The development stack is a set of technologies that work together, covering all the stages of creating an application.'
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
  const path = window.location.pathname
  const width = window.innerWidth

  useEffect(() => {
    if (width > 640) {
      setView(true)
    } else if (path !== '/') {
      setView(false)
    } else {
      setView(true)
    }
    console.log(view, width)
  }, [path])

  return (
    <div className={`app`}>
      <div className="gradient"></div>
      <Header />
      <div className={`main ${modal?.animate}`}>
        <div className="container">
          {view ? <SidebarLeft /> : ''}

          <NavBar links={links}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blogs />} />
              <Route path="/creations" element={<Creations />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about-me" element={<AboutMe />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/gain-life" element={<GainLifeGame />} />
              <Route path="/games/arcanoid" element={<ArcanoidGame />} />
              <Route path="/games/tower-defense" element={<TowerDefense />} />
              <Route path="/games/gorillas" element={<Gorillas />} />
              <Route path="/creations/:id" element={<Project />} />
              <Route path="/blog/:id" element={<Blog />} />
            </Routes>
          </NavBar>

          <SidebarRight />
        </div>
      </div>
      <div className="btns">
        <Button variant="full-blue" size="4xl" className="bigBtn">
          Navigation
        </Button>

        <Button variant="border" size="4xl" className="bigBtn">
          About
        </Button>
      </div>
      <ModalRoot />
    </div>
  )
}

export default App
