/**
 * Card Component
 * Container for displaying content in a card layout
 */

import React from 'react'

interface CardProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`result-container ${className}`}>
      {title && <h4>{title}</h4>}
      {children}
    </div>
  )
}
