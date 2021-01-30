## Description

Journal Fitness is a full-stack web application that can be used to search different exercises and store those exercises on lists for future use.

### Features/Technologies:

This application contains local authorization (passport-local). The local authorization utilizes BCrypt to salt and hash user passwprds. Flash messages are utilized for alerting users of the various actions that they perform in the application. Sessions is also utilized to keep users logged in while using the application. Pages with content will not render without the user being logged in. Sequelize is used to create, MODIFY AND MIGRATE MODELS. EJS and EJS Layouts were utilized for back-end HTML. I utilized Bootstrap for basic CSS styling.

This application uses JavaScript, jQuery, Node.js, PostgreSQL, CSS, Bootstrap, etc.

### Application Link

https://journal-fitness.herokuapp.com/

### Install Application Locally

1. Fork this repository. The easiest way is to in use *git clone https://github.com/Patbenmi/journal_fitness.git*. Once done, open the folder.

2. Next, use the command *npm install* to download all necessary packages.

3. Add a local database by using the command *createdb (database name)*

4. Update *config.json* where database names are required.

5. Use the command *sequelize db:migrate*. 

6. Launch the application by using *nodemon*.

### Future Goals

- Update CSS to give the application a more professional feel. 

- Incorporate another API with videos so that users can see individuals performing the exercises they search.

- Allow users to compile exercises into workouts.

- Have names of individual commentators to render next to their comments.
