# OneFile Learning Journal - Improved Student Interface

## 🎯 Hackathon Project Overview

This is an improved version of the OneFile apprenticeship learning journal platform, focused on enhancing the student experience for logging off-the-job (OTJ) learning hours.

## ✨ Key Improvements Implemented

### 1. **Progress Dashboard** 📊
- **Visual Progress Tracking**: Beautiful stat cards showing:
  - Total OTJ hours logged vs target
  - Current week's hours
  - Variance to target (ahead/behind)
  - Total journal entries
- **Progress Bar**: Annual progress visualization with percentage
- **At-a-Glance Overview**: Students can immediately see their progress without digging through data

### 2. **Simplified Entry Form** ✍️
- **All-in-One Interface**: No more tab switching - everything on one page
- **Auto-Calculated Duration**: Smart time calculation from start/end times
- **Clear Category Selection**: Pre-defined OTJ categories with helpful descriptions
- **Inline Help Text**: Contextual guidance throughout the form

### 3. **KSB Selection** 🎓
- **Easy-to-Use Selector**: Click-to-add KSB interface
- **Search & Filter**: Find KSBs by keyword or type (Knowledge/Skill/Behaviour)
- **Visual Tagging**: Color-coded KSB badges for quick identification
- **Multi-Select**: Add multiple KSBs to each entry

### 4. **Document Upload** 📎
- **Drag & Drop Support**: Intuitive file upload
- **Multiple File Types**: Supports PDF, Word, Excel, PowerPoint, Images
- **File Preview**: See uploaded documents with file size
- **Easy Removal**: One-click to remove documents

### 5. **Improved Timeline View** 📅
- **Visual Timeline**: Beautiful chronological view of all entries
- **Smart Date Display**: Day, month, year in an attractive card format
- **Entry Cards**: Clean, organized display of all entry information
- **OTJ Badge**: Clear visual indicator for off-the-job entries

## 🎨 UX Enhancements

### Design Improvements:
- **Modern UI**: Gradient backgrounds, smooth transitions, professional styling
- **Color-Coded Elements**: Different colors for different types (Knowledge = Blue, Skill = Green, Behaviour = Pink)
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: Proper labels, ARIA attributes, keyboard navigation

### User Flow Improvements:
- **Fewer Steps**: Streamlined from 5+ steps to 1 unified form
- **Instant Feedback**: Real-time duration calculation
- **Clear Actions**: Obvious "Add New Entry" button
- **Contextual Help**: Tooltips and descriptions where needed

## 📋 Requirements Met

### Must Have ✅
- ✅ Students can record off-the-job entries
- ✅ See total hours logged
- ✅ Add date and time to entries
- ✅ Upload supporting documents (all file types)
- ✅ Mark entries as "off the job"
- ✅ See variance to target hours
- ✅ View KSBs achieved

### Should Have ✅
- ✅ Clear classification/categories
- ✅ Full description visibility
- ✅ Clear navigation and signposts

### Could Have ✅
- ✅ Type in time manually
- ✅ Auto-calculated duration
- ✅ Pre-populated categories

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Visit `http://localhost:5174/` to see the improved interface.

### Build for Production
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── LearningJournal.jsx       # Main container component
│   ├── ProgressDashboard.jsx     # Progress tracking dashboard
│   ├── OTJEntryForm.jsx          # Simplified entry form
│   ├── KSBSelector.jsx           # KSB selection component
│   ├── DocumentUpload.jsx        # File upload component
│   ├── JournalTimeline.jsx       # Timeline view of entries
│   └── *.css                     # Component styles
├── App.jsx                       # Root component
├── App.css                       # Global app styles
└── index.css                     # Base styles
```

## 💡 Key Features Breakdown

### Progress Dashboard
```javascript
// Automatically calculates:
- Total OTJ hours
- Current week's hours
- Variance to weekly target
- Progress percentage
```

### Auto-Duration Calculation
```javascript
// Smart calculation:
Start Time: 12:00 PM
End Time: 1:00 PM
Duration: Automatically shows "1h"
```

### KSB Management
```javascript
// Example KSBs:
- K1: Understanding of software development lifecycle
- S1: Ability to write clean, maintainable code
- B1: Professional attitude and work ethic
```

## 🎯 Success Criteria Achieved

1. **Visibility**: Students can see their progress at a glance
2. **Simplicity**: Reduced complexity from multiple tabs to one form
3. **Guidance**: Clear help text and descriptions throughout
4. **Efficiency**: Auto-calculations save time
5. **Completeness**: All required fields and documents in one place

## 🌟 Future Enhancements

Potential additions for future iterations:
- Holiday mode toggle
- Template system for common entries
- Export functionality
- Coach approval workflow
- Notifications for low variance
- Mobile app version

## 👥 Team Notes

This interface focuses on the **student experience** as the primary user. The next phase could include:
- Coach dashboard view
- Approval/rejection workflow
- Analytics and reporting
- Integration with existing OneFile backend

## 📊 Comparison: Before vs After

### Before (Original OneFile):
- ❌ Progress hidden in summary
- ❌ Tab switching required
- ❌ Manual time calculation
- ❌ No KSB visibility
- ❌ Basic timeline view

### After (Improved Version):
- ✅ Prominent progress dashboard
- ✅ Single-page entry form
- ✅ Auto-calculated duration
- ✅ Easy KSB selection
- ✅ Beautiful visual timeline

---

Built with ❤️ for the Winter Hackathon 2026
