import React from 'react'
import styles from './Textarea.module.css'

interface TextareaProps {
  id?: string
  placeholder?: string
  name?: string
}

const Textarea: React.FC<TextareaProps> = ({id = '', placeholder = '', name = ''}) => {
  return (
    <div className={styles.textarea}>
      <textarea name={name} id={id} placeholder={placeholder}></textarea>
    </div>
  )
}

export default Textarea