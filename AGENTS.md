# Agent Guidelines for Issue Management & Development Workflow

This document provides comprehensive guidelines for LLM agents working on this project, covering GitHub issues management, GitFlow branching strategy, changelog documentation, and semantic versioning.

## Table of Contents

1. [GitHub Issues Management](#github-issues-management)
2. [GitFlow Branching Strategy](#gitflow-branching-strategy)
3. [Changelog Documentation](#changelog-documentation)
4. [Semantic Versioning (SemVer)](#semantic-versioning-semver)
5. [Development Workflow](#development-workflow)
6. [Code Quality Standards](#code-quality-standards)
7. [Release Process](#release-process)

---

## GitHub Issues Management

### Issue Creation Guidelines

When creating GitHub issues, follow these structured approaches:

#### Issue Types

1. **Bug Reports** - Use label: `bug`

   - Include reproduction steps
   - Specify expected vs actual behavior
   - Add environment details (browser, Node version, etc.)
   - Include relevant code snippets or error messages

2. **Feature Requests** - Use label: `enhancement`

   - Clearly describe the feature and its benefits
   - Include acceptance criteria
   - Provide mockups or examples if applicable
   - Estimate effort and priority

3. **Documentation** - Use label: `documentation`

   - Specify what documentation needs updating
   - Include current vs desired state
   - Reference specific files or sections

4. **Technical Debt** - Use labels: `refactor`, `technical-debt`
   - Explain current limitations
   - Propose solutions and benefits
   - Include impact assessment

#### Issue Template Structure

```markdown
**Type**: [Bug/Enhancement/Documentation/Technical Debt]
**Priority**: [High/Medium/Low]
**Effort**: [Small/Medium/Large] (~X hours/days)

## Description

Brief description of the issue or feature

## Current State

What exists today (for bugs, what's broken)

## Desired State

What should happen or what we want to achieve

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes

Implementation details, constraints, or considerations

## Related Issues

Link to related issues using #issue-number
```

#### Labels and Organization

Use consistent labeling:

- **Type**: `bug`, `enhancement`, `documentation`, `question`
- **Priority**: `priority:high`, `priority:medium`, `priority:low`
- **Status**: `status:ready`, `status:in-progress`, `status:blocked`, `status:review`
- **Component**: `component:ui`, `component:api`, `component:docs`
- **Effort**: `effort:small`, `effort:medium`, `effort:large`

### Issue Lifecycle Management

1. **Triage** - Label new issues appropriately
2. **Planning** - Add to milestones and projects
3. **Assignment** - Assign to appropriate team member
4. **Progress Tracking** - Update status labels
5. **Review** - Link pull requests to issues
6. **Closure** - Verify completion and close with summary

---

## GitFlow Branching Strategy

### Branch Types

#### Main Branches

- **`main`** - Production-ready code, always deployable
- **`develop`** - Integration branch for features, latest development state

#### Supporting Branches

- **`feature/*`** - New features or enhancements
- **`release/*`** - Prepare for production releases
- **`hotfix/*`** - Critical fixes for production
- **`bugfix/*`** - Non-critical bug fixes

### Branch Naming Conventions

```bash
# Feature branches
feature/issue-123-add-markdown-editor
feature/migrate-to-ladle

# Release branches
release/v6.17.0
release/v7.0.0-beta.1

# Hotfix branches
hotfix/v6.16.1-critical-bug-fix
hotfix/security-vulnerability

# Bugfix branches
bugfix/issue-456-editor-alignment
```

### Workflow Process

1. **Feature Development**

   ```bash
   # Start from develop
   git checkout develop
   git pull origin develop
   git checkout -b feature/issue-123-feature-name

   # Make changes and commit
   git add .
   git commit -m "feat: add new feature (closes #123)"

   # Push and create PR to develop
   git push origin feature/issue-123-feature-name
   ```

2. **Release Preparation**

   ```bash
   # Create release branch from develop
   git checkout develop
   git checkout -b release/v6.17.0

   # Update version numbers, changelog
   # Make final bug fixes

   # Merge to main and develop
   git checkout main
   git merge release/v6.17.0
   git tag v6.17.0

   git checkout develop
   git merge release/v6.17.0
   ```

3. **Hotfix Process**

   ```bash
   # Create hotfix from main
   git checkout main
   git checkout -b hotfix/v6.16.1-critical-fix

   # Make fix and update version
   # Merge to both main and develop
   ```

### Pull Request Guidelines

- **Title Format**: `type(scope): description (#issue-number)`
- **Description**: Link to issue, describe changes, include breaking changes
- **Reviews**: Require at least one reviewer for production code
- **Tests**: Ensure all tests pass and coverage is maintained
- **Documentation**: Update relevant documentation

---

## Changelog Documentation

### CHANGELOG.md Structure

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- New features that have been added

### Changed

- Changes in existing functionality

### Deprecated

- Soon-to-be removed features

### Removed

- Features that have been removed

### Fixed

- Bug fixes

### Security

- Security vulnerability fixes

## [6.16.0] - 2024-06-06

### Added

- Enhanced markdown editor with syntax highlighting
- New USFM editor component

### Changed

- Improved performance of text rendering
- Updated React peer dependencies

### Fixed

- Fixed text selection issues in Safari
- Resolved memory leak in editor cleanup

## [6.15.0] - 2024-05-15

...
```

### Change Categories

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Now removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes

### Changelog Maintenance

1. **During Development** - Add entries to `[Unreleased]` section
2. **Before Release** - Move unreleased items to new version section
3. **Version Links** - Add comparison links at bottom of file
4. **Breaking Changes** - Clearly mark breaking changes in descriptions

---

## Semantic Versioning (SemVer)

### Version Format: MAJOR.MINOR.PATCH

- **MAJOR** (X.0.0) - Incompatible API changes
- **MINOR** (0.X.0) - New functionality, backward compatible
- **PATCH** (0.0.X) - Bug fixes, backward compatible

### Pre-release Versions

- **Alpha**: `1.0.0-alpha.1` - Early development
- **Beta**: `1.0.0-beta.1` - Feature complete, testing
- **RC**: `1.0.0-rc.1` - Release candidate

### Version Bump Guidelines

#### MAJOR Version (Breaking Changes)

```javascript
// Example: Removing or changing public API
// OLD: component.setText(text)
// NEW: component.updateContent({text, format})
```

#### MINOR Version (New Features)

```javascript
// Example: Adding new optional props
// NEW: <MarkdownEditor enableSyntaxHighlight={true} />
```

#### PATCH Version (Bug Fixes)

```javascript
// Example: Fixing existing functionality
// FIX: Cursor position after undo operation
```

### Version Update Process

1. **Determine Version Type** - Analyze changes for breaking changes
2. **Update package.json** - Bump version number
3. **Update CHANGELOG.md** - Move unreleased items to new version
4. **Create Git Tag** - Tag the release commit
5. **Publish** - Deploy to npm registry if applicable

---

## Development Workflow

### Complete Feature Development Process

1. **Issue Analysis**

   - Read issue thoroughly
   - Understand requirements and acceptance criteria
   - Ask clarifying questions if needed
   - Estimate effort and complexity

2. **Branch Creation**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/issue-123-feature-name
   ```

3. **Development**

   - Write code following project conventions
   - Add unit tests for new functionality
   - Update documentation as needed
   - Follow existing code patterns

4. **Testing**

   ```bash
   npm test                    # Run test suite
   npm run lint               # Check code style
   npm run build              # Verify build works
   ```

5. **Documentation**

   - Update component documentation
   - Add examples if needed
   - Update README if applicable

6. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: add new feature (closes #123)"
   git push origin feature/issue-123-feature-name
   ```

7. **Pull Request**

   - Create PR from feature branch to develop
   - Link to original issue
   - Request appropriate reviewers
   - Address feedback and make changes

8. **Merge and Cleanup**
   - Merge PR when approved
   - Delete feature branch
   - Update issue status

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No breaking changes (or properly documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed
- [ ] Accessibility requirements met

---

## Code Quality Standards

### React Component Guidelines

1. **Component Structure**

   ```jsx
   // Use functional components with hooks
   const MyComponent = ({ prop1, prop2, ...props }) => {
     // State and effects first
     const [state, setState] = useState(initial);

     // Event handlers
     const handleEvent = useCallback(() => {
       // handler logic
     }, [dependencies]);

     // Render
     return <div {...props}>{/* component content */}</div>;
   };
   ```

2. **PropTypes and Documentation**

   ```jsx
   MyComponent.propTypes = {
     prop1: PropTypes.string.isRequired,
     prop2: PropTypes.func,
   };

   MyComponent.defaultProps = {
     prop2: () => {},
   };
   ```

3. **Testing Standards**

   ```javascript
   import { render, screen, fireEvent } from "@testing-library/react";
   import MyComponent from "./MyComponent";

   describe("MyComponent", () => {
     it("should render correctly", () => {
       render(<MyComponent prop1='test' />);
       expect(screen.getByText("test")).toBeInTheDocument();
     });
   });
   ```

### Documentation Standards

- **Component Documentation** - Use `.md` files for each component
- **API Documentation** - Document all props, methods, and events
- **Examples** - Provide practical usage examples
- **Migration Guides** - Document breaking changes and migration paths

---

## Release Process

### Pre-Release Checklist

- [ ] All planned features implemented
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version number bumped in package.json
- [ ] Breaking changes documented
- [ ] Migration guide created (if needed)

### Release Steps

1. **Create Release Branch**

   ```bash
   git checkout develop
   git checkout -b release/v6.17.0
   ```

2. **Final Preparations**

   - Update version in package.json
   - Update CHANGELOG.md
   - Run full test suite
   - Build and verify artifacts

3. **Create Release PR**

   - PR from release branch to main
   - Include changelog in PR description
   - Get final review and approval

4. **Tag and Deploy**

   ```bash
   git checkout main
   git merge release/v6.17.0
   git tag v6.17.0
   git push origin main --tags
   ```

5. **Merge Back to Develop**

   ```bash
   git checkout develop
   git merge release/v6.17.0
   git push origin develop
   ```

6. **Publish Package** (if applicable)

   ```bash
   npm publish
   ```

7. **Create GitHub Release**
   - Go to GitHub releases
   - Create new release from tag
   - Include changelog content
   - Attach any release artifacts

### Post-Release

- [ ] Verify deployment successful
- [ ] Update documentation site
- [ ] Announce release (if significant)
- [ ] Monitor for issues
- [ ] Plan next iteration

---

## Troubleshooting Common Issues

### Build Issues

- Check Node.js version compatibility
- Clear node_modules and reinstall
- Verify all dependencies are compatible

### Test Failures

- Run tests individually to isolate issues
- Check for environment-specific problems
- Update snapshots if UI changed intentionally

### Merge Conflicts

- Use `git rebase develop` to replay changes
- Resolve conflicts manually
- Test thoroughly after resolution

### Documentation Sync Issues

- Always review documentation when making code changes
- Use the AGENTS.md file for guidance on handling discrepancies
- Raise issues when documentation is out of sync with codebase

---

## Additional Resources

- [GitHub Flow Documentation](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Semantic Versioning Specification](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [React Component Best Practices](https://react.dev/learn)

---

_This document should be updated as workflows evolve. When making changes to development processes, update this guide accordingly and ensure all team members are informed._
