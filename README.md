<div align='center'>

# Super[Sesh!](https://en.wiktionary.org/wiki/sesh#:~:text=A%20session)

**a project created by [Cole Gawin](https://github.com/chroline)**

<img alt="Hosted on Heroku" src='https://img.shields.io/badge/hosted%20on-heroku-purple?logo=heroku&style=for-the-badge'>

<a href='https://supersesh.herokuapp.com'>

<img src='https://img.shields.io/badge/CHECK IT OUT-blue?style=for-the-badge'>

</a>

</div>

---

# Technical Overview

**SuperSesh** is built using the MERN (**M**ongoDB, **E**xpressJS, **R**eact, **N**ode.js) stack *sans* MongoDB (more on 
that in a bit). Here is a brief overview on the specifics of the implementation of the stack for this project:

- **MongoDB** is a NoSQL document-oriented database and is one of the defining features of the MERN stack. To replicate the 
nature of a MongoDB database, I opted to have a single native Javascript object act as the "database storage" for the 
project, and I created an asynchronous wrapper around this object to simulate the asynchronicity of a MongoDB database.
  - For the scope of this project, I was focused on getting a working MVP that can be deployed publicly. I therefore 
    chose not to use an actual MongoDB database, and instead implemented the mock database previously described. 
    However, this mock database is abstracted such that MongoDB can eventually be implemented without having to re-
    implement the rest of the features in the project.
- **ExpressJS** is a backend web application framework for Node.js that handles HTTP requests to the web application. In 
conjunction with [Socket.IO](https://socket.io), the backend application powering SuperSesh handles both one-way (HTTP GET) 
requests and two-way (Socket.IO channels) connections.
- **React** is a front-end library for creating web interfaces and applications. This project makes use of 
[Next.js](https://nextjs.org), a framework built on-top of React that handles SSR (server-side rendering), production 
bundling, and client-side routing. SuperSesh uses a custom server powered by ExpressJS (as previously explained) that 
allows the project to use Next.js and Socket.IO in the same application.
- **Node.js** is the Javascript runtime environment used by SuperSesh. Since this project is coded entirely in 
Typescript, a typed superset of Javascript, the codebase is compiled from Typescript to Javascript before executing.

