// Netlify Forms submission helper.
//
// Netlify detects forms by parsing the HTML it serves at deploy time, and React
// renders its markup at runtime — so every form below also has a matching hidden
// static copy in index.html. That static copy is what registers the form with
// Netlify; the React version is what people actually fill in.
//
// Submissions are posted back to the site root as urlencoded data with a
// `form-name` field, which is how Netlify routes them to the right form.

const encode = (data) =>
  Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')

export async function submitToNetlify(formName, fields) {
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encode({ 'form-name': formName, ...fields })
  })

  if (!response.ok) {
    throw new Error(`form submission failed (${response.status})`)
  }
}
