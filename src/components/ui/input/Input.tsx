import React from 'react'
import styles from './Input.module.css'

interface InputProps {
  type?: string
  placeholder?: string
  id?: string
}

const Input: React.FC<InputProps> = ({ type = 'text', placeholder = 'Enter', id = '' }) => {
  return (
    <div className={styles.input}>
      <input type={type} placeholder={placeholder} id={id}/>
    </div>
  )
}

export default Input
