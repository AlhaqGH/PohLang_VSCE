# PohLang Hub - VS Code Extension

![PohLang Hub](https://img.shields.io/badge/PohLang-Hub-blue.svg)
![VS Code](https://img.shields.io/badge/VS%20Code-Extension-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.7+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

VS Code extension that integrates the PohLang interpreter into Visual Studio Code, providing syntax highlighting, code snippets, diagnostics, and execution capabilities for `.poh` files.

## Features

### 🎨 Syntax Highlighting
- Full syntax highlighting for PohLang (`.poh`) files
- Support for keywords, functions, variables, strings, numbers, and comments
- Proper color coding for different language constructs

### 📝 Code Snippets
- Pre-built snippets for common PohLang patterns
- Function definitions (`func`, `main`)
- Variable assignments (`set`, `var`)
- Control structures (`if`, `ifelse`, `while`, `for`)
- Arithmetic operations (`add`, `sub`, `mul`, `div`)
- Built-in functions (`print`, `input`)

### 🔍 IntelliSense & Autocompletion
- Smart autocompletion for PohLang keywords
- Function and variable suggestions
- Built-in function completions with parameter hints
- Operator completions with natural language syntax

### ⚡ Code Execution
- **Run File** (Ctrl+F5): Execute current `.poh` file
- Integrated terminal output
- Error reporting and diagnostics
- Support for interpreter arguments

### 🛠️ Project Management
- **Create Project**: Scaffold new PohLang projects
- **Update Language**: Download and install latest interpreter
- Project templates with sample code

### 🔧 Diagnostics
- Real-time syntax validation
- Error highlighting in Problems panel
- Warning and error messages from interpreter
- Line-specific error reporting

## Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "PohLang Hub"
4. Click Install

### Manual Installation
1. Download the `.vsix` file from the releases page
2. Open VS Code
3. Press Ctrl+Shift+P and type "Extensions: Install from VSIX"
4. Select the downloaded file

## Getting Started

### 1. Create Your First PohLang Project
- Open Command Palette (Ctrl+Shift+P)
- Run "PL-Hub: Create Project"
- Choose a directory and project name
- Start coding in `src/main.poh`

### 2. Write PohLang Code
```pohlang
# Hello World in PohLang
make function main:
    print "Hello, PohLang World!"
    
    set name to input "What's your name? "
    print "Nice to meet you, " + name + "!"

# Run the main function
main()
```

### 3. Run Your Code
- Open a `.poh` file
- Press Ctrl+F5 or use "PL-Hub: Run File" from Command Palette
- View output in the integrated terminal

## Commands

All commands are available from the Command Palette (Ctrl+Shift+P):

| Command | Description | Shortcut |
|---------|-------------|----------|
| `PL-Hub: Run File` | Execute the current .poh file | Ctrl+F5 |
| `PL-Hub: Create Project` | Create a new PohLang project | - |
| `PL-Hub: Update Language` | Update the PohLang interpreter | - |

## Language Features

### Keywords
- `make`, `set`, `to`, `is`
- `function`, `return`
- `if`, `else`, `while`, `for`
- `and`, `or`, `not`
- `true`, `false`, `null`

### Data Types
- Strings: `"hello"`, `'world'`
- Numbers: `42`, `3.14`
- Booleans: `true`, `false`
- Null: `null`

### Operators
- Arithmetic: `plus`, `minus`, `times`, `divided by`
- Comparison: `equals`, `greater than`, `less than`
- Logical: `and`, `or`, `not`

### Built-in Functions
- `print(message)` - Display output
- `input(prompt)` - Get user input
- `length(string)` - Get string length
- `type(variable)` - Get variable type
- `convert(value, type)` - Type conversion

## Configuration

### File Associations
The extension automatically associates `.poh` files with PohLang language mode.

### Settings
Currently, no additional configuration is required. The extension works out of the box.

## Requirements

- VS Code 1.70.0 or higher
- Node.js (for development)
- PohLang interpreter (included as placeholder)

## Extension Development

### Setup
```bash
# Clone the repository
git clone https://github.com/pohlang/pohlang-hub.git
cd pohlang-hub

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Run in development mode
code .
# Press F5 to launch extension development host
```

### Building
```bash
# Compile
npm run compile

# Package extension
vsce package
```

### Testing
```bash
# Run tests
npm test

# Lint code
npm run lint
```

## File Structure

```
pohlang-hub/
├── src/
│   ├── extension.ts          # Main entry point
│   ├── commands/             # VS Code commands
│   │   ├── runFile.ts
│   │   ├── createProject.ts
│   │   └── updateLanguage.ts
│   ├── language/             # Language support
│   │   ├── diagnostics.ts
│   │   └── completion.ts
│   └── utils/                # Utilities
│       └── processUtils.ts
├── syntaxes/
│   └── pohlang.tmLanguage.json
├── snippets/
│   └── pohlang.json
├── bin/
│   └── pohlang              # Interpreter binary
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Issues](https://github.com/pohlang/pohlang-hub/issues)
- [Discussions](https://github.com/pohlang/pohlang-hub/discussions)
- [Documentation](https://github.com/pohlang/pohlang-hub/wiki)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

---

**Enjoy coding with PohLang! 🚀**