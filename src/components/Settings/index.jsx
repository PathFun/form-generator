import { RightOutlined } from '@ant-design/icons-vue';
import { Tabs } from 'ant-design-vue';
import { defineComponent, reactive, watch, computed } from 'vue';
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
    const store = useStore();

    const toggleRight = () => Object.assign(state, { showRight: !state.showRight });

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
      () => store.selected,
      newValue => {
        if ((newValue && newValue[0] === '0') || newValue === '#' || !newValue) {
          Object.assign(state, { tabsKey: 'globalSettings', showItemSettings: false });
        } else {
          Object.assign(state, { tabsKey: 'itemSettings', showItemSettings: true });
        }
      }
    );

    const globalSettingHide = computed(
      () =>
        store.userProps.globalSettings === null ||
        (store.userProps.globalSettings && !Object.keys(store.userProps.globalSettings).length)
    );

    return () => {
      const { tabsKey, showRight, showItemSettings } = state;
      return showRight ? (
        <div class="right-layout relative pl2 pr2">
          <ToggleIcon />
          <Tabs activeKey={tabsKey} onChange={key => Object.assign(state, { tabsKey: key })}>
            {showItemSettings && (
              <TabPane tab="组件配置" key="itemSettings">
                <ItemSettings widgets={props.widgets} />
              </TabPane>
            )}
            {!globalSettingHide.value && (
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
