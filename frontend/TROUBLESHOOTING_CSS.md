# CSS Troubleshooting Guide

## Quick Fix Steps

1. **Stop the dev server** (Ctrl+C)

2. **Clear cache and restart:**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   
   # Clear npm cache
   npm cache clean --force
   
   # Restart dev server
   npm start
   ```

3. **Clear browser cache:**
   - Chrome/Edge: Ctrl+Shift+Delete or Cmd+Shift+Delete
   - Or hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Verify PostCSS is processing:**
   - Open browser DevTools (F12)
   - Check the Network tab - look for CSS files
   - Check the Elements tab - inspect an element with Tailwind classes
   - You should see the generated CSS styles

## Verify Setup

1. **Check files exist:**
   - ✅ `postcss.config.js` in root
   - ✅ `tailwind.config.js` in root
   - ✅ `src/index.css` imports Tailwind directives
   - ✅ `src/index.js` imports `./index.css`

2. **Check package.json has:**
   - `tailwindcss` in devDependencies
   - `postcss` in devDependencies
   - `autoprefixer` in devDependencies

## Test if CSS is Working

Add this to any component to test:
```jsx
<div className="bg-blue-500 text-white p-4 rounded">
  Test: If you see blue background, CSS is working!
</div>
```

## Common Issues

1. **CSS not loading after changes:**
   - Restart the dev server
   - Clear browser cache
   - Check browser console for errors

2. **Tailwind classes not applying:**
   - Verify `content` paths in `tailwind.config.js` match your file structure
   - Check that classes are spelled correctly
   - Ensure PostCSS is processing (check build output)

3. **Build errors:**
   - Delete `node_modules` and reinstall
   - Check for version conflicts
   - Verify all dependencies are installed

