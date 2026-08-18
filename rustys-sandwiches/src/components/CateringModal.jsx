import { useEffect, useRef, useState } from 'react'
import { submitToNetlify } from '../lib/netlifyForms'

const FORM_NAME = 'catering-inquiry'

const emptyForm = { name: '', email: '', date: '', headcount: '10-20', message: '' }

function CateringModal({ isOpen, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const firstFieldRef = useRef(null)

  // Close on Escape, and keep the page behind the modal from scrolling.
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose])

  // Start fresh each time the modal is opened, and hand focus to the first field.
  useEffect(() => {
    if (!isOpen) return
    setForm(emptyForm)
    setStatus('idle')
    firstFieldRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    try {
      await submitToNetlify(FORM_NAME, form)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div
      className="catering-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="catering-modal" role="dialog" aria-modal="true" aria-labelledby="catering-title">
        <button className="catering-close" type="button" onClick={onClose} aria-label="close">
          &#10005;
        </button>

        <h2 className="catering-title" id="catering-title">catering &amp; events</h2>
        <p className="catering-subtitle">platters for ten or more — tell us what you need</p>

        {status === 'done' ? (
          <div className="catering-success" role="status">
            <p className="catering-success-headline">inquiry received.</p>
            <p className="catering-success-text">we&rsquo;ll be in touch within one business day.</p>
            <button className="catering-submit" type="button" onClick={onClose}>
              done
            </button>
          </div>
        ) : (
          <form
            className="catering-form"
            name={FORM_NAME}
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            {/* Netlify needs these to route the submission; neither is user-facing. */}
            <input type="hidden" name="form-name" value={FORM_NAME} />
            <p className="visually-hidden">
              <label>
                don&rsquo;t fill this out if you&rsquo;re human: <input name="bot-field" tabIndex={-1} />
              </label>
            </p>

            <div className="catering-field">
              <label className="catering-label" htmlFor="catering-name">name</label>
              <input
                id="catering-name"
                ref={firstFieldRef}
                className="catering-input"
                type="text"
                name="name"
                value={form.name}
                onChange={updateField('name')}
                autoComplete="name"
                required
              />
            </div>

            <div className="catering-field">
              <label className="catering-label" htmlFor="catering-email">email</label>
              <input
                id="catering-email"
                className="catering-input"
                type="email"
                name="email"
                value={form.email}
                onChange={updateField('email')}
                autoComplete="email"
                required
              />
            </div>

            <div className="catering-field">
              <label className="catering-label" htmlFor="catering-date">event date</label>
              <input
                id="catering-date"
                className="catering-input"
                type="date"
                name="date"
                value={form.date}
                onChange={updateField('date')}
                required
              />
            </div>

            <div className="catering-field">
              <label className="catering-label" htmlFor="catering-headcount">headcount</label>
              <select
                id="catering-headcount"
                className="catering-input catering-select"
                name="headcount"
                value={form.headcount}
                onChange={updateField('headcount')}
              >
                <option value="10-20">10 &ndash; 20</option>
                <option value="20-50">20 &ndash; 50</option>
                <option value="50+">50 +</option>
              </select>
            </div>

            <div className="catering-field">
              <label className="catering-label" htmlFor="catering-message">tell us what you need</label>
              <textarea
                id="catering-message"
                className="catering-input catering-textarea"
                name="message"
                value={form.message}
                onChange={updateField('message')}
                rows={4}
              />
            </div>

            <button className="catering-submit" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'sending' : 'send inquiry'}
            </button>

            {status === 'error' && (
              <p className="catering-error" role="alert">
                that didn&rsquo;t go through — try again in a moment.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default CateringModal
