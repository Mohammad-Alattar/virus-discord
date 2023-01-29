import {
  ApplicationCommandDataResolvable,
  Client,
  Collection,
  ClientEvents,
} from "discord.js";
import { registerAppCommandsOptions } from "../interfaces/client";
import { Event } from "./event";
import globPromise from "../utils/globPromise";
import { Command } from "./command";
// @ts-ignore
import ascii from "ascii-table"


class Bot extends Client {
  public commands = new Collection<string, Command>();
  public buttons = new Collection<string, Command>()
  public selects = new Collection<string, Command>()
  public modal = new Collection<string, Command>()
  public subcommands = new Collection<string, Command>()
  public appcommands: ApplicationCommandDataResolvable[] = []
  public eventsTable = new ascii("Events").setJustify()
  public commandsTable = new ascii("Commands").setJustify()
  public subcommandsTable = new ascii("SubCommands").setJustify()
  start() {
    this.registerModules();
    this.login(process.env.botToken);
  }
  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async registerAppCommands({ commands, guildId }: registerAppCommandsOptions) {
    if (guildId) {
      this.guilds.cache.get(guildId)?.commands.set(commands);
    } else {
      this.application?.commands.set(commands);
      console.log(`Registered Commands ${commands.length}`);
    }
  }

  async getModals() {
    const modalFiles: string[] = await globPromise(
      `${__dirname}/../components/modals/*{.ts,.js}`
    )
    return modalFiles
  }

  async getSelects() {
    const selectFiles: string[] = await globPromise(
      `${__dirname}/../components/selects/*{.ts,.js}`
    )
    return selectFiles
  }
  async getButtons() {
    const buttonFiles: string[] = await globPromise(
      `${__dirname}/../components/buttons/*{.ts,.js}`
    )
    return buttonFiles
  }
  async getEvents() {
    const eventFiles: string[] = await globPromise(
      `${__dirname}/../events/*{.ts,.js}`
    );
    return eventFiles
  }

  async getCommands() {
    const commandFiles: string[] = await globPromise(
      `${__dirname}/../commands/*/*{.ts,.js}`
    );
    return commandFiles
  }
  async getCommandsDir() {
    const commandFiles: string[] = await globPromise(
      `${__dirname}/../commands/*/*/`
    );
    return commandFiles
  }
  async getSubCommands(group: string) {
    const commandFiles: string[] = await globPromise(
      `${__dirname}/../commands/*/${group}/*{.ts,.js}`
    );
    return commandFiles
  }


  async registerCommands() {
    const commandFiles = await this.getCommands()
    for (const filePath of commandFiles) {
      const _Command: new () => Command = await this.importFile(filePath);
      const command = new _Command();
      command.client = this;
      if (!command.name.length) throw new Error("Invalid Name: Name is empty");

      if (this.commands.has(command.name)) {
        this.eventsTable.addRow(command.name, "🔴 Error")
        throw new Error("Invalid Name: Duplicated name");
      }
      this.commands.set(command.name, command);
      this.appcommands.push(command.resolve());
      this.commandsTable.addRow(command.name, "🟢 Working")
    }

  }
  // async registerSubCommands() {
  //   const parentDir = await this.getCommandsDir()
  //   for (const dirPath of parentDir) {
  //     const commandName = parse(dirPath).base
  //     if (this.commands.has(commandName)) throw new Error(`${commandName} Already exist\nHINT: create index.js/ts in command folder to create it`)
  //     const subCommandsPaths = await this.getSubCommands(commandName)
  //     const command: ApplicationCommandDataResolvable = {
  //       name: commandName,
  //       description: "-",
  //       options: []
  //     }
  //     this.commandsTable.addRow(commandName, "🟢 Working")
  //     for (const subFile of subCommandsPaths) {
  //       const _SubCommand: new () => Command = await this.importFile(subFile);
  //       const subCommand = new _SubCommand();
  //       subCommand.client = this;
  //       if (!subCommand.name?.length) throw new Error("Invalid Name: Name is empty");
  //       console.log(subCommand.name)
  //       if (this.subcommands.has(subCommand.name)) {
  //         this.eventsTable.addRow(subCommand.name, "🔴 Error")
  //         throw new Error("Invalid Name: Duplicated name");
  //       }
  //       const subCommandObject = {
  //         name: subCommand.name,
  //         description: subCommand.description,
  //         type: 1,
  //         options: subCommand.options
  //       }
  //       command.options?.push(subCommandObject)
  //       this.subcommands.set(subCommand.name, subCommand);
  //       this.subcommandsTable.addRow(`${commandName} ${subCommand.name}`, "🟢 Working")
  //     }
  //     this.appcommands.push(command)
  //   }
  // }
  async registerEvents() {
    const eventFiles = await this.getEvents()
    for (const filePath of eventFiles) {
      const event: Event<keyof ClientEvents> = await this.importFile(filePath);
      try {
        if (event.once) {
          this.once(event.event, event.run)

        } else {
          this.on(event.event, event.run);
        }
        this.eventsTable.addRow(event.event, "🟢 Working")
      } catch (e) {
        this.eventsTable.addRow(event.event, "🔴 Error")
      }
    }
  }
  async registerModules() {
    await this.registerEvents()
    await this.registerCommands()
    // await this.registerSubCommands()
    this.once("ready", () => {
      this.registerAppCommands({ commands: this.appcommands })
    });
    console.log(this.eventsTable.toString())
    console.log(this.commandsTable.toString())
    console.log(this.subcommandsTable.toString())
  }
}

export default Bot;