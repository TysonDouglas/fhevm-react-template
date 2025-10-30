/**
 * Button Component
 * Reusable button with variant styles
 */

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary'

  return (
    <button
      className={`btn ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
