# Changelog

All notable changes to the PohLang Hub VS Code extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-10-09

### Fixed
- Verified TypeScript compilation produces no errors
- Confirmed runtime binary v0.5.2 properly bundled in `bin/` directory
- Validated all 5 commands work correctly with latest PLHub

### Improved
- Updated documentation with comprehensive verification results
- Confirmed all 38 code snippets working correctly
- Validated syntax highlighting for all PohLang v0.5.2 features including 20 phrasal expressions
- Extension packages successfully as `.vsix` file

### Testing
- ✅ Full stack validation completed (see `VERIFICATION_REPORT.md`)
- ✅ All commands tested and functional (Run File, Create Project, Update Language, etc.)
- ✅ Extension compiles and packages successfully
- ✅ Runtime detection works across multiple locations (extension bin/, workspace, PATH)

### Technical
- TypeScript compilation: Clean, no errors
- ESLint: No linting issues
- Bundle size: Optimized with proper `.vscodeignore`

## [Unreleased]

### Planned
- Advanced debugging support
- Interactive PohLang REPL
- Code formatting and refactoring tools
- Integration with package managers
- Performance profiling tools

## [0.1.0] - 2025-09-21

- **IntelliSense**: Smart completions for keywords, functions, variables, and all 20 phrasal expressions- Code snippets for common PohLang patterns

- **Rust Runtime Integration**: Execute `.poh` files with fast compiled Rust runtime (v0.5.2)- IntelliSense and autocompletion support

- **Automatic Runtime Detection**: Searches extension, workspace, development directories, and PATH- Three main commands:

- **Commands**:  - **PL-Hub: Run File** - Execute current .poh file

  - `PL-Hub: Run File` (Ctrl+F5) - Execute current .poh file  - **PL-Hub: Create Project** - Scaffold new PohLang projects  

  - `PL-Hub: Create Project` - Scaffold new PohLang projects with v0.5.2 templates  - **PL-Hub: Update Language** - Update interpreter binary

  - `PL-Hub: Update Language` - Download and install latest runtime- Real-time diagnostics and error reporting

  - `PL-Hub: Run Environment Example` - Test installation- Integrated terminal output for code execution

  - `PL-Hub: Show SDK Versions` - Display installed versions- Project scaffolding with templates

- **Configuration Settings**:- Placeholder PohLang interpreter binary

  - `pohlangHub.pohlangRepo` - GitHub repository for releases- Language configuration with proper comment support

  - `pohlangHub.plhubRepo` - PL-Hub SDK repository- File association for `.poh` files

  - `pohlangHub.autoUpdate` - Automatic update checking

  - `pohlangHub.updateIntervalDays` - Update check frequency### Language Features

  - `pohlangHub.sdkTagOverride` - Pin to specific version- Keywords: `make`, `set`, `to`, `function`, `if`, `else`, `while`, `for`, etc.

  - `pohlangHub.githubToken` - Optional token for API rate limits- Operators: `plus`, `minus`, `times`, `divided by`, `equals`, etc.

- Built-in functions: `print`, `input`, `length`, `type`, `convert`

### Changed- Data types: strings, numbers, booleans, null

- Updated syntax highlighting from old Python-based syntax to PohLang v0.5.2 Rust syntax- Control structures: conditionals, loops, functions

- Changed function syntax from `make function name:` to `Make name with param:` / `Make name:`- Comments: single-line (`#`) and block (`#* *#`)

- Updated variable syntax from `set variable to value` to `Make variable = value`

- Changed conditional from `if...else` to `If...Otherwise...End If`### Code Snippets

- Updated loops from lowercase to capitalized: `While...End While`, `Repeat...End`- `func` - Create function

- Changed I/O functions from `print` / `input` to `Write` / `Ask for`- `main` - Main function template

- Updated project templates to use v0.5.2 syntax with phrasal expressions- `set` - Variable assignment

- Modified completion provider to suggest v0.5.2 constructs- `var` - Variable declaration

- Updated snippets to match modern PohLang syntax- `if`/`ifelse` - Conditional statements

- `while`/`for` - Loop structures

### Fixed- `print` - Print statement

- Runtime detection now uses `--run` flag for Rust runtime (v0.5.2)- `input` - Input statement

- File execution properly spawns pohlang.exe with correct arguments- Arithmetic operations (`add`, `sub`, `mul`, `div`)

- IntelliSense now provides accurate completions for current language version

### Technical Implementation

### Technical Details- TypeScript-based extension

- Extension ID: `pohlang.pohlang-hub`- Node.js child process integration for interpreter execution

- Minimum VS Code version: 1.70.0- VS Code language server protocol compliance

- Language ID: `pohlang`- Comprehensive error handling and validation

- File extensions: `.poh`- Cross-platform compatibility (Windows, macOS, Linux)

- Runtime: PohLang v0.5.2 (Rust-compiled)- Modular architecture with separated concerns



## [Unreleased]### Documentation

- Complete README with usage instructions

### Planned- Code examples and getting started guide

- Hover documentation for phrasal expressions- API documentation for extension development

- Go to definition for functions and variables- Contributing guidelines

- Find all references- MIT license

- Rename symbol refactoring

- Code formatting provider### Development Tools

- Debugger integration- TypeScript compilation setup

- Interactive playground- ESLint configuration

- More example projects- Build and packaging scripts

- VS Code launch configuration for debugging

---- Extension development host support



For full documentation, visit: https://github.com/pohlang/pohlang-hub---


## Version Schema

- **Major** (X.0.0): Breaking changes, major new features
- **Minor** (0.X.0): New features, backwards compatible
- **Patch** (0.0.X): Bug fixes, small improvements

## Support

For questions, issues, or feature requests:
- [GitHub Issues](https://github.com/pohlang/pohlang-hub/issues)
- [GitHub Discussions](https://github.com/pohlang/pohlang-hub/discussions)