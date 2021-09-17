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

## *Key Takeaways*

1. This project uses a modified MERN stack.
   1. The backend is able to handle both one-way and two-way communication with the client due to ExpressJS and 
      Socket.IO.
   2. The frontend application is managed by Next.js which handles SSR and other high-level features.
2. This project is structured as a monorepo codebase that contains code used in both the client- and server-side.
3. [Chakra UI](https://chakra-ui.com) is used as a base component library for stylistic purposes. 
   1. A custom theme was created with a custom font choices and colors.
   2. SCSS was used to style the nprogress loading indicator.

## MERN Stack

**SuperSesh** is built using the MERN (**M**ongoDB, **E**xpressJS, **R**eact, **N**ode.js) stack *sans* MongoDB (more 
on that in a bit). Here is a brief overview on the specifics of the implementation of the stack for this project:

- **MongoDB** is a NoSQL document-oriented database and is one of the defining features of the MERN stack. To replicate 
  the nature of a MongoDB database, I opted to have a single native Javascript object act as the "database storage" for 
  the project, and I created an asynchronous wrapper around this object to simulate the asynchronicity of a MongoDB 
  database.
  - For the scope of this project, I was focused on getting a working MVP that can be deployed publicly. I therefore 
    chose not to use an actual MongoDB database, and instead implemented the mock database previously described. 
    However, [this mock database is abstracted](https://github.com/chroline/supersesh/blob/main/src/server/database/store.ts) 
    such that MongoDB can eventually be   implemented without having to re-implement the rest of the features in the 
    project.
- **ExpressJS** is a backend web application framework for Node.js that handles HTTP requests to the web application. 
  In conjunction with [Socket.IO](https://socket.io), the backend application powering SuperSesh handles both one-way 
  (HTTP GET) requests and two-way (Socket.IO channels) connections.
- **React** is a front-end library for creating web interfaces and applications. This project makes use of 
  [Next.js](https://nextjs.org), a framework built on-top of React that handles SSR (server-side rendering), production 
  bundling, and client-side routing. SuperSesh uses a custom server powered by ExpressJS (as previously explained) that 
  allows the project to use Next.js and Socket.IO in the same application.
- **Node.js** is the Javascript runtime environment used by SuperSesh. Since this project is coded entirely in 
  Typescript, a typed superset of Javascript, the codebase is compiled from Typescript to Javascript before executing.

## Monorepo

This project is structured as a monorepo containing code that is used both client- and server-side within the `src` 
directory. All the client code is within the `src/client` directory, all the server code is within the 
`src/server` directory, and all shared utility types (interfaces, enums, etc.) used in both the client and server code 
are within the `src/shared` directory.

## Styling

To make SuperSesh look as polished as possible, it uses Chakra UI as a base component library since it provides a lot 
of highly functional components that are equally customizable. To that extent, a custom theme was created to give the 
project some extra flare.

- The font used in this project is [Calibre by Klim Type Foundry](https://klim.co.nz/retail-fonts/calibre/).
- The theme used in this project is based off [this base theme](https://gist.github.com/chroline/6256f6ca9db5d147683445d65c00d7e8).

Additionally, this project uses [NProgress](https://github.com/rstacruz/nprogress) to display page loading progress to the user. SCSS is used to provide custom styling to the NProgress loading indicator that matches the brand of SuperSesh.
