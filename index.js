require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const commands = [

  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if AQ Nexus is online'),

  new SlashCommandBuilder()
    .setName('verifypanel')
    .setDescription('Create verify panel')

].map(command => command.toJSON());

client.once(Events.ClientReady, async (c) => {

  console.log(`✅ Logged in as ${c.user.tag}`);

  const rest = new REST({
    version: '10'
  }).setToken(process.env.DISCORD_TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    {
      body: commands
    }
  );

  console.log('✅ Commands registered');

});

client.on(Events.InteractionCreate, async interaction => {

  if (interaction.isChatInputCommand()) {

    if (interaction.commandName === 'ping') {

      await interaction.reply({
        content: '🏓 AQ Nexus Online',
        ephemeral: true
      });

    }

    if (interaction.commandName === 'verifypanel') {

      const embed = new EmbedBuilder()
        .setColor('#f97316')
        .setTitle('✅ Verify Your Account')
        .setDescription(
`Welcome to AssetQuarry Development.

Verify yourself to access marketplace features and community resources.

Powered by Batur Systems`
        );

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('verify')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Success)
        );

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });

    }

  }

  if (interaction.isButton()) {

    if (interaction.customId === 'verify') {

      await interaction.reply({
        content: '✅ Verification successful.',
        ephemeral: true
      });

    }

  }

});

client.login(process.env.DISCORD_TOKEN);
