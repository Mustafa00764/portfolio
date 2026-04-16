import React, { useState } from 'react'
import { useHighScores } from '@hooks/useHighScores'

interface Props {
  currentScore: number
  onClose: () => void
}

export const HighScores: React.FC<Props> = ({ currentScore, onClose }) => {
  const { scores, addScore } = useHighScores()
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      addScore(name, currentScore)
      setSubmitted(true)
    }
  }

  return (
    <div className="highscores-overlay">
      <div className="highscores-panel">
        <h2>High Scores</h2>

        {!submitted && currentScore > 0 && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={20}
              autoFocus
            />
            <button type="submit">Save</button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{score.name}</td>
                <td>{Math.floor(score.score)}</td>
                <td>{new Date(score.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
