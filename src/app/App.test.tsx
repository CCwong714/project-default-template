import { render, screen } from '@testing-library/react'
import { App } from 'src/app/App'
import { describe, expect, it } from 'vitest'

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
