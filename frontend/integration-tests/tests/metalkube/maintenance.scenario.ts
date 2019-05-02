import { browser, ExpectedConditions as until } from 'protractor';

import { appHost } from '../../protractor.conf';
import * as crudView from '../../views/crud.view';
import * as bareMetalHostView from '../../views/metalkube/baremetalhost.view';

const masterNode = 'openshift-master-0';

describe(`Start and stop maintenance ${masterNode}`, () => {
  it('go to /k8s/all-namespaces/baremetalhosts', async() => {
    // FIXME: prefer navigating using the actual nav pane, to test that it's working and we're not just bypassing it
    await browser.get(`${appHost}/k8s/all-namespaces/baremetalhosts`);
    await crudView.isLoaded();
    // confirm that we're on the right page by testing that the "create" button adds a host
    expect(crudView.createYAMLButton.getText()).toEqual('Add Host');
  });

  it(`find ${masterNode} and check its status`, async() => {
    browser.wait(until.presenceOf(crudView.rowForName(masterNode)));
    expect(crudView.rowForName(masterNode).isDisplayed()).toBe(true);
    expect(bareMetalHostView.hostname(masterNode).isDisplayed()).toBe(true);
    const stat = await bareMetalHostView.status(masterNode).getText();
    expect(stat === 'Provisioned' || stat === 'Externally provisioned').toBe(true);
  });

  it(`start maintenance on ${masterNode}`, async() => {
    await crudView.selectOptionFromGear(masterNode, 'Start Maintenance');
    await bareMetalHostView.confirmAction();
    browser.wait(until.textToBePresentInElement(bareMetalHostView.status(masterNode), 'Starting maintenance'), 5000);
    const stat = await bareMetalHostView.status(masterNode).getText();
    expect(stat).toEqual('Starting maintenance');
  });

  it(`stop maintenance on ${masterNode}`, async() => {
    await crudView.selectOptionFromGear(masterNode, 'Stop Maintenance');
    await bareMetalHostView.confirmAction();
    browser.wait(until.textToBePresentInElement(bareMetalHostView.status(masterNode), 'rovisioned'), 5000);
    const stat = await bareMetalHostView.status(masterNode).getText();
    expect(stat === 'Provisioned' || stat === 'Externally provisioned').toBe(true);
  });
});
