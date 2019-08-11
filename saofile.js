const { join } = require("path");
const superb = require("superb");
const glob = require("glob");
const spawn = require("cross-spawn");
const validate = require("validate-npm-package-name");

const rootDir = __dirname;

module.exports = {
  prompts: [
    {
      name: "name",
      message: "Project name",
      default: "{outFolder}"
    },
    {
      name: "description",
      message: "Project description",
      default: `My ${superb()} Rapin App`
    },
    {
      name: "author",
      type: "string",
      message: "Author name",
      default: "{gitUser.name}",
      store: true
    },
    {
      name: "template",
      message: "Choose a template engine",
      choices: ["twig", "pug", "mustache"],
      type: "list",
      default: "twig"
    },
    {
      name: "stylesheet",
      message: "Choose a stylesheet engine",
      choices: ["postcss"],
      type: "list",
      default: "postcss"
    },
    {
      name: "typeorm",
      message: "Install typeorm plugin",
      choices: ["true", "false"],
      type: "list",
      default: "false"
    },
    {
      name: "dbType",
      message: "Install auth plugin",
      choices: ["mysql", "mongodb"],
      type: "list",
      default: "false",
      when: answers => answers.typeorm === "true"
    },
    {
      name: "dbUrl",
      message: "Database url",
      when: answers => answers.dbType === "mongodb"
    },
    {
      name: "dbAuthSource",
      message: "Database Auth Source",
      when: answers => answers.dbType === "mongodb"
    },
    {
      name: "dbReplicaSet",
      message: "Database Replica Set",
      when: answers => answers.dbType === "mongodb"
    },
    {
      name: "dbName",
      message: "Database name",
      when: answers => answers.dbType === "mysql"
    },
    {
      name: "dbHostname",
      message: "Database hostname",
      default: "locahost",
      when: answers => answers.dbType === "mysql"
    },
    {
      name: "dbPort",
      message: "Database port",
      default: "3306",
      when: answers => answers.dbType === "mysql"
    },
    {
      name: "dbUsername",
      message: "Database username",
      default: "root",
      when: answers => answers.dbType === "mysql"
    },
    {
      name: "dbPassword",
      message: "Database password",
      when: answers => answers.dbType === "mysql"
    },
    {
      name: "auth",
      message: "Install auth plugin",
      choices: ["true", "false"],
      type: "list",
      default: "false",
      when: answers => answers.typeorm === "true"
    },
    {
      name: "mail",
      message: "Enable mail service",
      choices: ["true", "false"],
      type: "list",
      default: "false"
    },
    {
      name: "mailService",
      message: "Service for send mails",
      choices: ["gmail", "yandex", "yahoo", "hotmail"],
      type: "list",
      default: "gmail",
      when: answers => answers.mail === "true"
    },
    {
      name: "mailUser",
      message: "Mail user",
      when: answers => answers.mail === "true"
    },
    {
      name: "mailPassword",
      message: "Mail password",
      when: answers => answers.mail === "true"
    },
    {
        name: "inky",
        message: "Install inky plugin",
        choices: ["true", "false"],
        type: "list",
        default: "false",
        when: answers => answers.mail === "true"
      },
    {
      name: "pm",
      message: "Choose a package manager",
      choices: ["yarn", "npm"],
      type: "list",
      default: "yarn"
    }
  ],
  templateData() {
    const inky = this.answers.inky == "true" ? true : false;
    const typeorm = this.answers.typeorm == "true" ? true : false;
    const auth = this.answers.auth == "true" ? true : false;
    const mail = this.answers.mail == "true" ? true : false;

    return {
      inky,
      typeorm,
      auth,
      mail
    };
  },
  actions() {
    const validation = validate(this.answers.name);
    validation.warnings &&
      validation.warnings.forEach(warn => {
        console.warn("Warning:", warn);
      });
    validation.errors &&
      validation.errors.forEach(err => {
        console.error("Error:", err);
      });
    validation.errors && validation.errors.length && process.exit(1);

    const actions = [
      {
        type: "add",
        files: "**",
        templateDir: "template/rapin"
      }
    ];

    if (this.answers.auth == "true") {
        actions.push({
          type: "add",
          files: "**",
          templateDir: "template/framework/auth"
        });
      }

    if (this.answers.typeorm == "true") {
      actions.push({
        type: "add",
        files: "**",
        templateDir: "template/framework/typeorm"
      });
    }

    actions.push({
      type: "add",
      files: "**",
      templateDir: "template/framework/" + this.answers.template
    });

    actions.push({
      type: "add",
      files: "*"
    });

    actions.push({
      type: "move",
      patterns: {
        gitignore: ".gitignore",
        "_package.json": "package.json",
        "_tsconfig.json": "tsconfig.json"
      }
    });

    return actions;
  },
  async completed() {
    this.gitInit();

    await this.npmInstall({ npmClient: this.answers.pm })

    const isNewFolder = this.outDir !== process.cwd();
    const cd = () => {
      if (isNewFolder) {
        console.log(`\t${this.chalk.cyan("cd")} ${this.outFolder}`);
      }
    };

    console.log();
    console.log(this.chalk.bold(`  To get started:\n`));
    cd();
    console.log(`\t${this.answers.pm} run dev\n`);
    console.log(this.chalk.bold(`  To start for production:\n`));
    cd();
    console.log(`\t${this.answers.pm} start`);

    console.log();
  }
};
