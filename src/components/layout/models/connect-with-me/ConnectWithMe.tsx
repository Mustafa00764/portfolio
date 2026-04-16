import styles from './ConnectWithMe.module.css'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/input/Input'
import Textarea from '@/components/ui/textarea/Textarea'
import { useModal } from '@/hooks/useModal'
import { useState } from 'react'

interface ConnectWithMeProps {
  type?: string
}

const ConnectWithMe = ({ type = 'me' }: ConnectWithMeProps) => {
  const { closeModal } = useModal()
  const [close, setClose] = useState<boolean>(false)

  const handleClose = () => {
    closeModal()
    setClose(true)
  }

  return (
    <div className={`${styles.hire} ${close ? styles.animation : ''}`} onClick={handleClose}>
      <div className={styles.model} onClick={e => e.stopPropagation()}>
        <div className={styles.texts}>
          <h3>{type === 'me' ? 'connect with me' : 'open for hire'}</h3>
          <p>
            {type === 'me'
              ? 'wanna chat? Or just share something cool?'
              : 'I would love to hear about your projects!'}
          </p>
        </div>
        <div className={styles.main}>
          <form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="your-name">How should I call you?</label>
              <Input placeholder="your name" id="your-name" />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Sending from</label>
              <Input type="email" placeholder="your.name@acme.com" id="email" />
            </div>
            <div className={styles.field}>
              <label htmlFor="transmitted-data">transmitted data</label>
              <Textarea placeholder="Hi, I write to you about ..." id="transmitted-data" />
            </div>
          </form>
          <div className={styles.buttons}>
            <Button variant="full-blue" size="3xl">
              send message [enter]
            </Button>
            <Button variant="border" size="2xl" className={styles.btnBlue} onClick={handleClose}>
              discard [esc]
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectWithMe
