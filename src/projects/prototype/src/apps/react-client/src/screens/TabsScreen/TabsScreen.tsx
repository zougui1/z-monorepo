import { Tabs } from '../../components/Tabs';

export const TabsScreen = () => {
  return (
    <div>
      <Tabs style={{ maxWidth: 500 }}>
        <Tabs.Tab title="Item One">
          Panel One
        </Tabs.Tab>
        <Tabs.Tab title="Item Two">
          Panel Two
        </Tabs.Tab>
        <Tabs.Tab title="Item Three">
          Panel Three
        </Tabs.Tab>
        <Tabs.Tab defaultActive title="Item Four">
          Panel Four
        </Tabs.Tab>
        <Tabs.Tab title="Item Five">
          Panel Five
        </Tabs.Tab>
        <Tabs.Tab title="Item Six">
          Panel Six
        </Tabs.Tab>
        <Tabs.Tab title="Item Seven">
          Panel Seven
        </Tabs.Tab>
      </Tabs>
    </div>
  );
}
