import { render, screen } from '@testing-library/react'
import { App } from 'src/app/App'
import { describe, expect, it } from 'vitest'

describe('App', () => {
  it('renders the Elva-inspired home page', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /meet elva\. a filmmaking crew in your phone/i,
      }),
    ).toBeInTheDocument()
  })
})
