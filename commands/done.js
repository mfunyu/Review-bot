module.exports = {
  data: {
    name: 'done',
    description: 'delete review voice channel',
    options: [
      {
        name: 'all',
        description: 'delete all voice channels with your name',
        type: 'BOOLEAN',
        required: false,
        default: false,
      },
      {
        name: 'current',
        description: 'delete the vocie channel you are joining currently',
        type: 'BOOLEAN',
        required: false,
        default: false,
      },
    ]
  },
  async execute(interaction) {
    await interaction.reply('channel deleted');
  }
}