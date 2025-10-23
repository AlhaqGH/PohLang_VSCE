# Change Log

All notable changes to the PohLang VS Code extension will be documented in this file.


## [0.6.6] - 2025-10-23

### Changed - Runtime v0.6.6 Support
- Updated for PohLang Runtime v0.6.6 with Phase 8 Optimizations Complete
- Version synchronized with PohLang runtime for clarity

### Runtime Features (v0.6.6)
- **Inline Caching**: 256-slot cache for fast global variable access
- **Enhanced Error Messages**: Source line number tracking for better debugging  
- **VM Statistics**: Comprehensive profiling with \--stats\ flag
- **Optimizations**: Constant folding, instruction fusion, dead code elimination
- **Performance**: Significant speedup through advanced VM optimizations

### Language Support Features
- Syntax highlighting for all PohLang constructs
- IntelliSense and code completion
- 50+ code snippets for faster coding
- Error detection and validation
- Symbol navigation and outline

### Notes
- This extension provides LANGUAGE SUPPORT ONLY (syntax, IntelliSense, snippets)
- For runtime execution, project management, and SDK tools, install the **PLHub** extension
- Both extensions work together for the complete PohLang development experience
- Fully backward compatible with previous PohLang versions

### Version Alignment
- PohLang Language Extension: v0.6.6
- PohLang Runtime: v0.6.6
- PLHub SDK: v0.6.0
- PLHub Extension: v0.2.5

---


## [0.3.2] - 2025-10-12

### Fixed - Critical: Removed Runtime Commands
- **REMOVED all runtime commands**: No more pohlang.runFile, pohlang.createProject, etc.
- **REMOVED all menus**: Context menus and command palette entries removed
- **REMOVED all keybindings**: Ctrl+F5 now handled by PLHub extension only
- **REMOVED all configuration**: SDK settings moved to PLHub extension
- **This extension is now PURELY language support** (syntax, IntelliSense, snippets)

### Why This Change?
- Previous version had duplicate commands that conflicted with PLHub extension
- Error: "command 'pohlang.runFile' not found" when trying to run files
- Language extension should ONLY provide language features, not runtime execution
- All runtime features now exclusively in PLHub extension

### What This Means
- **Language Extension**: Syntax highlighting + IntelliSense ONLY
- **PLHub Extension**: ALL runtime commands (required for execution)
- **Both needed**: Install both extensions for full functionality

---
All notable changes to the PohLang VS Code extension will be documented in this file.

## [0.3.1] - 2025-10-12

### Changed - Runtime v0.6.0 Support
- **Updated for PohLang v0.6.0**: Full support for latest runtime features
- **Phase 8 Optimizations**: Compatible with bytecode VM optimizations
- **Enhanced Error Messages**: Supports new error format with instruction pointers and suggestions
- **Better Performance**: Works with optimized runtime (5-10x faster)

### Technical Details
- Runtime compatibility: PohLang v0.6.0
- Phase 8 features: Constant folding, instruction fusion, peephole optimization, inline caching, enhanced errors
- Extension version: 0.3.1
- Language support remains unchanged (syntax highlighting, IntelliSense, etc.)

---
# Change Log

All notable changes to the PohLang VS Code extension will be documented in this file.

## [0.2.5] - 2025-10-11

### Added
- **🎯 Hover Information Provider** - Hover over keywords, functions, and variables to see documentation
  - Comprehensive documentation for 30+ keywords (Start, End, Make, Set, If, While, etc.)
  - Phrasal expression documentation (plus, minus, times, divided by, etc.)
  - File I/O operation docs (Phase 6 features)
  - Examples and syntax guides in hover tooltips
- **🔍 Signature Help Provider** - Parameter hints when typing function calls
  - Shows parameter names and descriptions while typing
  - Supports built-in phrasal expressions (join, split, contains, etc.)
  - Works with user-defined functions
- **✅ Enhanced Diagnostics** - Real-time error detection in Problems panel
  - Parses actual PohLang runtime error output
  - Multiple error format support (Error:, Error at line X:, Could not parse, etc.)
  - Shows errors, warnings, and hints with proper severity levels
  - Automatic validation on file change and save
- **💡 Improved IntelliSense** - Better code completion triggers
  - Now triggers on newline for better statement completion
  - Enhanced completion context awareness

### Changed
- **Diagnostics System** - Now validates using actual PohLang interpreter output instead of mock syntax checking
- **Error Messages** - Better error message parsing with line number detection
- **Completion Triggers** - Added newline trigger for improved suggestion experience

### Fixed
- Problems panel now shows actual PohLang errors instead of basic syntax checks
- Inline suggestions work correctly for all PohLang constructs
- Error line numbers correctly mapped to editor positions

### Technical
- Added `hover.ts` - Comprehensive hover documentation provider
- Added `signatureHelp.ts` - Function parameter hint provider  
- Enhanced `diagnostics.ts` - Real PohLang error output parsing
- Updated `extension.ts` - Registered new language providers
- ~400 lines of new language server features

## [0.2.0] - 2025-10-10

### Added
- **PohLang Runtime v0.5.4** - Updated bundled runtime with Phase 5 error handling
- **Error Handling Support** - Full support for try/catch/finally syntax
  - `try this:` blocks
  - `if error` / `if error as variable` catch handlers
  - `if error of type "ErrorType"` type-specific catching
  - `finally:` cleanup blocks
  - `end try` block terminator
- **Error Types** - 7 built-in error types: RuntimeError, TypeError, MathError, FileError, JsonError, NetworkError, ValidationError
- **Custom Errors** - Create and throw custom error types
- **Natural Error Messages** - English-like error messages with file location reporting
- **Error Operations** - `error of type X with message Y`, `error message of`, `error type of`

### Changed
- Updated runtime from v0.5.2 to v0.5.4
- Enhanced description with error handling features
- Version bump to 0.2.0 (minor version for new features)

### Technical
- Runtime binary updated with ~450 lines of error handling code
- Compatible with all existing v0.5.2 programs (fully backward compatible)
- File location reporting in error messages

## [0.1.1] - 2025-10-05

### Added
- Initial release with PohLang v0.5.2 runtime
- Syntax highlighting for `.poh` files
- IntelliSense with 40+ code snippets
- Bundled Rust runtime (no separate download needed)
- One-click execution with Ctrl+F5
- Support for all Phase 1 features:
  - Statements: Write, Ask for, Set, Increase, Decrease, Return
  - Control flow: If/Otherwise, While, Repeat loops
  - Functions with parameters and default values
  - Collections: Lists and Dictionaries
  - 20 phrasal built-in expressions
  - Symbolic operators (+, -, *, /, >, <, ==, !=)

### Features
- Complete IDE experience in VS Code
- Local operation (works offline)
- Cross-platform support
- Integrated terminal execution
