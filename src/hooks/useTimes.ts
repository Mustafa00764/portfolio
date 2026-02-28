import { useEffect, useState } from 'react'

export const useTimes = () => {
  const [serverTime, setServerTime] = useState('')
  const [localTime, setLocalTime] = useState('')

  useEffect(() => {
    const updateTimes = () => {
      const d = new Date()

      // часовой формат
      setLocalTime(
        d.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        })
      )

      const serverDate = new Date(d)

      const moscowTime = serverDate.toLocaleString('ru-RU', {
        timeZone: 'Europe/Moscow',
        hour: '2-digit',
        minute: '2-digit'
      })

      setServerTime(moscowTime)
    }

    updateTimes()

    // Необязательно: Обновлять каждую секунду
    const interval = setInterval(updateTimes, 12_000)

    return () => clearInterval(interval)
  }, []) // Пустой массив зависимостей - запускается один раз при монтировании

  return {
    serverTime,
    localTime
  }
}
