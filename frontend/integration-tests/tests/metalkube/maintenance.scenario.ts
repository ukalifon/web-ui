import { browser, ExpectedConditions as until } from 'protractor';

import { appHost } from '../../protractor.conf';
import * as crudView from '../../views/crud.view';
import * as bareMetalHostView from '../../views/metalkube/baremetalhost.view';

const masterNode = 'openshift-master-0';
const provisionedStat = 'Provisioned';
const externallyProvisionedStat = 'Externally provisioned';
const startingMaintenanceStat = 'Starting maintenance';
var provisionedCond = function(elem) {
  return until.or(
    until.textToBePresentInElement(elem, provisionedStat),
    until.textToBePresentInElement(elem, externallyProvisionedStat)
  );
};

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
    browser.wait(provisionedCond(bareMetalHostView.status(masterNode)), 1000);
  });

  it(`start maintenance on ${masterNode}`, async() => {
    await crudView.selectOptionFromGear(masterNode, 'Start Maintenance');
    await bareMetalHostView.confirmAction();
    browser.wait(until.textToBePresentInElement(bareMetalHostView.status(masterNode), startingMaintenanceStat), 5000);
  });

  it(`stop maintenance on ${masterNode}`, async() => {
    await crudView.selectOptionFromGear(masterNode, 'Stop Maintenance');
    await bareMetalHostView.confirmAction();
    browser.wait(provisionedCond(bareMetalHostView.status(masterNode)), 5000);
  });
});
