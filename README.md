# Worketyamo — Final Project

Worketyamo is a practical Node.js backend focused on maintainability, clarity, and developer ergonomics. It uses Prisma for database access and follows small-team engineering principles: shipable features, clear separation of concerns, and predictable data models.

**Project ideology**
- **Simplicity First:** Prefer readable, minimal code that is easy to reason about and modify.
- **Explicit Data Contracts:** Use Prisma schema as the single source of truth for the database model and validations.
- **Separation of Concerns:** Keep controllers, services, middleware, and validators separate to make testing and future refactors simple.
- **Developer Experience:** Provide clear setup commands, helpful error messages, and predictable environment configuration.
- **Incremental Improvements:** Favor small, testable changes and migration-based database evolution.

**Repository Overview**
- **src/**: Application source (routes, controllers, services, middleware, validators).
- **prisma/**: Prisma schema and migration files.
- **generated/prisma/**: Generated Prisma client used by the app.
- **server.js**: App entry point.

**Quick start**
1. Install dependencies:

   ```bash
   npm install
   ```

2. Set environment variables (example):

   - `DATABASE_URL` — your database connection string
   - `PORT` — port the server listens on (optional)

3. Generate Prisma client (if not already present):

   ```bash
   npx prisma generate
   ```

4. Run migrations (development):

   ```bash
   npx prisma migrate dev
   ```

5. Start the server:

   ```bash
   npm run dev
   ```

If the project includes a prebuilt `generated/prisma` client (already committed), step 3 may be optional for quick testing.

**Testing & development tips**
- Keep migrations small and descriptive.
- Run the app locally against a disposable/dev database to avoid data loss.
- Use the `validators` and `middleware` layers for input sanitization and authorization checks.

**Contributing**
- Open a small PR with a focused change and a descriptive title.
- Add or update Prisma migrations when changing models.
- Add tests for bug fixes and new behavior when applicable.

**Contact**
For questions or collaboration, open an issue or contact the repository maintainers.

---
Generated README: concise project ideology, setup, and contribution guidance.
