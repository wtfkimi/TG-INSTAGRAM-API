import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard([Markup.button.callback('Login', 'login')], {
    // columns: 3
  });
}

export function serviceButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('📸Add instagram name', '/add'),
      Markup.button.callback('❌📸Delete instagram', '/delete'),
    ],
    {
      columns: 1,
    },
  );
}
