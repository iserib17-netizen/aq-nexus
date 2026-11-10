require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if AQ Nexus is online')
].map(c => c.toJSON());

client.once(Events.ClientReady, async (c) => {

  console.log(`✅ Logged in as ${c.user.tag}`);

  const rest = new REST({ version: '10' })
    .setToken(process.env.DISCORD_TOKEN);

  try {

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('✅ Slash commands registered');

  } catch (err) {
    console.error(err);
  }
});

client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {

    await interaction.reply({
      content: '🏓 AQ Nexus Online',
      ephemeral: true
    });

  }

});

client.login(process.env.DISCORD_TOKEN);
