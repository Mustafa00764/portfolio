import GameCard from '@/components/layout/cards/game-card/GameCard'
import '@assets/styles/pages/games.css'
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
      title: 'gain life',
      text: 'click the hearts',
      image: '/images/gain-life.png',
      slug: 'gain-life'
    },
    {
      id: 4,
      title: 'gain life',
      text: 'click the hearts',
      image: '/images/gain-life.png',
      slug: 'gain-life'
    },
    {
      id: 5,
      title: 'gain life',
      text: 'click the hearts',
      image: '/images/gain-life.png',
      slug: 'gain-life'
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
    <div className="games">
      <p>mini games</p>
      <div className="games-text">
        <p>Here you will see a few mini games I implemented in React or in Canvas.</p>
        <p>Have fun!</p>
      </div>
      <div className="games-list">
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
