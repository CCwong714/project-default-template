import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from 'src/app/App'
import { afterEach, describe, expect, it } from 'vitest'

afterEach(cleanup)

describe('App', () => {
  it('renders the adventure and starts at the Open gate', () => {
    const { container } = render(<App />)

    expect(
      screen.getByRole('img', { name: /a tiny adventure/i }),
    ).toBeInTheDocument()
    expect(container.querySelectorAll('.lake-intro__wave')).toHaveLength(3)
    expect(
      screen.getByRole('link', { name: 'Continue to the message' }),
    ).toHaveAttribute('href', '#message')
    expect(container.querySelector('#message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
    expect(screen.queryByText(/The call/i)).not.toBeInTheDocument()
  })

  it('unlocks the story gates only in the required order', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('button', { name: 'Reply' })).toBeInTheDocument()
    expect(screen.queryByText(/The call/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reply' }))
    expect(
      await screen.findByRole(
        'heading',
        { name: /of destiny/i },
        { timeout: 2000 },
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Take Map' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Take Compass' }))
    expect(screen.getByRole('button', { name: 'Take Map' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Take Potion' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Take Map' }))
    await user.click(screen.getByRole('button', { name: 'Take Potion' }))

    expect(
      screen.getByRole('heading', { name: /An absurd meeting/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Listen to the satyr/i }),
    ).toBeInTheDocument()
  })
})
