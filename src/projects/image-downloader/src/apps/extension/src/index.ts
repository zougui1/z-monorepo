console.log('test')
const run = async () => {
  const tabs = await browser.tabs.query({});
  //browser.tabs.connect().
  console.log('tabs', tabs);
  console.log('urls:', tabs.map(tab => tab.url))
}

run().catch((err) => console.error('error', err))
