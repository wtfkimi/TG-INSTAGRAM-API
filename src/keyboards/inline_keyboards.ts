export const loginInlineKeyboard = [
  [{ text: '📸Add instagram name', callback_data: '/add' }],
  [{ text: '🪧Get names instagram', callback_data: '/show' }],
];

export const loginAdminInlineKeyboard = [
  [{ text: '📸Get accounts in database', callback_data: '/getDbAcc' }],
  [{ text: '🪧Add accounts in database', callback_data: '/addDbAcc' }],
  [{ text: '🪧Delete accounts in database', callback_data: '/rmDbAcc' }],
  [{ text: '🪧Add admin in database', callback_data: '/insertAdminDbAcc' }],
  [{ text: '🪧Delete admin in database', callback_data: '/removeAdminDbAcc' }],
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
