import Generator from './Generator';
Generator.install = app => {
  app.component(Generator.name || 'Generator', Generator);
  return app;
};

export default Generator;
