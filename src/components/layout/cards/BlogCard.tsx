import React from 'react'
import '@assets/styles/components/blogCard.css'
import poster from '@/assets/images/poster.png'
import { Link } from 'react-router-dom'

interface BlogCardProps {
  blog: {
    id: number
    title: string
    poster: string
    subtitle: string
    createDate: string
    texts: React.ReactNode
  }
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Link to={`/blog/${blog.id}`} key={blog.id}>
      <div className="blog-card">
        <div className="blog-card-poster">
          <img src={blog.poster} alt="" />
        </div>
        <div className="blog-card-info">
          <div className="blog-card-author">
            <div className="blog-card-author-info">
              <img src={poster} alt="poster" />
              <p>Luz Wintheiser</p>
            </div>
            <p>{blog.createDate}</p>
          </div>
          <h2>{blog.title}</h2>
          <p>{blog.subtitle}</p>
        </div>
      </div>
    </Link>
  )
}

export default BlogCard
