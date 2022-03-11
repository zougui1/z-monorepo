import _ from 'lodash';

import { useStyles } from './QueryDevToolsPanel/ReactQueryDevToolsPanel.styles';
import { useDevToolsSelector } from './devtools.context';
import { useLocalStorage } from './QueryDevToolsPanel/temp';
import { Tabs } from '../../components/Tabs';

export function DevToolsContent() {
  const tabs = useDevToolsSelector(state => state.tabs);
  const classes = useStyles();

  const [activeTab, setActiveTab] = useLocalStorage<string>(
    'zougui.devtools.activeTab',
    '',
  );
  const [devToolsHeight, setDevToolsHeight] = useLocalStorage<number | null>(
    'zougui.devtools.height',
    null,
  );

  const handleDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    const panelElement = event.currentTarget.parentElement

    // Only allow left click for drag
    if (event.button !== 0) return;

    const dragInfo = {
      originalHeight: panelElement?.getBoundingClientRect().height ?? 0,
      pageY: event.pageY,
    }

    const run = (moveEvent: MouseEvent) => {
      const delta = dragInfo.pageY - moveEvent.pageY
      const calculatedHeight = dragInfo?.originalHeight + delta
      const newHeight = _.clamp(calculatedHeight, 70, window.innerHeight);

      setDevToolsHeight(newHeight)
    }

    const unsub = () => {
      document.removeEventListener('mousemove', run)
      document.removeEventListener('mouseUp', unsub)
    }

    document.addEventListener('mousemove', run)
    document.addEventListener('mouseup', unsub)
  }

  const actualDevToolsHeight = devToolsHeight || 500;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        backgroundColor: '#242424',
        color: 'white',
        width: '100%',
        height: actualDevToolsHeight,
        paddingBottom: 0,
      }}
    >
      <div className={classes.resizeHandle} onMouseDown={handleDragStart as any} />
      <Tabs
        active={activeTab || ''}
        onActive={tabId => setActiveTab(tabId)}
        style={{
        }}
      >
        {Object.values(tabs).map(tab => (
          <Tabs.Tab
            key={tab.name}
            id={tab.name}
            title={tab.name}
            panelProps={{
              style: {
                // resize handle + tab's title = a height of 52px
                height: `calc(${actualDevToolsHeight}px - 52px)`,
              }
            }}
          >
            <tab.Component data={tab.data} />
          </Tabs.Tab>
        ))}
      </Tabs>
    </div>
  );
}
