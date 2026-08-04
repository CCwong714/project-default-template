import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EntryOverlay } from 'src/features/portfolio/components/EntryOverlay'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

vi.mock('src/features/portfolio/components/LoadingAnimation', () => ({
  LoadingAnimation: ({ onComplete }: { onComplete: () => void }) => (
    <button onClick={onComplete} type="button">
      finish loader
    </button>
  ),
}))

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
    }),
  )
})

afterAll(() => {
  vi.unstubAllGlobals()
})

const getHiddenEntryButton = (className: string) => {
  const button = screen
    .getAllByRole('button', { hidden: true })
    .find((candidate) => candidate.classList.contains(className))
  expect(button).toBeDefined()
  return button as HTMLButtonElement
}

describe('EntryOverlay', () => {
  it('waits for both the loader and scene before enabling entry', async () => {
    const user = userEvent.setup()
    const onEnterSilent = vi.fn()
    const onEnterWithSound = vi.fn()
    const { rerender, unmount } = render(
      <EntryOverlay
        loadProgress={0}
        onEnterSilent={onEnterSilent}
        onEnterWithSound={onEnterWithSound}
        ready={false}
        visible
      />,
    )
    const primary = getHiddenEntryButton('entry-primary')
    const silent = getHiddenEntryButton('entry-silent')

    expect(primary).toBeDisabled()
    expect(silent).toBeDisabled()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading portfolio 0 percent',
    )

    await user.click(screen.getByRole('button', { name: 'finish loader' }))

    expect(
      screen.getByLabelText('motion & sound designer based in paris'),
    ).toHaveClass('is-visible')
    expect(primary).toBeDisabled()

    rerender(
      <EntryOverlay
        loadProgress={1}
        onEnterSilent={onEnterSilent}
        onEnterWithSound={onEnterWithSound}
        ready
        visible
      />,
    )

    expect(primary).toBeEnabled()
    expect(silent).toBeEnabled()
    expect(screen.getByRole('status')).toHaveTextContent('Portfolio ready')

    await user.tab()
    expect(primary).toHaveFocus()
    await user.tab({ shift: true })
    expect(silent).toHaveFocus()
    await user.tab()
    expect(primary).toHaveFocus()

    await user.click(primary)
    expect(onEnterWithSound).toHaveBeenCalledOnce()
    expect(onEnterSilent).not.toHaveBeenCalled()
    unmount()
  })

  it('removes both entry actions from the tab order after exit', () => {
    render(
      <EntryOverlay
        loadProgress={1}
        onEnterSilent={vi.fn()}
        onEnterWithSound={vi.fn()}
        ready
        visible={false}
      />,
    )

    expect(getHiddenEntryButton('entry-primary')).toHaveAttribute(
      'tabindex',
      '-1',
    )
    expect(getHiddenEntryButton('entry-silent')).toHaveAttribute(
      'tabindex',
      '-1',
    )
  })
})
