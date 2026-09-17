# TechNotes frontend integration

## API

Set `src/environments/environment.ts` to the HTTPS URL of the running TechNotes API, including `/api/v1`.

The frontend now integrates:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/notes`
- `GET /api/v1/notes/{id}`
- `GET /api/v1/notes/my`
- `POST /api/v1/notes`
- `PUT /api/v1/notes/{id}`
- `DELETE /api/v1/notes/{id}`
- `GET /api/v1/notes/search?searchTerm=...`

## Run

```powershell
npm install
npm start
```

## Authentication

The access token is kept in browser local storage for the current frontend implementation. Protected requests receive a Bearer token through the HTTP interceptor. Refresh/logout requests use `withCredentials: true` so the HTTP-only refresh cookie can be sent.

The backend refresh cookie must be scoped to the actual `/api/v1/auth` path (or `/`) to be sent to the refresh endpoint. If the backend currently sets a different cookie Path, fix that backend setting; Angular cannot override a cookie Path.

## Note hierarchy

The editor supports recursive sections and content ordering. Before create/update, the mapper normalizes section and content `sortOrder` values and converts editor content into the backend `NoteContentRequest` shape.

## Content type mapping

The API Swagger exposes `NoteContentType` as an integer enum. The frontend maps the documented block order as:

1 text
2 definition
3 points
4 example
5 code
6 table
7 graph
8 quote

If the backend `NoteContentType` enum has a different numeric ordering, update `CONTENT_TYPE_TO_API` and `API_TYPE_TO_CONTENT` in `src/app/features/notes/models/content-block-type.model.ts` to match the backend enum.

## Current backend limitations

The supplied Notes API has no endpoints for favorites, categories, tags, activity, or sharing. Those screens remain frontend-only or informational until corresponding backend endpoints exist. Password reset is also not exposed by the current Auth API.

The current `CreateNoteRequest` has no description field, so the create/edit UI description is not submitted to the API.
