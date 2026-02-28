import BlogCard from '@/components/layout/cards/BlogCard'
import styles from './Blogs.module.css'

const Blog = () => {
  const blogs = [
    {
      id: 1,
      title: 'Quick start with Magic Portfolio',
      poster: '/images/horizontal-1.webp',
      subtitle: 'A comprehensive guide to setting up your professional portfolio in minutes',
      createDate: '1 month ago',
      texts: (
        <div>
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
        <div>
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
        <div>
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
        <div>
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
  return (
    <div className={styles.blogs}>
      <p>Blogs</p>
      <div className={styles.blogsList}>
        {blogs.map(blog => {
          return <BlogCard key={blog.id} blog={blog} />
        })}
      </div>
    </div>
  )
}

export default Blog
