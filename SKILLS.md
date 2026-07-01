# SKILLS.md

Version: 1.0

Project: Fault Registration System

Purpose:
This document provides project-specific instructions for AI-assisted development. The goal is to ensure that all AI-generated changes remain consistent with the existing architecture, design language, and coding standards while integrating Material UI.

---

# Project Goal

The objective of this project is to integrate Material UI into the existing React frontend while preserving the current functionality, user experience, and overall project structure.

The AI should improve the UI without redesigning or restructuring the application.

---

# General Rules

- Always inspect the existing project before making any modifications.
- Preserve the current architecture.
- Preserve all existing CRUD functionality.
- Do not modify backend APIs.
- Do not rename API endpoints.
- Do not change request or response formats.
- Keep the existing folder structure.
- Keep the code clean, readable, and maintainable.
- Avoid unnecessary refactoring.
- Only modify files that are directly related to the requested task.

---

# UI Guidelines

The current UI already follows a specific visual identity.

When integrating Material UI:

- Preserve the existing dark theme.
- Preserve the existing purple color palette.
- Preserve the current layout as much as possible.
- Preserve spacing and visual hierarchy.
- Preserve animations if they already exist.
- Keep the interface responsive.
- Use Material UI components instead of plain HTML elements whenever appropriate.
- Reuse existing CSS whenever possible.
- Do not redesign the application unless explicitly requested.

The goal is to modernize the implementation, not to change the design.

---

# React Development Rules

- Use Functional Components.
- Preserve existing component names whenever possible.
- Preserve the current folder structure.
- Do not introduce unnecessary components.
- Do not introduce unnecessary third-party libraries.
- Preserve existing state management.
- Preserve current API calls.
- Keep the code modular and easy to understand.

---

# Backend Compatibility

This frontend communicates with an existing Spring Boot backend.

Always preserve:

- API URLs
- Fetch requests
- CRUD operations
- Request bodies
- Response structures
- Existing backend integration

Never modify backend-related behavior unless explicitly requested.

---

# Material UI Integration Rules

- Replace suitable HTML elements with Material UI components.
- Prefer Material UI components such as:
  - Button
  - TextField
  - Card
  - Typography
  - Container
  - Box
  - Stack
  - Grid
  - Dialog
  - Chip
  - Alert

- Do not replace components that already work well unless Material UI provides a clear improvement.
- Keep the resulting UI visually similar to the existing design.

---

# AI Working Style

Before making any changes:

1. Inspect the existing implementation.
2. Understand the current component.
3. Preserve existing behavior.
4. Make the smallest possible modification.
5. Explain what was changed after completing the task.

Always prioritize preserving functionality over making visual changes.

---

# AI Behavior

When performing UI transformations:

- Do not assume requirements that are not explicitly stated.
- If a design decision is unclear, preserve the existing implementation.
- Avoid replacing working code unnecessarily.
- Avoid rewriting entire components when only small modifications are needed.
- Prefer incremental improvements instead of complete rewrites.
- Explain the reasoning behind major UI changes.
- If multiple implementation options exist, choose the one that introduces the fewest changes.

---

# Priority Order

When making decisions, always follow this priority:

1. Preserve existing functionality.
2. Preserve backend compatibility.
3. Preserve the current visual identity.
4. Integrate Material UI.
5. Improve UI consistency.
6. Improve code readability.

Never sacrifice functionality for visual improvements.

---

# Expected AI Outcome

The resulting application should:

- Look almost identical to the original design.
- Continue working exactly as before.
- Preserve all existing CRUD operations.
- Use Material UI wherever appropriate.
- Require minimal manual corrections after the transformation.