import Generator from './Generator';
import Wrapper from './components/Canvas/core/Wrapper';
import RenderChildren from './components/Canvas/core/RenderChildren';
import './styles/index.less';
export { defaultCommonSettings, defaultGlobalSettings, defaultSettings } from './settings';
export { fromSetting, toSetting } from './transformer/form-render';

Generator.install = app => {
  app.component(Generator.name || 'Generator', Generator);
  return app;
};

export {
  Generator,
  Wrapper,
  RenderChildren
};
