# mog-vscode

EXPERIMENTAL: Extension for Visual Studio Code

## Dependencies

- vsce: `npm install -g vsce`

## Installation

```
git clone git@github.com:mogproject/mog-vscode.git
cd mog-vscode
npm install
vsce package
```

- Install `mog-vscode-x.x.x.vsix` in VS Code.
  - Press `Ctrl+Shift+P` to launch the command pallete.
  - Run `Extentions: Install from VSIX...` and choose the `.vsix` file.

## Update

```
git pull
npm install
vsce package
```

- Install `mog-vscode-x.x.x.vsix` in VS Code.

## Development

- Run `generate-packagejson.py` to keep `package.json` up to date.
