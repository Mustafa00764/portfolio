import React from 'react'
import Border from '../ui/Border'
import NavbarCard from './cards/NavbarCard';

type Link = {
  id: number;
  link: string
  title: string
  description: string
}

interface NavBarProps {
  children: React.ReactNode
  links: Link[]
}

const NavBar: React.FC<NavBarProps> = ({ children, links }) => {
  return (
    <div className='navbar'>
      <Border>{children}</Border>
      <nav className='nav'>
        {links.map(link => {
          return (
            <NavbarCard key={link.id} link={link}/>
          )
        })}
      </nav>
    </div>
  )
}

export default NavBar
