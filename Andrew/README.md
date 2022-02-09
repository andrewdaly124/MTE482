### Info

First you need to install node.

### **_debugging the app in web (my preferred testing method. does not preserve window size though)_**

`cd` to  `Andrew/andrews-app` and run the following commands in order:

```
npm i
npm start
```

### **_Building and running the app in prod (full build, preserves window size)_**

`cd` to  `Andrew/andrews-app` and run the following commands in order:

```
npm i
npm run elecbuild
```

then navigate to the new `dist` folder and run the setup executable. Done!

### **_Debugging (preserves window size)_**

```
npm i
npm run elecserve
```
