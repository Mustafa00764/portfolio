import React from 'react'
import styles from './GameCard.module.css'
interface GameCardProps {
  game: {
    id: number
    title: string
    text: string
    image: string
    slug: string
  }
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  return (
    <div className={styles.gameCard}>
      <img src={game.image} alt={game.image} />
      <h3>{game.title}</h3>
      <p>{game.text}</p>
    </div>
  )
}

export default GameCard
