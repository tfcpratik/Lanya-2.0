const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createpanel")
    .setDescription("⚙️ Setup an advanced ticket panel for your server")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("📢 Select the channel where the panel should be sent")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("style")
        .setDescription("🎨 Choose the panel style")
        .setRequired(true)
        .addChoices(
          { name: "🟦 Buttons", value: "buttons" },
          { name: "📜 Select Menu", value: "select" }
        )
    )
    .addStringOption(option =>
      option
        .setName("title")
        .setDescription("📝 The title of your ticket panel embed")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("description")
        .setDescription("💬 The message that appears inside the panel embed")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("color")
        .setDescription("🎨 Optional: Custom embed color (hex code like #2b2d31)")
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName("footer")
        .setDescription("🦶 Optional: Footer text for the panel embed")
        .setRequired(false)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    const style = interaction.options.getString("style");
    const title = interaction.options.getString("title");
    const desc = interaction.options.getString("description");
    const color = interaction.options.getString("color") || "#2b2d31";
    const footer = interaction.options.getString("footer") || "🎫 DEMON CLOUD Ticket System";

    // Create fancy embed
    const embed = new EmbedBuilder()
      .setTitle(`🎟️ ${title}`)
      .setDescription(
        `> ${desc}\n\n✨ **Need Help?**\nClick the button or select a category below to create a private ticket with our support team.\n\n🕒 *Response time may vary based on staff availability.*`
      )
      .setColor(color)
      .setFooter({ text: footer })
      .setTimestamp();

    let components = [];

    // Buttons Style
    if (style === "buttons") {
      const openBtn = new ButtonBuilder()
        .setCustomId("open_ticket")
        .setLabel("🎫 Open Ticket")
        .setStyle(ButtonStyle.Success);

      const infoBtn = new ButtonBuilder()
        .setLabel("🌐 Join Support Discord")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/your-support-link");

      components = [new ActionRowBuilder().addComponents(openBtn, infoBtn)];
    }

    // Select Menu Style
    else if (style === "select") {
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("ticket_select")
        .setPlaceholder("📂 Choose your ticket category")
        .addOptions(
          {
            label: "🛠️ Technical Support",
            description: "Get help with server or hosting issues",
            value: "tech_support",
          },
          {
            label: "💰 Billing / Payments",
            description: "Questions about purchases or payments",
            value: "billing",
          },
          {
            label: "🎮 Server Setup Help",
            description: "Need help setting up your game server?",
            value: "setup_help",
          },
          {
            label: "📦 Other Inquiries",
            description: "Anything else that doesn’t fit above",
            value: "other",
          }
        );

      const supportBtn = new ButtonBuilder()
        .setLabel("🌐 Join DEMON CLOUD")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/your-support-link");

      components = [
        new ActionRowBuilder().addComponents(selectMenu),
        new ActionRowBuilder().addComponents(supportBtn),
      ];
    }

    await channel.send({ embeds: [embed], components });
    await interaction.reply({
      content: `✅ **Ticket panel has been successfully created in** ${channel}!`,
      ephemeral: true,
    });
  },
};
