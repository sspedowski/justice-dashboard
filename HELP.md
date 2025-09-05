# Justice Dashboard - Complete Help Guide

## 🎯 Quick Start Guide

### Getting Started in 3 Steps

1. **First Time Setup**
   ```bash
   git clone https://github.com/sspedowski/justice-dashboard.git
   cd justice-dashboard
   cp .env.example .env
   # Edit .env with your actual credentials
   npm install
   npm start
   ```

2. **Access the Dashboard**
   - Open your browser to `http://localhost:3000`
   - Default login: `admin` / `justice2025` 
   - **⚠️ Change these credentials in production!**

3. **Start Using the System**
   - Upload PDF documents for analysis
   - Track legal cases and documents
   - Use AI-powered document summarization

---

## 📚 What is Justice Dashboard?

Justice Dashboard is a **legal document analysis and case management tool** that helps legal professionals:

- **📄 Process PDF Documents**: Upload and automatically analyze legal documents
- **🤖 AI-Powered Analysis**: Use OpenAI GPT-4 for document summarization and insights
- **📊 Case Tracking**: Organize and track legal cases with status updates
- **🔐 Secure Access**: JWT-based authentication with role-based access
- **⚖️ Legal Tools**: Integration with Wolfram Alpha for legal calculations

---

## 🖥️ Using the Dashboard

### Main Dashboard Features

1. **Dashboard Stats** (Top of page)
   - Total Cases, Active Cases, Completed Cases, Documents count
   - Real-time updates as you add content

2. **Case Management Section**
   - Add new cases manually
   - Upload and analyze PDF documents
   - Filter and search existing cases
   - Export data to CSV

3. **Document Upload & Analysis**
   - Drag & drop PDF files
   - Automatic AI summarization (requires OpenAI API key)
   - Document categorization and tagging

### Step-by-Step Workflow

#### Adding a Case Manually
1. Click **"Add Case"** button
2. Fill in case details:
   - Case ID (auto-generated if empty)
   - Title/Description
   - Status (Active, Completed, On Hold)
   - Date
3. Click **"Add Case"** to save

#### Uploading Documents
1. Click **"Upload PDF"** or drag files to the upload area
2. Select one or more PDF files
3. Wait for processing and AI analysis
4. Review the generated summary and tags
5. Case automatically added to tracker

#### Managing Existing Cases
- **Filter**: Use the search/filter box to find specific cases
- **Edit**: Click on any case to modify details
- **Delete**: Remove cases you no longer need
- **Export**: Download all case data as CSV

---

## ⚙️ Configuration & Setup

### Environment Variables

Create a `.env` file with these settings:

```bash
# Required for authentication
JWT_SECRET=your-secure-jwt-secret-32-chars-minimum
SESSION_SECRET=your-secure-session-secret-32-chars-minimum

# Admin account (change in production!)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Optional: AI Features
OPENAI_API_KEY=sk-your-openai-key-here

# Optional: Wolfram Alpha integration
WOLFRAM_APP_ID=your-wolfram-app-id

# Environment
NODE_ENV=development
```

### Security Requirements

**🚨 For Production Deployment:**
- Change default admin credentials
- Use strong, unique secrets (32+ characters)
- Enable HTTPS
- Never commit `.env` to version control
- Set `NODE_ENV=production`

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### "Server won't start"
**Problem**: Error when running `npm start`
**Solutions**:
- Check if all dependencies are installed: `npm install`
- Verify `.env` file exists and has required variables
- Check if port 3000 is already in use
- Make sure Node.js 18+ is installed

#### "Authentication not working"
**Problem**: Can't log in or getting auth errors
**Solutions**:
- Verify `JWT_SECRET` is set in `.env`
- Check username/password in `.env` or `users.json`
- Clear browser cookies and try again
- Check browser console for error messages

#### "PDF upload failing"
**Problem**: Files not uploading or processing
**Solutions**:
- Ensure file is a valid PDF (max 10MB)
- Check server logs for error messages
- Verify `uploads` directory exists and is writable
- For AI analysis, ensure `OPENAI_API_KEY` is set

#### "Dashboard not loading properly"
**Problem**: Blank page or missing elements
**Solutions**:
- Check browser console for JavaScript errors
- Ensure all required DOM elements exist
- Clear browser cache and refresh
- Check CSP (Content Security Policy) violations

#### "AI features not working"
**Problem**: No AI summaries or analysis
**Solutions**:
- Set `OPENAI_API_KEY` in `.env`
- Check API key is valid and has credits
- Review server logs for API errors
- Fallback to manual analysis if needed

### Getting Logs

**Server Logs**: Check terminal where you ran `npm start`
**Browser Logs**: Open Developer Tools (F12) → Console tab
**Network Issues**: Developer Tools → Network tab

---

## 🚀 Advanced Features

### AI Integration

**Document Summarization**:
- Automatic PDF text extraction
- GPT-4 powered summaries
- Legal document categorization
- Key information extraction

**Wolfram Alpha Integration**:
- Legal calculations and research
- Statistical analysis
- Date/time calculations
- Mathematical problem solving

### Data Management

**Export Options**:
- CSV export for all case data
- PDF report generation
- Data backup and restore

**Filtering & Search**:
- Filter by case status
- Search by keywords
- Date range filtering
- Advanced sorting options

---

## 🏗️ Development & Customization

### Project Structure
```
justice-dashboard/
├── server.js              # Main server entry point
├── justice-server/         # Backend server code
├── index.html             # Main dashboard page
├── login.html             # Login page
├── script.js              # Dashboard functionality
├── login.js               # Login functionality
├── styles.css             # Custom styles
└── .env                   # Environment configuration
```

### Adding Custom Features

1. **Backend APIs**: Add routes in `justice-server/server.js`
2. **Frontend UI**: Modify `index.html` and `script.js`
3. **Styling**: Edit CSS files or Tailwind classes
4. **Authentication**: Extend JWT middleware

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:backend
npm run test:frontend

# Run E2E tests with Cypress
npx cypress open
```

---

## 📦 Deployment

### Local Development
```bash
npm install
npm start
# Dashboard available at http://localhost:3000
```

### Production Deployment

**Render.com** (Recommended):
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically on push

**Railway.app**:
```bash
npm run deploy
```

**Docker**:
```bash
docker-compose up -d
```

### Environment Setup for Production

1. **Security Settings**:
   ```bash
   NODE_ENV=production
   JWT_SECRET=64-character-random-string
   SESSION_SECRET=64-character-random-string
   ```

2. **Strong Credentials**:
   ```bash
   ADMIN_USERNAME=your-secure-username
   ADMIN_PASSWORD=strong-password-with-symbols
   ```

3. **API Keys** (Optional):
   ```bash
   OPENAI_API_KEY=sk-your-production-key
   WOLFRAM_APP_ID=your-wolfram-id
   ```

---

## 💡 Tips & Best Practices

### Daily Usage Tips
- **Regular Backups**: Export case data regularly
- **Organize Cases**: Use consistent naming conventions
- **Security**: Log out when not in use
- **Updates**: Keep API keys and passwords secure

### Performance Tips
- **File Size**: Keep PDFs under 10MB for faster processing
- **Browser**: Use modern browsers (Chrome, Firefox, Safari)
- **Network**: Stable internet connection for AI features
- **Storage**: Monitor disk space for document storage

### Security Best Practices
- **Passwords**: Use strong, unique passwords
- **API Keys**: Rotate keys regularly
- **Access**: Limit admin access to trusted users
- **Updates**: Keep dependencies updated

---

## 🆘 Getting Help

### Support Options

1. **Documentation**: Check this help guide and `MASTER_DOCUMENTATION.md`
2. **Issues**: Report bugs on GitHub Issues
3. **Logs**: Always include server and browser logs with issues
4. **Community**: Join discussions on GitHub

### Before Asking for Help

1. ✅ Check this help guide
2. ✅ Review error logs (server terminal + browser console)
3. ✅ Verify environment variables are set correctly
4. ✅ Try basic troubleshooting steps
5. ✅ Check if issue is reproducible

### Reporting Issues

Include this information:
- **Environment**: OS, Node.js version, browser
- **Steps**: How to reproduce the issue
- **Logs**: Server logs and browser console errors
- **Configuration**: Relevant `.env` settings (hide secrets!)
- **Expected**: What should happen vs. what actually happens

---

## 📋 Checklist for New Users

### Initial Setup
- [ ] Clone repository
- [ ] Create `.env` file from `.env.example`
- [ ] Install dependencies (`npm install`)
- [ ] Set up admin credentials
- [ ] Start server (`npm start`)
- [ ] Access dashboard at `http://localhost:3000`

### First Use
- [ ] Log in with admin credentials
- [ ] Add a test case manually
- [ ] Upload a sample PDF document
- [ ] Verify AI analysis works (if API key set)
- [ ] Test filtering and search
- [ ] Export data to CSV

### Production Deployment
- [ ] Change default passwords
- [ ] Set strong JWT/session secrets
- [ ] Configure API keys
- [ ] Set up HTTPS
- [ ] Test all functionality
- [ ] Set up backups
- [ ] Monitor logs

---

## 🎓 Learning Resources

### Understanding the Technology
- **Express.js**: Web framework for Node.js
- **JWT**: JSON Web Tokens for authentication
- **Tailwind CSS**: Utility-first CSS framework
- **OpenAI API**: AI-powered document analysis
- **PDF.js**: Client-side PDF processing

### Legal Technology
- **Document Management**: Best practices for legal documents
- **Case Tracking**: Organizing legal workflows
- **AI in Law**: Using AI tools responsibly in legal practice
- **Security**: Protecting sensitive legal information

---

**✨ Welcome to Justice Dashboard! This tool is designed to streamline your legal document management and case tracking workflow. If you need additional help, don't hesitate to reach out through GitHub Issues.**