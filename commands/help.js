const Command = require("../structures/command");

module.exports = class HelpCommand extends Command {

	constructor(bot) {
		super(bot);
		this.help = "Print this message, or get help for a specific command";
		this.usage = [
			["", "print list of commands"],
			["[command]", "get help on a specific command"]
		];
	}

	async execute(ctx, command) {
		let {bot, args} = ctx;
		//help for a specific command
		let cmd = command || args[0];
		if(cmd) {
			if(bot.cmds[cmd] && bot.cmds[cmd].usage) {
				let output = { embed: {
					title: "Bot Command | " + cmd,
					description: bot.cmds[cmd].help + "\n\n**Usage:**\n",
					timestamp: new Date().toJSON(),
					color: 0x999999,
					author: {
						name: "Tupperbox",
						icon_url: bot.user.avatarURL
					},
					footer: {
						text: "If something is wrapped in <> or [], do not include the brackets when using the command. They indicate whether that part of the command is required <> or optional []."
					}
				}, cooldown: 1000};
				for(let u of bot.cmds[cmd].usage)
					output.embed.description += `**{{tul!}}${cmd}** ${u[0] ? `*${u[0]}* ` : ""}- ${u[1]}\n`;
				if(bot.cmds[cmd].desc)
					output.embed.description += `\n${bot.cmds[cmd].desc}`;
				return output;
			}
			return "Command not found.";
		}

		//general help
		let output = { embed: {
			title: "Tupperbox | Help",
			description: "I am Tupperbox, a bot that allows you to send messages as other pseudo-users using Discord webhooks.\nTo get started, register {{a tupper}} with `{{tul!}}register` and enter a message with the brackets you set!\nExample: `{{tul!}}register test [text]` to register with brackets as []\n`[Hello!]` to proxy the message 'Hello!'\n\n**Command List**\nType `{{tul!}}help command` for detailed help on a command.\n" + String.fromCharCode(8203) + "\n",
			color: 0x999999,
			author: {
				name: "Tupperbox",
				icon_url: bot.user.avatarURL
			}
		}};
		for(let cmd of Object.keys(bot.cmds)) {
			if(bot.cmds[cmd].help)
				output.embed.description += `**{{tul!}}${cmd}**  -  ${bot.cmds[cmd].help}\n`;
		}
		output.embed.fields = [{ name: "\u200b", value: `Single or double quotes can be used in any command to specify multi-word arguments!\n\nProxy tips:\nReact with \u274c to a recent proxy to delete it (if you sent it)!\nReact with \u2753 to a recent proxy to show who sent it in DM!\n\n${process.env.SUPPORT_INVITE ? "Questions? Join the support server: [invite](https://discord.gg/" + process.env.SUPPORT_INVITE + ")" : "" }\nNow accepting donations to cover server costs! [patreon](https://www.patreon.com/tupperbox)\nInvite the bot to your server --> [click](https://discord.com/oauth2/authorize?client_id=${process.env.BOT_INVITE}&scope=bot&permissions=536996928)`}];
		return output;
	}
};
