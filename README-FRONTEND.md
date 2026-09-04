# TechNotes Frontend Demo

Frontend-only Angular 21 + Tailwind project using dummy in-memory data.

## Included
- Public home and public notes
- W3Schools-style learning area: `/learn`, topics and lessons
- Dashboard
- My Notes
- Create Note editor
- Favorites
- Shared Notes
- Categories
- Tags
- Search
- Activity
- Profile
- Note detail pages
- Dynamic content block editor

## Deliberately excluded
- Authentication logic
- JWT/session handling
- Backend/API calls
- HTTP services
- Database integration

## Run

```powershell
npm install
npm start
```

Open `http://localhost:4200`.

All displayed application data comes from `src/app/core/data/dummy-data.service.ts`.
