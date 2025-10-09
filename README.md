# PohLang Hub - VS Code Extension# PohLang Hub - VS Code Extension



![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)

![PohLang](https://img.shields.io/badge/PohLang-v0.5.2-success.svg)![PohLang](https://img.shields.io/badge/PohLang-v0.5.2-success.svg)

![License](https://img.shields.io/badge/license-MIT-green.svg)![License](https://img.shields.io/badge/license-MIT-green.svg)



The official Visual Studio Code extension for **PohLang v0.5.2** - a human-friendly programming language powered by a Rust runtime that bridges the gap between natural language and code.The official Visual Studio Code extension for **PohLang v0.5.2** - a human-friendly programming language powered by a Rust runtime that bridges the gap between natural language and code.



> **PohLang - Programming that reads like prose**> **PohLang - Programming that reads like prose**



## ✨ Features## Features



### 🎨 Full PohLang v0.5.2 Syntax Support### 🎨 Syntax Highlighting

- Program blocks (`Start Program` / `End Program`)- Full syntax highlighting for PohLang (`.poh`) files

- Modern keywords (`If`, `Otherwise`, `While`, `Make`, etc.)- Support for keywords, functions, variables, strings, numbers, and comments

- **20 phrasal built-in expressions** (e.g., `total of`, `make uppercase`, `join...with`)- Proper color coding for different language constructs

- **Dual operator syntax**: Symbolic (`+`, `-`, `==`) and phrasal (`plus`, `minus`, `is equal to`)

- Comprehensive syntax highlighting### 📝 Code Snippets

- Pre-built snippets for common PohLang patterns

### 🚀 Rust Runtime Integration- Function definitions (`func`, `main`)

- Executes `.poh` files with **Rust-compiled runtime (v0.5.2)**- Variable assignments (`set`, `var`)

- Fast, compiled performance- Control structures (`if`, `ifelse`, `while`, `for`)

- Press `Ctrl+F5` to run current file- Arithmetic operations (`add`, `sub`, `mul`, `div`)

- Automatic runtime detection- Built-in functions (`print`, `input`)



### 💡 IntelliSense & Auto-Completion### 🔍 IntelliSense & Autocompletion

- Smart completions for all keywords and control structures- Smart autocompletion for PohLang keywords

- 20 phrasal expressions with parameter hints- Function and variable suggestions

- Function and variable snippets- Built-in function completions with parameter hints

- Both operator styles (symbolic & phrasal)- Operator completions with natural language syntax



### 📝 40+ Code Snippets### ⚡ Code Execution

Ready-to-use templates for:- **Run File** (Ctrl+F5): Execute current `.poh` file

- Program structure, control flow, functions- Integrated terminal output

- All 20 phrasal expressions- Error reporting and diagnostics

- Variables, operators, I/O- Support for interpreter arguments



### 🛠️ Project Management### 🛠️ Project Management

- Create projects with modern PohLang v0.5.2 templates- **Create Project**: Scaffold new PohLang projects

- Manage runtime versions- **Update Language**: Download and install latest interpreter

- SDK update commands- Project templates with sample code



## 📥 Installation### 🔧 Diagnostics

- Real-time syntax validation

1. Install from VS Code Marketplace (search "PohLang Hub")- Error highlighting in Problems panel

2. Run **"PL-Hub: Update Language"** to download Rust runtime- Warning and error messages from interpreter

3. Start coding!- Line-specific error reporting



## 🚀 Quick Start## Installation



Create a new `.poh` file and type `program` + `Tab`:### From VS Code Marketplace

1. Open VS Code

```pohlang2. Go to Extensions (Ctrl+Shift+X)

Start Program3. Search for "PohLang Hub"

    Write "Hello, PohLang!"4. Click Install

End Program

```### Manual Installation

1. Download the `.vsix` file from the releases page

Press `Ctrl+F5` to run!2. Open VS Code

3. Press Ctrl+Shift+P and type "Extensions: Install from VSIX"

## 📚 Examples4. Select the downloaded file



### Hello World## Getting Started

```pohlang

Start Program### 1. Create Your First PohLang Project

    Write "Hello, World!"- Open Command Palette (Ctrl+Shift+P)

    Make name = Ask for "Your name? "- Run "PL-Hub: Create Project"

    Write "Hi, "- Choose a directory and project name

    Write name- Start coding in `src/main.poh`

End Program

```### 2. Write PohLang Code

```pohlang

### Phrasal Expressions (v0.5.2 Feature)# Hello World in PohLang

```pohlangmake function main:

Start Program    print "Hello, PohLang World!"

    # Math    

    Make nums = [10, 20, 30, 40, 50]    set name to input "What's your name? "

    Make sum = total of nums    print "Nice to meet you, " + name + "!"

    Make min = smallest in nums

    Make max = largest in nums# Run the main function

    Write sum  # 150main()

    ```

    # Strings

    Make text = "  hello  "### 3. Run Your Code

    Make clean = trim spaces from text- Open a `.poh` file

    Make upper = make uppercase clean- Press Ctrl+F5 or use "PL-Hub: Run File" from Command Palette

    Write upper  # HELLO- View output in the integrated terminal

    

    # Collections## Commands

    Make first = first in nums

    Make count = count of numsAll commands are available from the Command Palette (Ctrl+Shift+P):

    Write first  # 10

    Write count  # 5| Command | Description | Shortcut |

End Program|---------|-------------|----------|

```| `PL-Hub: Run File` | Execute the current .poh file | Ctrl+F5 |

| `PL-Hub: Create Project` | Create a new PohLang project | - |

### Control Flow| `PL-Hub: Update Language` | Update the PohLang interpreter | - |

```pohlang

Start Program## Language Features

    Make age = 21

    ### Keywords

    If age >= 18:- `make`, `set`, `to`, `is`

        Write "Adult"- `function`, `return`

    Otherwise:- `if`, `else`, `while`, `for`

        Write "Minor"- `and`, `or`, `not`

    End If- `true`, `false`, `null`

    

    Make i = 0### Data Types

    While i < 3:- Strings: `"hello"`, `'world'`

        Write i- Numbers: `42`, `3.14`

        Increase i by 1- Booleans: `true`, `false`

    End While- Null: `null`

    

    Repeat 2:### Operators

        Write "Hi!"- Arithmetic: `plus`, `minus`, `times`, `divided by`

    End- Comparison: `equals`, `greater than`, `less than`

End Program- Logical: `and`, `or`, `not`

```

### Built-in Functions

### Functions- `print(message)` - Display output

```pohlang- `input(prompt)` - Get user input

Start Program- `length(string)` - Get string length

    Make greet with name:- `type(variable)` - Get variable type

        Write "Hello, "- `convert(value, type)` - Type conversion

        Write name

    End## Configuration

    

    greet("Alice")### File Associations

    greet("Bob")The extension automatically associates `.poh` files with PohLang language mode.

End Program

```### Settings

Currently, no additional configuration is required. The extension works out of the box.

## 🎯 20 Phrasal Built-in Expressions

## Requirements

| Category | Expressions |

|----------|-------------|- VS Code 1.70.0 or higher

| **Math** | `total of`, `smallest in`, `largest in`, `absolute value of`, `round`, `round down`, `round up` |- Node.js (for development)

| **String** | `make uppercase`, `make lowercase`, `trim spaces from` |- PohLang interpreter (included as placeholder)

| **Collection** | `first in`, `last in`, `reverse of`, `count of`, `join...with`, `split...by`, `contains...in`, `remove...from`, `append...to`, `insert...at` |

## Extension Development

## ⌨️ Commands

### Setup

Access via Command Palette (`Ctrl+Shift+P`):```bash

# Clone the repository

- **PL-Hub: Run File** (`Ctrl+F5`) - Execute current `.poh` filegit clone https://github.com/pohlang/pohlang-hub.git

- **PL-Hub: Create Project** - Scaffold new PohLang projectcd pohlang-hub

- **PL-Hub: Update Language** - Download latest runtime

- **PL-Hub: Run Environment Example** - Test installation# Install dependencies

- **PL-Hub: Show SDK Versions** - Display installed versionsnpm install



## ⚙️ Configuration# Compile TypeScript

npm run compile

Settings (search "PohLang" in settings):

# Run in development mode

| Setting | Default | Description |code .

|---------|---------|-------------|# Press F5 to launch extension development host

| `pohlangHub.pohlangRepo` | `AlhaqGH/PohLang` | PohLang releases repo |```

| `pohlangHub.autoUpdate` | `true` | Auto-check updates |

| `pohlangHub.updateIntervalDays` | `7` | Days between checks |### Building

```bash

## 🔧 Requirements# Compile

npm run compile

- VS Code 1.70.0+

- PohLang Runtime v0.5.2 (auto-downloaded)# Package extension

vsce package

## 🐛 Troubleshooting```



**"PohLang interpreter not found"**: Run **"PL-Hub: Update Language"**### Testing

```bash

**Code doesn't run**: Check Output panel, ensure `.poh` extension# Run tests

npm test

**Old syntax**: Update runtime to v0.5.2

# Lint code

## 📖 Resourcesnpm run lint

```

- [PohLang Guide](https://github.com/AlhaqGH/PohLang/blob/main/PohLang_Guide.md)

- [Vocabulary](https://github.com/AlhaqGH/PohLang/blob/main/spec/Vocabulary.md)## File Structure

- [Examples](https://github.com/AlhaqGH/PohLang/tree/main/examples/poh)

- [GitHub](https://github.com/pohlang/pohlang-hub)```

pohlang-hub/

## 📋 Release Notes├── src/

│   ├── extension.ts          # Main entry point

### 0.1.0 (Initial Release)│   ├── commands/             # VS Code commands

- Full PohLang v0.5.2 support│   │   ├── runFile.ts

- 40+ snippets│   │   ├── createProject.ts

- IntelliSense with 20 phrasal expressions│   │   └── updateLanguage.ts

- Rust runtime integration│   ├── language/             # Language support

- Project scaffolding│   │   ├── diagnostics.ts

- SDK management│   │   └── completion.ts

│   └── utils/                # Utilities

## 📄 License│       └── processUtils.ts

├── syntaxes/

MIT License - see [LICENSE](LICENSE)│   └── pohlang.tmLanguage.json

├── snippets/

## 💬 Support│   └── pohlang.json

├── bin/

- [Issues](https://github.com/pohlang/pohlang-hub/issues)│   └── pohlang              # Interpreter binary

- [Discussions](https://github.com/AlhaqGH/PohLang/discussions)├── package.json

├── tsconfig.json

---└── README.md

```

**Made with ❤️ for the PohLang community**

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