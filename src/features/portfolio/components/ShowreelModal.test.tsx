import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { ShowreelModal } from 'src/features/portfolio/components/ShowreelModal'
import { afterEach, describe, expect, it, vi } from 'vitest'

function ShowreelHarness() {
  const [open, setOpen] = useState(true)

  return (
    <ShowreelModal
      onClose={() => {
        setOpen(false)
      }}
      open={open}
    />
  )
}

describe('ShowreelModal', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps the full-screen layer mounted until the exit fade finishes', () => {
    vi.useFakeTimers()
    render(<ShowreelHarness />)

    const closeButtons = screen.getAllByRole('button', {
      name: 'Close showreel',
    })
    fireEvent.click(closeButtons[0])

    expect(
      screen.getByRole('dialog', { name: 'Showreel 2025' }),
    ).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(
      screen.queryByRole('dialog', { name: 'Showreel 2025' }),
    ).not.toBeInTheDocument()
  })

  it('closes from the Escape key', () => {
    const onClose = vi.fn()
    render(<ShowreelModal onClose={onClose} open />)

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledOnce()
  })
})
