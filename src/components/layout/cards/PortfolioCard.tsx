import Border from '@/components/ui/Border'
import Button from '@/components/ui/Button'
import React from 'react'
import '@assets/styles/components/portfolioCard.css'
import { Link } from 'react-router-dom'

interface PortfolioCardProps {
  portfolio: {
    id: number
    title: string
    createAt: string
    projectName: string
    description: string
    poster: string
    images: object | null
    link: string
    businessText: string
    businessSubtext: string
  }
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio }) => {
  return (
    <div className="portfolio-card">
      <Border className="">
        <div className="portfolio-poster">
          <img src={portfolio.poster} alt={portfolio.title} className="bg-img" />
          <div className="portfolio-info">
            <p>published {portfolio.createAt}</p>
            <img src={portfolio.poster} alt={portfolio.title} />
            <Link to={`/creations/${portfolio.id}`}>
              <Button variant="border-blue" size="3xl">
                <p>view live</p>
              </Button>
            </Link>
          </div>
        </div>
      </Border>
      <div className="portfolio-title">
        <div className="project-name">
          <h3>{portfolio.projectName}</h3>
          <hr />
        </div>
        <p>{portfolio.title}</p>
      </div>
    </div>
  )
}

export default PortfolioCard
