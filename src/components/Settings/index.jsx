import { RightOutlined } from '@ant-design/icons-vue';
import { Tabs } from 'ant-design-vue';
import { defineComponent, reactive, watch } from 'vue';
import { useStore } from '../../utils/context';
import GlobalSettings from './GlobalSettings';
import './index.less';
import ItemSettings from './ItemSettings';

const { TabPane } = Tabs;

const Settings = defineComponent({
  props: {
    widgets: Object
  },
  setup(props) {
    const state = reactive({
      tabsKey: 'globalSettings',
      showRight: true,
      showItemSettings: false
    });
    const { selected, userProps = {} } = useStore();
    const { tabsKey, showRight, showItemSettings } = state;

    const toggleRight = () => Object.assign(state, { showRight: !showRight });

    const ToggleIcon = () => (
      <div
        class="absolute top-0 left-0 pointer"
        style={{ height: 30, width: 30, padding: '8px 0 0 8px' }}
        onClick={toggleRight}
      >
        <RightOutlined class="f5" />
      </div>
    );

    const HideRightArrow = () => (
      <div class="absolute right-0 top-0 h2 flex-center" style={{ width: 40, transform: 'rotate(180deg)' }}>
        <ToggleIcon />
      </div>
    );

    // 如果没有选中任何item，或者是选中了根节点，object、list的内部，显示placeholder
    watch(
      () => selected,
      newValue => {
        if ((newValue && newValue[0] === '0') || newValue === '#' || !newValue) {
          Object.assign(state, { tabsKey: 'globalSettings', showItemSettings: false });
        } else {
          Object.assign(state, { tabsKey: 'itemSettings', showItemSettings: true });
        }
      }
    );

    const globalSettingHide =
      userProps.globalSettings === null || (userProps.globalSettings && !Object.keys(userProps.globalSettings).length);

    return () => {
      return showRight ? (
        <div class="right-layout relative pl2">
          <ToggleIcon />
          <Tabs activeKey={tabsKey} onChange={key => Object.assign(state, { tabsKey: key })}>
            {showItemSettings && (
              <TabPane tab="组件配置" key="itemSettings">
                <ItemSettings widgets={props.widgets} />
              </TabPane>
            )}
            {!globalSettingHide && (
              <TabPane tab="表单配置" key="globalSettings">
                <GlobalSettings widgets={props.widgets} />
              </TabPane>
            )}
          </Tabs>
        </div>
      ) : (
        <HideRightArrow />
      );
    };
  }
});

export default Settings;
