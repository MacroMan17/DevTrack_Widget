# Production Checklist

Before releasing DevTrack Widget, verify:

## Code Quality
- [ ] No `console.log()` statements in production code
- [ ] No DevTools open by default
- [ ] No localhost dependencies
- [ ] Error handling for API failures
- [ ] Graceful fallbacks for missing data

## Build & Packaging
- [ ] `npm run build` completes without errors
- [ ] `npm run build:exe` creates valid installer
- [ ] Installer runs on clean Windows 10/11 machine
- [ ] App launches without errors
- [ ] All features work offline (cached data)

## UI/UX
- [ ] Widget appears frameless and transparent
- [ ] Always-on-top works correctly
- [ ] Dragging and resizing work smoothly
- [ ] Settings panel saves correctly
- [ ] Tray icon appears and menu works
- [ ] Minimize to tray works
- [ ] Close button minimizes (not quits)

## Data & APIs
- [ ] GitHub API calls work
- [ ] LeetCode API calls work (with fallback)
- [ ] Error messages are user-friendly
- [ ] Data refreshes on schedule
- [ ] Manual refresh button works
- [ ] No API keys exposed in code

## Performance
- [ ] Startup time < 2 seconds
- [ ] Memory usage < 150MB
- [ ] CPU usage < 1% idle
- [ ] No memory leaks after 1 hour
- [ ] Smooth animations (60 FPS)

## Security
- [ ] No hardcoded credentials
- [ ] Context isolation enabled
- [ ] Node integration disabled
- [ ] Sandbox enabled
- [ ] No eval() or dynamic code execution
- [ ] HTTPS for all external APIs

## Installation
- [ ] Installer creates desktop shortcut
- [ ] Installer creates Start Menu entry
- [ ] Uninstaller removes all files
- [ ] App can be reinstalled cleanly
- [ ] No admin rights required (except install)

## Documentation
- [ ] README.md is complete
- [ ] QUICK_START.md is clear
- [ ] PRODUCTION_BUILD.md has all steps
- [ ] Troubleshooting section covers common issues
- [ ] Version number is updated

## Testing
- [ ] Test on Windows 10 (64-bit)
- [ ] Test on Windows 11 (64-bit)
- [ ] Test with no internet connection
- [ ] Test with invalid usernames
- [ ] Test with very long usernames
- [ ] Test window resizing to minimum size
- [ ] Test tray menu all options
- [ ] Test settings save/load

## Release
- [ ] Version bumped in package.json
- [ ] Git tag created (v1.0.0)
- [ ] Changelog updated
- [ ] Installer tested one final time
- [ ] Ready for distribution

---

## Pre-Release Commands

```bash
# Clean build
rm -r dist node_modules
npm install

# Build and test
npm run build
npm run build:exe

# Test installer
# Double-click dist/DevTrack\ Widget\ Setup\ 1.0.0.exe

# Verify production build
npm start
```

## Sign-Off

- [ ] All checklist items completed
- [ ] Tested by team member
- [ ] Ready for public release

**Date**: ___________  
**Tester**: ___________  
**Notes**: ___________
