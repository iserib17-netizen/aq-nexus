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

const VERIFIED_ROLE_ID = '1569707956335943750';

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
        .setDescription('Create verification panel')

].map(command => command.toJSON());

client.once(Events.ClientReady, async (readyClient) => {

    console.log(`✅ Logged in as ${readyClient.user.tag}`);

    try {

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

        console.log('✅ Slash commands registered');

    } catch (error) {

        console.error(error);

    }

});

client.on(Events.InteractionCreate, async (interaction) => {

    try {

        if (interaction.isChatInputCommand()) {

            if (interaction.commandName === 'ping') {

                return interaction.reply({
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

                return interaction.reply({
                    embeds: [embed],
                    components: [row]
                });

            }

        }

        if (interaction.isButton()) {

            if (interaction.customId !== 'verify') {
                return;
            }

            const member = interaction.member;

            if (member.roles.cache.has(VERIFIED_ROLE_ID)) {

                return interaction.reply({
                    content: '✅ You are already verified.',
                    ephemeral: true
                });

            }

            await member.roles.add(VERIFIED_ROLE_ID);

            return interaction.reply({
                content: '✅ Verification successful. Welcome to AssetQuarry.',
                ephemeral: true
            });

        }

    } catch (error) {

        console.error(error);

        if (!interaction.replied) {

            await interaction.reply({
                content: '❌ Something went wrong.',
                ephemeral: true
            });

        }

    }

});

client.login(process.env.DISCORD_TOKEN);
