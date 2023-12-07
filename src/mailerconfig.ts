import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export = {
  transport: `smtp://admin:password@localhost:2500`,
  defaults: {
    from: 'app@test.com',
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
