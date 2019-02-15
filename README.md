# <sub><sup><sub><sup>dxlibs-</sup></sub></sup></sub>waitfs <sub><sup><sub><sup>v0.1.0</sup></sub></sup></sub>
~~~
Espera por la existencia o eliminación de un archivo
~~~

## Scripts
```powershell
npm run eslint
```
```powershell
npm test
```
```powershell
npm run test-watch
```
```powershell
npm run sonar
```

## Instalación

### Como libreria
```powershell
npm install --save dxlibs-waitfs
```

## Modo de uso

```javascript
const wait = require("dxlibs-waitfs");
const filename = './archivo.txt';
const timeout = 10000;

wait
    .forCreate(filename, timeout)
    .then(ok => {
        if(!ok) throw new Error('Timeout!');

        console.log(`${filename} existe!`);
        return ok;
    })
    .catch(ex => {
        console.log(`ERROR: ${err}`);
    });

wait
    .forRemove(filename, timeout)
    .then(ok => {
        if(!ok) throw new Error('Timeout!');

        console.log(`${filename} fue eliminado!`);
        return ok;
    })
    .catch(ex => {
        console.log(`ERROR: ${err}`);
    });
```
---
