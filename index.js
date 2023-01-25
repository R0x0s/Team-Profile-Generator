const generateHTML = require("./src/generateHTML");
// packages needed for the application
const inquirer = require("inquirer");
const fs = require("fs");
//employee profiles
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const teamArray = [];

const addManager = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        message: "Hello team manager! What is your name?",
        name: "name",
      },
      {
        type: "input",
        message: "What is your employee ID number?",
        name: "id",
      },
      {
        type: "input",
        message: "What is your email address?",
        name: "email",
      },
      {
        type: "input",
        message: "What is your office number?",
        name: "officeNumber",
      },
    ])
    .then((managerInput) => {
      const { name, id, email, officeNumber } = managerInput;
      const manager = new Manager(name, id, email, officeNumber);
      teamArray.push(manager);
    });
};

const addEmployee = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        message:
          "Let's add people to your team. Please select your employee's role.",
        choices: ["Engineer", "Intern"],
        name: "role",
      },
      {
        type: "input",
        message: "What is the name of the employee?",
        name: "name",
      },
      {
        type: "input",
        message: "What is their employee ID number?",
        name: "id",
      },
      {
        type: "input",
        message: "What is their email address?",
        name: "email",
      },
      {
        type: "input",
        message: "What is their GitHub username?",
        when: (input) => input.role === "Engineer",
        name: "github",
      },
      {
        type: "input",
        message: "What school does the intern attend?",
        when: (input) => input.role === "Intern",
        name: "school",
      },
      {
        type: "confirm",
        message: "Would you like to add more employees to your team?",
        default: false,
        name: "confirmEmployee",
      },
    ])

    .then((employeeData) => {
      let { name, id, email, role, github, school, confirmEmployee } =
        employeeData;
      let employee;

      if (role === "Engineer") {
        employee = new Engineer(name, id, email, github);
      } else if (role === "Intern") {
        employee = new Intern(name, id, email, school);
      }
      teamArray.push(employee);

      if (confirmEmployee) {
        return addEmployee(teamArray);
      } else {
        return teamArray;
      }
    });
};
//function to write the HTML
//writeFileSync
const writeFile = (data) => {
  fs.writeFile("./dist/index.html", data, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("Your team profile has been generated!");
    }
  });
};

addManager()
  .then(addEmployee)
  .then((teamArray) => {
    return generateHTML(teamArray);
  })
  .then((pageHTML) => {
    return writeFile(pageHTML);
  })
  .catch((err) => {
    console.log(err);
  });
