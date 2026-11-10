require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    Events
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.once(Events.ClientReady, readyClient => {
    console.log(`✅ Logged in as ${readyClient.user.tag}`);

    client.user.setPresence({
        activities: [{
            name: 'AssetQuarry',
            type: 3
        }],
        status: 'online'
    });
});

client.login(process.env.DISCORD_TOKEN);
