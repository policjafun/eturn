---
name: Technologies used to build eturn
description: If you ever wanted to build a discord bot, you might be interested in the technologies we used to build eturn.
image: /images/bunjs.png
date: 2024-06-22 15:00
author: fëenko
---

## Introduction

When creating eturn, we had to choose the right technologies to build it. We wanted to make sure that the bot is fast, reliable and easy to maintain. In this article, we will discuss the technologies we used to build eturn.

<br>

## Programming language

Our choice for the programming language was [TypeScript](https://www.typescriptlang.org). TypeScript is a superset of JavaScript that adds static typing to the language. This makes it easier to catch errors and write more maintainable code. TypeScript also compiles down to JavaScript, so it can run on any platform that supports JavaScript.

Instead of [Node.js](https://nodejs.org/), we decided to use [Bun](https://bun.sh/), a pretty new runtime for TypeScript. Bun does not require to compile TypeScript and supports it natively. It is also faster than Node.js and has a smaller memory footprint.

<br>

## Database

For the database, we used [PostgresQL](https://www.postgresql.org). PostgresQL is a powerful, open-source relational database system. We chose PostgresQL because it is fast, scalable, and has a rich set of features.

Under the hood, we used [Prisma](https://www.prisma.io) to interact with the database. Prisma is an open-source database toolkit that makes it easy to work with databases in TypeScript.

<br>

## Summary

-   We used **TypeScript** as the programming language for eturn, along with **Bun** as the runtime.
-   We chose **PostgresQL** as the database and used **Prisma** to interact with it.
