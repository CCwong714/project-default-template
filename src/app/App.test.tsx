import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from '@/app/App'

describe('App', () => {
  it('renders the Unreal Engine 5 landing page', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /bigger worlds\. bigger stories\.more unreal\./i,
      }),
    ).toBeInTheDocument()
  })
})
