import React from 'react'
import { render, screen } from '@testing-library/react'
import SleepGoals from './SleepGoals'

// Mock framer-motion to avoid animation issues
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

// Mock styled-components
jest.mock('styled-components', () => ({
  styled: {
    Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('SleepGoals Component', () => {
  it('renders the title', () => {
    render(<SleepGoals />)
    expect(screen.getByText('🎯 Sleep Goals')).toBeInTheDocument()
  })

  it('shows add goal button', () => {
    render(<SleepGoals />)
    expect(screen.getByText('Add Goal')).toBeInTheDocument()
  })

  it('shows empty state when no goals', () => {
    render(<SleepGoals />)
    expect(screen.getByText('No Sleep Goals Set')).toBeInTheDocument()
  })
})