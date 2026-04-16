import styles from './Settings.module.css'
import Button from '@/components/ui/Button'
import RangeSlider from '@/components/ui/range-slider/RangeSlider'
import { useModal } from '@/hooks/useModal'
import React, { useState, ChangeEvent } from 'react'

const Settings = () => {
  const { closeModal } = useModal()
  const [close, setClose] = useState<boolean>(false)

  const [settings, setSettings] = useState({
    hudHue: 1,
    hudSize: 1280,
    textScale: 16
  })

  const update = (key: string, val: any) => setSettings(p => ({ ...p, [key]: val }))

  const handleClose = () => {
    closeModal()
    setClose(true)
  }

  return (
    <div className={`${styles.settings} ${close ? styles.animation : ''}`} onClick={handleClose}>
      <div className={styles.model} onClick={e => e.stopPropagation()}>
        <div className={styles.texts}>
          <h3>visual configurator</h3>
          <p>apply what works best for you</p>
        </div>
        <div className={styles.main}>
          <form className={styles.form}>
            <div className={styles.fields}>
              <div className={styles.field}>
                <RangeSlider
                  img={'/icons/hudhue.svg'}
                  title={'HUD HUE'}
                  texts={[
                    { title: 'Black', number: 8.4 },
                    { title: 'white', number: 7.5 }
                  ]}
                  minSize={0}
                  maxSize={3}
                  val={settings.hudHue}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => update('hudHue', e)}
                />
              </div>
              <div className={styles.field}>
                <RangeSlider
                  img={'/icons/hudsize.svg'}
                  title={'HUD SIZE'}
                  minSize={720}
                  maxSize={1476}
                  val={settings.hudSize}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => update('hudSize', e)}
                />
              </div>
              <div className={styles.field}>
                <RangeSlider
                  img={'/icons/textscale.svg'}
                  title={'Text scale'}
                  texts={[
                    { title: 'Largest', number: 32, unit: 'px' },
                    { title: 'Smallest', number: 12, unit: 'px' }
                  ]}
                  minSize={12}
                  maxSize={48}
                  val={settings.textScale}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => update('textScale', e)}
                />
              </div>
            </div>
            <div className={styles.formFooter}>
              <div className={styles.hr}></div>
              <div className={styles.warning}>
                <div className={styles.icon}>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_2405_1772)">
                      <path
                        d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
                        fill="currentColor"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2405_1772">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p>
                  The configuration data is stored in your browser. If you login from a different
                  browser or machine, your settings will not apply.
                </p>
              </div>
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

export default Settings
