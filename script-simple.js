/* Justice Dashboard - Simplified Version for Bulk Processing */

// Global variables
let isProcessingBulk = false;
let bulkProgress = 0;
let bulkTotal = 0;

// DOM Elements (initialized on page load)
let fileInput, generateBtn, bulkProcessBtn, exportBtn, summaryBox, trackerBody;
let categoryFilter, misconductFilter, totalCasesEl, activeCasesEl;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Justice Dashboard...');
  
  // Get DOM elements
  fileInput = document.getElementById("fileInput");
  generateBtn = document.getElementById("generateBtn");
  bulkProcessBtn = document.getElementById("bulkProcessBtn");
  exportBtn = document.getElementById("exportBtn");
  summaryBox = document.getElementById("summaryBox");
  trackerBody = document.querySelector("#results");
  categoryFilter = document.getElementById('categoryFilter');
  misconductFilter = document.getElementById('misconductFilter');
  totalCasesEl = document.getElementById('totalCases');
  activeCasesEl = document.getElementById('activeCases');

  // Check if essential elements exist
  if (!fileInput || !generateBtn || !trackerBody) {
    console.error('Required DOM elements not found:', {
      fileInput: !!fileInput,
      generateBtn: !!generateBtn,
      trackerBody: !!trackerBody
    });
    return;
  }

  console.log('All elements found, setting up event handlers...');
  
  // Set up event handlers
  setupEventHandlers();
  
  // Restore saved data
  restoreData();
  
  console.log('Justice Dashboard initialized successfully!');
});

// Set up all event handlers
function setupEventHandlers() {
  // Main process button
  generateBtn.onclick = async () => {
    const files = fileInput?.files;
    
    if (!files?.length) {
      alert("Please select PDF files first.");
      return;
    }
    
    if (files.length > 1) {
      const proceed = confirm(
        `You've selected ${files.length} files.\\n\\n` +
        `Process all files? This may take a while.`
      );
      
      if (proceed) {
        await processBulkFiles(Array.from(files), false);
      }
    } else {
      // Process single file
      await processSingleFile(files[0]);
    }
  };

  // Bulk process button
  if (bulkProcessBtn) {
    bulkProcessBtn.onclick = async () => {
      const files = fileInput?.files;
      
      if (!files?.length) {
        alert("Please select PDF files first.");
        return;
      }
      
      const proceed = confirm(
        `Bulk process ${files.length} files?\\n\\n` +
        `• Duplicates will be automatically skipped\\n` +
        `• Processing may take several minutes\\n` +
        `• Don't close the browser while processing`
      );
      
      if (proceed) {
        await processBulkFiles(Array.from(files), true);
      }
    };
  }

  // Export button
  if (exportBtn) {
    exportBtn.onclick = exportToCSV;
  }
}

// Process a single file
async function processSingleFile(file) {
  try {
    const text = await pdfToText(file);
    const summary = quickSummary(text);
    const fileURL = URL.createObjectURL(file);
    
    if (summaryBox) {
      summaryBox.textContent = summary;
    }
    
    // Check for duplicates
    const dupeCheck = isDuplicate(file.name, summary);
    if (dupeCheck.isDupe) {
      const userConfirm = confirm(
        `⚠️ Potential duplicate detected!\\n\\n` +
        `Reason: ${dupeCheck.reason}\\n\\n` +
        `Do you want to add this document anyway?`
      );
      
      if (!userConfirm) {
        alert("Document not added - duplicate detected.");
        return;
      }
    }
    
    addRow({
      category: detectCategory(text, file.name),
      child: detectChild(text),
      misconduct: "Review Needed",
      summary,
      tags: keywordTags(text),
      fileURL,
      fileName: file.name
    });
    
    alert("Document processed successfully!");
    
  } catch (error) {
    console.error('Error processing file:', error);
    alert(`Error processing ${file.name}: ${error.message}`);
  }
}

// Bulk processing function
async function processBulkFiles(files, skipDuplicates = false) {
  isProcessingBulk = true;
  bulkTotal = files.length;
  bulkProgress = 0;
  
  const progressDiv = document.getElementById('bulkProgress');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  if (progressDiv) progressDiv.classList.remove('hidden');
  
  let processedCount = 0;
  let duplicateCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    bulkProgress = i + 1;
    
    // Update progress
    const percentage = (bulkProgress / bulkTotal) * 100;
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `Processing ${bulkProgress} of ${bulkTotal} files... (${file.name})`;
    
    try {
      // Add delay to prevent browser freezing
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const text = await pdfToText(file);
      const summary = quickSummary(text);
      const fileURL = URL.createObjectURL(file);
      
      // Check for duplicates if requested
      if (skipDuplicates) {
        const dupeCheck = isDuplicate(file.name, summary);
        if (dupeCheck.isDupe) {
          duplicateCount++;
          continue;
        }
      }
      
      // Add row without alerts
      addRow({
        category: detectCategory(text, file.name),
        child: detectChild(text),
        misconduct: "Review Needed",
        summary,
        tags: keywordTags(text),
        fileURL,
        fileName: file.name
      });
      
      processedCount++;
      
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      errorCount++;
    }
  }
  
  // Hide progress and show results
  if (progressDiv) progressDiv.classList.add('hidden');
  isProcessingBulk = false;
  
  alert(
    `Bulk processing complete!\\n\\n` +
    `✅ Processed: ${processedCount} files\\n` +
    `⚠️ Duplicates skipped: ${duplicateCount}\\n` +
    `❌ Errors: ${errorCount}\\n` +
    `📊 Total: ${bulkTotal} files`
  );
}

// PDF to text converter
async function pdfToText(file) {
  try {
    if (typeof pdfjsLib === 'undefined') {
      console.warn('PDF.js not loaded, using filename as text');
      return `PDF File: ${file.name}`;
    }
    
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let text = "";
    
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      text += content.items.map(i => i.str).join(" ") + "\\n";
    }
    return text.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    return `PDF Document: ${file.name} (content extraction failed)`;
  }
}

// Text summarizer
const quickSummary = (text) => {
  const clean = text.replace(/\\s+/g, " ").trim();
  return clean.length > 200 ? clean.slice(0, 197) + "…" : clean;
};

// Category detector
function detectCategory(text, fileName) {
  const lowerText = text.toLowerCase();
  const lowerFileName = (fileName || "").toLowerCase();
  
  // Medical keywords
  if (/medical|doctor|hospital|health|hipaa|patient|treatment|prescription|diagnosis/.test(lowerText) ||
      /medical|doctor|hospital|health/.test(lowerFileName)) {
    return "Medical";
  }
  
  // School keywords  
  if (/school|education|teacher|classroom|iep|504|special education|principal|counselor/.test(lowerText) ||
      /school|education|iep/.test(lowerFileName)) {
    return "School";
  }
  
  // Legal keywords
  if (/court|judge|attorney|lawyer|legal|custody|visitation|case|lawsuit|hearing/.test(lowerText) ||
      /court|legal|case/.test(lowerFileName)) {
    return "Legal";
  }
  
  return "General";
}

// Child name detector
function detectChild(text) {
  const children = ["Jace", "Josh"];
  const found = children.filter(name => new RegExp(`\\\\b${name}\\\\b`, "i").test(text));
  if (found.length === 2) return "Both";
  if (found.length === 1) return found[0];
  return "Unknown";
}

// Legal keyword tagger
function keywordTags(text) {
  const keywords = {
    "Brady Violation": /\\bbrady\\b|exculpatory/i,
    "Civil Rights": /civil rights|§?1983/i,
    "CPS Negligence": /cps (?:failed|negligence)/i,
    "Custody Interference": /denied visitation|interference/i
  };
  
  return Object.entries(keywords)
    .filter(([, regex]) => regex.test(text))
    .map(([tag]) => tag);
}

// Create misconduct dropdown
function buildMisconductSelect(value = "Review Needed") {
  const select = document.createElement("select");
  const uid = `misconduct-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  
  select.id = uid;
  select.name = uid;
  select.className = "bg-transparent text-sm border-0";

  const options = [
    "Review Needed",
    "Denial of Right to Medical Safety and Privacy (HIPAA Violations)",
    "Violation of the Fourteenth Amendment - Due Process and Equal Protection"
  ];

  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = option.textContent = opt;
    select.appendChild(option);
  });

  select.value = value;
  select.onchange = saveTable;
  return select;
}

// Add row to tracker
function addRow({ category, child, misconduct, summary, tags, fileURL, fileName }) {
  const row = trackerBody.insertRow();
  
  row.insertCell().innerText = category;
  row.insertCell().innerText = child;
  row.insertCell().appendChild(buildMisconductSelect(misconduct));
  
  const summaryCell = row.insertCell();
  summaryCell.textContent = summary;
  summaryCell.title = summary;
  summaryCell.className = "max-w-xs truncate";
  
  row.insertCell().innerText = tags.join(", ");
  
  const actionCell = row.insertCell();
  if (fileURL) {
    const viewBtn = document.createElement("button");
    viewBtn.className = "px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600";
    viewBtn.innerText = "View PDF";
    viewBtn.onclick = () => window.open(fileURL, '_blank');
    actionCell.appendChild(viewBtn);
  } else {
    actionCell.innerText = "N/A";
  }
  
  saveTable();
}

// Check for duplicates (optimized)
function isDuplicate(fileName, summary) {
  if (!window.summaryCache) {
    window.summaryCache = new Set();
    const existingRows = Array.from(trackerBody.querySelectorAll('tr'));
    for (const row of existingRows) {
      const cells = row.cells;
      if (cells && cells.length >= 4) {
        window.summaryCache.add(cells[3].textContent.trim());
      }
    }
  }
  
  const trimmedSummary = summary.trim();
  
  if (window.summaryCache.has(trimmedSummary)) {
    return { isDupe: true, reason: 'Identical summary content' };
  }
  
  window.summaryCache.add(trimmedSummary);
  return { isDupe: false };
}

// Save table to localStorage
function saveTable() {
  localStorage.setItem("justiceTrackerRows", trackerBody.innerHTML);
  updateDashboardStats();
}

// Update dashboard statistics
function updateDashboardStats() {
  const rows = Array.from(trackerBody.querySelectorAll('tr'));
  const totalCases = rows.length;
  const activeCases = rows.filter(row => {
    const select = row.querySelector('select');
    return select && select.value !== 'Review Needed';
  }).length;
  
  if (totalCasesEl) totalCasesEl.textContent = totalCases;
  if (activeCasesEl) activeCasesEl.textContent = activeCases;
}

// Restore saved data
function restoreData() {
  const saved = localStorage.getItem("justiceTrackerRows");
  if (saved) {
    trackerBody.innerHTML = saved;
    updateDashboardStats();
  }
}

// Export to CSV
function exportToCSV() {
  const headers = ["Category", "Child", "Misconduct", "Summary", "Tags", "Actions"];
  
  const rows = Array.from(trackerBody.querySelectorAll("tr"))
    .map(tr => Array.from(tr.children)
      .map(td => {
        const select = td.querySelector('select');
        if (select) return select.value;
        return td.innerText.replace(/\\n/g, " ").replace(/"/g, '""');
      })
      .join(","));
  
  const csv = [headers.join(","), ...rows].join("\\r\\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  
  link.href = URL.createObjectURL(blob);
  link.download = `justice_tracker_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  alert("CSV exported successfully!");
}

// Clear data function
window.clearJusticeData = function() {
  localStorage.removeItem("justiceTrackerRows");
  trackerBody.innerHTML = "";
  window.summaryCache = new Set();
  updateDashboardStats();
  console.log("Justice tracker data cleared");
};
