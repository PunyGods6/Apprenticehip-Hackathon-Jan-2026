# Test Scenarios - OneFile Learning Journal

## Test Coverage Summary

| ID | Name | Description | Type of Requirement | Priority |
|---|---|---|---|---|
| **UNIT-1** | Calculate total OTJ hours correctly | Verify that the sum of all off-the-job hours from entries is calculated accurately | Functional | Must Have |
| **UNIT-2** | Calculate current week hours correctly | Verify that hours logged in the current week are calculated based on entry dates | Functional | Must Have |
| **UNIT-3** | Calculate variance (ahead/behind target) | Verify that variance between current week hours and weekly target is calculated correctly (positive = ahead, negative = behind) | Functional | Must Have |
| **UNIT-4** | Calculate progress percentage correctly | Verify that progress percentage is calculated as (totalOTJHours / totalTarget) * 100 | Functional | Must Have |
| **UNIT-5** | Display total entries count | Verify that total count of entries and count of off-the-job entries are displayed correctly | Functional | Should Have |
| **UNIT-6** | Calculate duration from start/end times | Verify that duration in hours is calculated correctly from start and end time inputs | Functional | Must Have |
| **UNIT-7** | Round duration to 1 decimal place | Verify that calculated duration is rounded to 1 decimal place for consistency | Functional | Must Have |
| **UNIT-8** | Filter KSBs by search term | Verify that KSBs can be filtered by entering a search term that matches ID, name, description | Functional | Must Have |
| **UNIT-9** | Filter KSBs by type | Verify that KSBs can be filtered by type (Knowledge, Skill, Behaviour) | Functional | Must Have |
| **UNIT-10** | Toggle KSB selection | Verify that clicking a KSB toggles its selection state (selected/unselected) | Functional | Must Have |
| **UNIT-11** | Display selected KSBs with correct styling | Verify that selected KSBs are visually distinguished with appropriate styling | Non-Functional | Should Have |
| **UNIT-12** | Accept valid file types | Verify that valid file types (PDF, Word, Excel, images, text, code files) are accepted for upload | Functional | Must Have |
| **UNIT-13** | Reject invalid file types | Verify that invalid/unsupported file types are rejected with appropriate error message | Functional | Must Have |
| **UNIT-14** | Display uploaded files correctly | Verify that uploaded files are displayed with correct name, size, and type information | Functional | Should Have |
| **UNIT-15** | Remove files when requested | Verify that users can remove uploaded files from the list before form submission | Functional | Should Have |
| **INT-1** | Add new entry and see it appear in timeline | Verify complete user flow: fill form → submit → entry appears in timeline with correct data | Functional | Must Have |
| **INT-2** | Progress dashboard updates when entry added | Verify that adding a new off-the-job entry immediately updates the total OTJ hours in the dashboard | Functional | Must Have |
| **INT-3** | Form submission with valid data | Verify that form can be submitted successfully with all required fields filled correctly | Functional | Must Have |
| **INT-4** | Display error message when entries fail to load | Verify that appropriate error message is shown when backend API fails to load entries | Functional | Must Have |
| **INT-5** | Show loading state while fetching entries | Verify that loading indicator is shown while entries are being fetched from backend | Non-Functional | Should Have |
| **INT-6** | Edit existing entry and see changes reflected | Verify complete edit flow: click edit → modify form fields → save → entry updates in timeline | Functional | Must Have |
| **INT-7** | Delete entry with confirmation | Verify delete flow: click delete → confirm dialog → entry removed from timeline | Functional | Must Have |
| **UNIT-16** | Display holiday mode component correctly | Verify that holiday mode component renders with toggle, days tracking, and progress bar | Functional | Should Have |
| **UNIT-17** | Toggle holiday mode on and off | Verify that clicking the toggle switch enables/disables holiday mode | Functional | Should Have |
| **UNIT-18** | Track holiday days used and remaining | Verify that days used are tracked correctly and remaining days are calculated | Functional | Should Have |
| **UNIT-19** | Update holiday days by editing | Verify that users can click on days value to edit and update holiday days used | Functional | Should Have |
| **UNIT-20** | Validate holiday days limits | Verify that holiday days cannot be negative or exceed total allowance | Functional | Must Have |
| **UNIT-21** | Display warning for low remaining days | Verify that remaining days show warning styling when less than 5 days remain | Non-Functional | Should Have |
| **UNIT-22** | Show holiday notice when mode is active | Verify that a notice appears indicating OTJ targets are paused when holiday mode is on | Functional | Should Have |
| **UNIT-23** | Handle holiday data fetch errors | Verify that appropriate error message is shown when holiday data fails to load | Functional | Must Have |
| **UNIT-24** | Create holiday record if none exists | Verify that system creates initial holiday record with defaults when none exists | Functional | Must Have |
| **UNIT-25** | ProgressDashboard shows neutral state on holiday | Verify that variance card shows neutral styling and holiday icon when holiday mode is enabled | Functional | Must Have |
| **UNIT-26** | ProgressDashboard shows normal variance when not on holiday | Verify that variance is calculated and displayed normally when holiday mode is disabled | Functional | Must Have |
| **UNIT-27** | Holiday mode prevents behind-target penalty | Verify that users are not penalized for low hours when holiday mode is active | Functional | Must Have |

## Test File Locations

### Unit Tests
- **ProgressDashboard.test.jsx**: `src/tests/ProgressDashboard.test.jsx`
  - Tests: UNIT-1, UNIT-2, UNIT-3, UNIT-4, UNIT-5, UNIT-25, UNIT-26, UNIT-27

- **OTJEntryForm.test.jsx**: `src/tests/OTJEntryForm.test.jsx`
  - Tests: UNIT-6, UNIT-7

- **KSBSelector.test.jsx**: `src/tests/KSBSelector.test.jsx`
  - Tests: UNIT-8, UNIT-9, UNIT-10, UNIT-11

- **DocumentUpload.test.jsx**: `src/tests/DocumentUpload.test.jsx`
  - Tests: UNIT-12, UNIT-13, UNIT-14, UNIT-15

- **HolidayMode.test.jsx**: `src/tests/HolidayMode.test.jsx`
  - Tests: UNIT-16, UNIT-17, UNIT-18, UNIT-19, UNIT-20, UNIT-21, UNIT-22, UNIT-23, UNIT-24

### Integration Tests
- **LearningJournal.test.jsx**: `src/tests/LearningJournal.test.jsx`
  - Tests: INT-1, INT-2, INT-3, INT-4, INT-5, INT-6, INT-7

## Test Execution

To run all tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

To run tests with coverage:
```bash
npm run test:coverage
```

To run specific test file:
```bash
npm test -- ProgressDashboard
```

## Test Results

**Total Tests**: 68
- **Unit Tests**: 27
- **Integration Tests**: 7

**Test Status**: ✅ All Passing (68/68)

**Coverage Goal**: 70-80% for critical components

## Priority Definitions

- **Must Have**: Core functionality that is essential for the application to work correctly
- **Should Have**: Important features that enhance user experience but are not critical
- **Could Have**: Nice-to-have features that can be implemented if time permits

## Type of Requirement Definitions

- **Functional**: Tests that verify specific features or behaviors work as expected
- **Non-Functional**: Tests that verify performance, UI/UX, error handling, or other quality attributes
