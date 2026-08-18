# Backend

The site's editable content is stored server-side so an edit made in one browser
is what every visitor sees. Two Netlify Blobs stores back it: `site-content`
holds a single JSON record, `site-media` holds uploaded images.

## Required setup

Set **`ADMIN_PASSCODE`** in the Netlify UI (Site configuration → Environment
variables) — pick your own value, and treat it as a shared password.

Until it is set, `/api/content` still serves content but every write returns
`503`: the endpoints fail closed rather than falling back to a default, so a
half-configured deploy cannot be edited by anyone who guesses a constant.

## Endpoints

| Method | Path               | Auth | Purpose                                 |
| ------ | ------------------ | ---- | --------------------------------------- |
| GET    | `/api/content`     | —    | Published content (`null` if never set) |
| PUT    | `/api/content`     | yes  | Validate and publish content            |
| POST   | `/api/admin-verify`| yes  | Check a passcode before opening the panel |
| POST   | `/api/media`       | yes  | Upload one image, returns its URL        |
| GET    | `/api/media/:id`   | —    | Serve an uploaded image                  |

Authenticated requests carry `Authorization: Bearer <passcode>`, compared in
constant time against the environment variable. The passcode is never sent to
the browser and is not in the client bundle.

## Notes

Images are stored once and referenced by URL rather than inlined into the
content record, so the JSON every visitor loads stays around 500 bytes instead
of megabytes. Blob ids are a hash of the image bytes, which makes re-uploading
the same picture a no-op and lets the media endpoint serve `immutable` caching.

Writes are validated against a fixed shape with length caps, and image fields
must be either an uploaded `/api/media/<id>` path or an absolute `https` URL.

`netlify dev` runs the whole stack locally with a file-backed blob store; plain
`vite preview` serves no functions, and the app falls back to the defaults in
`src/lib/siteContent.js` when the API cannot be reached.
