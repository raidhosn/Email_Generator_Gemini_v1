import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'

describe('App Component', () => {
    it('renders correctly in default English', () => {
        render(<App />)
        expect(screen.getByText('Email Generator AI')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Paste your rough email text here...')).toBeInTheDocument()
    })

    it('switches to Portuguese when PT button is clicked', async () => {
        render(<App />)
        const ptBtn = screen.getByLabelText('Trocar para Português')
        await act(async () => {
            fireEvent.click(ptBtn)
        })
        expect(screen.getByText('Gerador de E-mail AI')).toBeInTheDocument()
    })

    it('generates a table preview by default', () => {
        render(<App />)
        const preview = screen.getByLabelText('Generated Result (Preview)')
        expect(preview.innerHTML).toContain('Subscription ID')
    })

    it('shows loading state when an action is triggered', async () => {
        vi.useFakeTimers()
        render(<App />)
        const formatBtn = screen.getByText('Table Format')
        await act(async () => {
            fireEvent.click(formatBtn)
        })
        expect(screen.getByText('Generating...')).toBeInTheDocument()
        await act(async () => {
            vi.runAllTimers()
        })
        expect(screen.queryByText('Generating...')).not.toBeInTheDocument()
        vi.useRealTimers()
    })
})
