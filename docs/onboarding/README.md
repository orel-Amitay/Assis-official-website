# Powered by Assis onboarding PDF

The downloadable PDF is generated from the live site page so it matches
`/PoweredByAssis` exactly (same React component + styles).

## Regenerate

1. Run the site locally (`npm run dev`)
2. Run:

```bash
npm run pdf:powered-by-assis
```

This prints `http://localhost:3000/PoweredByAssis/print` to:

- `docs/onboarding/What-you-now-have-with-Assis.pdf`
- `public/docs/What-you-now-have-with-Assis.pdf` (served as Download PDF)
