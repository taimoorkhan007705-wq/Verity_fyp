# Upload Project to GitHub

Complete step-by-step guide to upload the Verity project to your GitHub repository.

## 📋 Prerequisites

1. **GitHub Account** - [Create one here](https://github.com/signup)
2. **Git Installed** - [Download Git](https://git-scm.com/download/win)
3. **GitHub Authentication** - Use HTTPS (recommended) or SSH

## 🔑 Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: `Verity` (or your preferred name)
3. **Description**: AI-Powered Content Verification Platform
4. **Visibility**: Public (to share) or Private (for personal)
5. **DO NOT** initialize with README (we already have one)
6. Click **Create repository**

## 📝 Step 2: Configure Git Locally

Open **Command Prompt** or **PowerShell** and run:

```bash
# Navigate to project
cd f:\FYP\Verity

# Configure Git user (one-time setup)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Verify configuration
git config user.name
git config user.email
```

Replace with your actual name and email.

## 🔄 Step 3: Add Remote Repository

```bash
# Navigate to project root
cd f:\FYP\Verity

# Remove old remote if it exists
git remote remove origin

# Add new remote (replace USERNAME and REPO_NAME)
git remote add origin https://github.com/USERNAME/Verity.git

# Verify remote
git remote -v
# Should show:
# origin  https://github.com/USERNAME/Verity.git (fetch)
# origin  https://github.com/USERNAME/Verity.git (push)
```

## 📤 Step 4: Stage and Commit Changes

```bash
# Check status
git status

# Stage all changes (except .gitignore'd files)
git add .

# Create commit
git commit -m "Initial commit: Verity FYP - AI-powered content verification platform

- Full-stack React + Node.js application
- User authentication and authorization
- AI-powered content detection using Sightengine
- Reviewer voting system with trust scoring
- Real-time leaderboard with performance metrics
- MongoDB database integration
- Responsive design for web and mobile"

# Verify commit
git log --oneline -n 3
```

## 🚀 Step 5: Push to GitHub

```bash
# Get the branch name (usually main or master)
git branch

# Push to GitHub (replace main if your branch is different)
git push -u origin main

# Or if your default branch is master:
git push -u origin master

# Verify with:
git status
# Should show: "Your branch is up to date with 'origin/main'"
```

### If Branch Doesn't Exist Locally

```bash
# Create and push main branch
git checkout -b main

# Push to GitHub
git push -u origin main
```

## 🔐 GitHub Authentication

### HTTPS Method (Recommended)
1. When prompted for credentials, use your GitHub username
2. For password, use a **Personal Access Token** (PAT):
   - Go to https://github.com/settings/tokens
   - Click "Generate new token"
   - Select: repo, write:packages
   - Copy token and use as password

### SSH Method (Advanced)
1. Generate SSH key: `ssh-keygen -t rsa`
2. Add to GitHub: https://github.com/settings/ssh
3. Update remote: `git remote set-url origin git@github.com:USERNAME/Verity.git`

## ✅ Verification

After pushing, verify on GitHub:

1. Go to https://github.com/USERNAME/Verity
2. Should see all files and folders:
   - backend/
   - Verity_FYP/
   - README.md
   - SETUP.md
   - .gitignore
   - etc.

3. Check "Commits" tab - should show your commit

## 📝 Update Remote URL If Needed

If you created repo with different name:

```bash
# View current remote
git remote -v

# Update remote
git remote set-url origin https://github.com/USERNAME/NEW-REPO-NAME.git

# Verify
git remote -v

# Push again
git push -u origin main
```

## 🔄 Future Updates

After initial upload, for future changes:

```bash
# Make your changes...

# Stage and commit
git add .
git commit -m "Your commit message"

# Push to GitHub
git push

# That's it!
```

## 🆘 Troubleshooting

### Error: "fatal: not a git repository"
```bash
# Make sure you're in the right directory
cd f:\FYP\Verity

# Check if .git exists
dir /a | findstr ".git"
```

### Error: "fatal: Permission denied"
- Verify GitHub credentials
- Use Personal Access Token instead of password
- Check you have push permission to repository

### Error: "fatal: Cannot parse URL"
```bash
# Verify remote URL
git remote -v

# Fix if needed
git remote set-url origin https://github.com/USERNAME/Verity.git
```

### Error: "Updates were rejected"
```bash
# Pull latest changes first
git pull origin main

# Then push
git push origin main
```

### Changes Not Showing on GitHub
```bash
# Make sure you've added files
git add .

# Check status
git status

# Should show changes to be committed

# Create commit
git commit -m "message"

# Push
git push
```

## 📚 Useful Git Commands

```bash
# View commit history
git log --oneline

# See what changed
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View branches
git branch -a

# Switch branch
git checkout branch-name

# Create new branch
git checkout -b feature-name

# Merge branches
git merge feature-name
```

## 🎯 GitHub Repository Structure

After uploading, your GitHub repo will look like:

```
Verity/
├── backend/              # Express.js API
├── Verity_FYP/          # React frontend
├── README.md            # Project overview
├── SETUP.md             # Development setup
├── GITHUB_UPLOAD.md     # This file
├── package.json         # Root package
└── .gitignore           # Ignored files
```

## 📊 Next Steps on GitHub

1. **Add README sections** (if needed):
   - Features
   - Tech stack
   - Getting started
   - Contributing

2. **Configure repository**:
   - Add topics: react, nodejs, mongodb, ai
   - Set description
   - Add homepage URL

3. **Invite collaborators** (if team project):
   - Settings → Collaborators
   - Add team members

4. **Set up CI/CD** (optional):
   - GitHub Actions
   - Auto-testing
   - Auto-deploy

## 🔒 Security Checklist

Before making repository public:

- [ ] No .env files committed (check .gitignore)
- [ ] No API keys in code
- [ ] No passwords in files
- [ ] Database credentials not exposed
- [ ] Private data removed
- [ ] Sensitive files in .gitignore

## 📞 Need Help?

Common resources:
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/)
- [Stack Overflow - git tag](https://stackoverflow.com/questions/tagged/git)

## 🎉 Success!

Once pushed to GitHub:
- Share repository URL with team/friends
- Collaborate with pull requests
- Track issues
- Use GitHub Pages for documentation
- Set up CI/CD pipelines

---

**Happy coding! Your project is now on GitHub! 🚀**
