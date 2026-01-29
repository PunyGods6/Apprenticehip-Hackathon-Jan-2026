# Testing Plan - OneFile Learning Journal

## 📋 Overview
This testing plan follows the **Software Development Lifecycle (SDLC)** testing phase, ensuring our improved OneFile interface is reliable, functional, and meets all requirements.

## 🎯 Testing Strategy

### Testing Framework
- **Vitest**: Fast unit testing framework (Vite-native alternative to Jest)
- **React Testing Library**: Component testing with user-centric approach
- **@testing-library/user-event**: Realistic user interaction simulation

### Testing Pyramid Approach
```
    /\
   /  \     E2E Tests (Optional - time permitting)
  /----\    
 /      \   Integration Tests (7 tests)
/--------\  
/----------\ Unit Tests (27 tests)
```

## 🧪 Test Coverage

### 1. Unit Tests (Business Logic)

#### ProgressDashboard.test.jsx
**Purpose**: Test calculation accuracy
- ✅ Calculate total OTJ hours correctly
- ✅ Calculate current week hours correctly
- ✅ Calculate variance (ahead/behind target)
- ✅ Calculate progress percentage correctly

**Why**: Core business logic that must be accurate for student progress tracking

#### OTJEntryForm.test.jsx
**Purpose**: Test auto-duration calculation
- ✅ Calculate duration from start/end times correctly
- ✅ Handle edge cases (e.g., end time before start time)
- ✅ Display duration in correct format (hours/minutes)

**Why**: Critical feature that saves students time and prevents errors

#### HolidayMode.test.jsx
**Purpose**: Test holiday mode functionality
- ✅ Display holiday mode component correctly
- ✅ Toggle holiday mode on and off
- ✅ Track holiday days used and remaining
- ✅ Update holiday days by editing
- ✅ Validate holiday days limits (0-28)
- ✅ Display warning for low remaining days
- ✅ Show holiday notice when mode is active
- ✅ Handle holiday data fetch errors
- ✅ Create holiday record if none exists

**Why**: Allows students to pause OTJ targets during holidays without penalty

---

### 2. Component Tests (User Interactions)

#### KSBSelector.test.jsx
**Purpose**: Test search and filter functionality
- ✅ Filter KSBs by search term
- ✅ Filter by type (Knowledge/Skill/Behaviour)
- ✅ Toggle KSB selection correctly
- ✅ Display selected KSBs with correct styling

**Why**: Ensures students can easily find and select relevant KSBs

#### DocumentUpload.test.jsx
**Purpose**: Test file validation and upload
- ✅ Accept valid file types (PDF, Word, Excel, etc.)
- ✅ Reject invalid file types
- ✅ Display uploaded files correctly
- ✅ Remove files when requested

**Why**: Validates document handling meets requirements

---

### 3. Integration Tests (Component Interaction)

#### LearningJournal.test.jsx
**Purpose**: Test complete user flow
- ✅ Add new entry and see it appear in timeline
- ✅ Progress dashboard updates when entry added
- ✅ Form resets after successful submission
- ✅ Form submission with valid data
- ✅ Display error message when entries fail to load
- ✅ Show loading state while fetching entries
- ✅ Edit existing entry and see changes reflected
- ✅ Delete entry with confirmation

**Why**: Validates end-to-end functionality from student perspective

---

## 📊 Test Metrics

### Success Criteria
- ✅ All tests pass
- ✅ Core business logic covered (calculations)
- ✅ Key user interactions tested
- ✅ No regressions when adding features

### Coverage Goals
- **Aim**: 70-80% code coverage for critical components
- **Priority**: Quality over quantity (meaningful tests > 100% coverage)

---

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run tests with UI (visual interface)
```bash
npm run test:ui
```

---

## 🎨 Testing Best Practices Applied

1. **User-Centric Testing**: Test what users see and do, not implementation details
2. **Arrange-Act-Assert Pattern**: Clear test structure
3. **Descriptive Test Names**: Easy to understand what's being tested
4. **Isolated Tests**: Each test independent of others
5. **Mock Minimal**: Test real behavior where possible

---

## 📝 Test Documentation

Each test file includes:
- **Description**: What component/feature is being tested
- **Setup**: Any required test data or mocks
- **Test Cases**: Clear, descriptive test descriptions
- **Assertions**: Meaningful expect statements

---

## 🔄 SDLC Integration

### Where Testing Fits:
1. ✅ **Requirements Analysis** - Defined what to build
2. ✅ **Design** - Planned component structure
3. ✅ **Implementation** - Built the features
4. 🟢 **Testing** - Currently validating functionality ← WE ARE HERE
5. ⏳ **Deployment** - Next phase (if applicable)
6. ⏳ **Maintenance** - Future iterations

---

## 🎯 Hackathon Demo Points

When presenting tests, highlight:
1. **SDLC Knowledge**: "We followed the Software Development Lifecycle..."
2. **Test Strategy**: "We used a testing pyramid approach..."
3. **Business Logic**: "We tested critical calculations like OTJ hours..."
4. **User Experience**: "We tested from the student's perspective..."
5. **Quality Assurance**: "This ensures our improvements actually work..."

---

## 🌟 Future Testing Enhancements

If more time available:
- Accessibility testing (a11y)
- Performance testing
- Visual regression testing
- E2E tests with Playwright/Cypress
- CI/CD integration (GitHub Actions)

---

**Testing ensures our improved OneFile interface is not just better looking, but actually better functioning!** ✨
