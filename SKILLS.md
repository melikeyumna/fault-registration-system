# SKILLS.md

Version: 2.0

Project: Fault Registration System

## Purpose

The goal of this project is to migrate the existing React frontend to Material UI while preserving the current visual appearance and user experience.

The implementation may be completely refactored if necessary, as long as the final application looks and behaves like the original.

---

# Primary Objectives

Priority order:

1. Preserve the current visual design.
2. Use Material UI for at least 90% of the user interface.
3. Preserve all existing functionality.
4. Keep backend compatibility.
5. Write clean and maintainable React code.

---

# Material UI Requirements

Material UI should be the primary UI framework used throughout the application.

Prefer Material UI components whenever an equivalent exists.

The following components should be used whenever appropriate:

- AppBar
- Toolbar
- Container
- Box
- Grid
- Stack
- Card
- CardContent
- CardActions
- Button
- TextField
- Typography
- Chip
- Dialog
- Alert
- FormControl
- Select
- MenuItem
- Paper
- Divider

Plain HTML elements should only be used when no suitable Material UI component exists.

Target Material UI usage: **90% or higher**.

---

# Design Requirements

The final UI should look almost identical to the current application.

Preserve:

- Dark theme
- Purple color palette
- Layout
- Component positioning
- Spacing
- Typography hierarchy
- Overall user experience

Users should feel they are using the same application.

---

# CSS Usage

App.css should only contain:

- Global styles
- Fonts
- Background
- Gradients
- Animations
- Responsive adjustments
- Small custom overrides

Component styling should primarily use:

- Material UI Theme
- sx prop
- Material UI styling system

Avoid creating new custom CSS unless necessary.

---

# React Development Rules

You are free to refactor the React code if it improves the Material UI integration.

You may:

- Restructure components
- Replace HTML with Material UI components
- Improve code organization
- Improve readability
- Remove unnecessary code

However:

- Do not change application behavior.
- Do not change routing.
- Do not change business logic.
- Do not modify CRUD functionality.

---

# Backend Compatibility

The backend is already complete.

Never modify:

- API endpoints
- Request bodies
- Response structures
- Authentication flow
- Session management
- CRUD logic

Frontend changes must remain fully compatible with the existing Spring Boot backend.

---

# AI Working Process

Before making changes:

1. Inspect the existing implementation.
2. Understand the current UI.
3. Plan the migration.
4. Convert components to Material UI.
5. Verify visual consistency.
6. Explain completed changes.

---

# AI Behavior

When multiple implementation options exist:

- Prioritize Material UI usage.
- Preserve the existing visual appearance.
- Prefer Material UI components over custom HTML.
- Use the Material UI Theme system instead of custom CSS whenever possible.
- Avoid unnecessary visual differences.
- Explain significant design decisions.

---

# Expected Result

The final application should:

- Look almost identical to the original design.
- Use Material UI across at least 90% of the interface.
- Preserve all existing functionality.
- Preserve all CRUD operations.
- Preserve backend compatibility.
- Be cleaner and more maintainable than the original implementation.