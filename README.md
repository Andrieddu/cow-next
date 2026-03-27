<img width="4579" height="1750" alt="cow logo" src="https://github.com/user-attachments/assets/3e6760ea-2cda-4f84-be03-1da174b7165d" />

# CoW - Coworking App

Welcome to **CoW**, an MVP for coworking space management and booking.
This project is built on a professional infrastructure designed to ensure scalability and security.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Database & Auth:** [Supabase](https://supabase.com)
- **ORM:** [Prisma](https://prisma.io)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Validation:** Zod

## Workflows

The project follows an automated CI/CD pipeline:

1. **Quality Check:** Every Pull Request is automatically verified for TypeScript errors and security vulnerabilities.
2. **Versioning:** Releases and changelogs are managed via Release Drafter (SemVer).
3. **Environments:**
   - `master`: Preview Environment (Pre-production).
   - `production`: Live Environment (Production).

## Local Development

1. Install dependencies:

```bash
npm install
```
