import Border from '@/components/ui/border/Border'
import styles from './AboutMe.module.css'
import Scene from '@/components/layout/3d-model/scene/Scene'

const AboutMe = () => {
  const texts = [
    {
      title: 'The short introduction of my life',
      description:
        "I have always been fascinated by the endless possibilities of the internet and the ways it can be leveraged to make our lives better. I decided to pursue a career in web engineering to help build innovative and impactful web-based solutions that can solve complex problems and make a difference in people's lives."
    },
    {
      title: 'Career and development',
      description:
        'Throughout my career, I have worked with a wide range of technologies, from front-end frameworks like React and Angular to back-end frameworks like Node.js and Django. I am passionate about staying up-to-date with the latest industry trends and tools and continually learning new skills to improve my craft.'
    },
    {
      title: 'More can be added in the left side for summary',
      description:
        'As a web engineer, my top priority is to ensure the reliability, scalability, and security of the web applications I develop. I enjoy collaborating with cross-functional teams and working closely with clients to understand their needs and provide them with the best possible solutions.'
    }
  ]
  return (
    <div className={styles.aboutMe}>
      <p>Who is Max Eshchanov</p>
      <div className={styles.main}>
        <div className={styles.list}>
          {texts.map((item, index) => {
            return (
              <div key={index} className={styles.texts}>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.description}>{item.description}</p>
              </div>
            )
          })}
        </div>
        <Border className={styles.border}>
          <div className={styles.model}>
            <Scene />
          </div>
        </Border>
      </div>
    </div>
  )
}

export default AboutMe
