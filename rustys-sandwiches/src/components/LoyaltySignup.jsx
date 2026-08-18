import { useState } from 'react'
import { submitToNetlify } from '../lib/netlifyForms'

const FORM_NAME = 'loyalty-signup'

function LoyaltySignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    setStatus('sending')
    try {
      await submitToNetlify(FORM_NAME, { email })
      setStatus('done')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <section className="loyalty" id="regulars">
      <h2 className="loyalty-heading">rusty&rsquo;s regulars</h2>
      <p className="loyalty-subtext">buy nine, the tenth one is on us</p>

      {status === 'done' ? (
        <p className="loyalty-success" role="status">
          <span className="loyalty-check" aria-hidden="true">&#10003;</span>
          you&rsquo;re in! 10th one is on us.
        </p>
      ) : (
        <form
          className="loyalty-form"
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

          <label className="visually-hidden" htmlFor="loyalty-email">
            email address
          </label>
          <input
            id="loyalty-email"
            className="loyalty-input"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your email"
            autoComplete="email"
            required
          />

          <button className="loyalty-button" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'joining' : 'join'}
          </button>

          {status === 'error' && (
            <p className="loyalty-error" role="alert">
              that didn&rsquo;t go through — try again in a moment.
            </p>
          )}
        </form>
      )}
    </section>
  )
}

export default LoyaltySignup
