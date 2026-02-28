import '@assets/styles/header.css'
import Button from '../ui/Button'
import { useState } from 'react'
import { useTimes } from '@/hooks/useTimes'

const Header = () => {
  const [coin, setCoin] = useState(1425)
  const { serverTime, localTime } = useTimes()

  const addCoin = () => {
    setCoin(coin + 1)
  }

  return (
    <div className="header">
      <div className="balance">
        <div className="level">
          <h2 className="level-number">48</h2>
          <h4 className="level-title">LEVEL</h4>
        </div>
        <div className="coins">
          <Button variant="border" size="icon" onClick={addCoin}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.25 7.25V6.25V5.25V4.25V3.25V2.25V1.25M7.25 7.25V8.25V9.25V10.25V11.25V12.25V13.25M7.25 7.25H8.25H9.25H10.25H11.25H12.25H13.25M7.25 7.25H6.25H5.25H4.25H3.25H2.25H1.25"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </Button>
          <div className="coins-info">
            <h2 className="coin-number">{coin.toLocaleString('en-US')}</h2>
            <h4 className="coin-title">COINS AWARDED</h4>
          </div>
        </div>
      </div>
      <div className="times">
        <Button onClick={() => console.log('click')}>
          <p>credits</p>
        </Button>
        <div className="server-time">
          <p className="time-title">server time: </p>
          <p>{serverTime}</p>
        </div>
        <div className="local-time">
          <p className="time-title">local time: </p>
          <p>{localTime}</p>
        </div>
      </div>
    </div>
  )
}

export default Header
