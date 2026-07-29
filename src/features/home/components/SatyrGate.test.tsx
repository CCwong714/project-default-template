import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { SatyrGate } from 'src/features/home/components/SatyrGate'
import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('SatyrGate', () => {
  it('matches the original listen and attack timelines', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()

    render(<SatyrGate onComplete={onComplete} />)

    expect(screen.queryByText(/listen carefully/i)).not.toBeInTheDocument()

    const listenButton = screen.getByRole('button', {
      name: /listen to the satyr/i,
    })
    fireEvent.click(listenButton)

    expect(listenButton).toBeDisabled()
    expect(screen.queryByText(/listen carefully/i)).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(499)
    })
    expect(listenButton).toBeDisabled()
    expect(listenButton).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(
      screen.queryByRole('button', { name: /listen to the satyr/i }),
    ).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5499)
    })
    expect(
      screen.queryByRole('button', { name: /attack/i }),
    ).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    const attackButton = screen.getByRole('button', { name: /attack/i })
    fireEvent.click(attackButton)

    expect(attackButton).toBeDisabled()

    act(() => {
      vi.advanceTimersByTime(4999)
    })
    expect(onComplete).not.toHaveBeenCalled()
    expect(
      screen.queryByLabelText('Chapter three unlocked'),
    ).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(onComplete).toHaveBeenCalledOnce()
    expect(screen.getByLabelText('Chapter three unlocked')).toBeInTheDocument()
  })

  it('keeps all dialogue rows mounted while their visibility changes', () => {
    vi.useFakeTimers()

    render(<SatyrGate onComplete={vi.fn()} />)

    const openingRows = [
      screen.getByText('Hey !').closest('.dialogue-line'),
      screen
        .getByText('What a pretty good bag you have here...')
        .closest('.dialogue-line'),
      screen.getByText('Would you like…').closest('.dialogue-line'),
      screen.getByText('… to give me !').closest('.dialogue-line'),
    ]
    const closingRows = [
      screen.getByText('Take that instead !').closest('.dialogue-line'),
      screen
        .getByText('Ouch ! No need to get upset…')
        .closest('.dialogue-line'),
      screen.getByText('You can go...').closest('.dialogue-line'),
    ]

    ;[...openingRows, ...closingRows].forEach((row) => {
      expect(row).toHaveAttribute('aria-hidden', 'true')
    })

    fireEvent.click(
      screen.getByRole('button', { name: /listen to the satyr/i }),
    )
    expect(openingRows[0]).toHaveAttribute('aria-hidden', 'false')

    act(() => {
      vi.advanceTimersByTime(6000)
    })
    expect(openingRows[0]).toHaveAttribute('aria-hidden', 'true')
    openingRows.slice(1).forEach((row) => {
      expect(row).toHaveAttribute('aria-hidden', 'false')
    })

    fireEvent.click(screen.getByRole('button', { name: /attack/i }))
    expect(openingRows[1]).toHaveAttribute('aria-hidden', 'true')
    expect(closingRows[0]).toHaveAttribute('aria-hidden', 'false')

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    openingRows.forEach((row) => {
      expect(row).toHaveAttribute('aria-hidden', 'true')
    })
    closingRows.forEach((row) => {
      expect(row).toHaveAttribute('aria-hidden', 'false')
    })
  })
})
