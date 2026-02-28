import Button from '@/components/ui/Button'
import React from 'react'
import { NavLink } from 'react-router-dom'

interface Link {
  link: {
    id: number
    link: string
    title: string
    description: string
  }
}

const NavbarCard: React.FC<Link> = ({ link }) => {
  return (
    <NavLink to={link.link} className={({ isActive }) => (isActive ? 'isActive' : '')}>
      <div className="navbarCard">
        <div className="line"></div>
        <div className="navbar-info">
          <Button variant="union" size="large" className="btn-nav">
            {link.title}
          </Button>
          <p className="navbar-text">{link.description}</p>
        </div>
      </div>
    </NavLink>
  )
}

export default NavbarCard
