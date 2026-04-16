import GameCard from '@/components/layout/cards/game-card/GameCard'
import styles from './Games.module.css'
import { Link } from 'react-router-dom'

const Games = () => {
  const games = [
    {
      id: 1,
      title: 'gain life',
      text: 'click the hearts',
      image: '/images/gain-life.png',
      slug: 'gain-life'
    },
    {
      id: 2,
      title: 'escape the storm',
      text: 'bullet-hell like game',
      image: '/images/gain-life.png',
      slug: 'escape-the-storm'
    },
    {
      id: 3,
      title: 'tower defense',
      text: 'click the hearts',
      image: '/images/tower-defense.png',
      slug: 'tower-defense'
    },
    {
      id: 4,
      title: 'Gorillas',
      text: 'click the hearts',
      image: '/images/gorillas.png',
      slug: 'gorillas'
    },
    {
      id: 5,
      title: 'arcanoid',
      text: 'destroy the bricks game',
      image: '/images/gain-life.png',
      slug: 'arcanoid'
    },
    {
      id: 6,
      title: 'gain life',
      text: 'click the hearts',
      image: '/images/gain-life.png',
      slug: 'gain-life'
    }
  ]
  return (
    <div className={styles.games}>
      <p>mini games</p>
      <div className={styles.text}>
        <p>Here you will see a few mini games I implemented in React or in Canvas.</p>
        <p>Have fun!</p>
      </div>
      <div className={styles.list}>
        {games.map(game => {
          return (
            <Link to={`/games/${game.slug}`} key={game.id}>
              <GameCard game={game} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Games
