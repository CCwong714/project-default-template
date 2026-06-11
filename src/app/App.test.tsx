import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from '@/app/App'

describe('App', () => {
  it('renders the project base home page', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /build the first real feature here/i,
      }),
    ).toBeInTheDocument()
  })
})
