# Quick Fix Guide for Windows Automation Issues

Based on your testing, here are the solutions to the issues you encountered:

## ✅ Fixed Issues

### 1. Environment Variable Extraction
**Problem**: `No environment variables found`
**Solution**: Updated `extract-env.js` to check additional path locations

**Now works with**:
```powershell
node extract-env.js
```

### 2. Project Cleanup (No Git Bash Required)
**Problem**: `bash` command not recognized
**Solution**: Use PowerShell version instead

**Windows command**:
```powershell
npm run cleanup:windows
```

**Or directly**:
```powershell
powershell -ExecutionPolicy Bypass -File cleanup-and-structure.ps1
```

### 3. PDF Processing with Real Files
**Problem**: `input.pdf` not found
**Solution**: Use existing PDFs from your uploads folder

**Test your PDFs**:
```powershell
npm run test-pdf
```

**Process a real PDF**:
```powershell
python update_pdf_links.py "server\uploads\1751231212352-2.21.24_Referee_Recommendation_and_Order_RE_Child_Support__1_.pdf" "Updated_Court_Order.pdf"
```

## 🎯 Working Commands for Windows

### Complete Setup Sequence
```powershell
# 1. Install dependencies
npm install

# 2. Clean up project (Windows version)
npm run cleanup:windows

# 3. Extract environment variables
npm run extract-env

# 4. Run code quality checks
npm run lint
npm run format

# 5. Test PDF processing
npm run test-pdf

# 6. Process an actual PDF
python update_pdf_links.py "server\uploads\[filename].pdf" "output.pdf"
```

### Interactive Menu (Fixed)
```powershell
# Make sure to enter ONLY the number (no extra characters)
.\automation.ps1

# At prompt: enter 1, 2, 3, etc. (NOT "1 # comment")
```

## 📂 Your Project Structure

After running `cleanup:windows`, your structure will be:
```
justice-dashboard/
├── frontend/           # (client files moved here)
├── backend/           # (server files moved here)  
├── docs/              # (documentation)
├── scripts/           # (automation scripts)
├── .env               # (extracted environment variables)
└── ...
```

## 🔧 Available NPM Scripts

```json
{
  "scripts": {
    "extract-env": "node extract-env.js",
    "cleanup": "bash cleanup-and-structure.sh",           // Linux/Mac
    "cleanup:windows": "powershell -ExecutionPolicy Bypass -File cleanup-and-structure.ps1",  // Windows
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write .",
    "test-pdf": "python test_pdf_processing.py",
    "update-pdf": "python update_pdf_links.py"
  }
}
```

## 💡 Pro Tips

1. **Always run from the correct directory**:
   ```
   c:\Users\ssped\justice-dashboard\justice-dashboard\  ← Here
   ```

2. **Use Tab completion** for file paths to avoid typos

3. **Check what PDFs you have**:
   ```powershell
   ls server\uploads\*.pdf
   ```

4. **Test before processing important files**:
   ```powershell
   npm run test-pdf
   ```

Your automation setup is now Windows-friendly and ready to use! 🚀
