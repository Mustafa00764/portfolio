import { useModal } from '@/hooks/useModal'
import styles from './Credits.module.css'
import { useState } from 'react'

interface List {
  id: number
  title: string
  lists: string[]
}

const Credits = () => {
  const { closeModal } = useModal()
  const [close, setClose] = useState<boolean>(false)

  const handleClose = () => {
    closeModal()
    setClose(true)
  }

  const lists: List[] = [
    {
      id: 1,
      title: 'developed by',
      lists: ['Maksim @Max00764']
    },
    {
      id: 2,
      title: 'designed by',
      lists: ['Maksim @Max00764']
    },
    {
      id: 3,
      title: 'audio effects',
      lists: ['click, hover, typing and all other audio effects by mixkit.co']
    },
    {
      id: 4,
      title: 'music',
      lists: [
        '“tea Fragrance” by Adeline Yeo (HP), Never forget',
        '“pressure” by Eggy Toast, Shed Roof',
        '“We were kids” by HolinzaPATREON, never forget'
      ]
    }
  ]

  return (
    <div className={`${styles.credits} ${close ? styles.animation : ''}`} onClick={handleClose}>
      <div className={styles.model} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.texts}>
            <h3>Credits</h3>
            <p>Everything involved in this project</p>
          </div>
          <div className={styles.hr} />
        </div>
        <div className={styles.lists}>
          {lists.map(list => {
            return (
              <div key={list.id} className={styles.list}>
                <div className={styles.title}>
                  <p>{list.title}</p>
                </div>
                <div className={styles.textLists}>
                  {list.lists.map((text, index) => {
                    return <p key={index}>{text}</p>
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Credits
