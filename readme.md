![](./logo.png)

# Wise

## Description

Wise is a productive tool for manage your plans and targets.As its name saying, you are expected to manage your life and work as a wise (wo)man.

![](./MainWin.png)
![](./PinWin.png)
The main features of wise:

1. Tree struct data manage
2. Markdown support
3. Pin your plan on your desktop

## TODO

- [x] Node order changable
- [ ] Display your plans as tree
- [ ] Chinese support
- [ ] React markdown plugin to enable more sytnx
- [ ] Windows and Intel MacOS support

### Bugs

- [x] Logout then login will not refresh the node state
  - It will reload now.
- [x] How to maintain the communicate with electron
  - IpcRender post message to get port now

### 🙁 Oops, I have no capability to do

- [ ] I need my real-time render markdown

### Features

- [x] Locally saved (use [sqlite3](https://www.npmjs.com/package/sqlite3))
- [x] Order changable and rename convenient
- [x] Drag doesn't work after once drag.
- [x] Resize the pin card
- [x] Sync both of the windows
- [ ] More easy to identify the complete / Muti Radio Button To arhieve
- [ ] Able to restore the pin win
- [ ] Auto format the markdown
- [ ] Special component to useHistory
- [ ] Themes
- [ ] Bookmarks
- [ ] Calendar Record Your leraning
- [ ] A Explore place
- [x] Show titlebar
- [x] Auto open the pin window when pin.(Single Mode)
- [x] Click icon to open the main window
- [x] Default Select Node (And switch page should reset it)

## Develop

Install all dependencies

```bash
yarn
# generate all workspace
yarn build
```

Start server

```bash
# start watch changes
yarn watch
# start main win react project
yarn workspace @wise/app dev
# start pin win react project
yarn workspace @wise/pin dev
# start electron
yarn workspace @wise/electron dev
```

# Licensen

MIT
