# Setup Instructions

Follow these exact steps to get the project running with proper styling:

## 1. Create Project Directory
\`\`\`bash
mkdir task-management-frontend
cd task-management-frontend
\`\`\`

## 2. Initialize Next.js Project
\`\`\`bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
\`\`\`

## 3. Install Dependencies
\`\`\`bash
npm install react-hook-form react-query axios js-cookie framer-motion react-hot-toast lucide-react clsx tailwind-merge tailwindcss-animate class-variance-authority
\`\`\`

## 4. Install Dev Dependencies
\`\`\`bash
npm install --save-dev @types/js-cookie jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom json-server concurrently
\`\`\`

## 5. Replace Configuration Files
Make sure to replace the following files with the provided versions:
- \`tailwind.config.ts\`
- \`postcss.config.mjs\`
- \`app/globals.css\`
- \`next.config.mjs\`
- \`package.json\`

## 6. Clear Next.js Cache (if needed)
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

## 7. Verify Tailwind is Working
Open your browser to http://localhost:3000 and you should see:
- Styled login page with gradient background
- Blue buttons with hover effects
- Proper typography and spacing
- Responsive design

## Troubleshooting

### If styles are still not loading:

1. **Check the browser console** for any CSS errors
2. **Verify Tailwind config** - make sure \`tailwind.config.ts\` includes all content paths
3. **Clear browser cache** - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
4. **Restart dev server** - Stop and run \`npm run dev\` again
5. **Check globals.css import** - Ensure it's imported in \`app/layout.tsx\`

### If you see unstyled content:
1. Make sure \`@tailwind\` directives are at the top of \`globals.css\`
2. Verify PostCSS config is correct
3. Check that Tailwind is processing the CSS by looking at the Network tab in dev tools

### Common Issues:
- **Missing tailwindcss-animate**: Install with \`npm install tailwindcss-animate\`
- **Wrong file extensions**: Make sure config files have correct extensions (.ts, .mjs)
- **Cache issues**: Delete \`.next\` folder and restart
\`\`\`
