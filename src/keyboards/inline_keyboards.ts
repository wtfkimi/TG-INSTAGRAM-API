export const loginInlineKeyboard = [
  [{ text: '📸Add instagram name', callback_data: '/add' }],
  [{ text: '🪧Get names instagram', callback_data: '/show' }],
];
export const userAddedKeyboard = (name: string) => {
  return [
    [{ text: '📸Delete user from database', callback_data: `/delete${name}` }],
    [{ text: '🪧Generate last post', callback_data: `/generatePost${name}` }],
    [
      {
        text: '🪧Generate post by number',
        callback_data: `/postNumber${name}`,
      },
    ],
    [{ text: '🪧Sand msg to channel', callback_data: `/channelMsg` }],
  ];
};

export function generateKeyboardNames(names: string[]) {
  let keyboard = [];
  for (let name of names) {
    keyboard.push([{ text: `🧍‍♂️${name}`, callback_data: `/profile${name}` }]);
  }
  return keyboard;
}
