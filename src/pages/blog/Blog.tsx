import styles from './Blog.module.css'
import { Link, useParams } from 'react-router-dom'
import poster from '@/assets/images/poster.png'
import Button from '@/components/ui/Button'

const Blog = () => {
  const { id } = useParams()

  const blogs = [
    {
      id: 1,
      title: 'Quick start with Magic Portfolio',
      poster: '/images/horizontal-1.webp',
      subtitle: 'A comprehensive guide to setting up your professional portfolio in minutes',
      createDate: '1 month ago',
      texts: (
        <div className={styles.description}>
          <h2>About</h2>
          <p>
            Magic Portfolio is a comprehensive, MDX-based, SEO-friendly, responsive portfolio
            template built with Once UI and Next.js.
          </p>
          <h2>License</h2>
          <p>
            Magic Portfolio is licensed under the CC BY-NC 4.0. You can only use it for personal
            purposes, and you must attribute the original work. The attribution is added in the
            footer by default, but you can place it in any other, visible part of your site.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: 'Quick start with Magic Portfolio',
      poster: '/images/img1.png',
      subtitle: 'A comprehensive guide to setting up your professional portfolio in minutes',
      createDate: '1 month ago',
      texts: (
        <div className={styles.description}>
          <h2>About</h2>
          <p>
            Magic Portfolio is a comprehensive, MDX-based, SEO-friendly, responsive portfolio
            template built with Once UI and Next.js.
          </p>
          <h2>License</h2>
          <p>
            Magic Portfolio is licensed under the CC BY-NC 4.0. You can only use it for personal
            purposes, and you must attribute the original work. The attribution is added in the
            footer by default, but you can place it in any other, visible part of your site.
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: 'Quick start with Magic Portfolio',
      poster: '/images/horizontal-1.webp',
      subtitle: 'A comprehensive guide to setting up your professional portfolio in minutes',
      createDate: '1 month ago',
      texts: (
        <div className={styles.description}>
          <h2>About</h2>
          <p>
            Magic Portfolio is a comprehensive, MDX-based, SEO-friendly, responsive portfolio
            template built with Once UI and Next.js.
          </p>
          <h2>License</h2>
          <p>
            Magic Portfolio is licensed under the CC BY-NC 4.0. You can only use it for personal
            purposes, and you must attribute the original work. The attribution is added in the
            footer by default, but you can place it in any other, visible part of your site.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: 'Quick start with Magic Portfolio',
      poster: '/images/horizontal-1.webp',
      subtitle: 'A comprehensive guide to setting up your professional portfolio in minutes',
      createDate: '1 month ago',
      texts: (
        <div className={styles.description}>
          <h2>About</h2>
          <p>
            Magic Portfolio is a comprehensive, MDX-based, SEO-friendly, responsive portfolio
            template built with Once UI and Next.js.
          </p>
          <h2>License</h2>
          <p>
            Magic Portfolio is licensed under the CC BY-NC 4.0. You can only use it for personal
            purposes, and you must attribute the original work. The attribution is added in the
            footer by default, but you can place it in any other, visible part of your site.
          </p>
        </div>
      )
    }
  ]

  const currentBlog = blogs.filter(blog => blog.id === Number(id))[0]

  return (
    <div className={styles.blog}>
      <div className={styles.blogHeader}>
        <div className={styles.blogAuthor}>
          <div className={styles.blogAuthorInfo}>
            <img src={poster} alt="poster" />
            <p>Luz Wintheiser</p>
          </div>
          <p>{currentBlog.createDate}</p>
        </div>
        <Link to="/blog">
          <Button size="xl">
            <p>blogs</p>
          </Button>
        </Link>
      </div>
      <div className={styles.blogInfo}>
        <div className={styles.blogTitle}>
          <h1>{currentBlog.title}</h1>
          <p>{currentBlog.subtitle}</p>
        </div>
        <img className={styles.poster} src={currentBlog.poster} alt="img" />
        {currentBlog.texts}
      </div>
    </div>
  )
}

export default Blog
