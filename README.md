# Registro de hospital - Nativo Digital
CRUD para alta de pacientes de un hospital que conforma la prueba técnica para proceso de reclutamiento de Nativo Digital

## Instalación

### Base de datos
1. Para instalar la base de datos necesita tener instalado [mysql](https://www.mysql.com/downloads/)
2. Ejecutar el [script](./database/hospital.sql) de creación de registros de hospital para llenar la base de datos con información de prueba.
>Nota: Si es necesario, modifique el nombre o la contraseña del usuario de la base de datos en el archivo [env](./backend/.env) 

### Backend
1. Para poder ejecutar correctamente el servidor necesita tener instalado [node.js](https://nodejs.org/es/).
2. Entrar a la carpeta backend y abrir la línea de comandos.
3. Ejecutar los siguientes comandos:
```  
npm install
```
```
npx prisma init --datasource-provider mysql
```
```
npx prisma migrate dev --name init
```
npm run dev

### Frontend
1. Entrar a la carpeta frontend y abrir la línea de comandos.
2. Ejecutar el comando:
```
npm run dev
```
4. En el navegador, entrar a la siguiente ruta: [localhost:3001](http://localhost:3001)
