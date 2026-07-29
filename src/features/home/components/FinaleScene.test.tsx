import { cleanup, render, screen } from '@testing-library/react'
import { FinaleScene } from 'src/features/home/components/FinaleScene'
import { useElementScrollProgress } from 'src/features/home/hooks/useElementScrollProgress'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('src/features/home/components/LottieAsset', () => ({
  LottieAsset: ({ className }: { className?: string }) => (
    <div className={className} />
  ),
}))

vi.mock('src/features/home/hooks/useElementScrollProgress', () => ({
  useElementScrollProgress: vi.fn(),
}))

const mockedScrollProgress = vi.mocked(useElementScrollProgress)

beforeEach(() => {
  mockedScrollProgress.mockReset()
})

afterEach(() => {
  cleanup()
})

describe('FinaleScene', () => {
  it('recreates the original curtain frame at 77 percent progress', () => {
    mockedScrollProgress
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.77)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)

    const { container } = render(<FinaleScene />)
    const endOverlay = container.querySelector('.homecoming__end')
    const endVisual = container.querySelector('.homecoming__end-visual')
    const curtains = container.querySelectorAll('.homecoming__curtain')

    expect(endOverlay).toHaveAttribute('aria-hidden', 'true')
    expect(endVisual).toHaveStyle({
      opacity: '0',
      transform: 'scale(2)',
    })
    expect(curtains).toHaveLength(2)
    curtains.forEach((curtain) => {
      expect(curtain).toHaveStyle({
        width: '27.777777777777796vw',
      })
    })
  })

  it('keeps the original contact copy and field placeholders', () => {
    mockedScrollProgress.mockReturnValue(0)

    render(<FinaleScene />)

    expect(screen.getByLabelText('Your email')).toHaveAttribute(
      'placeholder',
      'elon.musk@tesla.com',
    )
    expect(screen.getByLabelText('Your message')).toHaveAttribute(
      'placeholder',
      "I love the concept, let's work together !",
    )
    expect(
      screen.getByText(
        /A tiny adventure 2025 - All rights reserved - Made with love by/,
      ),
    ).toBeInTheDocument()
  })
})
