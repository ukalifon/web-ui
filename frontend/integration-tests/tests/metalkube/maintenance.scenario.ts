import { browser, ExpectedConditions as until } from 'protractor';

import { appHost } from '../../protractor.conf';
import * as crudView from '../../views/crud.view';
import * as bareMetalHostView from '../../views/metalkube/baremetalhost.view';

describe('Start and stop maintenance master-0', () => {
  it('go to /k8s/all-namespaces/baremetalhosts', async() => {
    // FIXME: prefer navigating using the actual nav pane, to test that it's working and we're not just bypassing it
    await browser.get(`${appHost}/k8s/all-namespaces/baremetalhosts`);
    await crudView.isLoaded();
    // confirm that we're on the right page by testing that the "create" button adds a host
    expect(crudView.createYAMLButton.getText()).toEqual('Add Host');
  });

  it('find master-0 and check its status', async() => {
    browser.wait(until.presenceOf(crudView.rowForName('openshift-master-0')));
    expect(crudView.rowForName('openshift-master-0').isDisplayed()).toBe(true);
    expect(bareMetalHostView.hostname('openshift-master-0').isDisplayed()).toBe(true);
    const stat = await bareMetalHostView.status('openshift-master-0').getText();
    expect(stat === 'Provisioned' || stat === 'Externally provisioned').toBe(true);
  });

  it('start maintenance on master-0', async() => {
    await crudView.selectOptionFromGear('openshift-master-0', 'Start Maintenance');
    await bareMetalHostView.confirmAction();
    browser.sleep(4000);
    const stat = await bareMetalHostView.status('openshift-master-0').getText();
    expect(stat).toEqual('Starting maintenance');
  });

  it('stop maintenance on master-0', async() => {
    await crudView.selectOptionFromGear('openshift-master-0', 'Stop Maintenance');
    await bareMetalHostView.confirmAction();
    browser.sleep(4000);
    const stat = await bareMetalHostView.status('openshift-master-0').getText();
    expect(stat === 'Provisioned' || stat === 'Externally provisioned').toBe(true);
  });
});
