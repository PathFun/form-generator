import Canvas from './components/Canvas';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Provider from './Provider';

const Generator = ({ fixedName = '', settingsWidgets = {}, onCanvasSelect = undefined, ...rest }) => {
  return (
    <Provider {...rest}>
      <div class="fr-generator-container">
        <Sidebar fixedName={fixedName} />
        <Canvas onSelect={onCanvasSelect} />
        <Settings widgets={settingsWidgets} />
      </div>
    </Provider>
  );
};

Generator.Provider = Provider;
Generator.Sidebar = Sidebar;
Generator.Canvas = Canvas;
Generator.Settings = Settings;

export default Generator;
